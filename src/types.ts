export type ApiResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export interface Project {
  id: number;
  name: string;
  archived: boolean;
}

export interface Plan {
  id: number;
  projectId: number;
  title: string;
  status: string;
  a1Objective?: string;
  a1Background?: string;
  a1Scope?: string;
  a1Success?: string;
  a2Approach?: string;
  a2Stack?: string[];
  a2Risks?: string;
  a3Structure?: PhaseStructure[];
  a4Memo?: string;
  a5Checklist?: ChecklistItem[];
  a5Result?: string;
  a6Summary?: string;
  a6Lessons?: string;
  a7Review?: string;
}

export interface PhaseStructure {
  phase: string;
  tasks: { task: string; checklists: string[] }[];
}

export interface ChecklistItem {
  item: string;
  result: string;
}

export interface Task {
  id: number;
  planId: number;
  phase: string;
  task: string;
  checklist: string;
  status: string;
  phaseOrder: number;
  taskOrder: number;
  checklistOrder: number;
}

export interface Note {
  id: number;
  title?: string;
  content: string;
  noteDate?: string;
  createdAt: string;
}
