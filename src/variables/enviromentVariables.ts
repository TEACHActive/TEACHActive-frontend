import { logger } from "logging";

const envLoadError = (envVar: string) => {
  const errorMessage = `Could not load ${envVar} env variable`;
  logger.error(errorMessage);
  throw new Error(errorMessage);
};

const falsyPrimitives = {
  string: "",
  intAsString: "0",
};

//=====Load .env Variables=====
//=============================

//=====Firebase=====
//==================
export const FIREBASE_API_KEY: string =
  process.env.REACT_APP_FIREBASE_API_KEY || falsyPrimitives.string;
if (!FIREBASE_API_KEY) {
  envLoadError("REACT_APP_FIREBASE_API_KEY");
}

export const FIREBASE_AUTHDOMAIN: string =
  process.env.REACT_APP_FIREBASE_AUTHDOMAIN || falsyPrimitives.string;
if (!FIREBASE_AUTHDOMAIN) {
  envLoadError("REACT_APP_FIREBASE_AUTHDOMAIN");
}

export const FIREBASE_PROJECT_ID: string =
  process.env.REACT_APP_FIREBASE_PROJECT_ID || falsyPrimitives.string;
if (!FIREBASE_PROJECT_ID) {
  envLoadError("REACT_APP_FIREBASE_PROJECT_ID");
}

export const FIREBASE_STORAGEBUCKET: string =
  process.env.REACT_APP_FIREBASE_STORAGEBUCKET || falsyPrimitives.string;
if (!FIREBASE_STORAGEBUCKET) {
  envLoadError("REACT_APP_FIREBASE_STORAGEBUCKET");
}

export const FIREBASE_MESSAGING_SENDER_ID: string =
  process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || falsyPrimitives.string;
if (!FIREBASE_MESSAGING_SENDER_ID) {
  envLoadError("REACT_APP_FIREBASE_MESSAGING_SENDER_ID");
}

export const FIREBASE_APP_ID: string =
  process.env.REACT_APP_FIREBASE_APP_ID || falsyPrimitives.string;
if (!FIREBASE_APP_ID) {
  envLoadError("REACT_APP_FIREBASE_APP_ID");
}

export const FIREBASE_MEASUREMENT_ID: string =
  process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || falsyPrimitives.string;
if (!FIREBASE_MEASUREMENT_ID) {
  envLoadError("REACT_APP_FIREBASE_MEASUREMENT_ID");
}

//=======Other======
//==================
export const BASE_URL: string =
  process.env.REACT_APP_BASE_URL || falsyPrimitives.string;
if (!BASE_URL) {
  envLoadError("REACT_APP_BASE_URL");
}

export const VERSION: string =
  process.env.REACT_APP_VERSION || falsyPrimitives.string;
if (!VERSION) {
  envLoadError("REACT_APP_VERSION");
}

export const TEACHACTIVE_BACKEND_URL: string =
  process.env.REACT_APP_TEACHACTIVE_BACKEND_URL || falsyPrimitives.string;
if (!TEACHACTIVE_BACKEND_URL) {
  // If unset will default to 0 and !0 = false
  envLoadError("REACT_APP_TEACHACTIVE_BACKEND_URL");
}

export const TEACHACTIVE_BACKEND_PORT: number = parseInt(
  process.env.REACT_APP_TEACHACTIVE_BACKEND_PORT || falsyPrimitives.intAsString
);
if (!TEACHACTIVE_BACKEND_PORT) {
  // If unset will default to 0 and !0 = false
  envLoadError("REACT_APP_TEACHACTIVE_BACKEND_PORT");
}

export const TEACHACTIVE_BACKEND_PORT_DEV: number = parseInt(
  process.env.REACT_APP_TEACHACTIVE_BACKEND_PORT_DEV ||
    falsyPrimitives.intAsString
);
if (!TEACHACTIVE_BACKEND_PORT_DEV) {
  // If unset will default to 0 and !0 = false
  envLoadError("REACT_APP_TEACHACTIVE_BACKEND_PORT_DEV");
}
