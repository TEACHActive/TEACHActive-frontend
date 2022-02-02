import * as React from "react";
import { Button, Form } from "antd";

import * as Question from "../../../components/Questions";

export interface IInstructorMovementSectionProps {
  onFinish: (sectionName: string, values: any) => void;
  onFinishFailed: (sectionName: string) => void;
}

let key = 0;

export function InstructorMovementSection(
  props: IInstructorMovementSectionProps
) {
  const [isSaving, setIsSaving] = React.useState<boolean>(false);

  const [isSatified, setIsStatified] = React.useState<boolean>();
  const [notSatifiedReason, setNotSatifiedReason] = React.useState<string>();
  const [isGoalSet, setIsGoalSet] = React.useState<boolean>();
  const [goals, setGoals] = React.useState<string[]>();
  const [otherGoal, setOtherGoal] = React.useState<string>();
  const [isDescriptive, setIsDescriptive] = React.useState<boolean>();

  const { onFinish, onFinishFailed } = props;

  return (
    <Form
      onFinish={(values: any) => onFinish("instructorMovement", values)}
      onFinishFailed={() => onFinishFailed("instructorMovement")}
    >
      <Question.YNQuestion
        _key={key++}
        prompt={"Are you satisfied with where you moved during the class?"}
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
