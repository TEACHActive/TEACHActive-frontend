import * as React from "react";
import { useParams } from "react-router-dom";

import { Session } from "./sessionPage.types";
import { InfoCard } from "./InfoCard/infoCard";
import {
  ISessionPageAPIHandler,
  SessionPageFakeAPIHandler,
} from "./sessionPage.handler";
import { SessionPagePresentational } from "./sessionPagePresentational";

export interface ISessionPageProps {}

interface ParamTypes {
  id: string;
}

export default function SessionPage(props: ISessionPageProps) {
  const { id } = useParams<ParamTypes>();

  const [sessions, setSessions] = React.useState<Session[]>([]);
  const apiHandler: ISessionPageAPIHandler = new SessionPageFakeAPIHandler();
  React.useEffect(() => {
    (async function getSetSesssions() {
      const allSessions = await apiHandler.getAllSessions();
      setSessions(allSessions);
    })();
  }, []);

  const matchingSession: Session | undefined = sessions!.find(
    (session: Session) => session.id === id
  );
  return <SessionPagePresentational session={matchingSession} />;
}
