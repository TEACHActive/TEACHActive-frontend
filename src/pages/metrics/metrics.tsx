import { Layout } from "antd";
import { useSelector } from "react-redux";
import { useAppDispatch } from "app/hooks";

import { selectSelectedSession, setSelectedSession } from "redux/sessionSlice";
import { SelectASession } from "components/Session/selectASession";
import { MetricsPagePresentational } from "./metricsPresentational";
import {
  _useGetSessionsQuery,
  _useUpdateSessionNameMutation,
} from "api/services/sessions";
import { ISession } from "api/services/sessions/types";

const { Header: AntHeader } = Layout;

export interface IMetricsPageProps {}

export function MetricsPage(props: IMetricsPageProps) {
  const selectedSession = useSelector(selectSelectedSession);

  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = _useGetSessionsQuery(true);

  const dispatch = useAppDispatch();

  const { updateSessionName } = _useUpdateSessionNameMutation();

  // const setSelectedSessionById = (
  //   sessionId: string | null,
  //   sessions: ISession[]
  // ) => {
  //   if (!sessionId) {
  //     dispatch(setSelectedSession(undefined));
  //     return;
  //   }
  //   const matchingSession = sessions.find(
  //     (session) => session.id === sessionId
  //   );
  //   if (!matchingSession) {
  //     dispatch(setSelectedSession(undefined));
  //     return;
  //   }
  //   const { id, name, userUID, performance, createdAtISO } = matchingSession;
  //   dispatch(
  //     setSelectedSession({
  //       id,
  //       name,
  //       userUID,
  //       performance,
  //       createdAtISO,
  //     })
  //   );
  // };

  if (isLoading || isFetching) {
    return (
      <AntHeader className="header">
        <p>Loading...</p>
      </AntHeader>
    );
  }

  if (isError || !data) {
    return (
      <AntHeader className="header">
        <p>Error...</p>
      </AntHeader>
    );
  }

  if (!selectedSession) {
    return <SelectASession />;
    // const lastSession: ISession | null =
    //   data.length > 0
    //     ? {
    //         id: data[0].id,
    //         name: data[0].name,
    //         userUID: data[0].userUID,
    //         performance: data[0].performance,
    //         createdAtISO: data[0].createdAtISO,
    //       }
    //     : null;
    // if (!lastSession) {
    //   return <SelectASession />;
    // }
    // dispatch(setSelectedSession(lastSession));
    // return <h2>Loading Session...</h2>;
  }

  return (
    <MetricsPagePresentational
      session={selectedSession}
      updateSessionName={updateSessionName}
      refetchSessions={refetch}
      // setSelectedSessionById={(id: string) => setSelectedSessionById(id, data)}
    />
  );
}
