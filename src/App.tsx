import * as React from "react";
import { Layout } from "antd";
import { Switch, Route } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faEdit,
  faArrowUp,
  faArrowDown,
  faHandPaper,
  faComment,
  faComments,
  faIdCard,
  faBookReader,
} from "@fortawesome/free-solid-svg-icons";

import "./App.css";
import { ComponentRoute, routes } from "./routes";
import {
  IMetricPageAPIHandler,
  MetricPageFakeAPIHandler,
} from "./pages/metric/metricPage.handler";
import { Session } from "./pages/metric/metricPage.types";

import { Sidebar } from "./components/Sidebar/sidebar";

const { Content, Footer } = Layout;

library.add(
  faEdit,
  faArrowUp,
  faArrowDown,
  faHandPaper,
  faComment,
  faComments,
  faIdCard,
  faBookReader
);

function App(props: any) {
  const history = useHistory();

  return (
    <div className="App">
      <Layout className="layout">
        <Sidebar history={history} />
        <Layout>
          {/* <Header
            className="site-layout-sub-header-background"
            style={{
              paddingLeft: "1em",
              display: "flex",
              alignItems: "flex-start",
            }}
          >
            <h1 style={{ color: "white" }}>
              {history.location.pathname.split("/").pop()}
            </h1>
          </Header> */}
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
