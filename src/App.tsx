import { Layout } from "antd";
import { Route, Routes } from "react-router-dom";

import { appRoutes } from "routes";
import { Sider } from "components/Sider/sider";
import { RequireAuth } from "hocs/requireAuth";
import { Header } from "components/Header/header";
import { Footer } from "components/Footer/footer";

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

import "./App.css";

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

function App() {
  return (
    <Layout className="layout">
      <Sider />
      <Layout>
        <Header />
        <Routes>
          {appRoutes
            .filter((item) => item.visible)
            .map((item, i) => {
              if (item.secureRoute) {
                return (
                  <Route
                    {...item.routeObject}
                    key={i}
                    element={
                      <RequireAuth>
                        <>{item.routeObject.element}</>
                      </RequireAuth>
                    }
                  />
                );
              }

              return (
                <Route
                  {...item.routeObject}
                  key={i}
                  element={<>{item.routeObject.element}</>} //Need to overwrite this since the element types are different
                />
              );
            })}
        </Routes>
      </Layout>
      <Footer />
    </Layout>
  );
}

export default App;
