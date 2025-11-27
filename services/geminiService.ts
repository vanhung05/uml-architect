import { GoogleGenAI, Type } from "@google/genai";
import { UseCaseData, GeneratedDiagrams } from "../types";

const parseJSON = (text: string) => {
    try {
        const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
        if (jsonMatch && jsonMatch[1]) {
            return JSON.parse(jsonMatch[1]);
        }
        const plainJsonMatch = text.match(/\{[\s\S]*\}/);
        if (plainJsonMatch) {
            return JSON.parse(plainJsonMatch[0]);
        }
        return JSON.parse(text);
    } catch (e) {
        console.error("Failed to parse JSON from AI response", e);
        throw new Error("AI response format error");
    }
};

const fixSequenceDiagram = (code: string): string => {
    const lines = code.split('\n');
    const fixedLines: string[] = [];
    const seenParticipants = new Set<string>();
    
    // First pass: collect all participant definitions and keep only first occurrence
    const participantLines: string[] = [];
    const nonParticipantLines: string[] = [];
    
    for (const line of lines) {
        const trimmed = line.trim();
        
        if (trimmed.startsWith('participant ')) {
            const match = trimmed.match(/participant\s+(\w+)\s+as\s+(\w+)/);
            if (match) {
                const participantId = match[1];
                // Only keep first occurrence
                if (!seenParticipants.has(participantId)) {
                    seenParticipants.add(participantId);
                    participantLines.push(line);
                } else {
                    console.log(`Removing duplicate participant: ${participantId}`);
                }
            } else {
                // Participant without alias
                const simpleMatch = trimmed.match(/participant\s+(\w+)/);
                if (simpleMatch) {
                    const participantId = simpleMatch[1];
                    if (!seenParticipants.has(participantId)) {
                        seenParticipants.add(participantId);
                        participantLines.push(line);
                    } else {
                        console.log(`Removing duplicate participant: ${participantId}`);
                    }
                }
            }
        } else {
            nonParticipantLines.push(line);
        }
    }
    
    // Combine: sequenceDiagram line, then all participants, then rest
    for (const line of nonParticipantLines) {
        const trimmed = line.trim();
        
        if (trimmed === 'sequenceDiagram') {
            fixedLines.push(line);
            // Add all participants right after sequenceDiagram
            fixedLines.push(...participantLines);
        } else {
            // Fix alt/loop headers - remove brackets
            let fixedLine = line;
            if (trimmed.startsWith('alt ') || trimmed.startsWith('loop ')) {
                fixedLine = fixedLine.replace(/\[([^\]]+)\]/g, '$1');
            }
            
            // Remove brackets from note text
            if (trimmed.startsWith('Note ')) {
                fixedLine = fixedLine.replace(/\[([^\]]+)\]/g, '$1');
            }
            
            fixedLines.push(fixedLine);
        }
    }
    
    return fixedLines.join('\n');
};

