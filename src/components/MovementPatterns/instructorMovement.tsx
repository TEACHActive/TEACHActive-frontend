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
import { useCallback } from "react";
import { useSelector } from "react-redux";
import { DurationObjectUnits } from "luxon";

import apiHandler from "api/handler";
import { BaseSession } from "api/types";
import { chunkArray } from "../../util";
import { getKeywordFilter, getSelectedSession } from "redux/selectors";
import Heatmap from "./heatmap";
import { RootState } from "redux/store";

export interface IInstructorMovementProps {
  uid: string;
}

type AgumentedInstructorMovementData = {
  podiumPos: number[];
  startTimestamp: {
    [unit: string]: keyof DurationObjectUnits;
  };
  avgX: number;
}[];

const defaultResolution = 100;

const uidPodiumMap = new Map( //Hardcoding workaround. A better solution is to use the edusense classrooms and join on course id with instructor then grab the podiumPos from that
  Object.entries({
    DPidRiG5WDUV7SkonuDGh5WBWLe2: [1216, 1497], //SICTR 2221
    GA5ljNiXgqZfqno1SdqoAFmpfFs2: [3070, 3293], //Carver 101
    IMOYjGsw7Eh92fxgzjIbMtGHouE3: [1697, 2888], //Gilman 1352
    hrUBw7QuYzS5jRdUmHzPFRwABwi2: [2336, 2614], //SICTR 0114
  })
);

export function InstructorMovement(props: IInstructorMovementProps) {
  const selectedSession: BaseSession | null = useSelector(
    (state: RootState) => getSelectedSession(state),
    BaseSession.equal
  );

  const keywordUser = useSelector((state: RootState) =>
    getKeywordFilter(state)
  );

  const [loading, setLoading] = React.useState(true);
  const [
    instructorMovement,
    setInstructorMovement,
  ] = React.useState<AgumentedInstructorMovementData>([]);
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

      const xTimestamp = chunkedEngagementData.map((chunk) => {
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
      const agumentedInstructorMovementData = xTimestamp.map((data) => {
        return {
          ...data,
          podiumPos: uidPodiumMap.get(keywordUser || props.uid) || [],
        };
      });
      setInstructorMovement(agumentedInstructorMovementData);
    }

    setLoading(false);
  }, []);

  React.useEffect(() => {
    getInstructorMovement();
  }, [getInstructorMovement, selectedSession]);

  // var config: any = {
  //   data: instructorMovement,
  //   type: "density",
  //   xField: "avgX",
  //   yField: "",
  //   colorField: "tmp",
  //   color:
  //     "#F51D27-#FA541C-#FF8C12-#FFC838-#FAFFA8-#80FF73-#12CCCC-#1890FF-#6E32C2",
  //   annotations: [
  //     {
  //       type: "image",
  //       start: ["min", "max"],
  //       end: ["max", "min"],
  //       src:
  //         "https://gw.alipayobjects.com/zos/rmsportal/NeUTMwKtPcPxIFNTWZOZ.png",
  //     },
  //   ],
  // };

  if (loading) {
    return <Spin />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
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
      <Heatmap data={instructorMovement.map((im) => im.avgX)} />
    </div>
  );
}
