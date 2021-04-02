import * as React from "react";
import { useOktaAuth } from "@okta/okta-react";
import {
  Typography,
  Tag,
  Button,
  Checkbox,
  Form,
  Input,
  Radio,
  Collapse,
} from "antd";
import { stringToHexColor } from "../../util";
import { Session, SessionMetricType } from "../metric/metricPage.types";
import { CheckboxValueType } from "antd/lib/checkbox/Group";
import { RadioChangeEvent } from "antd/lib/radio";
import MetricDisplay from "../../components/MetricDisplay/metricDisplay";
import BlockContent from "../../components/BlockContent/blockContent";
import { IGoalsPageAPIHandler, GoalsPageAPIHandler } from "./goalsPage.handler";
import { HandRaiseGoalsAndReflections } from "./goalsPage.types";

const { Panel } = Collapse;

export interface IStudentSpeechFormProps {
  session: Session;
}

const defaultLectureTypeOptions = [
  {
    label: "Lecture",
    value: "lecture",
    disabled: false,
    checked: false,
  },
  {
    label: "Explaining new concepts",
    value: "new_concepts",
    disabled: false,
    checked: false,
  },
  {
    label: "Answering Questions/ Clarifying",
    value: "answering_questions",
    disabled: false,
    checked: false,
  },
];

const defaultStudentSpeechGoalOptions = (speakingTime: any) => [
  {
    label: `Talk less than ${speakingTime} minutes`,
    value: "talk_less",
    disabled: false,
    checked: false,
  },
  {
    label: "Other",
    value: "other",
    disabled: false,
    checked: false,
  },
];

const defaultYesNoOptions = [
  {
    label: "Yes",
    value: "yes",
    disabled: false,
    checked: false,
  },
  {
    label: "No",
    value: "no",
    disabled: false,
    checked: false,
  },
];

