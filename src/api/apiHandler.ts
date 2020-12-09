import { Session } from "../types/types";
import SessionJSON from "../data/session.json";

export interface IAPIHandler {
  getAllSessions(): Promise<Session[]>;
}

export class APIHandler implements IAPIHandler {
  getAllSessions(): Promise<Session[]> {
    return Promise.resolve([]);
  }
}

export class FakeAPIHandler implements IAPIHandler {
  getAllSessions(): Promise<Session[]> {
    return Promise.resolve(
      SessionJSON.sessions.map(
        (session: any, i: number) => new Session(session)
      )
    );
  }
}
