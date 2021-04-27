import React from "react";

import { Layout } from "antd";
import { Switch, Route } from "react-router-dom";
import { library } from "@fortawesome/fontawesome-svg-core";

import {
  faBan,
  faBell,
  faEdit,
  faSync,
  faCheck,
  faUsers,
  faIdCard,
  faComment,
  faArrowUp,
  faComments,
  faHandPaper,
  faGripLines,
  faArrowDown,
  faBookReader,
} from "@fortawesome/free-solid-svg-icons";

import { PrivateRoute } from "./hocs/withAuth";
import { ComponentRoute, routes } from "./routes";
import { Header } from "./components/Header/header";
import { Sidebar } from "./components/Sidebar/sidebar";

import "./App.css";
import { updateSessions } from "redux/actions";
import { useDispatch } from "react-redux";
// import apiHandler from "api/handler";

const { Content, Footer } = Layout;

library.add(
  faBan,
  faBell,
  faEdit,
  faSync,
  faCheck,
  faUsers,
  faIdCard,
  faComment,
  faArrowUp,
  faComments,
  faHandPaper,
  faGripLines,
  faArrowDown,
  faBookReader
);

interface IAppProps {}

function App(props: IAppProps) {
  return (
    <Layout className="layout">
      <Sidebar />
      <Layout>
        <Header />
        <Switch>
          {routes.map((item: ComponentRoute, i: number) => {
            const content = (
              <Content style={{ margin: "24px 16px 0" }}>
                {item.component}
              </Content>
            );

            const propProps = {
              key: i,
              exact: item.exact,
              path: item.path,
            };

            return item.secure ? (
              <PrivateRoute {...propProps}>{content}</PrivateRoute>
            ) : (
              <Route {...propProps}>{content}</Route>
            );
          })}
        </Switch>
        <Footer style={{ textAlign: "center" }}></Footer>
      </Layout>
    </Layout>
  );
}

export default App;
