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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./App.css";
import { ComponentRoute, routes } from "./routes";
import SessionJSON from "./data/session.json";
// import history from "./history";
import { Session } from "./types/types";

const { SubMenu } = Menu;

const { Header, Content, Footer, Sider } = Layout;

library.add(faEdit, faArrowUp, faArrowDown);

function App(props: any) {
  let history = useHistory();
  return (
    <div className="App">
      <Layout className="layout">
        <Sider breakpoint="lg" collapsedWidth="0">
          <div className="logo" />

          <Menu theme="dark" mode="inline">
            {routes
              .filter((item: ComponentRoute) => item.inSidebar)
              .map((item: ComponentRoute, i: number) => (
                <SubMenu
                  key={i}
                  icon={item.icon}
                  title={item.name}
                  onTitleClick={() => history.push(item.link)}
                >
                  {item.name.toLowerCase() === "session" ? (
                    SessionJSON.sessions.map((session: any, i: number) => {
                      const sessionObj: Session = new Session(session);
                      return (
                        <Menu.ItemGroup key={i} title="Month">
                          <Menu.Item
                            onClick={() => history.push(`${sessionObj.id}`)}
                          >
                            {sessionObj.date.format("MMM Do YY")}{" "}
                            <FontAwesomeIcon icon="edit" />
                          </Menu.Item>
                        </Menu.ItemGroup>
                      );
                    })
                  ) : (
                    <Link to={item.link} />
                  )}
                </SubMenu>
              ))}
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
