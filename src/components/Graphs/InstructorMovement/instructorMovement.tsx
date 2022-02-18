import {
  Line,
  XAxis,
  YAxis,
  Label,
  Tooltip,
  CartesianGrid,
  ComposedChart,
} from "recharts";
import { useSelector } from "react-redux";
import { DurationObjectUnits } from "luxon";
import { selectSelectedSession } from "redux/sessionSlice";
import { _useGetInstructorMovementInSessionQuery } from "api/services/movement";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import { Result, Spin } from "antd";
import { Heatmap } from "./heatmap";

// import Heatmap from "./heatmap";

export interface IInstructorMovementProps {}

type AgumentedInstructorMovementData = {
  podiumPos: number[];
  startTimestamp: {
    [unit: string]: keyof DurationObjectUnits;
  };
  avgX: number;
}[];

export function InstructorMovement(props: IInstructorMovementProps) {
  const selectedSession = useSelector(selectSelectedSession);

  const {
    data,
    isLoading,
    isFetching,
    isError,
  } = _useGetInstructorMovementInSessionQuery(
    { sessionId: selectedSession?.id || "", numSegments: 50 },
    selectedSession ? null : skipToken
  );

  if (isLoading || isFetching) {
    return <Spin />;
  }
  if (isError || !data) {
    return (
      <Result
        status="error"
        subTitle="Error when loading Instructor Movement"
      />
    );
  }

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {/* <ComposedChart
          width={300}
          height={500}
          data={data}
          style={{ transform: "rotate(90deg)", width: "", height: "" }}
        > */}
        <ComposedChart width={500} height={300} data={data}>
          <Line
            type="basis"
            dataKey="instructor.avg.xPos"
            stroke="#8884d8"
            strokeWidth={2}
            connectNulls={true}
            dot={false}
          />
          {/* <Area
          type="monotone"
          dataKey="podiumPos"
          stroke="#8884d8"
          dot={false}
          strokeWidth={2}
        /> */}
          <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
          <XAxis dataKey="timeDiffMinutes">
            <Label
              value="Minutes elapsed in session"
              offset={0}
              position="insideBottom"
            />
          </XAxis>
          <Tooltip />
          <YAxis
            dataKey="instructor.avg.xPos"
            domain={["dataMin", "dataMax"]}
            label={{
              value: "Left <==> Right",
              angle: -90,
              position: "insideBottomLeft",
            }}
            tick={false}
          />
        </ComposedChart>
      </div>
      <div style={{ margin: "2em" }}>
        <Heatmap data={data.map((im) => im.instructor.avg.xPos)} />
      </div>
    </>
  );
}
