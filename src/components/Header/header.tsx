import React from "react";
import { Layout } from "antd";
import { useLocation } from "react-router-dom";

import { appRoutes } from "routes";
import { HeaderPresentational } from "./headerPresentational";
import { _useGetSessionsQuery } from "api/services/sessions";
import { skipToken } from "@reduxjs/toolkit/dist/query";

const { Header: AntHeader } = Layout;

export interface IHeaderProps {}

export function Header(props: IHeaderProps) {
  let location = useLocation();
  const [showHeader, setShowHeader] = React.useState(false);

  const { data, isLoading, isFetching, isError } = _useGetSessionsQuery(
    showHeader ?? skipToken
  );

  React.useEffect(() => {
    const matchingRoute = appRoutes.find(
      (route) => "/" + route.routeObject.path === location.pathname
    );
    setShowHeader(matchingRoute?.pathExtras.showHeader || false);
  }, [location]);

  if (!showHeader) {
    return <></>;
  }

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

  console.log(data);

  return <HeaderPresentational sessions={data} />;
}
