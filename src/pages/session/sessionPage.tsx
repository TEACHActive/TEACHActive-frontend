import * as React from "react";
import { useParams } from "react-router-dom";
import { MetricLayout } from "../../components/MetricLayout/metricLayout";
// import SessionJSON from "../../data/session.json";
// import { Session } from "../../types/types";

export interface ISessionProps {}

interface ParamTypes {
  id: string;
}

export default function SessionPage(props: ISessionProps) {
  const { id } = useParams<ParamTypes>();
  return (
    <div style={{ display: "flex" }}>
      <MetricLayout id={Number(id)} />
    </div>
  );
}
