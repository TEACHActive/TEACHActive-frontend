import { Layout } from "antd";
import { useSelector } from "react-redux";
import { useAppDispatch } from "app/hooks";

import { selectSelectedSession } from "redux/sessionSlice";
import { SelectASession } from "components/Session/selectASession";
import { MetricsPagePresentational } from "./metricsPresentational";
import {
  _useGetSessionsQuery,
  _useUpdateSessionNameMutation,
} from "api/services/sessions";

const { Header: AntHeader } = Layout;

export interface IMetricsPageProps {}

export function MetricsPage(props: IMetricsPageProps) {
  const selectedSession = useSelector(selectSelectedSession);

  const { data, isLoading, isFetching, isError } = _useGetSessionsQuery(true);

  // const dispatch = useAppDispatch();

  const {
    updateSessionName,
    updateSessionNameResult,
  } = _useUpdateSessionNameMutation();

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
      updateSessionName={updateSessionName} //todo get working
      updateSessionNameResult={updateSessionNameResult}
    />
  );
}
