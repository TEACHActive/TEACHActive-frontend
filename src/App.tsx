import * as React from "react";
import { Layout, TreeSelect } from "antd";
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
import {
  FirebaseAuthConsumer,
} from "@react-firebase/auth";

import "./App.css";
import { ComponentRoute, routes } from "./routes";
import {
  IMetricPageAPIHandler,
  MetricPageFakeAPIHandler,
} from "./pages/metric/metricPage.handler";
import { Session } from "./pages/metric/metricPage.types";

import { Sidebar } from "./components/Sidebar/sidebar";
import { Header } from "./components/Header/header";
import { IAPIHandler, APIHandler } from "./api/handler";

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

  const [sessions, setSessions] = React.useState<Session[]>([]);
  // const [selectedSession, setSelectedSession] = React.useState<Session | null>(
  //   null
  // );

  const apiHandler: IMetricPageAPIHandler = new MetricPageFakeAPIHandler();

  const newAPIHandler: IAPIHandler = new APIHandler();

  React.useEffect(() => {
    getSetSesssions();
  }, []);

  async function getSetSesssions() {
    const allSessions = await (await apiHandler.getAllSessions()).data;
    if (allSessions) setSessions(allSessions);
  }

  // console.log(selectedSession);

  
  newAPIHandler.getSessionIDs();

  return (
    <div className="App">
      <FirebaseAuthConsumer>
        {({ isSignedIn, user, providerId }: { isSignedIn: boolean, user: any, providerId: any }) => {
          return (
            <Layout className="layout">
              {/* <pre style={{ height: 300, overflow: "auto" }}>
                {JSON.stringify({ isSignedIn, user, providerId }, null, 2)}
              </pre> */}
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
                  style={{ padding: 24, minHeight: "100%", height: "100%" }}
                >
                  <Switch>
                    {routes.map((item: ComponentRoute, i: number) =>
                      item.secure ? (
                        <Route key={i} exact={item.exact} path={item.path}>
                          <Content
                            style={{ margin: "24px 16px 0", overflow: "auto" }}
                          >
                            {item.component}
                          </Content>
                        </Route>
                      ) : (
                        <Route key={i} exact={item.exact} path={item.path}>
                          <Content style={{ margin: "24px 16px 0" }}>
                            {item.component}
                          </Content>
                        </Route>
                      )
                    )}
                  </Switch>
                </div>
                <Footer style={{ textAlign: "center" }}></Footer>
              </Layout>
            </Layout>
          );
        }}
      </FirebaseAuthConsumer>
    </div>
  );
}

export default App;
