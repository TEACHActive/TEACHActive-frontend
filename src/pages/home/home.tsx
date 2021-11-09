import React from "react";
import { Spin } from "antd";
import { useAuthState } from "react-firebase-hooks/auth";

import { auth } from "firebase";
import apiHandler from "api/handler";
import { HomePagePresentational } from "./homePresentational";
import { logger } from "logging";

export interface IHomePageProps {}

export function HomePage(props: IHomePageProps) {
  const [instructorName, setInstructorName] = React.useState<
    string | undefined
  >(undefined);

  const [user] = useAuthState(auth);

  React.useEffect(() => {
    // apiHandler.getInstructorName(user?.uid || "");
    const fetchInstructorName = async () => {
      let response;
      try {
        response = await apiHandler.getInstructorName(user?.uid || "");
        setInstructorName(response?.name);
      } catch (e) {
        logger.error(e);
      }
    };
    fetchInstructorName();
  }, [user]);

  if (!instructorName) {
    return <Spin />;
  }

  return <HomePagePresentational instructorName={instructorName} />;
}
