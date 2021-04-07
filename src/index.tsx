import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import "antd/dist/antd.css";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import firebase from "firebase/app";
import "firebase/auth";
import { FirebaseAuthProvider } from "@react-firebase/auth";
import { firebaseConfig } from "./firebase/firebaseConfig";
import { PersistGate } from "redux-persist/integration/react";

const { providerStore, persistor } = store();

ReactDOM.render(
  <Provider store={providerStore}>
    <PersistGate loading={null} persistor={persistor}>
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
