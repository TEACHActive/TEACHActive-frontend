import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import { store } from "./app/store";
import * as serviceWorker from "./serviceWorker";

import "./index.css";
import "antd/dist/antd.css";

ReactDOM.render(
  // <React.StrictMode>
  // Add this back when ant design updates to fix collapse sider issue https://github.com/ant-design/ant-design/issues/22493
  // Issue can be tracked here https://github.com/ant-design/ant-design/projects/7#card-36931870
  <BrowserRouter basename={process.env.PUBLIC_URL}>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>,
  // </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
