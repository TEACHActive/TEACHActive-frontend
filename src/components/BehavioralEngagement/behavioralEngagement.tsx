import * as React from "react";

import { Checkbox, Spin } from "antd";
import { CheckboxValueType } from "antd/lib/checkbox/Group";
import {
  XAxis,
  YAxis,
  Line,
  Label,
  LineChart,
  CartesianGrid,
  Tooltip as RechartsTooltip,
} from "recharts";

import { chunkArray } from "../../util";
import { ArmPose, ArmPosesInFrame, BaseSession, Person } from "api/types";
import apiHandler from "api/handler";
import { useSelector } from "react-redux";
import { getSelectedSession } from "redux/selectors";
import { useCallback } from "react";
import { RootState } from "redux/store";

export interface IBehavioralEngagementProps {}

const defaultOptions = [
  {
    label: "Hand Raises",
    value: "handRaises",
    disabled: false,
    checked: true,
  },
  {
    label: "Instructor Speech",
    value: "instructorSpeech",
    disabled: true, //Todo: Update on fixing speech
    checked: false,
  },
  {
    label: "Student Speech",
    value: "studentSpeech",
    disabled: true, //Todo: Update on fixing speech
    checked: false,
  },
];

const defaultResolution = 10;

export function BehavioralEngagement(props: IBehavioralEngagementProps) {
  const selectedSession: BaseSession | null = useSelector(
    (state: RootState) => getSelectedSession(state),
    BaseSession.equal
  );

  const [options, setOptions] = React.useState(defaultOptions);
  const [loading, setLoading] = React.useState(true);
  const [chunkedEngagementData, setChunkedEngagementData] = React.useState<
    ArmPosesInFrame[]
  >([]);
  // const [resolution, setResolution] = React.useState(defaultResolution);
  // const [chunkedEngagementData, setChunkedEngagementData] = React.useState<
  //   {
  //     timestamp: number;
  //     frameNumber: number;
  //     handsRaised: number;
  //     numPeopleHandsRaised: number;
  //     armsCrossed: number;
  //     error: number;
  //     handsOnFace: number;
  //     other: number;
  //   }[]
  // >();

  // React.useEffect(() => {
  //   setLoading(true);
  //   const chunkLength = props.engagementData.length / defaultResolution;
  //   const chunkedEngagementData = chunkArray(props.engagementData, chunkLength)
  //     .map((chunk) => {
  //       return chunk.reduce(
  //         (tally, armPose) => {
  //           return {
  //             handsRaised: tally.handsRaised +=
  //               armPose.armPoseCount.handsRaised.length,
  //             numPeopleHandsRaised: armPose.armPoseCount.handsRaised.filter(
  //               (value, index, self) => self.indexOf(value) === index
  //             ).length,
  //             armsCrossed: tally.armsCrossed +=
  //               armPose.armPoseCount.armsCrossed,
  //             error: tally.error += armPose.armPoseCount.error,
  //             handsOnFace: tally.handsOnFace +=
  //               armPose.armPoseCount.handsOnFace,
  //             other: tally.other += armPose.armPoseCount.other,
  //             frameNumber: chunk[0].frameNumber,
  //             timestamp: chunk[0].timestamp,
  //           };
  //         },
  //         {
  //           timestamp: 0,
  //           frameNumber: 0,
  //           handsRaised: 0,
  //           numPeopleHandsRaised: 0,
  //           armsCrossed: 0,
  //           error: 0,
  //           handsOnFace: 0,
  //           other: 0,
  //         }
  //       );
  //     })
  //     .map((chunk) => {
  //       return {
  //         ...chunk,
  //         handsRaised: chunk.handsRaised / 15.0,
  //       };
  //     });
  //   setChunkedEngagementData(chunkedEngagementData);
  //   setLoading(false);
  // }, [props.engagementData]);

  const onChange = (checkedValue: CheckboxValueType[]) => {
    setLoading(true);
    let newOptions = [...defaultOptions];
    const instructorSpeechOptionIndex = newOptions.findIndex(
      (option) => option.value === "instructorSpeech"
    );
    const studentSpeechOptionIndex = newOptions.findIndex(
      (option) => option.value === "studentSpeech"
    );
    const handRaisesOptionIndex = newOptions.findIndex(
      (option) => option.value === "handRaises"
    );

    if (checkedValue.includes("handRaises")) {
      newOptions[instructorSpeechOptionIndex].disabled = true;
      newOptions[instructorSpeechOptionIndex].checked = false;
      newOptions[studentSpeechOptionIndex].disabled = true;
      newOptions[studentSpeechOptionIndex].checked = false;

      newOptions[handRaisesOptionIndex].checked = true;
    } else {
      newOptions[instructorSpeechOptionIndex].disabled = false;
      newOptions[studentSpeechOptionIndex].disabled = false;

      newOptions[handRaisesOptionIndex].checked = false;
    }

    if (checkedValue.includes("instructorSpeech")) {
      newOptions[instructorSpeechOptionIndex].disabled = false;
      newOptions[instructorSpeechOptionIndex].checked = true;

      newOptions[studentSpeechOptionIndex].disabled = false;
    } else {
      newOptions[instructorSpeechOptionIndex].checked = false;
    }

    if (checkedValue.includes("studentSpeech")) {
      newOptions[studentSpeechOptionIndex].disabled = false;
      newOptions[studentSpeechOptionIndex].checked = true;

      newOptions[instructorSpeechOptionIndex].disabled = false;
    } else {
      newOptions[studentSpeechOptionIndex].checked = false;
    }

    if (
      checkedValue.includes("instructorSpeech") ||
      checkedValue.includes("studentSpeech")
    ) {
      newOptions[handRaisesOptionIndex].disabled = true;
      newOptions[handRaisesOptionIndex].checked = false;
    }

    if (
      !checkedValue.includes("instructorSpeech") &&
      !checkedValue.includes("studentSpeech")
    ) {
      newOptions[handRaisesOptionIndex].disabled = false;
    }

    //Always set disabled for now since not able to analize speech
    newOptions[instructorSpeechOptionIndex].disabled = true;
    newOptions[studentSpeechOptionIndex].disabled = true;
    newOptions[handRaisesOptionIndex].disabled = false;

    setOptions(newOptions);
    setLoading(false);
  };

  const getEngagementData = useCallback(async () => {
    setLoading(true);
    const armPosesFrames = await apiHandler.getArmPosesInSession(
      selectedSession.id
    );
    if (!armPosesFrames) {
      //Issue here, should be getting these, will send message in API Handler
      return;
    }
    const chunkLength = armPosesFrames.length / defaultResolution;
    const chunkedEngagementData = chunkArray(armPosesFrames, chunkLength)
      .map((chunk) => {
        const timeDiffAtStartOfChunk = chunk[0].timeDiff;
        return chunk.reduce((acc, curr) => {
          return {
            armPoseCount: {
              handsRaised:
                acc.armPoseCount.handsRaised + curr.armPoseCount.handsRaised,
              armsCrossed:
                acc.armPoseCount.armsCrossed + curr.armPoseCount.armsCrossed,
              error: acc.armPoseCount.error + curr.armPoseCount.error,
              handsOnFace:
                acc.armPoseCount.handsOnFace + curr.armPoseCount.handsOnFace,
              other: acc.armPoseCount.other + curr.armPoseCount.other,
            },
            timeDiff: timeDiffAtStartOfChunk,
          };
        });
      })
      .map((chunk) => {
        return {
          ...chunk,
          armPoseCount: {
            handsRaised: chunk.armPoseCount.handsRaised / 15.0,
            armsCrossed: chunk.armPoseCount.armsCrossed / 15.0,
            error: chunk.armPoseCount.error / 15.0,
            handsOnFace: chunk.armPoseCount.handsOnFace / 15.0,
            other: chunk.armPoseCount.other / 15.0,
          },
        };
      });
    setChunkedEngagementData(chunkedEngagementData);
    setLoading(false);
  }, []);

  React.useEffect(() => {
    getEngagementData();
  }, [selectedSession]);

  if (loading) {
    return <Spin />;
  }

  return (
    <div>
      <Checkbox.Group
        options={options}
        defaultValue={["handRaises"]}
        value={options.map((option) => (option.checked ? option.value : ""))}
        onChange={onChange}
      />

      <LineChart
        width={430}
        height={325}
        data={chunkedEngagementData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
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
          type="number"
          dataKey={`armPoseCount.${ArmPose.HandsRaised}`}
          label={{
            value: "# of seconds of Hand Raises (student + time)",
            angle: -90,
            position: "insideLeft",
          }}
        />
        <RechartsTooltip />

        {options.find((option) => option.value === "handRaises")?.checked && (
          <Line
            type="monotone"
            dataKey={`armPoseCount.${ArmPose.HandsRaised}`}
            stroke="#82ca9d"
          />
        )}
      </LineChart>
      {/* <Slider
        defaultValue={defaultResolution}
        min={0}
        max={50}
        onAfterChange={(value: number) => setResolution(value)}
      /> */}
    </div>
  );
}
