import { fetchBaseQuery } from "@reduxjs/toolkit/query";

import { URL } from "../util";
// import type { RootState } from "app/store";
import { Cookie, CookieSingleton } from "cookies";

export const baseQuery = fetchBaseQuery({
  baseUrl: URL,
  prepareHeaders: (headers, { getState }) => {
    // const { data } = (getState() as RootState)
    const token = CookieSingleton.getInstance().getCookie(Cookie.AUTH_TOKEN);

    // If we have a token set in state, let's assume that we should be passing it.
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

export const getCameraFPS = () => {
  return 15;
};
