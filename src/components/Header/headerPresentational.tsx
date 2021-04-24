import * as React from "react";

import "firebase/auth";

import { DataNode } from "antd/lib/tree";
import { Button, Badge, Modal, Layout, Input } from "antd";
import { FirebaseAuthConsumer } from "@react-firebase/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { BaseSession } from "api/types";
import Changelog from "components/Changelog/changelog";
import SessionSelect from "components/SessionSelect/sessionSelect";

import "./header.css";
import { CookieSingleton } from "types/cookies.types";
import { Cookie } from "constants/cookies";

const { Header: AntHeader } = Layout;

interface IHeaderPresentationalProps {
  sessions: BaseSession[];
  sessionTreeData: DataNode[];
  setNotificationsOpen: (open: boolean) => void;
  notificationsOpen: boolean;
  logout: () => Promise<void>;
  login: () => void;
  isNewAppVersion: boolean;
  markedRead: boolean;
  setAppVersion: (version: string | undefined) => void;
  refreshSessions: (uid: string) => void;
  refreshingSessions: boolean;
}

const HeaderPresentational: React.FC<IHeaderPresentationalProps> = (props) => {
  const [UID, setUID] = React.useState("");

  const storeUID = (uid: string) => {
    CookieSingleton.getInstance().setCookie(Cookie.UID, uid);
  };
  return (
    <FirebaseAuthConsumer>
      {({
        isSignedIn,
        user,
      }: {
        isSignedIn: boolean;
        user: firebase.default.User;
      }) => (
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
                  sessions={props.sessions}
                  sessionTreeData={props.sessionTreeData}
                />
                {isSignedIn && (
                  <Button
                    type="link"
                    style={{ padding: "0px" }}
                    onClick={() =>
                      props.refreshSessions(
                        CookieSingleton.getInstance().getCookie(Cookie.UID) ||
                          user.uid
                      )
                    }
                  >
                    <FontAwesomeIcon
                      icon="sync"
                      color="white"
                      className={props.refreshingSessions ? "sync--spin" : ""}
                    />
                  </Button>
                )}
              </div>
              <Input
                style={{ marginLeft: "10px" }}
                onChange={(event) => setUID(event.target.value)}
              ></Input>
              <Button onClick={() => storeUID(UID)}>Set UID</Button>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                <Badge
                  dot
                  count={props.isNewAppVersion && !props.markedRead ? 1 : 0}
                  offset={[-15, 7]}
                >
                  <Button
                    type="link"
                    onClick={() => props.setNotificationsOpen(true)}
                  >
                    <FontAwesomeIcon icon="bell" size="lg" color="white" />
                  </Button>
                </Badge>
                <hr style={{ width: "5px", margin: "0px 28px 0px 15px" }} />
                {isSignedIn ? (
                  <div>
                    <Button danger type="default" onClick={props.logout}>
                      Log out
                    </Button>
                  </div>
                ) : (
                  <Button type="primary" onClick={props.login}>
                    Log in
                  </Button>
                )}
              </div>
            </div>
          </AntHeader>
          <Modal
            title="Changelog"
            visible={props.notificationsOpen}
            onOk={() => props.setNotificationsOpen(false)}
            onCancel={() => props.setNotificationsOpen(false)}
            footer={[
              <Button
                key="read"
                onClick={() => {
                  props.setAppVersion(process.env.REACT_APP_VERSION);
                }}
              >
                Mark as Read
              </Button>,
              <Button
                key="submit"
                type="primary"
                onClick={() => props.setNotificationsOpen(false)}
              >
                Ok
              </Button>,
            ]}
          >
            <Changelog />
          </Modal>
        </>
      )}
    </FirebaseAuthConsumer>
  );
};

export default HeaderPresentational;
