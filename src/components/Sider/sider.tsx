import { Cookie, CookieSingleton } from "cookies";
import React from "react";
import { useLocation } from "react-router-dom";

import { appRoutes } from "routes";
import { SiderPresentational } from "./siderPresentational";

export interface ISiderProps {}

export function Sider(props: ISiderProps) {
  let location = useLocation();
  const [showSider, setShowSider] = React.useState(false);
  const [siderCollapsed, setSiderCollapsed] = React.useState(
    CookieSingleton.getInstance().getCookie(Cookie.SIDER_COLLAPSE) === "true"
  );

  React.useEffect(() => {
    const matchingRoute = appRoutes.find(
      (route) => "/" + route.routeObject.path === location.pathname
    );

    setShowSider(matchingRoute?.pathExtras.showSider || false);
  }, [location]);

  const rememberSiderCollapse = (collapsed: boolean) => {
    CookieSingleton.getInstance().setCookie(Cookie.SIDER_COLLAPSE, collapsed);
  };

  if (!showSider) return <></>;

  return (
    <SiderPresentational
      menuItems={appRoutes.filter((route) => route.showInSidebar)}
      collapsed={siderCollapsed}
      setCollapsed={(collapsed: boolean) => {
        setSiderCollapsed(collapsed);
        rememberSiderCollapse(collapsed);
      }}
    />
  );
}
