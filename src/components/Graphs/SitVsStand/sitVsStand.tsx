import {
  Area,
  XAxis,
  YAxis,
  Label,
  AreaChart,
  CartesianGrid,
  Tooltip as RechartsTooltip,
} from "recharts";
import { Result, Spin } from "antd";
import { useSelector } from "react-redux";
import { SitStand } from "api/services/sessions/types";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import { selectSelectedSession } from "redux/sessionSlice";
import { SitStandInFrame } from "api/services/sitStand/types";
import { _useGetSitStandDataInSessionQuery } from "api/services/sitStand";

export interface ISitVsStandProps {
  sessionId?: string;
}

const toPercent = (decimal: number, fixed = 0) =>
  `${(decimal * 100).toFixed(fixed)}%`;

// const defaultResolution = 10;

export function SitVsStand(props: ISitVsStandProps) {
  const {
    isLoading,
    isError,
    isFetching,
    data,
  } = _useGetSitStandDataInSessionQuery(
    { sessionId: props.sessionId || "", chunkSizeInMinutes: 5 },
    props.sessionId ? null : skipToken
  );

  if (isFetching || isLoading) {
    return <Spin />;
  }
  if (isError || !data) {
    return (
      <Result status="error" subTitle="Error when fetching sit vs stand data" />
    );
  }

  const sitStandData = data
    .map((frame) => new SitStandInFrame(frame))
    .sort((a, b) => a.timestamp.end.toMillis() - b.timestamp.end.toMillis())
    .map((sitStandData, i, arr) => {
      sitStandData[SitStand.Sit] =
        Math.round((sitStandData[SitStand.Sit] + Number.EPSILON) * 100) / 100;
      sitStandData[SitStand.Stand] =
        Math.round((sitStandData[SitStand.Stand] + Number.EPSILON) * 100) / 100;
      sitStandData[SitStand.Error] =
        Math.round((sitStandData[SitStand.Error] + Number.EPSILON) * 100) / 100;
      return sitStandData;
    });

  return (
    <AreaChart
      width={400}
      height={300}
      data={sitStandData}
      stackOffset="expand"
      margin={{
        top: 10,
        right: 30,
        left: 0,
        bottom: 0,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="timeDiff.minutes">
        <Label
          value="Minutes elapsed in session"
          offset={0}
          position="insideBottom"
        />
      </XAxis>
      <YAxis
        tickFormatter={(value: any, index: number) => toPercent(value, 0)}
        label={{
          value: "Percentage of students in each state",
          angle: -90,
        }}
        width={100}
      />
      <RechartsTooltip />
      <Area
        type="monotone"
        dataKey={SitStand.Error}
        stackId="1"
        stroke="#f0000"
        fill="#ff0000"
      />
      <Area
        type="monotone"
        dataKey={SitStand.Stand}
        stackId="1"
        stroke="#2bc44f"
        fill="#2bc44f"
      />
      <Area
        type="monotone"
        dataKey={SitStand.Sit}
        stackId="1"
        stroke="#1e7fc7"
        fill="#1e7fc7"
      />
    </AreaChart>
  );
}
