import { auth } from "firebase";
import { logger } from "logging";
import { DateTime } from "luxon";
import { message, Spin } from "antd";
import { useAuthState } from "react-firebase-hooks/auth";
import { useLocation, Navigate } from "react-router-dom";

import { LogInRoute, LogoutRoute } from "routes";
import { Cookie, CookieSingleton } from "cookies";

export function RequireAuth({ children }: { children: JSX.Element }) {
  const [user, loading, error] = useAuthState(auth);
  const location = useLocation();

  if (loading) {
    return <Spin />;
  }

  if (error) {
    logger.error(error.message, () =>
      message.error("Error logging in: " + error.message)
    );
    return <Navigate to={LogInRoute.link()} state={{ from: location }} />;
  }

  if (!user) {
    // From: https://stackblitz.com/github/remix-run/react-router/tree/main/examples/auth?file=src%2FApp.tsx
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page
    return <Navigate to={LogInRoute.link()} state={{ from: location }} />;
  }

  //Check that Bearer token isnt expired
  const tokenExpireISO = CookieSingleton.getInstance().getCookie(
    Cookie.AUTH_TOKEN_EXPIRE_DATETIME_ISO
  );
  if (!tokenExpireISO) {
    //redirect to an interminant loggedout page
    return <Navigate to={LogoutRoute.link()} state={{ from: location }} />;
  }

  const timeUntilExpire = DateTime.fromISO(tokenExpireISO)
    .diffNow("seconds")
    .toObject();

  const secondsUntilExpire = timeUntilExpire.seconds || 0;

  if (secondsUntilExpire <= 0) {
    return <Navigate to={LogoutRoute.link()} state={{ from: location }} />;
  }

  return children;
}
