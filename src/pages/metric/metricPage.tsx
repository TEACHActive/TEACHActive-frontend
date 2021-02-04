import * as React from "react";
import { Spin, Empty } from "antd";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import { Session } from "./metricPage.types";
import {
  IMetricPageAPIHandler,
  MetricPageFakeAPIHandler,
} from "./metricPage.handler";
import { SessionPagePresentational } from "./metricPagePresentational";

import "./metricPage.css";
import { faFontAwesomeLogoFull } from "@fortawesome/free-solid-svg-icons";

export interface ISessionPageProps {
  // session: Session | null;
  // loading: boolean;
}

// interface ParamTypes {
//   id: string;
// }

export default function MetricPage(props: ISessionPageProps) {
  // const { id } = useParams<ParamTypes>();
  // const [loading, setLoading] = React.useState<boolean>(true);

  // const [sessions, setSessions] = React.useState<Session[]>([]);
  // const apiHandler: IMetricPageAPIHandler = new MetricPageFakeAPIHandler();
  // React.useEffect(() => {
  //   (async function getSetSesssions() {
  //     const allSessions = await (await apiHandler.getAllSessions()).data;
  //     setSessions(allSessions);
  //     setLoading(false);
  //   })();
  // }, []);

  // const matchingSession: Session | undefined = props.sessions!.find(
  //   (session: Session) => session.id === id
  // );
  // if (props.loading) return <Spin />;

  const selectedSession: Session | null = useSelector((state: any) => state.session.selectedSession);

  if (!selectedSession) return <Empty />;

  return <SessionPagePresentational session={selectedSession} />;
}
