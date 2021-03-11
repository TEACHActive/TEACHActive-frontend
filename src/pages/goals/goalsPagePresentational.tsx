import * as React from "react";
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

const { Title } = Typography;
const { Panel } = Collapse;

export interface IGoalsPagePresentationalProps {
  session: Session;
  reflections: any[];
}

const defaultHandRaisesReasonOptions = [
  {
    label: "Ask questions/clarifications",
    value: "questions_clarifications",
    disabled: false,
    checked: false,
  },
  {
    label: "Participate in-class discussions",
    value: "participate_discussions",
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

const defaultHandRaiseGoalOptions = [
  {
    label: "Trigger more student discussions to increase hand raises",
    value: "more_student_discussions",
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

/**
 * Page for setting goals and logging reflections
 * Note: This component would benifit from using Formik
 * @param props
 */
export default function GoalsPagePresentational(
  props: IGoalsPagePresentationalProps
) {
  const [handRaisesReasonOptions, setHandRaisesReasonOptions] = React.useState(
    defaultHandRaisesReasonOptions
  );

  const [handRaiseReasonOther, setHandRaiseReasonOther] = React.useState("");

  const [
    satisifedWithHandRaisesValue,
    setSatisifedWithHandRaisesValue,
  ] = React.useState<"yes" | "no" | "">("");

  const [
    reasonDissatisfiedWithHandRaises,
    setReasonDissatisfiedWithHandRaises,
  ] = React.useState("");

  const [goalNextSessionValue, setGoalNextSessionValue] = React.useState<
    "yes" | "no" | ""
  >("");

  const [handRaiseGoalOptions, setHandRaiseGoalOptions] = React.useState(
    defaultHandRaiseGoalOptions
  );

  const [handRaiseGoalOther, setHandRaiseGoalOther] = React.useState("");

  const onFinish = (values: any) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const onChangeHandRaisesReasons = (checkedValue: CheckboxValueType[]) => {
    const updatedReasons = defaultHandRaisesReasonOptions.map((resason) => {
      let updatedReason = { ...resason };
      updatedReason.checked = checkedValue.includes(resason.value)
        ? true
        : false;
      return updatedReason;
    });
    setHandRaisesReasonOptions(updatedReasons);
  };

  const onChangeHandRaiseGoals = (checkedValue: CheckboxValueType[]) => {
    const updatedGoals = defaultHandRaiseGoalOptions.map((goal) => {
      let updatedGoal = { ...goal };
      updatedGoal.checked = checkedValue.includes(goal.value) ? true : false;
      return updatedGoal;
    });
    setHandRaiseGoalOptions(updatedGoals);
  };

  const handRaisesMetric = props.session.metrics?.find(
    (metric) => metric.metricType === SessionMetricType.HandRaises
  );

  return (
    <Collapse defaultActiveKey={["1"]}>
      <Panel header="Hand Raises" key="1">
        <Form
          name="reflectionsForm"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          {handRaisesMetric && (
            <BlockContent
              color={handRaisesMetric.color}
              name={handRaisesMetric.name}
              help_text={handRaisesMetric.help_text}
              has_alert={handRaisesMetric.has_alert}
              icon={"hand-paper"}
            >
              <MetricDisplay
                metricType={handRaisesMetric.metricType}
                metric={handRaisesMetric.metric}
                denominator={handRaisesMetric.denominator}
                hasDenominator={handRaisesMetric.hasDenominator}
                unit={handRaisesMetric.unit}
                trend={handRaisesMetric.trend}
                trend_metric={handRaisesMetric.trend_metric}
                trend_metric_unit={handRaisesMetric.trend_metric_unit}
              />
            </BlockContent>
          )}

          <Form.Item>
            <p>
              The number of hand raises in this session is{" "}
              {
                props.session.metrics?.find(
                  (metric) => metric.metricType === SessionMetricType.HandRaises
                )?.metric
              }
            </p>
          </Form.Item>

          <Form.Item>
            <p>Students mainly raised their hands during this session to...?</p>
            <Checkbox.Group
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
              options={defaultHandRaisesReasonOptions}
              value={handRaisesReasonOptions.map((option) =>
                option.checked ? option.value : ""
              )}
              onChange={onChangeHandRaisesReasons}
            />
          </Form.Item>

          {handRaisesReasonOptions.find((reason) => reason.value === "other")
            ?.checked && (
            <Form.Item>
              <Input
                value={handRaiseReasonOther}
                onChange={(event) =>
                  setHandRaiseReasonOther(event.target.value)
                }
              />
            </Form.Item>
          )}

          <Form.Item>
            <p>Are you satisfied with students’ number of hand raises?</p>
            <Radio.Group
              optionType="button"
              buttonStyle="solid"
              options={defaultYesNoOptions}
              value={satisifedWithHandRaisesValue}
              onChange={(e: RadioChangeEvent) =>
                setSatisifedWithHandRaisesValue(e.target.value)
              }
            />
          </Form.Item>

          {satisifedWithHandRaisesValue === "no" && (
            <Form.Item>
              <p>
                Why are you dissatisfied with the number of student hand raises?
              </p>
              <Input
                value={reasonDissatisfiedWithHandRaises}
                onChange={(event) =>
                  setReasonDissatisfiedWithHandRaises(event.target.value)
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
                options={defaultHandRaiseGoalOptions}
                value={handRaiseGoalOptions.map((option) =>
                  option.checked ? option.value : ""
                )}
                onChange={onChangeHandRaiseGoals}
              />
            </Form.Item>
          )}

          {handRaiseGoalOptions.find((reason) => reason.value === "other")
            ?.checked && (
            <Form.Item>
              <Input
                value={handRaiseGoalOther}
                onChange={(event) => setHandRaiseGoalOther(event.target.value)}
              />
            </Form.Item>
          )}
        </Form>
      </Panel>
    </Collapse>
  );
}
