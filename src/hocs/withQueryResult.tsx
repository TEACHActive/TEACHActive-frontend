import { Button, Result, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";

export function WithQueryResult<T>(
  WrappedComponent: JSX.Element,
  data: T | undefined,
  error: FetchBaseQueryError | SerializedError | boolean | undefined,
  isLoading: boolean
) {
  const navigate = useNavigate();

  if (isLoading) {
    return <Spin size="large" />;
  } else if (data) {
    return WrappedComponent;
  } else {
    const status = "500";
    let subtitle = "Sorry, something went wrong.";
    if (typeof error !== "boolean") {
      subtitle =
        error && "data" in error
          ? JSON.stringify(error.data)
          : "Sorry, something went wrong.";
    }
    return (
      <Result
        status={status}
        title="500"
        subTitle={subtitle}
        extra={
          <Button type="primary" onClick={() => navigate(0)}>
            Refresh
          </Button>
        }
      />
    );
  }
}
