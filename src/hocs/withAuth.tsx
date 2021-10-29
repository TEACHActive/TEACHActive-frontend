import { FirebaseAuthConsumer } from "@react-firebase/auth";
import React from "react";
import { Redirect, Route } from "react-router-dom";
import { Layout } from "antd";

const { Content } = Layout;

export const PrivateRoute = ({ ...rest }) => {
  return (
    <FirebaseAuthConsumer>
      {({ isSignedIn }: { isSignedIn: boolean }) => {
        return isSignedIn ? (
          <Route {...rest}>
            <Content>{rest.children}</Content>
          </Route>
        ) : (
          <Redirect to="/login" />
        );
      }}
    </FirebaseAuthConsumer>
  );
};
