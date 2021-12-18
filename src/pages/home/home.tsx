import { useAuthState } from "react-firebase-hooks/auth";

import { auth } from "firebase";
import { WithQueryResult } from "hocs/withQueryResult";
import { _useGetUserQuery } from "api/services/user";
import { HomePagePresentational } from "./homePresentational";

export interface IHomePageProps {}

export function HomePage(props: IHomePageProps) {
  const [user] = useAuthState(auth);

  const { data, error, isLoading } = _useGetUserQuery(user?.uid || "");

  const WrappedComponent = (
    <HomePagePresentational instructorName={data?.name || ""} /> // TODO: ?
  );

  return WithQueryResult(WrappedComponent, data, error, isLoading);
}
