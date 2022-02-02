import React from "react";
import { DefaultQuestionProps } from ".";
import { Form, Checkbox, CheckboxOptionType, Input } from "antd";

export interface IMultiChoiceQuestionProps {
  questionOptions: CheckboxOptionType[];
  hasOther: boolean;
  otherInitialValue: string;
  setOtherValue: (value: string) => void;
  setValues: (values: string[]) => void;
  initialValues: string[];
  // name: string;
}

export function MultiChoiceQuestion(
  props: IMultiChoiceQuestionProps & DefaultQuestionProps
) {
  const [otherSelected, setOtherSelected] = React.useState<boolean>(false);
  const {
    _key,
    prompt,
    isRequired,
    isDisabled,
    saving,
    hasOther,
    otherInitialValue,
    questionOptions,
    setOtherValue,
    initialValues,
    setValues,
    // name
  } = props;

  return (
    <>
      <Form.Item key={_key} label={prompt} required={isRequired}>
        <Checkbox.Group
          disabled={isDisabled || saving}
          defaultValue={initialValues}
          style={{ display: "flex", flexDirection: "column" }}
          options={
            hasOther
              ? [...questionOptions, { label: "Other", value: "Other" }]
              : questionOptions
          }
          onChange={(checkedValues) => {
            const otherChecked = !!checkedValues.find(
              (value) => value.toString().toLowerCase() === "other"
            );
            setOtherSelected(otherChecked);
            setValues(checkedValues.map((value) => value.toString()));
          }}
        />
      </Form.Item>
      {hasOther && otherSelected && (
        <Form.Item label={"Other"} name="other" required={hasOther}>
          <Input
            onChange={(e) => {
              setOtherValue(e.target.value);
            }}
            value={otherInitialValue}
            disabled={isDisabled || saving}
          />
        </Form.Item>
      )}
    </>
  );
}
