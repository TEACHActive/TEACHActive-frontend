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
  faBell,
  faSync,
} from "@fortawesome/free-solid-svg-icons";

import "./App.css";
import { ComponentRoute, routes } from "./routes";

import { Sidebar } from "./components/Sidebar/sidebar";
import { Header } from "./components/Header/header";
import apiHandler from "./api/handler";
import { PrivateRoute } from "./hocs/withAuth";
import { getSessions } from "./redux/selectors";

const { Content, Footer } = Layout;

library.add(
  faEdit,
  faArrowUp,
  faArrowDown,
  faHandPaper,
  faComment,
  faComments,
  faIdCard,
  faBookReader,
  faBell,
  faSync
);

function App(props: any) {
  const history = useHistory();

  // const [sessions, setSessions] = React.useState<Session[]>([]);
  // const [selectedSession, setSelectedSession] = React.useState<Session | null>(
  //   null
  // );

  React.useEffect(() => {
    getSetSesssions();
    checkForUpdates();
  }, []);

  const checkForUpdates = () => {
    //REACT_APP_VERSION
  };

  const getSetSesssions = async () => {
    // const allSessions = await (await apiHandler.getAllSessions()).data;
    // if (allSessions) setSessions(allSessions);
    // const allIDs = await newAPIHandler.getAllSessionIDs();
    // console.log(videoFrames);
  };

  // console.log(selectedSession);

  return (
    <Layout className="layout">
      {/* <pre style={{ height: 300, overflow: "auto" }}>
                {JSON.stringify({ isSignedIn, user, providerId }, null, 2)}
              </pre> */}
      <Sidebar
        history={history}
        apiHandler={apiHandler}
        refreshSessions={getSetSesssions}
        // selectedSession={selectedSession}
      />
      <Layout>
        <Header
          history={history}
          apiHandler={apiHandler}
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
                <PrivateRoute key={i} exact={item.exact} path={item.path}>
                  <Content style={{ margin: "24px 16px 0" }}>
                    {item.component}
                  </Content>
                </PrivateRoute>
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
}

export default App;
