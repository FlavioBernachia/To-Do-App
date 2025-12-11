// /types/task.ts
export interface Task {
    id: string;                       
    user_id?: string;                 
    text: string;
    start: string;                   
    end: string;
    start_time?: string | null;       
    end_time?: string | null;         
    tags: string[];
    note: string;
    priority: "alta" | "medio" | "baja";
    completed: boolean;
    task_date: string;               
  }
  