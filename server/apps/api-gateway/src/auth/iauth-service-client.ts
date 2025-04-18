import { Observable } from 'rxjs';

export interface IAuthServiceClient {
  GetMe(data: { token: string }): Observable<any>;

  SignUp(data: { email: string; password: string }): Observable<any>;

  SignIn(data: { email: string; password: string }): Observable<any>;

  VerifyToken(data: { token: string }): Observable<{ id: string; email: string; }>;
}