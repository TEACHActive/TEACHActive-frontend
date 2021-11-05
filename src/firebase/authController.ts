import "firebase/authController";
import { User } from "firebase/auth";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";

import { logger } from "logging";
import { auth } from "firebase";

export const loginWithEmailAndPassword = async (
  email: string,
  password: string
): Promise<User | null> => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
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
