import * as React from "react";
import { Redirect } from "react-router-dom";
import OktaSignInWidget from "../../components/OktaSignInWidget/oktaSignInWidget";
import { useOktaAuth } from "@okta/okta-react";
import { Tokens } from "@okta/okta-auth-js";

import * as OktaAuth from "../../config/oktaConfig";

export interface ISignInPageProps {}

export default function SignInPage(props: ISignInPageProps) {
  const { oktaAuth, authState } = useOktaAuth();

  const onSuccess = (tokens: Tokens | undefined) => {
    oktaAuth.handleLoginRedirect(tokens);
  };

  const onError = (err: any) => {
    console.log("error logging in", err);
  };

  if (authState.isPending) return null;

  return authState.isAuthenticated ? (
    <Redirect to={{ pathname: "/" }} />
  ) : (
    <OktaSignInWidget
      config={OktaAuth.oktaSignInConfig}
      onSuccess={onSuccess}
      onError={onError}
    />
  );
}
