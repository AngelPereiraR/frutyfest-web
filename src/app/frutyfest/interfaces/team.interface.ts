import { User } from "src/app/auth/interfaces";

export interface Event {
  event: string
}

export interface Team {
  _id:         string;
  color:       string;
  totalPoints: number;
  users:       User[];
  event:       string;
  name:       string;
}
