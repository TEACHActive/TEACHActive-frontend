import * as React from "react";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

import { Cookie, CookieSingleton } from "cookies";
import { logoutOfFirebase } from "firebase/authController";
import { LogInRoute } from "routes";

export interface ILogoutPageProps {}

export function LogoutPage(props: ILogoutPageProps) {
  const navigate = useNavigate();

  React.useEffect(() => {
    async function doLogout() {
      const logoutSuccess = await logoutOfFirebase();
      if (!logoutSuccess) {
        message.error("Error when logging you out");
        return;
      }
      message.info(
        "Reached time limit, you were logged out to ensure security"
      );
      CookieSingleton.getInstance().setCookie(Cookie.AUTH_TOKEN, "");
      CookieSingleton.getInstance().setCookie(
        Cookie.AUTH_TOKEN_EXPIRE_DATETIME_ISO,
        ""
      );
      navigate(LogInRoute.link());
    }

    doLogout();
  }, []);

  return (
    <div>
      <h1>Logging you out</h1>
    </div>
  );
}
