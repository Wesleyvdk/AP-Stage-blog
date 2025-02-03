import { Authenticator } from "remix-auth";

type User = {
  username: string;
  password: string;
};

// Create an instance of the authenticator, pass a generic with what
// strategies will return
export const authenticator = new Authenticator<User>();
