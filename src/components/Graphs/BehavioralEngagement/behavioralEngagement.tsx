import React from "react";
import { useSelector } from "react-redux";
import { Checkbox, Result, Spin } from "antd";
import { skipToken } from "@reduxjs/toolkit/dist/query";
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

import { ArmPose } from "api/services/sessions/types";
import { ArmPoseStats } from "api/services/armPose/types";
import { selectSelectedSession } from "redux/sessionSlice";
import { CombinedSpeechFrame } from "api/services/speech/types";
import { _useGetArmPoseDataInSessionQuery } from "api/services/armPose";
import { _useGetCombinedSpeechDataInSessionQuery } from "api/services/speech";
import { SessionMetricType } from "components/MetricDisplay/metricDisplay.types";

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
    disabled: true,
    checked: false,
  },
  {
    label: "Student Speech",
    value: "studentSpeech",
    disabled: true,
    checked: false,
  },
];

export function BehavioralEngagement(props: IBehavioralEngagementProps) {
  const [dataFilterOptions, setDataFilterOptions] = React.useState(
    defaultOptions
  );
  const [loading, setLoading] = React.useState(true);

  const selectedSession = useSelector(selectSelectedSession);

  const getArmPoseDataInSessionResult = _useGetArmPoseDataInSessionQuery(
    { sessionId: selectedSession?.id || "", chunkSizeInMinutes: 5 },
    selectedSession ? null : skipToken
  );

  const getCombinedSpeechDataInSessionResult = _useGetCombinedSpeechDataInSessionQuery(
    {
      sessionId: selectedSession?.id || "",
      minSpeakingAmp: 0,
      chunkSizeInMinutes: 5,
    },
    selectedSession ? null : skipToken
  );

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

    setDataFilterOptions(newOptions);
    setLoading(false);
  };

  const armPoseLoading =
    getArmPoseDataInSessionResult.isLoading ||
    getArmPoseDataInSessionResult.isFetching;
  const speechLoading =
    getCombinedSpeechDataInSessionResult.isLoading ||
    getCombinedSpeechDataInSessionResult.isFetching;

  if (armPoseLoading || speechLoading) {
    return <Spin />;
  }

  const armPoseError =
    getArmPoseDataInSessionResult.isError ||
    !getArmPoseDataInSessionResult.data;
  const speechError =
    getCombinedSpeechDataInSessionResult.isError ||
    !getCombinedSpeechDataInSessionResult.data;

  if (armPoseError || speechError) {
    return <Result status="error" subTitle="Error occured when getting data" />;
  }

  const armPoseData = getArmPoseDataInSessionResult.data.map(
    (armPoseStats) => new ArmPoseStats(armPoseStats)
  );

  const combinedSpeechData = getCombinedSpeechDataInSessionResult.data.map(
    (combinedSpeechFrame) => new CombinedSpeechFrame(combinedSpeechFrame)
  );

  const handRaisesChecked = dataFilterOptions.find(
    (option) => option.value === SessionMetricType.HandRaises
  )?.checked;
  const studentSpeechChecked = dataFilterOptions.find(
    (option) => option.value === SessionMetricType.StudentSpeech
  )?.checked;
  const instructorSpeechChecked = dataFilterOptions.find(
    (option) => option.value === SessionMetricType.InstructorSpeech
  )?.checked;

  let line, line2, yAxis, selectedData;

  if (studentSpeechChecked || instructorSpeechChecked) {
    yAxis = (
      <YAxis
        type="number"
        domain={[0, 1]}
        min={0}
        max={1}
        label={{
          value: "Amplitude",
          angle: -90,
          position: "center",
        }}
      />
    );
    selectedData = combinedSpeechData;

    if (studentSpeechChecked && instructorSpeechChecked) {
      // TODO: ?
      //   const studentData = studentSpeechEngagementData || [];
      //   data = instructorSpeechEngagementData?.map((insData, i) => {
      //     return {
      //       ...insData,
      //       avgInstructorAmplitude: insData.avgAmplitude,
      //       avgStudentAmplitude:
      //         i < studentData.length ? studentData[i].avgAmplitude : 0,
      //     };
      //   });

      line = (
        <Line
          type="monotone"
          dataKey={`speakerInSeconds.instructor`}
          stroke="#82ca9d"
        />
      );
      line2 = (
        <Line
          type="monotone"
          dataKey={`speakerInSeconds.student`}
          stroke="#ffca9d"
        />
      );
      yAxis = (
        <YAxis
          type="number"
          // range={[0, 1]}
          label={{
            value: "Amplitude",
            angle: -90,
            position: "center",
          }}
        />
      );
    } else if (studentSpeechChecked) {
      //   data = studentSpeechEngagementData;
      line = (
        <Line
          type="monotone"
          dataKey={`speakerInSeconds.student`}
          stroke="#ffca9d"
        />
      );
    } else if (instructorSpeechChecked) {
      //Could use else but for sake of clarity
      //   data = instructorSpeechEngagementData;
      line = (
        <Line
          type="monotone"
          dataKey={`speakerInSeconds.instructor`}
          stroke="#82ca9d"
        />
      );
    }
  } else if (handRaisesChecked) {
    line = (
      <Line
        type="monotone"
        dataKey={`${ArmPose.HandsRaised}`}
        stroke="#82ca9d"
      />
    );
    yAxis = (
      <YAxis
        type="number"
        dataKey={`${ArmPose.HandsRaised}`}
        label={{
          value: "# of seconds of Hand Raises",
          angle: -90,
          position: "center",
        }}
      />
    );

    selectedData = armPoseData;
  }

  return (
    <div>
      <Checkbox.Group
        options={dataFilterOptions}
        defaultValue={[SessionMetricType.HandRaises]}
        value={dataFilterOptions.map((option) =>
          option.checked ? option.value : ""
        )}
        onChange={onChange}
      />

      <LineChart
        width={430}
        height={325}
        data={selectedData}
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
        {yAxis}
        <RechartsTooltip />
        {line}
        {line2}
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