export default function StudentSpeechForm(props: IStudentSpeechFormProps) {
  const apiHandler: IGoalsPageAPIHandler = new GoalsPageAPIHandler();

  const { oktaAuth, authState } = useOktaAuth();

  const [expectSpeakingTimeValue, setExpectSpeakingTimeValue] = React.useState<
    "yes" | "no" | ""
  >("");

  const [lectureTypeOptions, setLectureTypeOptions] = React.useState(
    defaultLectureTypeOptions
  );

  const [
    satisfiedWithSpeakingTimeValue,
    setSatisfiedWithSpeakingTimeValue,
  ] = React.useState<"yes" | "no" | "">("");

  const [
    unsatisfiedWithSpeakingTimeValue,
    setUnsatisfiedWithSpeakingTimeValue,
  ] = React.useState("");

  const [goalNextSessionValue, setGoalNextSessionValue] = React.useState<
    "yes" | "no" | ""
  >("");

  const [
    instructorSpeechGoalOptions,
    setInstructorSpeechGoalOptions,
  ] = React.useState(defaultStudentSpeechGoalOptions(0));

  const [
    instructorSpeechGoalOther,
    setInstructorSpeechGoalOther,
  ] = React.useState("");
  const [
    isMetricDescriptiveValue,
    setIsMetricDescriptiveValue,
  ] = React.useState<"yes" | "no" | "">("");

  const onSave = async (values: any) => {
    //===Gather all values into one object===
    // const cleanedHandRaiseReasonOther = handRaisesReasonOptions.find(
    //   (reason) => reason.value === "other"
    // )?.checked
    //   ? handRaiseReasonOther
    //   : "";
    // //Satisfied with hand raises
    // const cleanedReasonDissatisfiedWithHandRaises =
    //   satisifedWithHandRaisesValue === "no"
    //     ? reasonDissatisfiedWithHandRaises
    //     : "";
    // //Goal for next session
    // const cleanedHandRaiseGoalOptions =
    //   goalNextSessionValue === "no" ? [] : handRaiseGoalOptions;
    // const cleanedHandRaiseGoalOther = handRaiseGoalOptions.find(
    //   (goal) => goal.value === "other"
    // )?.checked
    //   ? handRaiseGoalOther
    //   : "";
    // const handRaiseGoalsAndReflections: HandRaiseGoalsAndReflections = {
    //   handRaisesReasonOptions: handRaisesReasonOptions,
    //   handRaiseReasonOther: cleanedHandRaiseReasonOther,
    //   satisifedWithHandRaisesValue: satisifedWithHandRaisesValue,
    //   reasonDissatisfiedWithHandRaises: cleanedReasonDissatisfiedWithHandRaises,
    //   goalNextSessionValue: goalNextSessionValue,
    //   handRaiseGoalOptions: cleanedHandRaiseGoalOptions,
    //   handRaiseGoalOther: cleanedHandRaiseGoalOther,
    // };
    // try {
    //   const response = await apiHandler.sumbitHandRaiseGoals(
    //     props.session.id,
    //     "1",
    //     handRaiseGoalsAndReflections
    //   );
    //   if (response.statusCode === 200) {
    //     console.log("Success:", values);
    //   } else {
    //     console.error(response.statusCode, response.data);
    //     console.error("Failed to submit responses");
    //   }
    // } catch (e) {
    //   console.error(e);
    // }
  };

  const onSaveFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const onChangeLectureTypeReasons = (checkedValue: CheckboxValueType[]) => {
    console.log(checkedValue);

    const updatedReasons = defaultLectureTypeOptions.map((resason) => {
      let updatedReason = { ...resason };
      updatedReason.checked = checkedValue.includes(resason.value)
        ? true
        : false;
      return updatedReason;
    });
    setLectureTypeOptions(updatedReasons);
  };

  const onChangeInstructorSpeechGoals = (
    checkedValue: CheckboxValueType[],
    speakingTime: any
  ) => {
    const updatedGoals = defaultStudentSpeechGoalOptions(speakingTime).map(
      (goal) => {
        let updatedGoal = { ...goal };
        updatedGoal.checked = checkedValue.includes(goal.value) ? true : false;
        return updatedGoal;
      }
    );
    setInstructorSpeechGoalOptions(updatedGoals);
  };

  const studentSpeechMetric = props.session.metrics?.find(
    (metric) => metric.metricType === SessionMetricType.StudentSpeech
  );

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "2em" }}>
      <Form
        name="reflectionsForm"
        initialValues={{ remember: true }}
        onFinish={onSave}
        onFinishFailed={onSaveFailed}
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "flex-start",
        }}
      >
        {studentSpeechMetric && (
          <BlockContent
            color={studentSpeechMetric.color}
            name={studentSpeechMetric.name}
            help_text={studentSpeechMetric.help_text}
            has_alert={studentSpeechMetric.has_alert}
            icon={"comment"}
          >
            <MetricDisplay
              metricType={studentSpeechMetric.metricType}
              metric={studentSpeechMetric.metric}
              denominator={studentSpeechMetric.denominator}
              hasDenominator={studentSpeechMetric.hasDenominator}
              unit={studentSpeechMetric.unit}
              trend={studentSpeechMetric.trend}
              trend_metric={studentSpeechMetric.trend_metric}
              trend_metric_unit={studentSpeechMetric.trend_metric_unit}
            />
          </BlockContent>
        )}

        <br />

        <Form.Item>
          <p>
            Students spoke for <strong>{studentSpeechMetric?.metric}</strong>{" "}
            minutes during this session
          </p>
        </Form.Item>

        <Form.Item>
          <p>
            Did you expect that they will be speaking for this amount of time?
          </p>
          <Radio.Group
            optionType="button"
            buttonStyle="solid"
            options={defaultYesNoOptions}
            value={expectSpeakingTimeValue}
            onChange={(e: RadioChangeEvent) =>
              setExpectSpeakingTimeValue(e.target.value)
            }
          />
        </Form.Item>

        <Form.Item>
          <p>Your talking was mainly...</p>
          <Checkbox.Group
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
            options={defaultLectureTypeOptions}
            value={lectureTypeOptions.map((option) =>
              option.checked ? option.value : ""
            )}
            onChange={onChangeLectureTypeReasons}
          />
        </Form.Item>

        <Form.Item>
          <p>Are you satisfied with the number of minutes they spoke?</p>
          <Radio.Group
            optionType="button"
            buttonStyle="solid"
            options={defaultYesNoOptions}
            value={satisfiedWithSpeakingTimeValue}
            onChange={(e: RadioChangeEvent) =>
              setSatisfiedWithSpeakingTimeValue(e.target.value)
            }
          />
        </Form.Item>

        {satisfiedWithSpeakingTimeValue === "no" && (
          <Form.Item>
            <Input
              value={unsatisfiedWithSpeakingTimeValue}
              onChange={(event) =>
                setUnsatisfiedWithSpeakingTimeValue(event.target.value)
              }
            />
          </Form.Item>
        )}

        <Form.Item>
          <p>Would you like to set a goal for next session?</p>
          <Radio.Group
            optionType="button"
            buttonStyle="solid"
            options={defaultYesNoOptions}
            value={goalNextSessionValue}
            onChange={(e: RadioChangeEvent) =>
              setGoalNextSessionValue(e.target.value)
            }
          />
        </Form.Item>

        {goalNextSessionValue === "yes" && (
          <Form.Item>
            <p>Select Goals From below</p>
            <Checkbox.Group
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
              options={defaultStudentSpeechGoalOptions(
                studentSpeechMetric?.metric
              )}
              value={instructorSpeechGoalOptions.map((option) =>
                option.checked ? option.value : ""
              )}
              onChange={(checkedValue: CheckboxValueType[]) =>
                onChangeInstructorSpeechGoals(
                  checkedValue,
                  studentSpeechMetric?.metric
                )
              }
            />
          </Form.Item>
        )}

        {instructorSpeechGoalOptions.find((reason) => reason.value === "other")
          ?.checked && (
          <Form.Item>
            <Input
              value={instructorSpeechGoalOther}
              onChange={(event) =>
                setInstructorSpeechGoalOther(event.target.value)
              }
            />
          </Form.Item>
        )}

        {/* <Form.Item>
          <p>
            Is this metric descriptive/ indicative of what’s happening during
            class time?
          </p>
          <Radio.Group
            optionType="button"
            buttonStyle="solid"
            options={defaultYesNoOptions}
            value={isMetricDescriptiveValue}
            onChange={(e: RadioChangeEvent) =>
              setIsMetricDescriptiveValue(e.target.value)
            }
          />
        </Form.Item> */}

        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
