import React, { useEffect, useState, useContext } from "react";
// import COLOR from "../../constants/colors";
// import { TREND } from "../../constants/constants";
import MetricDisplay from "../MetricDisplay/metricDisplay";
import SessionJSON from "../../data/session.json";
import APIContext from "../../context/apiContext";
import { IAPIHandler } from "../../api/apiHandler";
import { Session } from "../../types/types";

export interface IMetricLayoutProps {
  id: number;
}

export function MetricLayout(props: IMetricLayoutProps) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const apiHandler: IAPIHandler = useContext(APIContext);
  useEffect(() => {
    (async function getSetSesssions() {
      const allSessions = await apiHandler.getAllSessions();
      setSessions(allSessions);
    })();
  }, []);

  const matchingSession: Session | undefined = sessions!.find(
    (session: Session) => session.id === props.id
  );
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-evenly",
        alignItems: "center",
        width: "100%",
      }}
    >
      {matchingSession &&
        matchingSession.data.map((item: any, i: number) => (
          <MetricDisplay
            key={i}
            icon={item.icon}
            color={item.color}
            name={item.name}
            metric={item.metric}
            unit={item.unit}
            trend={item.trend}
            trend_metric={item.trend_metric}
            trend_metric_unit={item.trend_metric_unit}
            help_text={item.help_text}
            has_alert={item.has_alert}
          />
        ))}
    </div>
  );
}
