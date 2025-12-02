interface Attendance {
  date: string;        // ISO format
  status: 'Present' | 'Absent';
}
export interface Staff {
  _id?: string;
  name: string;
  role: string;
  salary: number;
  attendance?: Attendance[];
}
