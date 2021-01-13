import * as React from "react";
import { Menu, Layout, Input, Button } from "antd";
import { ComponentRoute, routes } from "../../routes";
import { Session } from "../../pages/session/sessionPage.types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  ISessionPageAPIHandler,
  SessionPageFakeAPIHandler,
} from "../../pages/session/sessionPage.handler";

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

  const apiHandler: ISessionPageAPIHandler = new SessionPageFakeAPIHandler();

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
                        onClick={() =>
                          props.history.push(`/session/${session.id}`)
                        }
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
                  onClick={() => props.history.push(item.link)}
                >
                  {item.name}
                </Menu.Item>
              )
            )}
        </Menu>
      </Sider>
    </>
  );
}
