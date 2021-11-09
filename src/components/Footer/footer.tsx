import React from "react";
import { useLocation } from "react-router-dom";

import { appRoutes } from "routes";
import { FooterPresentational } from "./footerPresentational";

export interface IFooterProps {}

export function Footer(props: IFooterProps) {
  let location = useLocation();
  const [showFooter, setShowFooter] = React.useState(false);

  React.useEffect(() => {
    const matchingRoute = appRoutes.find(
      (route) => "/" + route.routeObject.path === location.pathname
    );

    setShowFooter(matchingRoute?.pathExtras.showFooter || false);
  }, [location]);

  if (!showFooter) return <></>;
  return <FooterPresentational />;
}
