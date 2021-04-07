import * as React from "react";
import firbase from "firebase";
import { Layout, Button } from "antd";
import { useHistory } from "react-router-dom";
import { FirebaseAuthConsumer } from "@react-firebase/auth";
import "firebase/auth";
import SessionSelect from "../SessionSelect/sessionSelect";
import { logoutOfFirebase } from "../../firebase/auth";
import * as routes from "../../routes";
import { useSelector } from "react-redux";
import { BaseSession } from "../../api/types";
import { IAPIHandler } from "../../api/handler";
import * as ReducerActionType from "../../redux/actionTypes";
import { useDispatch } from "react-redux";
import { getUser, getSessions } from "../../redux/selectors";

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
  const history = useHistory();
  const dispatch = useDispatch();

  React.useEffect(() => {
    const secondsBetweenRefreshingSesions = 60;
    refreshSessions(userUID);
    const refreshSessionsIntervalId = setInterval(
      () => refreshSessions(userUID),
      secondsBetweenRefreshingSesions * 1000
    );

    return () => clearInterval(refreshSessionsIntervalId);
  }, []);

  const login = async () => {
    history.push(routes.SignInRoute.link());
    // const googleAuthProvider = new firebase.default.auth.GoogleAuthProvider();
    // loginWithProvider(googleAuthProvider);
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
              {isSignedIn ? (
                <div>
                  <Button
                    type="default"
                    onClick={() => refreshSessions(userUID)}
                  >
                    Refresh
                  </Button>
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
          </AntHeader>
        );
      }}
    </FirebaseAuthConsumer>
  );
}
