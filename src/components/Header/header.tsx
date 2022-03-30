import React from "react";
import { Layout } from "antd";
import { auth } from "firebase";
import { useLocation } from "react-router-dom";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import { useAuthState } from "react-firebase-hooks/auth";

import { appRoutes } from "routes";
import { _useGetSessionsQuery } from "api/services/sessions";
import { HeaderPresentational } from "./headerPresentational";
import { _useGetUserQuery } from "api/services/user";

const { Header: AntHeader } = Layout;

export interface IHeaderProps {}

export function Header(props: IHeaderProps) {
  let location = useLocation();
  const [user] = useAuthState(auth);
  const [showHeader, setShowHeader] = React.useState(false);

  const {
    data: userData,
    error: userError,
    isLoading: userIsLoading,
  } = _useGetUserQuery(user?.uid || "");

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

  return (
    <HeaderPresentational
      sessions={data}
      isAdmin={userData?.isAdmin || false}
    />
  );
}
