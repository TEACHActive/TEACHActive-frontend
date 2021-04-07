import { message } from "antd";
import * as firebase from "firebase/app";
import "firebase/auth";

export const loginWithProvider = async (
  provider: firebase.default.auth.AuthProvider
): Promise<firebase.default.User | null> => {
  return firebase.default
    .auth()
    .signInWithPopup(provider)
    .then(
      function (result) {
        // The firebase.User instance:
        const user = result.user;
        // The Facebook firebase.auth.AuthCredential containing the Facebook
        // access token:
        const credential = result.credential;
        return user;
      },
      function (error) {
        // The provider's account email, can be used in case of
        // auth/account-exists-with-different-credential to fetch the providers
        // linked to the email:
        const email = error.email;
        // The provider's credential:
        const credential = error.credential;
        // In case of auth/account-exists-with-different-credential error,
        // you can fetch the providers using this:
        if (error.code === "auth/account-exists-with-different-credential") {
          firebase.default
            .auth()
            .fetchSignInMethodsForEmail(email)
            .then(function (providers) {
              // The returned 'providers' is a list of the available providers
              // linked to the email address. Please refer to the guide for a more
              // complete explanation on how to recover from this error.
              message.error("account-exists-with-different-credential");
            });
        }
        return null;
      }
    );
};

export const loginWithEmailAndPassword = async (
  email: string,
  password: string
): Promise<firebase.default.User | null> => {
  return firebase.default
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(
      function (result) {
        const user = result.user;
        const credential = result.credential;
        return user;
      },
      function (error) {
        const email = error.email;
        const credential = error.credential;
        if (error.code === "auth/account-exists-with-different-credential") {
          firebase.default
            .auth()
            .fetchSignInMethodsForEmail(email)
            .then(function (providers) {
              message.error("account-exists-with-different-credential");
            });
        }
        return null;
      }
    );
};

export const logoutOfFirebase = async () => firebase.default.auth().signOut();
