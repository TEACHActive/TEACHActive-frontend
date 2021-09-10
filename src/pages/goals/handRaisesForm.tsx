import React from "react";
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
import { SessionMetricType } from "../metric/metricPage.types";
import { CheckboxValueType } from "antd/lib/checkbox/Group";
import { RadioChangeEvent } from "antd/lib/radio";
import MetricDisplay from "../../components/MetricDisplay/metricDisplay";
import BlockContent from "../../components/BlockContent/blockContent";
import { HandRaiseGoalsAndReflections } from "./goalsPage.types";
import { BaseSession } from "api/types";

import { useSelector } from "react-redux";
import { RootState } from "redux/store";
import { getMetrics } from "redux/selectors";

const { Panel } = Collapse;

export interface IHandRaisesFormProps {
  session: BaseSession;
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

export default function HandRaisesForm(props: IHandRaisesFormProps) {
  const metrics: any[] = useSelector(
    (state: RootState) => getMetrics(state)
  );

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

  const [
    isMetricDescriptiveValue,
    setIsMetricDescriptiveValue,
  ] = React.useState<"yes" | "no" | "">("");

  const [handRaiseGoalOptions, setHandRaiseGoalOptions] = React.useState(
    defaultHandRaiseGoalOptions
  );

  const [handRaiseGoalOther, setHandRaiseGoalOther] = React.useState("");

  const onSave = async (values: any) => {
    //===Gather all values into one object===
    //Hand Raise Reasons
    //Note: it would be nice to have all of this data on the backend and generic...
    //If other is checked pass through value, otherwise clear it
    const cleanedHandRaiseReasonOther = handRaisesReasonOptions.find(
      (reason) => reason.value === "other"
    )?.checked
      ? handRaiseReasonOther
      : "";

    //Satisfied with hand raises
    const cleanedReasonDissatisfiedWithHandRaises =
      satisifedWithHandRaisesValue === "no"
        ? reasonDissatisfiedWithHandRaises
        : "";

    //Goal for next session
    const cleanedHandRaiseGoalOptions =
      goalNextSessionValue === "no" ? [] : handRaiseGoalOptions;
    const cleanedHandRaiseGoalOther = handRaiseGoalOptions.find(
      (goal) => goal.value === "other"
    )?.checked
      ? handRaiseGoalOther
      : "";

    const handRaiseGoalsAndReflections: HandRaiseGoalsAndReflections = {
      handRaisesReasonOptions: handRaisesReasonOptions,
      handRaiseReasonOther: cleanedHandRaiseReasonOther,
      satisifedWithHandRaisesValue: satisifedWithHandRaisesValue,
      reasonDissatisfiedWithHandRaises: cleanedReasonDissatisfiedWithHandRaises,
      goalNextSessionValue: goalNextSessionValue,
      handRaiseGoalOptions: cleanedHandRaiseGoalOptions,
      handRaiseGoalOther: cleanedHandRaiseGoalOther,
    };

    console.error("Not impliimited");

    // try {
    //   const response = await apiHandler.sumbitHandRaiseGoals(
    //     props.session.id,
    //     "1",
    //     handRaiseGoalsAndReflections
    //   );

    //   if (response.statusCode === 200) {
    //     // console.log("Success:", values);
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

  // const handRaisesMetric = props.session.metrics?.find(
  //   (metric) => metric.metricType === SessionMetricType.HandRaises
  // );//Todo

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
        {
          console.log(metrics)
        }
        {/* <BlockContent
          color={item.color}
          name={item.name}
          help_text={item.help_text}
          has_alert={item.has_alert}
          icon={item.icon}
          key={i}
        >
          <MetricDisplay
            metricType={item.metricType}
            metric={item.metric}
            metricPrepend={item.metricPrepend}
            denominator={item.denominator}
            hasDenominator={item.hasDenominator}
            unit={item.unit}
            trend={item.trend}
            trend_metric={item.trend_metric}
            trend_metric_unit={item.trend_metric_unit}
            canEdit={item.canEdit}
            updateMetric={(newMetric: string) =>
              item.updateMetric(newMetric)
            }
          >
            {item.children}
          </MetricDisplay>
        </BlockContent> */}


        {/* {handRaisesMetric && (
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
        )} */}

        <br />

        <Form.Item>
          <p>
            The number of hand raises in this session is{" "}
            <strong>
              {/* {
                props.session.metrics?.find(
                  (metric) => metric.metricType === SessionMetricType.HandRaises
                )?.metric
              } */}
            </strong>
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
              onChange={(event) => setHandRaiseReasonOther(event.target.value)}
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

        <Form.Item>
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
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
