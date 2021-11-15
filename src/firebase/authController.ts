import {
  signOut,
  signInWithCustomToken,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { logger } from "logging";
import { auth } from "firebase";
import apiHandler from "api/handler";
import { TokenResponse } from "./types";

export const loginWithEmailAndPassword = async (
  email: string,
  password: string
): Promise<TokenResponse | null> => {
  try {
    const tokenResponse = await apiHandler.loginUser(email, password);

    if (!tokenResponse?.firebaseToken) {
      throw new Error("No firebase token returned");
    }

    // const userCreds = await signInWithEmailAndPassword(auth, email, password);

    // console.log(
    //   (await userCreds.user.getIdToken()) === tokenResponse?.firebaseToken
    // );

    await signInWithCustomToken(auth, tokenResponse?.firebaseToken); //Not working

    return tokenResponse;
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    logger.error("errorCode: " + errorCode, "errorMessage: " + errorMessage);
    return null;
  }
};

export const logoutOfFirebase = async (): Promise<boolean> => {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    logger.error(error);
    return false;
  }
};
