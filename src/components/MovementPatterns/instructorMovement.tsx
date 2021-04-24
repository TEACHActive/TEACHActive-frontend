import * as React from "react";

import {
  Line,
  Area,
  XAxis,
  YAxis,
  Label,
  Tooltip,
  CartesianGrid,
  ComposedChart,
} from "recharts";
import { Spin } from "antd";
import h337 from "heatmap.js";
import { useCallback } from "react";
import { useSelector } from "react-redux";
import { DurationObjectUnits } from "luxon";

import apiHandler from "api/handler";
import { BaseSession } from "api/types";
import { chunkArray } from "../../util";
import { getSelectedSession } from "redux/selectors";

export interface IInstructorMovementProps {}

type AgumentedInstructorMovementData = {
  podiumPos: number[];
  startTimestamp: {
    [unit: string]: keyof DurationObjectUnits;
  };
  avgX: number;
};

const defaultResolution = 100;

export function InstructorMovement(props: IInstructorMovementProps) {
  const selectedSession: BaseSession | null = useSelector(
    (state: any) => getSelectedSession(state),
    BaseSession.equal
  );

  const [loading, setLoading] = React.useState(true);
  const [instructorMovement, setInstructorMovement] = React.useState<
    AgumentedInstructorMovementData[]
  >([]);
  const [data, setData] = React.useState<any[]>([]);

  const getInstructorMovement = useCallback(async () => {
    setLoading(true);
    const instructorMovement = await apiHandler.getInstructorMovement(
      selectedSession.id
    );
    if (instructorMovement) {
      const filteredInstructorMovement = instructorMovement.filter(
        (frame) => !!frame.xPos
      );
      const chunkLength = filteredInstructorMovement.length / defaultResolution;

      const chunkedEngagementData = chunkArray(
        filteredInstructorMovement,
        chunkLength
      );

      const test = chunkedEngagementData.map((chunk) => {
        const startTimestamp = chunk[0].timestamp;
        return chunk.reduce(
          (acc, curr, _, { length }) => {
            return {
              ...acc,
              avgX: acc.avgX + curr.xPos / length,
            };
          },
          {
            avgX: 0,
            startTimestamp: startTimestamp,
          }
        );
      });
      const agumentedInstructorMovementData = test.map((data) => {
        return {
          ...data,
          podiumPos: [960, 1217],
        };
      });
      setInstructorMovement(agumentedInstructorMovementData);
    }
    setLoading(false);
  }, []);

  React.useEffect(() => {
    getInstructorMovement();

    const appContainer: HTMLElement | null = document.querySelector(".App");
    if (appContainer) {
      let heatmapInstance = h337.create({
        // only container is required, the rest will be defaults
        container: appContainer,
      });
      var points = [];
      var max = 0;
      let min = Number.MAX_SAFE_INTEGER;
      var width = 840;
      var height = 400;
      var len = 200;

      while (len--) {
        var val = Math.floor(Math.random() * 100);
        max = Math.max(max, val);
        min = Math.min(min, val);
        var point = {
          x: Math.floor(Math.random() * width),
          y: Math.floor(Math.random() * height),
          value: val,
        };
        points.push(point);
      }

      var data = {
        max: max,
        min: min,
        data: points,
      };
      // if you have a set of datapoints always use setData instead of addData
      // for data initialization
      heatmapInstance.setData(data);
    }
  }, [getInstructorMovement, selectedSession]);

  var config: any = {
    data: instructorMovement,
    type: "density",
    xField: "avgX",
    yField: "",
    colorField: "tmp",
    color:
      "#F51D27-#FA541C-#FF8C12-#FFC838-#FAFFA8-#80FF73-#12CCCC-#1890FF-#6E32C2",
    annotations: [
      {
        type: "image",
        start: ["min", "max"],
        end: ["max", "min"],
        src:
          "https://gw.alipayobjects.com/zos/rmsportal/NeUTMwKtPcPxIFNTWZOZ.png",
      },
    ],
  };

  if (loading) {
    return <Spin />;
  }

  return (
    <ComposedChart width={600} height={400} data={instructorMovement}>
      <Line
        type="basis"
        dataKey="avgX"
        stroke="#8884d8"
        strokeWidth={2}
        connectNulls={true}
        dot={false}
      />
      <Area
        type="monotone"
        dataKey="podiumPos"
        stroke="#8884d8"
        dot={false}
        strokeWidth={2}
      />
      <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
      <XAxis dataKey="startTimestamp.minutes">
        <Label
          value="Minutes elapsed in session"
          offset={0}
          position="insideBottom"
        />
      </XAxis>
      <Tooltip />
      <YAxis
        domain={["dataMin", "dataMax"]}
        label={{
          value: "Left <==> Right",
          angle: -90,
          position: "insideBottomLeft",
        }}
        tick={false}
      />
    </ComposedChart>
  );
}
