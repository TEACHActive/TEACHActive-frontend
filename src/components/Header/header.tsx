import * as React from "react";
import { Layout, Button, Spin, Badge, message, Input } from "antd";
import { useHistory } from "react-router-dom";
import { FirebaseAuthConsumer } from "@react-firebase/auth";
import "firebase/auth";
import Cookies from "universal-cookie";
import ReactMarkdown from "react-markdown";

import SessionSelect from "../SessionSelect/sessionSelect";
import { logoutOfFirebase } from "../../firebase/auth";
import * as routes from "../../routes";
import { useSelector } from "react-redux";
import { BaseSession } from "../../api/types";
import apiHandler, { IAPIHandler } from "../../api/handler";
import * as ReducerActionType from "../../redux/actionTypes";
import { useDispatch } from "react-redux";
import { getUser, getSessions } from "../../redux/selectors";
import * as COOKIE from "../../constants/cookies";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import ChangelogJSON from "../../changelog.json";
import Modal from "antd/lib/modal/Modal";
import generateChangelog from "../../generateChangelog";
import { SessionTreeNodeTitle } from "../Header/sessionTreeNodeTitle";

import "./header.css";
import { setUserUID } from "../../redux/actions";

const { Header: AntHeader } = Layout;

export interface IHeaderProps {
  history: any;
  apiHandler: IAPIHandler;
}

