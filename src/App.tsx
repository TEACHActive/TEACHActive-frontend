import { Layout } from "antd";
import { Route, Routes } from "react-router-dom";

import { appRoutes } from "routes";
import { PrivateRoute } from "hocs/privateRoute";

import "./App.css";

function App() {
  return (
    <Layout className="layout">
      {/* <Sidebar /> */}
      <Layout>
        {/* <Header /> */}
        <Routes>
          {appRoutes.map((item, i) => {
            if (item.secureRoute) {
              return <PrivateRoute elementRoute={item} key={i} />;
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
    </Layout>
  );
}

export default App;
