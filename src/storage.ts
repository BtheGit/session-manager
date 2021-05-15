import Cookie from "js-cookie";
import { Session } from "./types";
import { SESSION_COOKIE_ID } from "./constants";

Cookie.defaults = { secure: true };

export function readSession(): Session {
  return Cookie.getJSON(SESSION_COOKIE_ID);
}

export function writeSession(session: Session): void {
  Cookie.set(SESSION_COOKIE_ID, session);
}