export const generateUML = async (data: UseCaseData): Promise<GeneratedDiagrams> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    You are an expert UML Architect and Mermaid.js specialist.
    I will provide a specific Use Case specification. Your task is to generate valid Mermaid.js code for two diagrams: an Activity Diagram and a Sequence Diagram, based on the provided text.

    **Use Case Data:**
    - Name: ${data.name}
    - Actor: ${data.actor}
    - Trigger: ${data.trigger}
    - Pre-conditions: ${data.preConditions}
    - Post-conditions: ${data.postConditions}
    - Basic Flow: ${data.basicFlow}
    - Alternative Flow: ${data.alternativeFlow}
    - Exception Flow: ${data.exceptionFlow}

    **Requirements for Activity Diagram:**
    - **ABSOLUTE CRITICAL RULE**: The FIRST line MUST be exactly 'flowchart TD' (NOT 'graph TD', NOT 'graph', NOT 'flowchart').
      - INCORRECT: graph TD
      - INCORRECT: graph LR
      - CORRECT: flowchart TD
    - **CRITICAL RULE**: Do NOT use reserved keywords like "end", "start", "subgraph", "class" as Node IDs. 
      - INCORRECT: end("Kết thúc")
      - CORRECT: EndNode("Kết thúc")
      - CORRECT: StartNode("Bắt đầu")
    - Start with a 'StartNode' and end with an 'EndNode'.
    - Include the Pre-conditions after StartNode.
    - Represent the Basic Flow steps sequentially.
    - Analyze the flow for keywords like "if", "check", "verify" to create Decision diamonds.
    - Integrate Alternative and Exception flows as branches from appropriate steps or decisions.
    - **SYNTAX RULE**: Enclose ALL node text in double quotes to handle Vietnamese characters.
      - If the text contains double quotes, replace them with single quotes.
      - Correct: A["Người dùng bấm 'Đăng nhập'"]
      - Incorrect: A["Người dùng bấm "Đăng nhập""]

    **Requirements for Sequence Diagram:**
    - Use 'sequenceDiagram'.
    - **ABSOLUTE CRITICAL RULE**: Define ALL participants ONCE at the TOP of the diagram. NEVER define a participant twice.
      - INCORRECT:
        participant Actor as NguoiDung
        participant UI as GiaoDien
        ... some messages ...
        participant Actor as NguoiDung (DUPLICATE - FORBIDDEN!)
      - CORRECT:
        participant Actor as NguoiDung
        participant UI as GiaoDien
        participant System as HeThong
        participant DB as CSDL
        ... all messages use these participants ...
    - **CRITICAL RULE**: ALWAYS include a UI/Interface participant to show user interactions with the interface.
      - REQUIRED participants order: Actor (user) -> UI (interface) -> System (backend) -> DB/External Services
      - Typical participants (define ALL at the top):
        participant Actor as NguoiDung
        participant UI as GiaoDien
        participant System as HeThong
        participant DB as CSDL
    - **CRITICAL RULE**: User interactions should go through UI first, then UI communicates with System.
      - CORRECT flow: Actor->>UI: Click button -> UI->>System: Send request -> System->>DB: Query
      - INCORRECT flow: Actor->>System: Click button (skipping UI layer)
    - **CRITICAL RULE**: Use simple Alphanumeric IDs (no spaces) for participants. For aliases, use SINGLE WORD only (no spaces).
      - INCORRECT: participant Khách Hàng
      - INCORRECT: participant Actor as Khách Hàng
      - INCORRECT: participant System as Hệ thống
      - CORRECT: participant Actor as NguoiDung
      - CORRECT: participant UI as GiaoDien
      - CORRECT: participant System as HeThong
      - CORRECT: participant DB as CSDL
    - **CRITICAL RULE**: Participant aliases MUST be a single word with NO SPACES. Use camelCase or PascalCase for Vietnamese words.
      - INCORRECT: Khách Hàng (has space)
      - INCORRECT: Hệ thống (has space)
      - CORRECT: NguoiDung
      - CORRECT: GiaoDien
      - CORRECT: HeThong
      - CORRECT: CSDL
    - **CRITICAL RULE**: Do NOT use quotes around participant aliases.
    - **CRITICAL RULE**: Do NOT enclose message texts in quotes. Use plain text only.
      - INCORRECT: Actor->>System: "Bấm nút đặt sân"
      - CORRECT: Actor->>System: Bấm nút đặt sân
    - **CRITICAL RULE**: Do NOT use ANY special characters or punctuation in message text or notes. Remove ALL: single quotes ('), parentheses (), brackets [], slashes /, colons :, semicolons ;, commas ,, periods ., dashes -, hyphens
      - INCORRECT: Actor->>System: Bấm nút 'Đặt sân'
      - INCORRECT: Actor->>System: Chọn loại sân (Sân 5 hoặc Sân 7)
      - INCORRECT: Note right of System: Trạng thái 'Đã đặt'
      - INCORRECT: System->>Actor: Hiển thị thông tin chi tiết đặt sân Giá tiền giờ tên sân
      - INCORRECT: Note right of System: Sân được đặt thành công và chuyển trạng thái sang Đã đặt Hệ thống gửi email thông báo xác nhận cho khách hàng
      - CORRECT: Actor->>System: Bấm nút Đặt sân
      - CORRECT: Actor->>System: Chọn loại sân Sân 5 hoặc Sân 7
      - CORRECT: Note right of System: Trạng thái Đã đặt
      - CORRECT: System->>Actor: Hiển thị thông tin chi tiết đặt sân
      - CORRECT: Note right of System: Sân được đặt thành công
    - **CRITICAL RULE**: Keep ALL message text and notes SHORT and SIMPLE. Maximum 8 words per message or note.
      - INCORRECT: Note right of System: Sân được đặt thành công và chuyển trạng thái sang Đã đặt Hệ thống gửi email thông báo xác nhận cho khách hàng
      - CORRECT: Note right of System: Sân được đặt thành công
    - **CRITICAL RULE**: For notes, do NOT use quotes around the text.
      - INCORRECT: Note right of Actor: "Thông tin"
      - CORRECT: Note right of Actor: Thông tin
    - **CRITICAL RULE**: Replace ALL newlines (\\n) inside message texts or notes with spaces. Mermaid does NOT support raw newlines.
    - Use these IDs for all messages (e.g., Actor->>System: Message).
    - Start with the Trigger message.
    - Convert Basic Flow steps into messages (->>).
    - Use 'alt' or 'loop' blocks for Alternative and Exception flows. AVOID using 'opt' blocks.
    - **CRITICAL RULE**: The keyword 'end' is ONLY used to close 'alt' or 'loop' blocks. NEVER use 'end' as a standalone line or message.
    - **CRITICAL RULE**: Every 'alt' or 'loop' block MUST have exactly ONE 'end' to close it.
    - **CRITICAL RULE**: For 'alt' or 'loop' headers, use ONLY Vietnamese text without any codes, numbers, or special characters. NO brackets or special symbols.
      - INCORRECT: alt E1 Lỗi thanh toán
      - INCORRECT: alt A1 Khách hàng chọn bộ lọc
      - INCORRECT: alt E1: Lỗi thanh toán
      - INCORRECT: alt [Dữ liệu hợp lệ]
      - INCORRECT: alt [Email sai định dạng]
      - CORRECT: alt Lỗi thanh toán
      - CORRECT: alt Khách hàng chọn bộ lọc
      - CORRECT: alt Trường hợp lỗi
      - CORRECT: alt Dữ liệu hợp lệ
      - CORRECT: alt Email sai định dạng
    - **ABSOLUTE CRITICAL RULE**: The word 'else' MUST ALWAYS appear ALONE on its own line with NOTHING after it. NO TEXT. NO LABELS. NO SPACES after 'else'.
      - INCORRECT: else A2 Thanh toán bằng phương thức khác
      - INCORRECT: else E2 Thanh toán thành công
      - INCORRECT: else Thanh toán thất bại
      - INCORRECT: else Thanh toán thành công
      - CORRECT: else
      - This is MANDATORY. The word 'else' by itself on a line, nothing more.
    - **CRITICAL RULE**: Inside 'alt' blocks, use 'else' for alternative branches. You can have multiple 'else' branches.
      - CORRECT structure:
        alt Condition1
            Actor->>System: Message1
        else
            Actor->>System: Message2
        else
            Actor->>System: Message3
        end
    - **CRITICAL RULE**: ALL content (messages, notes, etc.) MUST be placed INSIDE blocks, BEFORE the 'end' keyword.
      - INCORRECT:
        alt Condition1
            Actor->>System: Message1
        else Condition2
            Actor->>System: Message2
        end
        Note right of System: Some note
      - CORRECT:
        alt Condition1
            Actor->>System: Message1
        else Condition2
            Actor->>System: Message2
            Note right of System: Some note
        end
    - **CRITICAL RULE**: After an 'end' keyword, you can ONLY have: another 'alt'/'loop' block, a message, or a note at the top level. NEVER put notes after 'end' if they belong inside the block.
    - **ABSOLUTE CRITICAL RULE - NO EXCEPTIONS**: NEVER EVER nest 'alt' or 'loop' blocks. ALL blocks MUST be at the TOP LEVEL ONLY.
      - INCORRECT (FORBIDDEN):
        alt Condition1
            Actor->>System: Message1
        else
            alt SubCondition
                Actor->>System: Message2
            end
        end
      - INCORRECT (FORBIDDEN):
        alt Condition1
            Actor->>System: Message1
            alt SubCondition
                Actor->>System: Message2
            end
        end
      - CORRECT:
        alt Condition1
            Actor->>System: Message1
        else
            Actor->>System: Message2
        end
        alt SubCondition
            Actor->>System: Message3
        else
            Actor->>System: Message4
        end
    - **CRITICAL RULE**: Place 'alt' blocks IMMEDIATELY after the action that triggers the decision, NOT at the end of the diagram.
      - INCORRECT (alt at the end):
        Actor->>System: Login
        System->>DB: Check credentials
        DB-->>System: Return result
        System->>Actor: Show result
        alt Login failed
            System->>Actor: Show error
        end
      - CORRECT (alt right after decision point):
        Actor->>System: Login
        System->>DB: Check credentials
        DB-->>System: Return result
        alt Login successful
            System->>Actor: Redirect to dashboard
        else
            System->>Actor: Show error message
        end
    - **CRITICAL RULE**: Integrate Alternative Flows and Exception Flows at their LOGICAL POSITION in the sequence, not at the end.
      - When you see "Alternative Flow" or "Exception Flow" in the use case, identify WHERE in the Basic Flow it branches off
      - Place the 'alt' block at that exact position in the sequence
    - **CRITICAL RULE**: If you have multiple decision points, create SEPARATE top-level 'alt' blocks in SEQUENCE. Do NOT nest them.
    - **CRITICAL RULE**: Inside 'alt' or 'else' branches, you can ONLY have: messages (->>) and notes (Note). You CANNOT have another 'alt' or 'loop'.
    - **CRITICAL RULE**: Do NOT use the 'break' or 'opt' keywords. They cause syntax errors. Use only 'alt' and 'loop'.
    - **CRITICAL RULE**: Ensure every command is strictly on a NEW LINE. Do not combine commands.
    - **CRITICAL RULE**: Keep message text simple and concise. Avoid complex punctuation and special characters.
    - **CRITICAL RULE**: If you need to show a simple optional flow without branching, just use regular messages. Do NOT use 'alt' with only one branch.

    **Output Format:**
    Return ONLY a JSON object with the following structure:
    {
      "activityDiagram": "mermaid code string here...",
      "sequenceDiagram": "mermaid code string here..."
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            activityDiagram: { type: Type.STRING },
            sequenceDiagram: { type: Type.STRING },
          },
          required: ["activityDiagram", "sequenceDiagram"],
        }
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const result = parseJSON(text);
    
    // Post-process sequence diagram to fix common issues
    if (result.sequenceDiagram) {
      result.sequenceDiagram = fixSequenceDiagram(result.sequenceDiagram);
    }
    
    return result;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
