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
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { useOktaAuth } from "@okta/okta-react";

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

  const history = useHistory();
  const { oktaAuth, authState } = useOktaAuth();

  const login = async () => history.push("/login");

  const logout = async () => oktaAuth.signOut();

  const button = authState.isAuthenticated ? (
    <button onClick={logout}>Logout</button>
  ) : (
    <button onClick={login}>Login</button>
  );

  const selectedSession: Session | null = useSelector(
    (state: any) => state.session.selectedSession
  );

  if (authState.isPending) return null;

  if (!selectedSession) return <Empty />;

  return <SessionPagePresentational session={selectedSession} />;
}
