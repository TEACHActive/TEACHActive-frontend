import { Layout } from "antd";

import { _useGetSessionsQuery } from "api/services/sessions";
import { ProgressPagePresentational } from "./progressPresentational";

const { Header: AntHeader } = Layout;

export interface IProgressPageProps {}

export function ProgressPage(props: IProgressPageProps) {
  const { data, isLoading, isFetching, isError } = _useGetSessionsQuery(true);

  if (isLoading || isFetching) {
    return (
      <AntHeader className="header">
        <p>Loading...</p>
      </AntHeader>
    );
  }

  if (isError) {
    return (
      <AntHeader className="header">
        <p>Error...</p>
      </AntHeader>
    );
  }

  if (data.length === 0) {
    return (
      <AntHeader className="header">
        <p>No sessions yet, come back after a session has been analyzed</p>
      </AntHeader>
    );
  }

  return <ProgressPagePresentational sessions={data} />;
}
