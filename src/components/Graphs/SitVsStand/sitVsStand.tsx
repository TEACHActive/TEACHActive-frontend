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

export interface ISitVsStandProps {}

const toPercent = (decimal: number, fixed = 0) =>
  `${(decimal * 100).toFixed(fixed)}%`;

// const defaultResolution = 10;

export function SitVsStand(props: ISitVsStandProps) {
  const selectedSession = useSelector(selectSelectedSession);

  const {
    isLoading,
    isError,
    isFetching,
    data,
  } = _useGetSitStandDataInSessionQuery(
    { sessionId: selectedSession?.id || "", numSegments: 10 },
    selectedSession ? null : skipToken
  );

  if (isFetching || isLoading) {
    return <Spin />;
  }
  if (isError || !data) {
    return (
      <Result status="error" subTitle="Error when fetching sit vs stand data" />
    );
  }

  const initalTimestamp = new SitStandInFrame(data[0]).timestamp.end;

  const sitStandData = data
    .map((frame) => new SitStandInFrame(frame))
    .sort((a, b) => a.timestamp.end.toMillis() - b.timestamp.end.toMillis())
    .map((sitStandData, i, arr) => {
      if (i === 0) return sitStandData;
      const timeDiffMins = sitStandData.timestamp.end
        .diff(initalTimestamp, "minutes")
        .toObject().minutes;
      // if (i === 1)
      //   console.log(sitStandData.timestamp.end, arr[i - 1].timestamp.end);

      sitStandData.timeDiff.minutes = Math.round(timeDiffMins || 0);
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
          position: "center",
        }}
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
