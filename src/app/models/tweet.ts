import {User} from "./user";

export interface Tweet {
  text: string;
  date: string;
  user: User;
}
