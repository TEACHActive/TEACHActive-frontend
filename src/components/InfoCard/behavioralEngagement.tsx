import * as React from "react";
import { Checkbox, Tooltip } from "antd";
import { CheckboxValueType } from "antd/lib/checkbox/Group";
import { LineChart, CartesianGrid, XAxis, YAxis, Legend, Line } from "recharts";

import FramesJSON from "../../data/frames.json";
import { chunkArray } from "../../util";
import { VideoFrameSession } from "../../api/types";

export interface IBehavioralEngagementProps {
  videoFrames:
    | {
        instructor: VideoFrameSession[];
        student: VideoFrameSession[];
      }
    | undefined;
}

const defaultOptions = [
  {
    label: "Hand Raises",
    value: "handRaises",
    disabled: false,
    checked: false,
  },
  {
    label: "Instructor Speech",
    value: "instructorSpeech",
    disabled: false,
    checked: false,
  },
  {
    label: "Student Speech",
    value: "studentSpeech",
    disabled: false,
    checked: false,
  },
];

export function BehavioralEngagement(props: IBehavioralEngagementProps) {
  const [options, setOptions] = React.useState(defaultOptions);
  const [engagementData, setEngagementData] = React.useState<
    { frameNumber: number; armPose: any }[]
  >([]);

  React.useEffect(() => {
    if (!props.videoFrames) {
      console.error("error here");
      return;
    }

    const engagementData = props.videoFrames.student[0].videoFrames
      .sort((a, b) => a.frameNumber - b.frameNumber)
      .map((frame) => {
        const armPoseCntObj = frame.people
          .map((person) => person.armpose)
          .reduce(
            (tally: { [x: string]: any }, armPose: string | number) => {
              tally[armPose] = (tally[armPose] || 0) + 1;
              return tally;
            },
            { handsRaised: 0, armsCrossed: 0, other: 0, error: 0 }
          );

        // console.log(armPoseCntObj);
        // return armPoseCntObj;
        return {
          frameNumber: frame.frameNumber,
          armPose: armPoseCntObj,
        };
      });

    console.log(engagementData);
    setEngagementData(engagementData);

    // const test = chunkArray(engagementData, 10).map((chunk) =>
    //   chunk.reduce(
    //     (tally: { [x: string]: any }, armPose: string | number) => {
    //       console.log(armPose);

    //       tally[armPose] = (tally[armPose] || 0) + 1;
    //       return tally;
    //     },
    //     { handsRaised: 0, armsCrossed: 0, other: 0, error: 0 }
    //   )
    // );
    // console.log(test);
  }, []);

  const onChange = (checkedValue: CheckboxValueType[]) => {
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

    setOptions(newOptions);
  };

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
        data={engagementData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="framenumber" />
        <YAxis type="number" tickCount={1} />
        <Legend />
        {options.find((option) => option.value === "handRaises")?.checked && (
          <Line
            type="monotone"
            dataKey="armPose.handsRaised"
            stroke="#82ca9d"
          />
        )}
      </LineChart>
    </div>
  );
}
