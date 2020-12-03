import * as React from "react";
import { Layout, Menu } from "antd";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import "./App.css";
import { ComponentRoute, routes } from "./routes";

const { SubMenu } = Menu;

const { Header, Content, Footer, Sider } = Layout;

function App() {
  return (
    <Router>
      <div className="App">
        <Layout className="layout">
          <Sider
            breakpoint="lg"
            collapsedWidth="0"
            onBreakpoint={(broken) => {
              console.log(broken);
            }}
            onCollapse={(collapsed, type) => {
              console.log(collapsed, type);
            }}
          >
            <div className="logo">
              <h1>TEACHActive</h1>
            </div>
            <hr />
            <Menu theme="dark" mode="inline" defaultSelectedKeys={["4"]}>
              {routes
                .filter((item: ComponentRoute) => item.inSidebar)
                .map((item: ComponentRoute, i: number) => (
                  <SubMenu key={i} icon={item.icon} title={item.name}>
                    {item.name.toLowerCase() === "session" ? (
                      <Menu.ItemGroup key="g1" title="Item 1">
                        <Menu.Item key="1">
                          <Link to={item.link}>Option 1</Link>
                        </Menu.Item>
                        <Menu.Item key="2">
                          <Link to={item.link}>Option 2</Link>
                        </Menu.Item>
                      </Menu.ItemGroup>
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
            <Switch>
              {routes.map((item: any, i: number) => (
                <Route key={i} exact path={item.path}>
                  <Content style={{ margin: "24px 16px 0" }}>
                    <div
                      className="site-layout-background"
                      style={{ padding: 24, minHeight: 360 }}
                    >
                      {item.component}
                    </div>
                  </Content>
                </Route>
              ))}
            </Switch>
            <Footer style={{ textAlign: "center" }}></Footer>
          </Layout>
        </Layout>
      </div>
    </Router>
  );
}

export default App;
