import * as React from "react";
import { Layout, Menu } from "antd";
import { Switch, Route, Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faEdit,
  faArrowUp,
  faArrowDown,
} from "@fortawesome/free-solid-svg-icons";

import "./App.css";
import { ComponentRoute, routes } from "./routes";
import {
  ISessionPageAPIHandler,
  SessionPageFakeAPIHandler,
} from "./pages/session/sessionPage.handler";
import { Session } from "./pages/session/sessionPage.types";

const { SubMenu } = Menu;

const { Header, Content, Footer, Sider } = Layout;

library.add(faEdit, faArrowUp, faArrowDown);

function App(props: any) {
  let history = useHistory();

  const [sessions, setSessions] = React.useState<Session[]>([]);
  const apiHandler: ISessionPageAPIHandler = new SessionPageFakeAPIHandler();
  React.useEffect(() => {
    (async function getSetSesssions() {
      const allSessions = await apiHandler.getAllSessions();
      setSessions(allSessions);
    })();
  }, [apiHandler]);

  return (
    <div className="App">
      <Layout className="layout">
        <Sider breakpoint="lg" collapsedWidth="0">
          <div className="logo" />

          <Menu theme="dark" mode="inline">
            {routes
              .filter((item: ComponentRoute) => item.inSidebar)
              .map((item: ComponentRoute, i: number) =>
                item.name.toLowerCase() === "session" ? (
                  <SubMenu
                    key={i}
                    icon={item.icon}
                    title={item.name}
                    onTitleClick={(e) => console.log(e.key)}
                  >
                    {sessions.map((sessions: Session, i: number) => {
                      const date = sessions.createdAt?.toLocaleString();
                      console.log(date);

                      return (
                        <Menu.Item key={i} title={date}>
                          {date}
                        </Menu.Item>
                      );
                    })}
                  </SubMenu>
                ) : (
                  <Menu.Item
                    key={i}
                    icon={item.icon}
                    title={item.name}
                    onClick={() => history.push(item.link)}
                  >
                    {item.name}
                  </Menu.Item>
                )
              )}
          </Menu>
        </Sider>
        <Layout>
          <Header
            className="site-layout-sub-header-background"
            style={{
              paddingLeft: "1em",
              display: "flex",
              alignItems: "flex-start",
            }}
          >
            <h1 style={{ color: "white" }}>HCI 589 - Ethics</h1>
          </Header>
          <div
            className="site-layout-background"
            style={{ padding: 24, minHeight: 360 }}
          >
            <Switch>
              {routes.map((item: ComponentRoute, i: number) => (
                <Route key={i} exact={item.exact} path={item.path}>
                  <Content style={{ margin: "24px 16px 0" }}>
                    {item.component}
                  </Content>
                </Route>
              ))}
            </Switch>
          </div>
          <Footer style={{ textAlign: "center" }}></Footer>
        </Layout>
      </Layout>
    </div>
  );
}

export default App;
