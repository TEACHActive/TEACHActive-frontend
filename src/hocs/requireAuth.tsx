import { auth } from "firebase";
import { logger } from "logging";
import { message, Spin } from "antd";
import { useAuthState } from "react-firebase-hooks/auth";
import { useLocation, Navigate } from "react-router-dom";

import { LogInRoute } from "routes";

export function RequireAuth({ children }: { children: JSX.Element }) {
  const [user, loading, error] = useAuthState(auth);
  let location = useLocation();

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
    // than dropping them off on the home page.
    return <Navigate to={LogInRoute.link()} state={{ from: location }} />;
  }

  return children;
}