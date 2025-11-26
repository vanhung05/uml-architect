export interface UseCaseData {
  name: string;
  actor: string;
  trigger: string;
  preConditions: string;
  postConditions: string;
  basicFlow: string;
  alternativeFlow: string;
  exceptionFlow: string;
}

export interface GeneratedDiagrams {
  activityDiagram: string;
  sequenceDiagram: string;
}

export enum DiagramType {
  ACTIVITY = 'ACTIVITY',
  SEQUENCE = 'SEQUENCE'
}