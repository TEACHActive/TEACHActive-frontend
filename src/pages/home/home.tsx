import { useAuthState } from "react-firebase-hooks/auth";

import { auth } from "firebase";
import { WithQueryResult } from "hocs/withQueryResult";
import { useGetUserQuery } from "api/services/user/user";
import { HomePagePresentational } from "./homePresentational";

export interface IHomePageProps {}

export function HomePage(props: IHomePageProps) {
  const [user] = useAuthState(auth);

  const { data, error, isLoading } = useGetUserQuery(user?.uid || "");

  const WrappedComponent = (
    <HomePagePresentational instructorName={data?.data?.name || ""} />
  );

  return WithQueryResult(WrappedComponent, data, error, isLoading);
}
