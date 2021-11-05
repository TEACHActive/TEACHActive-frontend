import React from "react";
import { Spin } from "antd";
import { useAuthState } from "react-firebase-hooks/auth";
import { Navigate, Route, useLocation } from "react-router-dom";

import { auth } from "firebase";
import { IElementRoute, LogInRoute } from "routes";
import { logger } from "logging";

export interface IPrivateRoute {
  elementRoute: IElementRoute;
  key: number;
}

export const PrivateRoute = (props: IPrivateRoute) => {
  const [user, loading, error] = useAuthState(auth);
  let location = useLocation();

  if (loading) {
    return <Spin />;
  }
  if (error || !user) {
    console.log("Done loading, error or !user");
    return <Navigate to={LogInRoute.link()} state={{ from: location }} />;
  }
  console.log("Returning Private Route");
  return (
    <Route
      {...props.elementRoute.routeObject}
      key={props.key}
      element={<>{props.elementRoute.routeObject.element}</>} //Need to overwrite this since the element types are different
    />
  );
};
