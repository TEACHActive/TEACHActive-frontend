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
import * as ReducerActionType from "../../redux/actionTypes";

const { SubMenu } = Menu;
const { Header, Content, Footer, Sider } = Layout;

export interface ISidebarProps {
  history: any;
}

export function Sidebar(props: ISidebarProps) {
  const [sessions, setSessions] = React.useState<Session[]>([]);
  const [editingSessionIndexBool, setEditingSessionIndexBool] = React.useState(
    new Array()
  );
  const [newSessionName, setNewSessionName] = React.useState("");
  const sessionID = useSelector((state: any) => state.session.id);
  const dispatch = useDispatch();

  const apiHandler: IMetricPageAPIHandler = new MetricPageFakeAPIHandler();

  React.useEffect(() => {
    getSetSesssions();
  }, []);

  async function getSetSesssions() {
    const allSessions = await (await apiHandler.getAllSessions()).data;
    setEditingSessionIndexBool(new Array(allSessions.length).fill(false));
    setSessions(allSessions);
  }

  async function setSessionName(session: Session, newName: string) {
    const response = await apiHandler.setSessionName(session, newName);
    console.log(response);

    await getSetSesssions();
  }

  console.log("HERE", sessionID);

  return (
    <>
      <Sider breakpoint="lg" collapsedWidth="0">
        <div className="logo" />

        <Menu theme="dark" mode="inline">
          {routes
            .filter((item: ComponentRoute) => item.inSidebar)
            .map((item: ComponentRoute, i: number) =>
              item.name.toLowerCase() === "session" ? (
                <SubMenu key="sessionSub" icon={item.icon} title={item.name}>
                  {sessions.map((session: Session, i: number) => {
                    const date = session.createdAt?.toLocaleString();
                    if (editingSessionIndexBool[i]) {
                      return (
                        <div>
                          <Input
                            placeholder={date}
                            value={newSessionName}
                            onChange={(event) => {
                              setNewSessionName(event.target.value);
                            }}
                          />{" "}
                          <Button
                            type="primary"
                            onClick={() => {
                              setSessionName(session, newSessionName);
                              setNewSessionName("");
                              let items = [...editingSessionIndexBool];
                              items[i] = false;
                              setEditingSessionIndexBool(items);
                            }}
                          >
                            Save
                          </Button>
                        </div>
                      );
                    }
                    return (
                      <Menu.Item
                        key={session.id}
                        title={date}
                        onClick={() => {
                          // props.history.push(item.link(session.id))
                          dispatch({
                            type: ReducerActionType.SET_SESSION_ID,
                            payload: { id: session.id },
                          });
                        }}
                      >
                        {session.name ? session.name : date}{" "}
                        <FontAwesomeIcon
                          icon="edit"
                          className="sessionNameEditIcon"
                          onClick={() => {
                            let items = [...editingSessionIndexBool].fill(
                              false
                            );
                            items[i] = true;
                            setEditingSessionIndexBool(items);
                          }}
                        />
                      </Menu.Item>
                    );
                  })}
                </SubMenu>
              ) : (
                <Menu.Item
                  key={i}
                  icon={item.icon}
                  title={item.name}
                  onClick={() => props.history.push(item.link(sessionID))}
                >
                  {item.name}
                </Menu.Item>
              )
            )}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "2em",
            }}
          >
            <Button type="primary">New Session</Button>
          </div>
        </Menu>
      </Sider>
    </>
  );
}
