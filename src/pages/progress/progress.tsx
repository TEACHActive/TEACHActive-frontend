import { Layout } from "antd";
import { auth } from "firebase";
import { useAuthState } from "react-firebase-hooks/auth";

import { _useGetSessionsQuery } from "api/services/sessions";
import { ProgressPagePresentational } from "./progressPresentational";
import { _useGetUserQuery } from "api/services/user";

const { Header: AntHeader } = Layout;

export interface IProgressPageProps {}

export function ProgressPage(props: IProgressPageProps) {
  const [user] = useAuthState(auth);
  const { data, isLoading, isFetching, isError } = _useGetSessionsQuery(true);

  const {
    data: userData,
    error: userError,
    isLoading: userIsLoading,
  } = _useGetUserQuery(user?.uid || "");

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

  return (
    <ProgressPagePresentational
      sessions={data}
      isAdmin={userData?.isAdmin || false}
    />
  );
}
