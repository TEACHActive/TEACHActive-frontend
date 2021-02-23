import * as React from "react";
import { Checkbox, Tooltip } from "antd";
import { CheckboxValueType } from "antd/lib/checkbox/Group";
import { LineChart, CartesianGrid, XAxis, YAxis, Legend, Line } from "recharts";

import FramesJSON from "../../data/frames.json";

export interface IBehavioralEngagementProps {}

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
      newOptions[handRaisesOptionIndex].disabled = true;
      newOptions[handRaisesOptionIndex].checked = false;

      newOptions[instructorSpeechOptionIndex].checked = true;
    } else {
      newOptions[handRaisesOptionIndex].disabled = false;

      newOptions[instructorSpeechOptionIndex].checked = false;
    }

    if (checkedValue.includes("studentSpeech")) {
      newOptions[handRaisesOptionIndex].disabled = true;
      newOptions[handRaisesOptionIndex].checked = false;

      newOptions[studentSpeechOptionIndex].checked = true;
    } else {
      newOptions[handRaisesOptionIndex].disabled = false;

      newOptions[studentSpeechOptionIndex].checked = false;
    }

    setOptions(newOptions);
  };

  //   FramesJSON.frames.map((frame) => )

  const data = [
    {
      time: 0,
      uv: 4000,
      amt: 2400,
    },
    {
      time: 10,
      uv: 4000,
      amt: 2400,
    },
    {
      time: 20,
      uv: 3000,
      amt: 2210,
    },
    {
      time: 30,
      uv: 2000,
      amt: 2290,
    },
    {
      time: 40,
      uv: 2780,
      amt: 2000,
    },
    {
      time: 50,
      uv: 1890,
      amt: 2181,
    },
    {
      time: 60,
      uv: 2390,
      amt: 2500,
    },
  ];

  return (
    <div>
      <Checkbox.Group
        options={options}
        defaultValue={["handRaises"]}
        value={options.map((option) => (option.checked ? option.value : ""))}
        onChange={onChange}
      />

      <LineChart
        width={330}
        height={250}
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis />
        <Legend />
        <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
      </LineChart>
    </div>
  );
}
