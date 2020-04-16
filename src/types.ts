import { User } from "reducers/user";

export interface IReduxStore {
  user: User | null;
}
