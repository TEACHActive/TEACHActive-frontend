import { Form, Radio } from "antd";
import { DefaultQuestionProps } from ".";

export interface IYNQuestionProps {
  yesSelected: boolean;
  noSelected: boolean;
  setValue: (value: boolean) => void;
  initialValue: boolean;
}

export function YNQuestion(props: IYNQuestionProps & DefaultQuestionProps) {
  const {
    _key,
    prompt,
    isRequired,
    isDisabled,
    saving,
    yesSelected,
    noSelected,
    setValue,
  } = props;
  
  return (
    <Form.Item key={_key} label={prompt} required={isRequired}>
      <Radio.Group
        disabled={isDisabled || saving}
        // defaultValue={} //TODO:
        onChange={(event) => {
          event.stopPropagation();
          const radioValue = event.target.value;
          
          if (radioValue === "yes") {
            setValue(true);
          } else if (radioValue === "no") {
            setValue(false);
          }
        }}
      >
        <Radio value="yes" checked={yesSelected}>
          Yes
        </Radio>
        <Radio value="no" checked={noSelected}>
          No
        </Radio>
      </Radio.Group>
    </Form.Item>
  );
}
