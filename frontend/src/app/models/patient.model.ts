export interface Patient {
  id?: number;
  name: string;
  phone: string;
  notes?: string;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PatientPage {
  content: Patient[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
