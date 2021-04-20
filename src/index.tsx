/**
 * Entrypoint for application
 */

import React from "react";
import { Spin } from "antd";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";

import "firebase/auth";
import firebase from "firebase/app";
import { FirebaseAuthProvider } from "@react-firebase/auth";

import { PersistGate } from "redux-persist/integration/react";

import { firebaseConfig } from "./firebase/firebaseConfig";

import App from "./App";
import store from "./redux/store";
import * as serviceWorker from "./serviceWorker";

import "./index.css";
import "antd/dist/antd.css";

const { providerStore, persistor } = store();

ReactDOM.render(
  <Provider store={providerStore}>
    <PersistGate loading={<Spin />} persistor={persistor}>
      <FirebaseAuthProvider firebase={firebase} {...firebaseConfig}>
        {
          <Router>
            <App />
          </Router>
        }
      </FirebaseAuthProvider>
    </PersistGate>
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
