import { StatusTask } from 'src/types/types';

export class Task {
  id: number;
  created_at: Date;
  updated_at: Date;
  title: string;
  description: string;
  status: StatusTask;
  user_responsible_id: number;
  company_id: number;
}
