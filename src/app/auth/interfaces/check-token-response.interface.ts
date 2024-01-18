import { User } from './';

export interface CheckTokenResponse {
  user: User;
  token: string;
}
