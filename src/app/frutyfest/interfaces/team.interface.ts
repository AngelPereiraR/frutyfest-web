import { User } from "src/app/auth/interfaces";

export interface Team {
  _id:         string;
  color:       string;
  totalPoints: number;
  users:       User[];
  roles:       string[];
}
