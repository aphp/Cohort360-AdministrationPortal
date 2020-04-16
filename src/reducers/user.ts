export interface User {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
}

const initialState = null;

interface LoginAction {
  type: "LOGIN";
  payload: User;
}

interface LogoutAction {
  type: "LOGOUT";
}

const user = (
  state: User | null = initialState,
  action: LoginAction | LogoutAction
): User | null => {
  switch (action.type) {
    case "LOGIN": {
      return action.payload;
    }

    case "LOGOUT": {
      return initialState;
    }

    default:
      return state;
  }
};

export default user;
