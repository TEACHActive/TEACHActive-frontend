import * as React from "react";
import { Layout, Button } from "antd";
import { useHistory } from "react-router-dom";
import {
  FirebaseAuthConsumer,
} from "@react-firebase/auth";
import * as firebase from "firebase/app";
import "firebase/auth";

import { Session } from "../../pages/metric/metricPage.types";
import { IMetricPageAPIHandler } from "../../pages/metric/metricPage.handler";
import SessionSelect from "../SessionSelect/sessionSelect";

const { Header: AntHeader } = Layout;

export interface IHeaderProps {
  history: any;
  sessions: Session[];
  apiHandler: IMetricPageAPIHandler;
  refreshSessions: () => Promise<void>;
}

export function Header(props: IHeaderProps) {
  const history = useHistory();

  const login = async () => {
    const googleAuthProvider = new firebase.default.auth.GoogleAuthProvider();
    firebase.default.auth().signInWithPopup(googleAuthProvider).then(function(result) {
      // The firebase.User instance:
      var user = result.user;
      // The Facebook firebase.auth.AuthCredential containing the Facebook
      // access token:
      var credential = result.credential;
    }, function(error) {
      // The provider's account email, can be used in case of
      // auth/account-exists-with-different-credential to fetch the providers
      // linked to the email:
      var email = error.email;
      // The provider's credential:
      var credential = error.credential;
      // In case of auth/account-exists-with-different-credential error,
      // you can fetch the providers using this:
      if (error.code === 'auth/account-exists-with-different-credential') {
        firebase.default.auth().fetchSignInMethodsForEmail(email).then(function(providers) {
          // The returned 'providers' is a list of the available providers
          // linked to the email address. Please refer to the guide for a more
          // complete explanation on how to recover from this error.
        });
      }
    });
  }
  const logout = async () => firebase.default.auth().signOut();

  return (
    <AntHeader
      className="site-layout-sub-header-background"
      style={{
        paddingLeft: "1em",
        display: "flex",
        alignItems: "flex-start",
      }}
    >
      <div
        style={{
          color: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* {props.history.location.pathname.split("/").pop()} */}
        <SessionSelect
          sessions={props.sessions}
          apiHandler={props.apiHandler}
          refreshSessions={props.refreshSessions}
        />
        <FirebaseAuthConsumer>
        {({ isSignedIn, user, providerId }: { isSignedIn: boolean, user: any, providerId: any }) => {
          return (
            isSignedIn ?  
              <Button danger type="default" onClick={logout}>
                Logout
              </Button>
              :
              <Button type="primary" onClick={login}>
                Login
              </Button>
            );
          }}
        </FirebaseAuthConsumer>
      </div>
      
    </AntHeader>
  );
}
