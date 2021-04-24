import * as React from "react";
import { useSelector } from "react-redux";
import { Checkbox, Select, Spin } from "antd";
import { CheckboxValueType } from "antd/lib/checkbox/Group";
import { BarChart, CartesianGrid, XAxis, YAxis, Legend, Bar } from "recharts";

import { ArmPose, BaseSession } from "api/types";
import { getSessions } from "redux/selectors";

const { Option } = Select;

export interface IBehavioralEngagementProgressProps {}
export interface IBehavioralEngagementProgressState {
  selectedSessions: BaseSession[];
  options: {
    label: string;
    value: string;
    disabled: boolean;
    checked: boolean;
  }[];
  engagementData:
    | {
        handsRaised: number;
        armsCrossed: number;
        other: number;
        error: number;
        date: string;
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

export function BehavioralEngagementProgress(
  props: IBehavioralEngagementProgressProps
) {
  // state: IBehavioralEngagementProgressState = {
  //   selectedSessions: [],
  //   options: defaultOptions,
  //   engagementData: undefined,
  // };
  const sessions: BaseSession[] = useSelector((store: any) =>
    getSessions(store)
  );
  // const selectedSession: BaseSession | null = useSelector(
  //   (state: any) => getSelectedSession(state),
  //   BaseSession.equal
  // );

  // const [engagementData, setEngagementData] = React.useState();
  const [options, setOptions] = React.useState<
    {
      label: string;
      value: string;
      disabled: boolean;
      checked: boolean;
    }[]
  >([]);
  // const [matchingSessions, setMatchingSessions] = React.useState<BaseSession[]>(
  //   []
  // );

  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    // const engagementData = FramesJSON.frames
    //   .sort(
    //     (frameA: any, frameB: any) => frameA.frameNumber - frameB.frameNumber
    //   )
    //   .map((frame: any) => {
    //     const armPoseCntObj = frame.people.map(
    //       (person: any) => person.inference.posture.armPose
    //     );
    //     return {
    //       frameNumber: frame.frameNumber,
    //       armPose: armPoseCntObj,
    //     };
    //   })
    //   .reduce(
    //     (tally: { [x: string]: any }, armPoseandFrame: any) => {
    //       tally[armPoseandFrame.armPose] =
    //         (tally[armPoseandFrame.armPose] || 0) + 1;
    //       return tally;
    //     },
    //     { handsRaised: 0, armsCrossed: 0, other: 0, error: 0 }
    //   );
    // engagementData["date"] = "10/2/2002";
    // // console.log(engagementData);
    // setEngagementData(engagementData);
  }, []);

  const updateOptions = (checkedValue: CheckboxValueType[]) => {
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

  const handleSelectSessionChange = async (value: string[]) => {
    let matchingSessions: BaseSession[] = [];
    setLoading(true);

    value.forEach((value) => {
      const matchingSession = sessions.find((session) => session.id === value);
      if (matchingSession) matchingSessions.push(matchingSession);
    });
    // setMatchingSessions(matchingSessions);

    // const promises = matchingSessions.map((session) =>
    //   apiHandler.getFramesBySessionID(session.id, "student")
    // );
    // const sessionFrames = await Promise.all(promises);

    // const somethign = sessionFrames.map((sessionFrame) =>
    //   sessionFrame.reduce((acc, frame) => {
    //     console.log(frame.videoFrames);
    //     return frame.videoFrames;
    //   })
    // );

    // console.log("sessionFrames", somethign);
    setLoading(false);
  };

  // let engagementData2 = { ...engagementData };
  // let engagementData3 = { ...engagementData };
  // engagementData.date = "9/1/20";
  // engagementData2.date = "9/3/20";
  // engagementData2.handsRaised = 38;
  // engagementData3.date = "9/5/20";
  // engagementData3.handsRaised = 18;

  // const fakeData = [engagementData, engagementData2, engagementData3];

  return (
    <div style={{ padding: "1em", margin: "1em" }}>
      <Select
        mode="multiple"
        allowClear
        style={{ width: "100%" }}
        placeholder="Please select"
        defaultValue={[]}
        onChange={handleSelectSessionChange}
      >
        {sessions.map((session) => (
          <Option key={session.id} value={session.id}>
            {session.name}
          </Option>
        ))}
      </Select>
      <Checkbox.Group
        options={options}
        defaultValue={["handRaises"]}
        value={options.map((option) => (option.checked ? option.value : ""))}
        onChange={updateOptions}
      />
      {!loading && (
        <BarChart
          width={730}
          height={150}
          data={
            options.findIndex(
              (obj) => obj.value === "handRaises" && obj.checked
            ) !== -1
              ? []
              : []
          }
          style={{ marginTop: "1em" }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Legend />
          <Bar
            dataKey={ArmPose.HandsRaised}
            fill="#8884d8"
            label={<div>test</div>}
          />
        </BarChart>
      )}
      {loading && <Spin></Spin>}
    </div>
  );
}
