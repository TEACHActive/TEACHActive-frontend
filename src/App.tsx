import { Layout } from "antd";
import { Route, Routes } from "react-router-dom";

import { appRoutes } from "routes";
import { Sider } from "components/Sider/sider";
import { RequireAuth } from "hocs/requireAuth";
import { Header } from "components/Header/header";
import { Footer } from "components/Footer/footer";

import "./App.css";

function App() {
  return (
    <Layout className="layout">
      <Sider />
      <Layout>
        <Header />
        <Routes>
          {appRoutes.map((item, i) => {
            if (!item.visible) return <></>;
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
