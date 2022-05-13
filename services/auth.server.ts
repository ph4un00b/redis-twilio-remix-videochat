// app/services/auth.server.ts
import { Authenticator } from "remix-auth";
import { storage } from "./sessions.server";

// Create an instance of the authenticator, pass a generic with what
// strategies will return and will store in the session
// export let authenticator = new Authenticator<User>(storage);
export let authenticator = new Authenticator(storage);