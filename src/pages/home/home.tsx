import React from "react";
import { Button, Result, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";

import { auth } from "firebase";
import apiHandler from "api/handler";
import { LOADING_STATE } from "api/types";
import { HomePagePresentational } from "./homePresentational";

export interface IHomePageProps {}

export function HomePage(props: IHomePageProps) {
  const [instructorName, setInstructorName] = React.useState<
    string | undefined
  >(undefined);
  const [
    instructorNameLoadingState,
    setInstructorNameLoadingState,
  ] = React.useState<LOADING_STATE>(LOADING_STATE.LOADING);

  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  React.useEffect(() => {
    // apiHandler.getInstructorName(user?.uid || "");
    const fetchInstructorName = async () => {
      let response;
      response = await apiHandler.getInstructorName(user?.uid || "");
      if (response === null) {
        //Error
        setInstructorNameLoadingState(LOADING_STATE.ERROR);
        return;
      }
      setInstructorName(response?.name);
      setInstructorNameLoadingState(LOADING_STATE.DONE);
    };
    fetchInstructorName();
  }, [user]);

  switch (instructorNameLoadingState) {
    case LOADING_STATE.LOADING:
      return <Spin size="large" />;
    case LOADING_STATE.ERROR:
      return (
        <Result
          status="500"
          title="500"
          subTitle="Sorry, something went wrong."
          extra={
            <Button type="primary" onClick={() => navigate(0)}>
              Refresh
            </Button>
          }
        />
      );
    case LOADING_STATE.DONE:
      return <HomePagePresentational instructorName={instructorName || ""} />;
  }
}