export function Header(props: IHeaderProps) {
  const sessions: BaseSession[] = useSelector((store: any) =>
    getSessions(store)
  );
  const userUID: string = useSelector((store: any) => getUser(store));
  const [cookies, setCookies] = React.useState<Cookies | null>(null);
  const [prevAppVersion, setPrevAppVersion] = React.useState("");
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);
  const [markedRead, setMarkedRead] = React.useState(false);
  const [sessionTreeData, setSessionTreeData] = React.useState<any[]>([]);
  const [refreshingSessions, setRefreshingSessions] = React.useState(false);
  const [uid, setUID] = React.useState("");

  const history = useHistory();
  const dispatch = useDispatch();

  React.useEffect(() => {
    const cookieObj = new Cookies();
    setCookies(cookieObj);
    const prevAppVersion = cookieObj.get(COOKIE.APP_VERSION);
    setPrevAppVersion(prevAppVersion);

    rebuildSessions();
    console.log(13);

    const secondsBetweenRefreshingSesions = 5;

    // const refreshSessionsIntervalId = setInterval(
    //   () => refreshSessions(userUID),
    //   secondsBetweenRefreshingSesions * 1000
    // );

    // return () => clearInterval(refreshSessionsIntervalId);
  }, [sessions]);

  const rebuildSessions = async () => {
    // const newSessions = await refreshSessions(userUID);
    if (!sessions) return;
    buildSessionTreeData(
      sessions.sort((a, b) => a.createdAt.toMillis() - b.createdAt.toMillis())
    );
  };

  const storeUID = () => {
    if (cookies)
      cookies.set("UID", uid, {
        path: "/",
        sameSite: "strict",
      });

    dispatch(setUserUID(uid));
  };

  const setAppVersion = (version: string | undefined) => {
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
    dispatch({
      type: ReducerActionType.USER_LOGOUT,
    });
    history.push(routes.SignInRoute.link());
  };

  const refreshSessions = async (uid: string) => {
    setRefreshingSessions(true);
    console.log("refreshSessions", uid);

    const sessions: BaseSession[] = await props.apiHandler.getSessionsByUID(
      uid
    );

    //Todo: reestablish
    // const namedSessionsPromises = sessions.map((session) => {
    //   return new Promise(async (resolve, reject) => {
    //     const sessionExtras = await apiHandler.getSessionExtras(session.id);

    //     resolve(
    //       new BaseSession({
    //         ...session,
    //         ...sessionExtras,
    //       })
    //     );
    //   });
    // });

    // const namedSessions = await Promise.all(namedSessionsPromises);

    dispatch({
      type: ReducerActionType.SET_SESSIONS,
      payload: { sessions: sessions },
    });
    setRefreshingSessions(false);
    return sessions;
  };

  async function setSessionName(session: BaseSession, newName: string) {
    //Todo: reestablish
    const success = false; /*await props.apiHandler.updateMetric(session.id, "name", {
      name: newName,
    });*/
    if (!success) {
      message.error("Failed to update session name");
      return;
    }
    refreshSessions(userUID);
    // setEditingSessionIndexBool(new Array(allSessions.length).fill(false));
  }

  const buildSessionTreeData = (sessions: BaseSession[]) => {
    // sessions = sessions.map((session) => new BaseSession(session));

    const data: any[] = [];
    sessions.forEach((session: BaseSession, i: number) => {
      let matchingIndexYear = data.findIndex(
        (yearLevel: any) => yearLevel.title === session.createdAt.year
      );
      if (matchingIndexYear === -1) {
        //Insert a new year into list
        matchingIndexYear =
          data.push({
            title: session.createdAt.year,
            value: session.createdAt.year,
            key: session.createdAt.year,
            selectable: false,
            children: [],
          }) - 1;
      }
      let matchingIndexMonth = data[matchingIndexYear].children.findIndex(
        (monthLevel: any) => monthLevel.title === session.createdAt.monthLong
      );
      if (matchingIndexMonth === -1) {
        //Insert a new month into list of children of correct year
        matchingIndexMonth =
          data[matchingIndexYear].children.push({
            title: session.createdAt.monthLong,
            value: session.createdAt.monthLong,
            key: session.createdAt.monthLong,
            selectable: false,
            children: [],
          }) - 1;
      }

      data[matchingIndexYear].children[matchingIndexMonth].children.push({
        title: (
          <SessionTreeNodeTitle
            session={session}
            setSessionName={setSessionName}
          />
        ),
        value: session.id,
        selectable: true,
      });
    });

    setSessionTreeData(data);
  };

  if (!cookies) return <Spin />;

  const isNewVersion = prevAppVersion !== process.env.REACT_APP_VERSION;

  const changelog = generateChangelog(ChangelogJSON);

  console.log("userUID", userUID);

  return (
    <FirebaseAuthConsumer>
      {({ isSignedIn, user, providerId }) => {
        return (
          <>
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
                    sessionTreeData={sessionTreeData}
                  />
                  <Button
                    type="link"
                    style={{ padding: "0px" }}
                    onClick={() => refreshSessions(userUID)}
                  >
                    <FontAwesomeIcon
                      icon="sync"
                      color="white"
                      className={refreshingSessions ? "sync--spin" : ""}
                    />
                  </Button>
                </div>
                <Input
                  style={{ marginLeft: "10px" }}
                  onChange={(event) => setUID(event.target.value)}
                ></Input>
                <Button onClick={storeUID}>Set UID</Button>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                  }}
                >
                  <Badge
                    dot
                    count={isNewVersion && !markedRead ? 1 : 0}
                    offset={[-15, 7]}
                  >
                    <Button
                      type="link"
                      onClick={() => setNotificationsOpen(true)}
                    >
                      <FontAwesomeIcon icon="bell" size="lg" color="white" />
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
            <Modal
              title="Changelog"
              visible={notificationsOpen}
              onOk={() => setNotificationsOpen(false)}
              onCancel={() => setNotificationsOpen(false)}
              footer={[
                <Button
                  key="read"
                  onClick={() => {
                    setAppVersion(process.env.REACT_APP_VERSION);
                    setMarkedRead(true);
                  }}
                >
                  Mark as Read
                </Button>,
                <Button
                  key="submit"
                  type="primary"
                  onClick={() => setNotificationsOpen(false)}
                >
                  Ok
                </Button>,
              ]}
            >
              <ReactMarkdown>{changelog}</ReactMarkdown>
            </Modal>
          </>
        );
      }}
    </FirebaseAuthConsumer>
  );
}
