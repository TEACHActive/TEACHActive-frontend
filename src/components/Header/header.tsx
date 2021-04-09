import * as React from "react";
import firbase from "firebase";
import { Layout, Button, Spin, Badge } from "antd";
import { useHistory } from "react-router-dom";
import { FirebaseAuthConsumer } from "@react-firebase/auth";
import "firebase/auth";
import Cookies from "universal-cookie";

import SessionSelect from "../SessionSelect/sessionSelect";
import { logoutOfFirebase } from "../../firebase/auth";
import * as routes from "../../routes";
import { useSelector } from "react-redux";
import { BaseSession } from "../../api/types";
import { IAPIHandler } from "../../api/handler";
import * as ReducerActionType from "../../redux/actionTypes";
import { useDispatch } from "react-redux";
import { getUser, getSessions } from "../../redux/selectors";
import * as COOKIE from "../../constants/cookies";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const { Header: AntHeader } = Layout;

export interface IHeaderProps {
  history: any;
  apiHandler: IAPIHandler;
  refreshSessions: () => Promise<void>;
}

export function Header(props: IHeaderProps) {
  const sessions: BaseSession[] = useSelector((store: any) =>
    getSessions(store)
  );
  const userUID: string = useSelector((store: any) => getUser(store));
  const [cookies, setCookies] = React.useState<Cookies | null>(null);
  const [prevAppVersion, setPrevAppVersion] = React.useState("");
  const history = useHistory();
  const dispatch = useDispatch();

  React.useEffect(() => {
    const cookieObj = new Cookies();
    setCookies(cookieObj);
    setPrevAppVersion(cookieObj.get(COOKIE.APP_VERSION));

    const secondsBetweenRefreshingSesions = 60;
    refreshSessions(userUID);
    const refreshSessionsIntervalId = setInterval(
      () => refreshSessions(userUID),
      secondsBetweenRefreshingSesions * 1000
    );

    return () => clearInterval(refreshSessionsIntervalId);
  }, []);

  const setAppVersion = (version: string) => {
    if (cookies)
      cookies.set(COOKIE.APP_VERSION, version, {
        path: "/",
        sameSite: "strict",
      });
  };

  const login = async () => {
    history.push(routes.SignInRoute.link());
  };

  const logout = async () => {
    logoutOfFirebase();
    history.push(routes.SignInRoute.link());
  };

  const refreshSessions = async (uid: string) => {
    const sessions: BaseSession[] = await props.apiHandler.getSessionsByUID(
      uid
    );

    dispatch({
      type: ReducerActionType.SET_SESSIONS,
      payload: { sessions: sessions },
    });
  };

  if (!cookies) return <Spin />;

  return (
    <FirebaseAuthConsumer>
      {({ isSignedIn, user, providerId }) => {
        return (
          <AntHeader
            className="site-layout-sub-header-background"
            style={{
              paddingLeft: "1em",
              display: "flex",
              alignItems: "flex-start",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              <div
                style={{
                  color: "white",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {/* {props.history.location.pathname.split("/").pop()} */}
                <SessionSelect
                  sessions={sessions}
                  apiHandler={props.apiHandler}
                  refreshSessions={props.refreshSessions}
                />
                <Button type="default" onClick={() => refreshSessions(userUID)}>
                  Refresh
                </Button>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                <Badge dot={true} offset={[-15, 7]}>
                  <Button type="link">
                    <FontAwesomeIcon icon="bell" size="lg" />
                  </Button>
                </Badge>
                <hr style={{ width: "5px", margin: "0px 28px 0px 15px" }} />
                {isSignedIn ? (
                  <div>
                    <Button danger type="default" onClick={logout}>
                      Log out
                    </Button>
                  </div>
                ) : (
                  <Button type="primary" onClick={login}>
                    Log in
                  </Button>
                )}
              </div>
            </div>
          </AntHeader>
        );
      }}
    </FirebaseAuthConsumer>
  );
}
