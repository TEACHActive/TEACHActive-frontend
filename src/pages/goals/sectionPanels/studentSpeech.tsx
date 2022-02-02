import * as React from "react";
import { Button, Form } from "antd";

import * as Question from "../../../components/Questions";
import { SessionMetricType } from "components/MetricDisplay/metricDisplay.types";

export interface IStudentSpeechSectionProps {
  onFinish: (sectionName: string, values: any) => void;
  onFinishFailed: (sectionName: string) => void;
}

let key = 0;

export function StudentSpeechSection(props: IStudentSpeechSectionProps) {
  const [isSaving, setIsSaving] = React.useState<boolean>(false);

  const [
    isExpectSpeakingTime,
    setIsExpectSpeakingTime,
  ] = React.useState<boolean>();
  const [mainTalkingTypes, setMainTalkingTypes] = React.useState<string[]>();
  const [
    otherMainTalkingType,
    setOtherMainTalkingType,
  ] = React.useState<string>();
  const [isSatified, setIsStatified] = React.useState<boolean>();
  const [notSatifiedReason, setNotSatifiedReason] = React.useState<string>();
  const [isGoalSet, setIsGoalSet] = React.useState<boolean>();
  const [goals, setGoals] = React.useState<string[]>();
  const [otherGoal, setOtherGoal] = React.useState<string>();
  const [isDescriptive, setIsDescriptive] = React.useState<boolean>();

  const { onFinish, onFinishFailed } = props;

  return (
    <Form
      onFinish={(values: any) =>
        onFinish(SessionMetricType.StudentSpeech, values)
      }
      onFinishFailed={() => onFinishFailed(SessionMetricType.StudentSpeech)}
    >
      <Question.YNQuestion
        _key={key++}
        prompt={
          "Did you expect that the students would be speaking for this amount of time?"
        }
        isRequired={true}
        isDisabled={false}
        saving={isSaving}
        yesSelected={false}
        noSelected={false}
        setValue={(value) => setIsExpectSpeakingTime(value)}
        initialValue={isExpectSpeakingTime || false}
      />
      <Question.MultiChoiceQuestion
        _key={key++}
        prompt={"Their talking was mainly"}
        isRequired={true}
        isDisabled={false}
        saving={isSaving}
        questionOptions={[
          {
            label: "Asking questions",
            value: "Asking questions",
          },
          {
            label: "Participating",
            value: "Participating",
          },
          {
            label: "Discussing with others",
            value: "Discussing with others",
          },
        ]}
        hasOther={true}
        otherInitialValue={otherMainTalkingType || ""}
        setOtherValue={(value: string) => setOtherMainTalkingType(value)}
        setValues={(value) => setMainTalkingTypes(value)}
        initialValues={mainTalkingTypes || []}
      />
      <Question.YNQuestion
        _key={key++}
        prompt={"Are you satisfied with the number of minutes they spoke?"}
        isRequired={true}
        isDisabled={false}
        saving={isSaving}
        yesSelected={false}
        noSelected={false}
        setValue={(value) => setIsStatified(value)}
        initialValue={isSatified || false}
      />
      {!isSatified && (
        <Question.FreeResponseQuestion
          _key={key++}
          prompt={
            "If you answered no for the previous question, please explain why"
          }
          isRequired={true}
          isDisabled={false}
          saving={isSaving}
          setValue={(value: string) => setNotSatifiedReason(value)}
          initialValue={notSatifiedReason || ""}
        />
      )}
      <Question.YNQuestion
        _key={key++}
        prompt={"Would you like to set a goal for next session?"}
        isRequired={true}
        isDisabled={false}
        saving={isSaving}
        yesSelected={false}
        noSelected={false}
        setValue={(value) => setIsGoalSet(value)}
        initialValue={isGoalSet || false}
      />
      {isGoalSet && (
        <Question.MultiChoiceQuestion
          _key={key++}
          prompt={"Select your goals for the next session"}
          isRequired={true}
          isDisabled={false}
          saving={isSaving}
          questionOptions={[]}
          hasOther={true}
          otherInitialValue={otherGoal || ""}
          setOtherValue={(value: string) => setOtherGoal(value)}
          setValues={(values: string[]) => setGoals(values)}
          initialValues={goals || []}
        />
      )}
      <Question.YNQuestion
        _key={key++}
        prompt={
          "Is this metric descriptive/ indicative of what’s happening during class time?"
        }
        isRequired={true}
        isDisabled={false}
        saving={isSaving}
        yesSelected={false}
        noSelected={false}
        setValue={(value) => setIsDescriptive(value)}
        initialValue={isDescriptive || false}
      />
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={isSaving}>
          Save
        </Button>
      </Form.Item>
    </Form>
  );
}
