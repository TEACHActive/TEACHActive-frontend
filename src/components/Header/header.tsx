import React from "react";
import { Layout } from "antd";
import { useLocation } from "react-router-dom";

import { appRoutes } from "routes";
import { HeaderPresentational } from "./headerPresentational";
import { useGetSessionsQuery } from "api/services/sessions/sessions";

const { Header: AntHeader } = Layout;

export interface IHeaderProps {}

export function Header(props: IHeaderProps) {
  let location = useLocation();
  const [showHeader, setShowHeader] = React.useState(false);

  const { data, isLoading, isFetching, isError } = useGetSessionsQuery();

  React.useEffect(() => {
    const matchingRoute = appRoutes.find(
      (route) => "/" + route.routeObject.path === location.pathname
    );
    setShowHeader(matchingRoute?.pathExtras.showHeader || false);
  }, [location]);

  if (!showHeader) {
    return <></>;
  }

  if (isError) {
    <AntHeader className="header">
      <p>Error...</p>
    </AntHeader>;
  }

  if (isLoading || isFetching) {
    return (
      <AntHeader className="header">
        <p>Loading...</p>
      </AntHeader>
    );
  }

  const sessions = data?.data || [];

  return <HeaderPresentational sessions={sessions} />;
}
