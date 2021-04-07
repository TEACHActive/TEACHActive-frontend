import { Checkbox, Spin, Tooltip } from "antd";
import { CheckboxValueType } from "antd/lib/checkbox/Group";
import * as React from "react";
import { BarChart, CartesianGrid, XAxis, YAxis, Legend, Bar } from "recharts";

import FramesJSON from "../../data/frames.json";
import { Session } from "../../pages/metric/metricPage.types";

export interface IBehavioralEngagementProgressProps {}
export interface IBehavioralEngagementProgressState {
  selectedSessions: Session[];
  options: {
    label: string;
    value: string;
    disabled: boolean;
    checked: boolean;
  }[];
  engagementData: {
     handsRaised: number;
      armsCrossed: number;
      other: number;
      error: number;
      date: string;
  } | undefined;
}

const data = [
  {
    name: "Page A",
    uv: 4000,
    pv: 2400,
  },
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
  },
  {
    name: "Page C",
    uv: 2000,
    pv: 9800,
  },
  {
    name: "Page D",
    uv: 2780,
    pv: 3908,
  },
];

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

export class BehavioralEngagementProgress extends React.Component implements IBehavioralEngagementProgressProps{
  state: IBehavioralEngagementProgressState = {
    selectedSessions: [],
    options: defaultOptions,
    engagementData: undefined
  };

  componentDidMount = () => {
    const engagementData = FramesJSON.frames
      .sort(
        (frameA: any, frameB: any) => frameA.frameNumber - frameB.frameNumber
      )
      .map((frame: any) => {
        const armPoseCntObj = frame.people
          .map((person: any) => person.inference.posture.armPose)
          

        return {
          frameNumber: frame.frameNumber,
          armPose: armPoseCntObj,
        };
      })
      .reduce(
        (tally: { [x: string]: any }, armPoseandFrame: any) => {
          tally[armPoseandFrame.armPose] = (tally[armPoseandFrame.armPose] || 0) + 1;
          return tally;
        },
        { handsRaised: 0, armsCrossed: 0, other: 0, error: 0 }
      );
      engagementData["date"] = "10/2/2002"
    // console.log(engagementData);
    this.setState({
      engagementData: engagementData,
    });
  };

  onChange = (checkedValue: CheckboxValueType[]) => {
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

    this.setState({
      options: newOptions,
    });
  };

  render() {
    const { options, engagementData } = this.state;

    if(!engagementData) {
      return <Spin/>
    }
    let engagementData2 = {...engagementData};
    let engagementData3 = {...engagementData};
    engagementData.date = "9/1/20"
    engagementData2.date = "9/3/20";
    engagementData2.handsRaised = 38;
    engagementData3.date = "9/5/20";
    engagementData3.handsRaised = 18;

    const fakeData = [engagementData, engagementData2, engagementData3]


    return (
      <div style={{ padding: "1em", margin: "1em" }}>
        <Checkbox.Group
          options={options}
          defaultValue={["handRaises"]}
          value={options.map((option) => (option.checked ? option.value : ""))}
          onChange={this.onChange}
        />
        <BarChart width={730} height={150} data={(options.findIndex(obj => obj.value === "handRaises" && obj.checked) != -1)? fakeData: []} style={{marginTop: "1em"}}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Legend />
          <Bar dataKey="handsRaised" fill="#8884d8" label={<div>test</div>}/>
        </BarChart>
      </div>
    );
  }
}
