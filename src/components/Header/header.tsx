import React from "react";
import { useLocation } from "react-router-dom";

import { appRoutes } from "routes";
import { HeaderPresentational } from "./headerPresentational";

export interface IHeaderProps {}

export function Header(props: IHeaderProps) {
  let location = useLocation();
  const [showHeader, setShowHeader] = React.useState(false);
  const [loadingUsers, setLoadingUsers] = React.useState(false);

  React.useEffect(() => {
    const matchingRoute = appRoutes.find(
      (route) => "/" + route.routeObject.path === location.pathname
    );

    setShowHeader(matchingRoute?.pathExtras.showHeader || false);
  }, [location]);

  const reloadUsers = async () => {
    setLoadingUsers(true);
    //Todo: Load Users
    setLoadingUsers(false);
  };

  if (!showHeader) return <></>;

  return (
    <HeaderPresentational
      loadingUsers={loadingUsers}
      reloadUsers={reloadUsers}
    />
  );
}
