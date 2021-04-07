import * as React from "react";
import { Menu, Layout, Input, Button } from "antd";
import { useSelector, useDispatch } from "react-redux";

import { ComponentRoute, routes } from "../../routes";
import { Session } from "../../pages/metric/metricPage.types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  IMetricPageAPIHandler,
  MetricPageFakeAPIHandler,
} from "../../pages/metric/metricPage.handler";
import { FirebaseAuthConsumer } from "@react-firebase/auth";

const { SubMenu } = Menu;
const { Header, Content, Footer, Sider } = Layout;

export interface ISidebarProps {
  history: any;
  apiHandler: IMetricPageAPIHandler;
  refreshSessions: () => Promise<void>;
  // selectedSession: Session | null;
}

export function Sidebar(props: ISidebarProps) {
  const [editingSessionIndexBool, setEditingSessionIndexBool] = React.useState(
    new Array()
  );
  const [newSessionName, setNewSessionName] = React.useState("");
  const selectedSession: Session | null = useSelector(
    (state: any) => state.selectedSession
  );
  const dispatch = useDispatch();

  async function setSessionName(session: Session, newName: string) {
    const response = await props.apiHandler.setSessionName(session, newName);
    // console.log(response);

    await props.refreshSessions();
    //Todo
    // setEditingSessionIndexBool(new Array(allSessions.length).fill(false));
  }
  return (
    <FirebaseAuthConsumer>
      {({
        isSignedIn,
        user,
        providerId,
      }: {
        isSignedIn: boolean;
        user: any;
        providerId: any;
      }) => {
        return (
          <>
            <Sider breakpoint="lg" collapsedWidth="0" style={{ flexGrow: 4 }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <div style={{ flexGrow: 10 }}>
                  <div className="logo" />

                  <Menu theme="dark" mode="inline">
                    {routes
                      .filter((item: ComponentRoute) => item.inSidebar)
                      .map((item: ComponentRoute, i: number) => (
                        <Menu.Item
                          key={i}
                          icon={item.icon}
                          title={item.name}
                          onClick={() => props.history.push(item.link())}
                        >
                          {item.name}
                        </Menu.Item>
                      ))}
                  </Menu>
                </div>
                <p
                  style={{
                    flexShrink: 1,
                    color: "white",
                    alignSelf: "center",
                    fontSize: 10,
                  }}
                >
                  Version: {process.env.REACT_APP_VERSION}
                </p>
              </div>
            </Sider>
          </>
        );
      }}
    </FirebaseAuthConsumer>
  );
}
