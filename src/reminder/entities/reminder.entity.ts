import { StatusReminder } from '@prisma/client';

export class Reminder {
  id: Number;
  created_at: String;
  updated_at: String;
  title: String;
  description: String;
  reminder_date: String;
  status: StatusReminder;
  user_id: Number;
}
