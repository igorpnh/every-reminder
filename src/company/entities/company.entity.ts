import { User } from 'src/user/entities/user.entity';

export class Company {
  id: number;
  created_at: Date;
  updated_at: Date;
  company_name: string;
  company_email: string;
  companyHierarchy?: any;
  task?: any;
  user: User[] | User;
}

export class CompanyHierarchy {
  id: number;
  hierarchy_level: 1 | 2 | 3; // 1 = Creator, 2 = Manager, 3 = Employee
  hierarcy_name: string;
  company_id: number;
  company: Company;
  user: User[] | User;
}
