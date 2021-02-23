import * as React from "react";
import { Layout, TreeSelect } from "antd";
import { Switch, Route } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { Security, SecureRoute, LoginCallback } from "@okta/okta-react";
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
import { OktaAuth } from "@okta/okta-auth-js";

import "./App.css";
import { ComponentRoute, routes } from "./routes";
import {
  IMetricPageAPIHandler,
  MetricPageFakeAPIHandler,
} from "./pages/metric/metricPage.handler";
import { Session } from "./pages/metric/metricPage.types";

import { Sidebar } from "./components/Sidebar/sidebar";
import { Header } from "./components/Header/header";

import * as OktaConfig from "./config/oktaConfig";

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

  const customAuthHandler = () => {
    history.push("/login");
  };

  const [sessions, setSessions] = React.useState<Session[]>([]);
  // const [selectedSession, setSelectedSession] = React.useState<Session | null>(
  //   null
  // );

  const apiHandler: IMetricPageAPIHandler = new MetricPageFakeAPIHandler();

  React.useEffect(() => {
    getSetSesssions();
  }, []);

  async function getSetSesssions() {
    const allSessions = await (await apiHandler.getAllSessions()).data;

    setSessions(allSessions);
  }

  // console.log(selectedSession);

  return (
    <div className="App">
      <Layout className="layout">
        <Sidebar
          history={history}
          apiHandler={apiHandler}
          refreshSessions={getSetSesssions}
          sessions={sessions}
          // selectedSession={selectedSession}
        />
        <Layout>
          <Header
            history={history}
            sessions={sessions}
            apiHandler={apiHandler}
            refreshSessions={getSetSesssions}
            // selectedSession={selectedSession}
            // updateSelectedSession={updateSelectedSession}
          />
          <div
            className="site-layout-background"
            style={{ padding: 24, minHeight: 360 }}
          >
            <Security
              oktaAuth={new OktaAuth(OktaConfig.oktaAuthConfig)}
              onAuthRequired={customAuthHandler}
            >
              <Switch>
                {routes.map((item: ComponentRoute, i: number) =>
                  item.secure ? (
                    <SecureRoute key={i} exact={item.exact} path={item.path}>
                      <Content style={{ margin: "24px 16px 0" }}>
                        {item.component}
                      </Content>
                    </SecureRoute>
                  ) : (
                    <Route key={i} exact={item.exact} path={item.path}>
                      <Content style={{ margin: "24px 16px 0" }}>
                        {item.component}
                      </Content>
                    </Route>
                  )
                )}
              </Switch>
            </Security>
          </div>
          <Footer style={{ textAlign: "center" }}></Footer>
        </Layout>
      </Layout>
    </div>
  );
}

export default App;
