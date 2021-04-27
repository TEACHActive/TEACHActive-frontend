import * as React from "react";

import "firebase/auth";

import { message } from "antd";
import { DataNode } from "antd/lib/tree";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import * as routes from "routes";
import { BaseSession } from "api/types";
import { Cookie } from "constants/cookies";
import { getAllSessions, getKeywordFilter, getSessions } from "redux/selectors";
import { CookieSingleton } from "types/cookies.types";
import * as ReducerActionType from "redux/actionTypes";
import HeaderPresentational from "./headerPresentational";
import { logoutOfFirebase } from "firebase/authController";
import { SessionTreeNodeTitle } from "components/Header/sessionTreeNodeTitle";

import "./header.css";
import { useCallback } from "react";
import { updateSessions } from "redux/actions";
import apiHandler from "api/handler";
import { RootState } from "redux/store";

export interface IHeaderProps {}

export function Header(props: IHeaderProps) {
  const filteredSessions: BaseSession[] = useSelector((store: RootState) =>
    getSessions(store)
  );
  const allSessions: BaseSession[] = useSelector((store: RootState) =>
    getAllSessions(store)
  );
  const keywordFilter: string = useSelector((store: RootState) =>
    getKeywordFilter(store)
  );
  const [isNewAppVersion, setIsNewAppVersion] = React.useState(false);
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);
  const [refreshingSessions, setRefreshingSessions] = React.useState(false);
  const [markedRead, setMarkedRead] = React.useState(false);
  const [sessionTreeData, setSessionTreeData] = React.useState<DataNode[]>([]);
  const [sessionKeywords, setSessionKeywords] = React.useState<string[]>([]);

  const [timeoutIds, setTimeoutIds] = React.useState<
    ReturnType<typeof setTimeout>[]
  >([]);

  const history = useHistory();
  const dispatch = useDispatch();

  const checkVersion = () => {
    const prevAppVersion = CookieSingleton.getInstance().getCookie(
      Cookie.APP_VERSION
    );
    const isNewVersion = prevAppVersion !== process.env.REACT_APP_VERSION;
    setIsNewAppVersion(isNewVersion);
  };

  const rebuildSessions = useCallback(() => {
    if (!filteredSessions) return;
    const sortedSessions = filteredSessions.sort(
      (a, b) => a.createdAt.toMillis() - b.createdAt.toMillis()
    );
    buildSessionTreeData(sortedSessions);
  }, [filteredSessions]);

  const login = () => {
    history.push(routes.SignInRoute.link());
  };

  const logout = async () => {
    await logoutOfFirebase();
    dispatch({
      type: ReducerActionType.USER_LOGOUT,
    });
    history.push(routes.SignInRoute.link());
  };

  const setAppVersion = (version: string | undefined) => {
    if (!version) {
      message.error("Failed to mark as read, can not get app version");
      return;
    }
    setMarkedRead(true);
  };

  const refreshSessions = (uid: string) => {
    setRefreshingSessions(true);
    dispatch(updateSessions(uid));
    //Since dispatch doesnt return a promise (as far as im aware) just make the system think its updating the sessions for x seconds
    const numberOfSecondsToFakeRefreshSession = 1;
    const timeoutId = setTimeout(() => {
      setRefreshingSessions(false);
    }, numberOfSecondsToFakeRefreshSession * 1000);
    setTimeoutIds([...timeoutIds, timeoutId]);
  };

  const setSessionName = async (
    sessionId: string,
    newName: string,
    uid: string
  ) => {
    await apiHandler.updateSessionName(sessionId, newName);
    refreshSessions(uid);
  };

  const buildSessionTreeData = useCallback(
    (sessions: BaseSession[]) => {
      //Todo: Consider using Set() or .distinct to make this cleaner
      setSessionTreeData([]);

      const differentKeywords = new Set([
        ...allSessions.map((session) => session.keyword),
      ]);
      if (differentKeywords.size > 1) {
        const definedKeywords = Array.from(differentKeywords).filter(
          (keyword) => keyword !== undefined
        ) as string[];

        setSessionKeywords(definedKeywords);
      }

      const data: DataNode[] = [];
      sessions.forEach((session: BaseSession, i: number) => {
        let matchingIndexYear = data.findIndex(
          (yearLevel: any) => yearLevel.title === session.createdAt.year
        );
        if (matchingIndexYear === -1) {
          //Insert a new year into list
          matchingIndexYear =
            data.push({
              title: session.createdAt.year,
              key: session.createdAt.year,
              selectable: false,
              children: [],
            }) - 1;
        }
        // console.log(data[matchingIndexYear].children);

        let matchingIndexMonth = data[matchingIndexYear].children?.findIndex(
          (monthLevel: any) => monthLevel.title === session.createdAt.monthLong
        );
        // console.log(matchingIndexMonth);

        if (matchingIndexMonth === undefined || matchingIndexMonth === -1) {
          //Insert a new month into list of children of correct year
          if (!data[matchingIndexYear].children) {
            data[matchingIndexYear].children = [];
          }
          matchingIndexMonth =
            data[matchingIndexYear].children!.push({
              title: session.createdAt.monthLong,
              key: session.createdAt.monthLong,
              selectable: false,
              children: [],
            }) - 1;
        }

        if (!data[matchingIndexYear].children![matchingIndexMonth].children) {
          data[matchingIndexYear].children![matchingIndexMonth].children = [];
        }

        data[matchingIndexYear].children![matchingIndexMonth].children!.push({
          title: (
            <SessionTreeNodeTitle
              session={session}
              // setSessionName={(session: BaseSession,
              //   newSessionName: string) => setSessionName(session.id, newSessionName, "")}
            />
          ),
          key: session.id,
          selectable: true,
        });
      });

      setSessionTreeData(data);
    },
    [filteredSessions]
  );

  React.useEffect(() => {
    rebuildSessions();
    checkVersion();
    return () => {
      timeoutIds.forEach((timeoutId) => clearTimeout(timeoutId));
    };
  }, [rebuildSessions]);

  return (
    <HeaderPresentational
      sessions={filteredSessions}
      sessionTreeData={sessionTreeData}
      setNotificationsOpen={setNotificationsOpen}
      notificationsOpen={notificationsOpen}
      logout={logout}
      login={login}
      isNewAppVersion={isNewAppVersion}
      markedRead={markedRead}
      setAppVersion={setAppVersion}
      refreshSessions={refreshSessions}
      refreshingSessions={refreshingSessions}
      sessionKeywords={sessionKeywords}
      keywordFilter={keywordFilter}
    />
  );
}
