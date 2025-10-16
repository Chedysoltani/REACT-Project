export class SignupDto {
  email: string;
  password: string;
  name: string;
  role: 'ADMIN' | 'DOCTOR' | 'RECEPTIONIST' | 'PATIENT';
}

export class LoginDto {
  email: string;
  password: string;
}
