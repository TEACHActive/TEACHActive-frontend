import * as React from "react";
import { Spin, Empty } from "antd";
import { useParams } from "react-router-dom";

import { Session } from "./sessionPage.types";
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
  const [loading, setLoading] = React.useState<boolean>(true);

  const [sessions, setSessions] = React.useState<Session[]>([]);
  const apiHandler: ISessionPageAPIHandler = new SessionPageFakeAPIHandler();
  React.useEffect(() => {
    (async function getSetSesssions() {
      const allSessions = await (await apiHandler.getAllSessions()).data;
      setSessions(allSessions);
      setLoading(false);
    })();
  }, []);

  const matchingSession: Session | undefined = sessions!.find(
    (session: Session) => session.id === id
  );
  if (loading) return <Spin />;
  if (!matchingSession) return <Empty />;

  return <SessionPagePresentational session={matchingSession} />;
}
