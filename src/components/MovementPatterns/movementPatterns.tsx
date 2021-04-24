import React from "react";

import { DownOutlined } from "@ant-design/icons";
import { Button, Dropdown, Menu, Spin } from "antd";

import { SitVsStand } from "./sitVsStand";
import { VideoFrameSession } from "api/types";
import { InstructorMovement } from "./instructorMovement";

export interface IMovementPatternsProps {}

enum SelectedActivity {
  SitVsStand,
  InstructorMovement,
}

// const defaultResolution = 100;

export function MovementPatterns(props: IMovementPatternsProps) {
  const [selectedActivity, setSelectedActivity] = React.useState(
    SelectedActivity.SitVsStand
  );
  const [movementPatternData, setMovementPatternData] = React.useState<any[]>();
  // const [resolution, setResolution] = React.useState(defaultResolution);

  React.useEffect(() => {
    // calculateInstructorMovementPatternData(props.videoFrames.instructor);
  }, []);

  // const getOpenPoseIdOfInstructor = (
  //   instructorVideoFrames: VideoFrameSession[]
  // ) => {
  //   //Not working because the highest person in frame is not always visible
  //   let map = new Map();

  //   for (
  //     let videoFrameIndex = 0;
  //     videoFrameIndex < instructorVideoFrames[0].videoFrames.length;
  //     videoFrameIndex++
  //   ) {
  //     const frame = instructorVideoFrames[0].videoFrames[videoFrameIndex];
  //     for (
  //       let personIndex = 0;
  //       personIndex < frame.people.length;
  //       personIndex++
  //     ) {
  //       const person = frame.people[personIndex];
  //       const personYFramesArr = map.get(person.openposeId) || [];
  //       const yPosSecondTrackedPoint = person.body[4];
  //       personYFramesArr.push(yPosSecondTrackedPoint);
  //       map.set(person.openposeId, personYFramesArr);
  //     }
  //   }

  //   const mapQuartile = Array.from(map)
  //     .map(([openposeId, yPosArr]) => {
  //       const q25 = quantile(yPosArr, 0.75);
  //       return {
  //         openposeId: openposeId,
  //         q25: q25,
  //       };
  //     })
  //     .reduce((acc, curr) => {
  //       if (curr.q25 < acc.q25) {
  //         return curr;
  //       }
  //       return acc;
  //     });

  //   return mapQuartile.openposeId;
  // };

  // const calculateInstructorMovementPatternData = useCallback(
  //   (instructorVideoFrames: VideoFrameSession[]) => {
  //     if (!instructorVideoFrames[0]) {
  //       message.error(
  //         "Error while calculating Instructor movement pattern data"
  //       );
  //       return;
  //     }

  //     const instructorOpenposeId = getOpenPoseIdOfInstructor(
  //       instructorVideoFrames
  //     );

  //     const movementPatternData = instructorVideoFrames[0].videoFrames.map(
  //       (frame) => {
  //         // const averageYPosOfPeople = frame.people.reduce((acc: number[], person) => {
  //         //   const yPosSecondTrackedPoint = person.body[4];
  //         //   acc[person.openposeId] = yPosSecondTrackedPoint;
  //         //   return acc;
  //         // }, [])
  //         let xPosInstructor = -1;
  //         if (frame.people.length > 0) {
  //           const instructorPerson = frame.people.find(
  //             (person) => person.openposeId === instructorOpenposeId
  //           );
  //           if (instructorPerson) {
  //             //Found the instructor in this frame?
  //             xPosInstructor = instructorPerson.body[3];
  //           } else {
  //             const minYPerson = frame.people.reduce((minYPerson, person) => {
  //               if (person.body[3] > minYPerson.body[3]) {
  //                 return person;
  //               }
  //               return minYPerson;
  //             });
  //             xPosInstructor = minYPerson.body[3];
  //           }
  //         }
  //         return {
  //           frameNumber: frame.frameNumber,
  //           timestamp: frame.timestamp,
  //           xPos: xPosInstructor, //body[3] = Neck I think (at least the upper torso)
  //         };
  //       }
  //     );

  //     const initialDateTime = movementPatternData[0].timestamp;

  //     const chunkLength = movementPatternData.length / defaultResolution;

  //     // console.log(movementPatternData);

  //     const chunkedMovementPatternData = chunkArray<
  //       typeof movementPatternData[0]
  //     >(movementPatternData, chunkLength)
  //       .map((chunk) =>
  //         chunk.reduce(
  //           (accumulator, movmentPatternFrame) => {
  //             const beginingTimestampMins = Math.round(
  //               chunk[0].timestamp.diff(initialDateTime, "minutes").minutes
  //             );
  //             if (!beginingTimestampMins) {
  //               //Some issue with NaN mins? Any other way to resolve this other than throwing away frame?
  //               return accumulator;
  //             }
  //             if (movmentPatternFrame.xPos === -1) {
  //               return {
  //                 xPosSum: accumulator.xPosSum,
  //                 numFrames: accumulator.numFrames,
  //                 frameNumber: chunk[0].frameNumber,
  //                 timestamp: beginingTimestampMins,
  //               };
  //             }
  //             return {
  //               xPosSum: accumulator.xPosSum + movmentPatternFrame.xPos,
  //               numFrames: accumulator.numFrames + 1,
  //               frameNumber: chunk[0].frameNumber,
  //               timestamp: beginingTimestampMins,
  //             };
  //           },
  //           {
  //             xPosSum: 0,
  //             numFrames: 0,
  //             frameNumber: 0,
  //             timestamp: 0,
  //           }
  //         )
  //       )
  //       .map(
  //         (
  //           sumMovementPatternChunk: {
  //             xPosSum: number;
  //             numFrames: number;
  //             frameNumber: number;
  //             timestamp: number;
  //           },
  //           i: number,
  //           arr: {
  //             xPosSum: number;
  //             numFrames: number;
  //             frameNumber: number;
  //             timestamp: number;
  //           }[]
  //         ) => {
  //           if (sumMovementPatternChunk.numFrames === 0) {
  //             //may not record person for any frames in that chunk, cant divide by 0
  //             const prevAvgXPos =
  //               i === 0 ? 0 : arr[i - 1].xPosSum / arr[i - 1].numFrames;
  //             if (!prevAvgXPos) return sumMovementPatternChunk;
  //             return {
  //               ...sumMovementPatternChunk,
  //               avgXPos: prevAvgXPos ?? 0, //Sometimes get NaN here?
  //             };
  //           }
  //           const currAvgXPos =
  //             sumMovementPatternChunk.xPosSum /
  //             sumMovementPatternChunk.numFrames;
  //           if (!currAvgXPos) return sumMovementPatternChunk;
  //           return {
  //             ...sumMovementPatternChunk,
  //             avgXPos: currAvgXPos ?? 0, //Sometimes get NaN here?
  //           };
  //         }
  //       );

  //     setMovementPatternData(chunkedMovementPatternData);
  //   },
  //   []
  // );

  const menu = (
    <Menu>
      <Menu.Item
        onClick={() => setSelectedActivity(SelectedActivity.SitVsStand)}
      >
        Sit vs. Stand
      </Menu.Item>
      <Menu.Item
        onClick={() => setSelectedActivity(SelectedActivity.InstructorMovement)}
      >
        Instructor Movement
      </Menu.Item>
    </Menu>
  );

  return (
    <div>
      <Dropdown overlay={menu}>
        <Button
          type="link"
          className="ant-dropdown-link"
          onClick={(e) => e.preventDefault()}
        >
          {SelectedActivity[selectedActivity]} <DownOutlined />
        </Button>
      </Dropdown>
      {selectedActivity === SelectedActivity.SitVsStand && <SitVsStand />}
      {selectedActivity === SelectedActivity.InstructorMovement && (
        <InstructorMovement />
      )}
    </div>
  );
}
