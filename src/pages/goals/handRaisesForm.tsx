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
import { CheckboxValueType } from "antd/lib/checkbox/Group";
import { RadioChangeEvent } from "antd/lib/radio";
import MetricDisplay from "../../components/MetricDisplay/metricDisplay";
import BlockContent from "../../components/BlockContent/blockContent";
// import { HandRaiseGoalsAndReflections } from "./goalsPage.types";
import { BaseSession } from "api/types";

import { useSelector } from "react-redux";
import { RootState } from "redux/store";
import { getMetrics } from "redux/selectors";
import apiHandler from "api/handler";

const { Panel } = Collapse;

export interface IHandRaisesFormProps {
  session: BaseSession;
  metric: any;
  user: firebase.default.User;
  // handRaiseReflections: HandRaiseGoalsAndReflections;
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
  // const [handRaisesReasonOptions, setHandRaisesReasonOptions] = React.useState(
  //   props.handRaiseReflections.handRaisesReasonOptions ||
  //     defaultHandRaisesReasonOptions
  // );
  // const [handRaiseReasonOther, setHandRaiseReasonOther] = React.useState(
  //   props.handRaiseReflections.handRaiseReasonOther || ""
  // );
  // const [
  //   satisifedWithHandRaisesValue,
  //   setSatisifedWithHandRaisesValue,
  // ] = React.useState<string>(
  //   props.handRaiseReflections.satisifedWithHandRaisesValue || ""
  // );
  // const [
  //   reasonDissatisfiedWithHandRaises,
  //   setReasonDissatisfiedWithHandRaises,
  // ] = React.useState(
  //   props.handRaiseReflections.reasonDissatisfiedWithHandRaises || ""
  // );
  // const [goalNextSessionValue, setGoalNextSessionValue] = React.useState<
  //   string
  // >(props.handRaiseReflections.goalNextSessionValue || "");
  // const [
  //   isMetricDescriptiveValue,
  //   setIsMetricDescriptiveValue,
  // ] = React.useState<string>(""); //Todo: impliment on front and back
  // const [handRaiseGoalOptions, setHandRaiseGoalOptions] = React.useState(
  //   props.handRaiseReflections.handRaiseGoalOptions ||
  //     defaultHandRaiseGoalOptions
  // );
  // const [handRaiseGoalOther, setHandRaiseGoalOther] = React.useState(
  //   props.handRaiseReflections.handRaiseGoalOther || ""
  // );
  // const [saving, setSaving] = React.useState(false);
  // const onSave = async (values: any) => {
  //   setSaving(false);
  //   //===Gather all values into one object===
  //   //Hand Raise Reasons
  //   //Note: it would be nice to have all of this data on the backend and generic...
  //   //If other is checked pass through value, otherwise clear it
  //   const cleanedHandRaiseReasonOther = handRaisesReasonOptions.find(
  //     (reason) => reason.value === "other"
  //   )?.checked
  //     ? handRaiseReasonOther
  //     : "";
  //   //Satisfied with hand raises
  //   const cleanedReasonDissatisfiedWithHandRaises =
  //     satisifedWithHandRaisesValue === "no"
  //       ? reasonDissatisfiedWithHandRaises
  //       : "";
  //   //Goal for next session
  //   const cleanedHandRaiseGoalOptions =
  //     goalNextSessionValue === "no" ? [] : handRaiseGoalOptions;
  //   const cleanedHandRaiseGoalOther = handRaiseGoalOptions.find(
  //     (goal) => goal.value === "other"
  //   )?.checked
  //     ? handRaiseGoalOther
  //     : "";
  //   const handRaiseGoalsAndReflections: HandRaiseGoalsAndReflections = {
  //     handRaisesReasonOptions: handRaisesReasonOptions,
  //     handRaiseReasonOther: cleanedHandRaiseReasonOther,
  //     satisifedWithHandRaisesValue: satisifedWithHandRaisesValue,
  //     reasonDissatisfiedWithHandRaises: cleanedReasonDissatisfiedWithHandRaises,
  //     goalNextSessionValue: goalNextSessionValue,
  //     handRaiseGoalOptions: cleanedHandRaiseGoalOptions,
  //     handRaiseGoalOther: cleanedHandRaiseGoalOther,
  //   };
  //   // console.log("test", handRaiseGoalsAndReflections);
  //   const response = await apiHandler.updateHandRaiseReflections(
  //     props.session.id,
  //     props.user.uid,
  //     handRaiseGoalsAndReflections
  //   );
  //   setSaving(false);
  // };
  // const onSaveFailed = (errorInfo: any) => {
  //   console.log("Failed:", errorInfo);
  // };
  // const onChangeHandRaisesReasons = (checkedValue: CheckboxValueType[]) => {
  //   const updatedReasons = defaultHandRaisesReasonOptions.map((resason) => {
  //     let updatedReason = { ...resason };
  //     updatedReason.checked = checkedValue.includes(resason.value)
  //       ? true
  //       : false;
  //     return updatedReason;
  //   });
  //   setHandRaisesReasonOptions(updatedReasons);
  // };
  // const onChangeHandRaiseGoals = (checkedValue: CheckboxValueType[]) => {
  //   const updatedGoals = defaultHandRaiseGoalOptions.map((goal) => {
  //     let updatedGoal = { ...goal };
  //     updatedGoal.checked = checkedValue.includes(goal.value) ? true : false;
  //     return updatedGoal;
  //   });
  //   setHandRaiseGoalOptions(updatedGoals);
  // };
  // // const handRaisesMetric = props.session.metrics?.find(
  // //   (metric) => metric.metricType === SessionMetricType.HandRaises
  // // );//Todo
  // const layout = {
  //   labelCol: { span: 8 },
  //   wrapperCol: { span: 16 },
  // };
  // const tailLayout = {
  //   wrapperCol: { offset: 8, span: 16 },
  // };
  // return (
  //   <div style={{ display: "flex", justifyContent: "center", padding: "2em" }}>
  //     <Form
  //       name="reflectionsForm"
  //       initialValues={{ remember: true }}
  //       onFinish={onSave}
  //       onFinishFailed={onSaveFailed}
  //       style={{
  //         width: "100%",
  //         display: "flex",
  //         flexDirection: "column",
  //         justifyContent: "flex-start",
  //         alignItems: "flex-start",
  //       }}
  //     >
  //       <BlockContent
  //         color={props.metric.color}
  //         name={props.metric.name}
  //         help_text={props.metric.help_text}
  //         has_alert={props.metric.has_alert}
  //         icon={props.metric.icon}
  //       >
  //         <MetricDisplay
  //           metricType={props.metric.metricType}
  //           metric={props.metric.metric}
  //           metricPrepend={props.metric.metricPrepend}
  //           denominator={props.metric.denominator}
  //           hasDenominator={props.metric.hasDenominator}
  //           unit={props.metric.unit}
  //           trend={props.metric.trend}
  //           trend_metric={props.metric.trend_metric}
  //           trend_metric_unit={props.metric.trend_metric_unit}
  //           canEdit={props.metric.canEdit}
  //           updateMetric={(newMetric: string) =>
  //             props.metric.updateMetric(newMetric)
  //           }
  //         >
  //           {props.metric.children}
  //         </MetricDisplay>
  //       </BlockContent>
  //       <br />
  //       <Form.Item>
  //         <p>
  //           The number of hand raises in this session is{" "}
  //           <strong>{props.metric.metric}</strong>
  //         </p>
  //       </Form.Item>
  //       <Form.Item>
  //         <p>Students mainly raised their hands during this session to...?</p>
  //         <Checkbox.Group
  //           style={{
  //             display: "flex",
  //             flexDirection: "column",
  //             alignItems: "flex-start",
  //           }}
  //           options={defaultHandRaisesReasonOptions}
  //           value={handRaisesReasonOptions.map((option) =>
  //             option.checked ? option.value : ""
  //           )}
  //           onChange={onChangeHandRaisesReasons}
  //         />
  //       </Form.Item>
  //       {handRaisesReasonOptions.find((reason) => reason.value === "other")
  //         ?.checked && (
  //         <Form.Item>
  //           <Input
  //             value={handRaiseReasonOther}
  //             onChange={(event) => setHandRaiseReasonOther(event.target.value)}
  //           />
  //         </Form.Item>
  //       )}
  //       <Form.Item>
  //         <p>Are you satisfied with students’ number of hand raises?</p>
  //         <Radio.Group
  //           optionType="button"
  //           buttonStyle="solid"
  //           options={defaultYesNoOptions}
  //           value={satisifedWithHandRaisesValue}
  //           onChange={(e: RadioChangeEvent) =>
  //             setSatisifedWithHandRaisesValue(e.target.value)
  //           }
  //         />
  //       </Form.Item>
  //       {satisifedWithHandRaisesValue === "no" && (
  //         <Form.Item>
  //           <p>
  //             Why are you dissatisfied with the number of student hand raises?
  //           </p>
  //           <Input
  //             value={reasonDissatisfiedWithHandRaises}
  //             onChange={(event) =>
  //               setReasonDissatisfiedWithHandRaises(event.target.value)
  //             }
  //           />
  //         </Form.Item>
  //       )}
  //       <Form.Item>
  //         <p>Would you like to set a goal for next session?</p>
  //         <Radio.Group
  //           optionType="button"
  //           buttonStyle="solid"
  //           options={defaultYesNoOptions}
  //           value={goalNextSessionValue}
  //           onChange={(e: RadioChangeEvent) =>
  //             setGoalNextSessionValue(e.target.value)
  //           }
  //         />
  //       </Form.Item>
  //       {goalNextSessionValue === "yes" && (
  //         <Form.Item>
  //           <p>Select Goals From below</p>
  //           <Checkbox.Group
  //             style={{
  //               display: "flex",
  //               flexDirection: "column",
  //               alignItems: "flex-start",
  //             }}
  //             options={defaultHandRaiseGoalOptions}
  //             value={handRaiseGoalOptions.map((option) =>
  //               option.checked ? option.value : ""
  //             )}
  //             onChange={onChangeHandRaiseGoals}
  //           />
  //         </Form.Item>
  //       )}
  //       {handRaiseGoalOptions.find((reason) => reason.value === "other")
  //         ?.checked && (
  //         <Form.Item>
  //           <Input
  //             value={handRaiseGoalOther}
  //             onChange={(event) => setHandRaiseGoalOther(event.target.value)}
  //           />
  //         </Form.Item>
  //       )}
  //       <Form.Item>
  //         <p>
  //           Is this metric descriptive/ indicative of what’s happening during
  //           class time?
  //         </p>
  //         <Radio.Group
  //           optionType="button"
  //           buttonStyle="solid"
  //           options={defaultYesNoOptions}
  //           value={isMetricDescriptiveValue}
  //           onChange={(e: RadioChangeEvent) =>
  //             setIsMetricDescriptiveValue(e.target.value)
  //           }
  //         />
  //       </Form.Item>
  //       <Form.Item {...tailLayout}>
  //         <Button type="primary" htmlType="submit" disabled={saving}>
  //           Save
  //         </Button>
  //       </Form.Item>
  //     </Form>
  //   </div>
  // );
}
