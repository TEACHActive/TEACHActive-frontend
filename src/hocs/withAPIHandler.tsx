import * as React from "react";
import { IAPIHandler } from "../api/handler";

export interface IWithAPIHandlerProps {
  apiHandler: IAPIHandler;
}

export const withAPIHandler = <P extends object>(
  Component: React.ComponentType<P>
) =>
  class WithWithAPIHandler extends React.Component<P & IWithAPIHandlerProps> {
    render() {
      const { apiHandler, ...props } = this.props;
      return <Component {...(props as P)} apiHandler={apiHandler} />;
    }
  };
