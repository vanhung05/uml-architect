<div align="center">

# 🎨 Hùng UML Architect

### Chuyển đổi đặc tả Use Case thành sơ đồ UML tự động với AI

[![Made with React](https://img.shields.io/badge/Made%20with-React-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Powered by Gemini AI](https://img.shields.io/badge/Powered%20by-Gemini%20AI-4285F4?style=for-the-badge&logo=google)](https://ai.google.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Mermaid](https://img.shields.io/badge/Mermaid-FF3670?style=for-the-badge&logo=mermaid&logoColor=white)](https://mermaid.js.org/)

<p align="center">
  <img src="https://img.shields.io/badge/version-1.0.0-blue.svg" alt="Version">
  <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License">
  <img src="https://img.shields.io/badge/author-Nguyễn%20Văn%20Hùng-purple.svg" alt="Author">
</p>

</div>

---

## 📖 Giới thiệu

**Hùng UML Architect** là công cụ tự động hóa việc tạo sơ đồ UML từ đặc tả Use Case bằng sức mạnh của Gemini AI. Ứng dụng giúp các nhà phân tích, lập trình viên và sinh viên tiết kiệm thời gian trong việc vẽ sơ đồ phức tạp.

### ✨ Tính năng nổi bật

- 🤖 **AI-Powered**: Sử dụng Gemini 2.5 Flash để phân tích và tạo sơ đồ thông minh
- 📊 **Hai loại sơ đồ**: Activity Diagram và Sequence Diagram
- 🎯 **Giao diện trực quan**: Form nhập liệu dễ sử dụng với validation
- 🔍 **Zoom & Pan**: Phóng to/thu nhỏ sơ đồ để xem chi tiết
- 🎨 **UI hiện đại**: Thiết kế đẹp mắt với Tailwind CSS
- ⚡ **Real-time**: Tạo sơ đồ nhanh chóng với loading animation
- 🌐 **Responsive**: Hoạt động tốt trên mọi thiết bị
- 🔄 **Auto-fix**: Tự động sửa lỗi cú pháp Mermaid phổ biến

### 🎯 Use Cases

- Phân tích yêu cầu phần mềm
- Tài liệu hóa hệ thống
- Học tập và giảng dạy UML
- Prototype nhanh cho dự án
- Review và thảo luận thiết kế

---

## 🚀 Bắt đầu nhanh

### Yêu cầu hệ thống

- Node.js 16.x trở lên
- npm hoặc yarn
- Gemini API Key (miễn phí tại [Google AI Studio](https://aistudio.google.com/))

### Cài đặt

1. **Clone repository**
   ```bash
   git clone https://github.com/vanhung05/uml-architect.git
   cd uml-architect
   ```

2. **Cài đặt dependencies**
   ```bash
   npm install
   ```

3. **Cấu hình API Key**
   
   Tạo file `.env.local` trong thư mục gốc:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```
   
   Lấy API key miễn phí tại: https://aistudio.google.com/app/apikey

4. **Chạy ứng dụng**
   ```bash
   npm run dev
   ```
   
   Mở trình duyệt tại: http://localhost:3000

---

## 📚 Hướng dẫn sử dụng

### 1. Nhập thông tin Use Case

Điền đầy đủ các trường:
- **Tên Use Case**: Tên ngắn gọn mô tả chức năng
- **Tác nhân (Actor)**: Người hoặc hệ thống tương tác
- **Trigger**: Sự kiện kích hoạt use case
- **Điều kiện trước**: Điều kiện cần có trước khi thực hiện
- **Điều kiện sau**: Kết quả sau khi hoàn thành
- **Luồng chính**: Các bước thực hiện chính
- **Luồng thay thế**: Các luồng xử lý khác
- **Luồng ngoại lệ**: Xử lý lỗi và ngoại lệ

### 2. Chọn loại sơ đồ

- ✅ **Activity Diagram**: Thể hiện luồng hoạt động
- ✅ **Sequence Diagram**: Thể hiện tương tác giữa các thành phần

### 3. Tạo sơ đồ

Nhấn nút **"Phân tích & Vẽ"** và đợi AI xử lý (2-5 giây)

### 4. Xem và tương tác

- Sử dụng nút **Zoom** để phóng to/thu nhỏ
- Cuộn để xem toàn bộ sơ đồ
- Xem mã nguồn Mermaid nếu có lỗi

---

## 🏗️ Kiến trúc

```
uml-architect/
├── components/
│   ├── MermaidDiagram.tsx    # Component hiển thị sơ đồ
│   └── UseCaseForm.tsx        # Form nhập liệu
├── services/
│   └── geminiService.ts       # Tích hợp Gemini AI
├── types.ts                   # TypeScript definitions
├── constants.ts               # Use case mẫu
├── App.tsx                    # Component chính
└── index.tsx                  # Entry point
```

### Tech Stack

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS
- **Diagrams**: Mermaid.js
- **AI**: Google Gemini 2.5 Flash
- **Build**: Vite
- **Deploy**: Vercel

---

## 🌐 Deploy lên Vercel

### Cách 1: Deploy qua Vercel Dashboard

1. Push code lên GitHub
2. Truy cập [vercel.com/new](https://vercel.com/new)
3. Import repository của bạn
4. Thêm Environment Variable:
   - Key: `GEMINI_API_KEY`
   - Value: API key của bạn
5. Click **Deploy**

### Cách 2: Deploy qua CLI

```bash
# Cài đặt Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Thêm API key
vercel env add GEMINI_API_KEY

# Deploy production
vercel --prod
```

Chi tiết xem file [DEPLOY.md](DEPLOY.md)

---

## 🎨 Screenshots

### Giao diện chính
![Main Interface](https://via.placeholder.com/800x400?text=Main+Interface)

### Activity Diagram
![Activity Diagram](https://via.placeholder.com/800x400?text=Activity+Diagram)

### Sequence Diagram
![Sequence Diagram](https://via.placeholder.com/800x400?text=Sequence+Diagram)

---

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón! Hãy:

1. Fork repository
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

---

## 📝 License

Dự án này được phân phối dưới giấy phép MIT. Xem file [LICENSE](LICENSE) để biết thêm chi tiết.

---

## 👨‍💻 Tác giả

**Nguyễn Văn Hùng**

- GitHub: [@vanhung05](https://github.com/vanhung05)
- Email: your.email@example.com

---

## 🙏 Lời cảm ơn

- [Google Gemini AI](https://ai.google.dev/) - AI engine
- [Mermaid.js](https://mermaid.js.org/) - Diagram rendering
- [React](https://reactjs.org/) - UI framework
- [Vercel](https://vercel.com/) - Hosting platform

---

<div align="center">

### ⭐ Nếu thấy hữu ích, hãy cho dự án một ngôi sao!

Made with ❤️ by Nguyễn Văn Hùng

</div>
