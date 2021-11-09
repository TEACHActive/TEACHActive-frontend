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
import {
  ArmPose,
  ArmPosesInFrame,
  AudioInFrame,
  BaseSession,
  Person,
} from "api/types";
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

const defaultResolution = 10;

export function BehavioralEngagement(props: IBehavioralEngagementProps) {
  const selectedSession: BaseSession | null = useSelector(
    (state: RootState) => getSelectedSession(state),
    BaseSession.equal
  );

  const [options, setOptions] = React.useState(defaultOptions);
  const [loading, setLoading] = React.useState(true);
  const [
    armPoseChunkedEngagementData,
    setArmPoseChunkedEngagementData,
  ] = React.useState<any[]>([]);
  const [
    instructorSpeechEngagementData,
    setInstructorSpeechEngagementData,
  ] = React.useState<any[]>();
  const [
    studentSpeechEngagementData,
    setStudentSpeechEngagementData,
  ] = React.useState<any[]>();
  // const [resolution, setResolution] = React.useState(defaultResolution);

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

    setOptions(newOptions);
    setLoading(false);
  };

  const getEngagementData = useCallback(async () => {
    setLoading(true);
    const fps = 15.0;
    const armPosesFrames = await apiHandler.getArmPosesInSession(
      selectedSession.id
    );

    const instructorSpeechFrames = await apiHandler.getInstructorSpeechInSession(
      selectedSession.id
    );

    const studentSpeechFrames = await apiHandler.getStudentSpeechInSession(
      selectedSession.id
    );

    //=========================================================================
    //=========================================================================
    let armPoseChunkedEngagementData;
    if (armPosesFrames) {
      const armPoseChunkLength = armPosesFrames.length / defaultResolution;
      armPoseChunkedEngagementData = chunkArray(
        armPosesFrames,
        armPoseChunkLength
      )
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
              handsRaised: chunk.armPoseCount.handsRaised / fps,
              armsCrossed: chunk.armPoseCount.armsCrossed / fps,
              error: chunk.armPoseCount.error / fps,
              handsOnFace: chunk.armPoseCount.handsOnFace / fps,
              other: chunk.armPoseCount.other / fps,
            },
          };
        });
    }

    //=========================================================================
    //=========================================================================

    let instructorSpeechChunkedEngagementData;
    if (instructorSpeechFrames) {
      const instructorSpeechChunkLength =
        instructorSpeechFrames.length / defaultResolution;
      instructorSpeechChunkedEngagementData = chunkArray(
        instructorSpeechFrames,
        instructorSpeechChunkLength
      )
        .map((chunk: any[]) => {
          const timeDiffAtStartOfChunk = chunk[0].timeDiff;
          return chunk.reduce(
            (
              acc: { totalAmplitude: number; timeDiff: any; count: number },
              curr: AudioInFrame,
              i: number
            ) => {
              return {
                totalAmplitude: acc.totalAmplitude + curr.amplitude,
                timeDiff: timeDiffAtStartOfChunk,
                count: acc.count + 1,
              };
            },
            {
              totalAmplitude: 0,
              timeDiff: timeDiffAtStartOfChunk,
              count: 0,
            }
          );
        })
        .map((chunk) => {
          return {
            avgAmplitude: chunk.totalAmplitude / chunk.count,
            timeDiff: chunk.timeDiff,
          };
        });

      instructorSpeechChunkedEngagementData = instructorSpeechChunkedEngagementData.sort(
        (a: any, b: any) => a.timeDiff.minutes - b.timeDiff.minutes
      );
    }

    //=========================================================================
    //=========================================================================

    let studentSpeechChunkedEngagementData;
    if (studentSpeechFrames) {
      const studentSpeechChunkLength =
        studentSpeechFrames.length / defaultResolution;
      studentSpeechChunkedEngagementData = chunkArray(
        studentSpeechFrames,
        studentSpeechChunkLength
      )
        .map((chunk: any[]) => {
          const timeDiffAtStartOfChunk = chunk[0].timeDiff;
          return chunk.reduce(
            (
              acc: { totalAmplitude: number; timeDiff: any; count: number },
              curr: AudioInFrame,
              i: number
            ) => {
              return {
                totalAmplitude: acc.totalAmplitude + curr.amplitude,
                timeDiff: timeDiffAtStartOfChunk,
                count: acc.count + 1,
              };
            },
            {
              totalAmplitude: 0,
              timeDiff: timeDiffAtStartOfChunk,
              count: 0,
            }
          );
        })
        .map((chunk) => {
          return {
            avgAmplitude: chunk.totalAmplitude / chunk.count,
            timeDiff: chunk.timeDiff,
          };
        });

      studentSpeechChunkedEngagementData = studentSpeechChunkedEngagementData.sort(
        (a: any, b: any) => a.timeDiff.minutes - b.timeDiff.minutes
      );
    }

    //=========================================================================
    //=========================================================================

    setArmPoseChunkedEngagementData(armPoseChunkedEngagementData || []);
    setInstructorSpeechEngagementData(instructorSpeechChunkedEngagementData);
    setStudentSpeechEngagementData(studentSpeechChunkedEngagementData);

    setLoading(false);
  }, []);

  React.useEffect(() => {
    getEngagementData();
  }, [selectedSession]);

  if (loading) {
    return <Spin />;
  }

  const handRaisesChecked = options.find(
    (option) => option.value === "handRaises"
  )?.checked;
  const studentSpeechChecked = options.find(
    (option) => option.value === "studentSpeech"
  )?.checked;
  const instructorSpeechChecked = options.find(
    (option) => option.value === "instructorSpeech"
  )?.checked;

  let line, line2, yAxis, data;

  if (studentSpeechChecked || instructorSpeechChecked) {
    yAxis = (
      <YAxis
        type="number"
        dataKey={`avgAmplitude`}
        min={0}
        max={1}
        label={{
          value: "Amplitude",
          angle: -90,
          position: "center",
        }}
      />
    );
    if (studentSpeechChecked && instructorSpeechChecked) {
      //Todo
      const studentData = studentSpeechEngagementData || [];
      data = instructorSpeechEngagementData?.map((insData, i) => {
        return {
          ...insData,
          avgInstructorAmplitude: insData.avgAmplitude,
          avgStudentAmplitude:
            i < studentData.length ? studentData[i].avgAmplitude : 0,
        };
      });
      // console.log(data);

      line = (
        <Line
          type="monotone"
          dataKey={`avgInstructorAmplitude`}
          stroke="#82ca9d"
        />
      );
      line2 = (
        <Line
          type="monotone"
          dataKey={`avgStudentAmplitude`}
          stroke="#ffca9d"
        />
      );
      yAxis = (
        <YAxis
          type="number"
          dataKey={`avgAmplitude`}
          min={0}
          max={1}
          label={{
            value: "Amplitude",
            angle: -90,
            position: "center",
          }}
        />
      );
    } else if (studentSpeechChecked) {
      data = studentSpeechEngagementData;
      line = <Line type="monotone" dataKey={`avgAmplitude`} stroke="#82ca9d" />;
    } else if (instructorSpeechChecked) {
      //Could use else but for sake of clarity
      data = instructorSpeechEngagementData;
      line = <Line type="monotone" dataKey={`avgAmplitude`} stroke="#82ca9d" />;
    }
  } else if (handRaisesChecked) {
    line = (
      <Line
        type="monotone"
        dataKey={`armPoseCount.${ArmPose.HandsRaised}`}
        stroke="#82ca9d"
      />
    );
    yAxis = (
      <YAxis
        type="number"
        dataKey={`armPoseCount.${ArmPose.HandsRaised}`}
        label={{
          value: "# of seconds of Hand Raises",
          angle: -90,
          position: "center",
        }}
      />
    );

    data = armPoseChunkedEngagementData;
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
        data={data}
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
