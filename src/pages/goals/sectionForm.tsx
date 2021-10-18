import { Button, Checkbox, Form, Radio, Select, Slider, Spin } from "antd";
import TextArea from "antd/lib/input/TextArea";
import apiHandler from "api/handler";
import * as React from "react";
import {
  QuestionType,
  ReflectionSection,
  ReflectionSectionQuestion,
  ReflectionSectionQuestionOnSelected,
} from "./goalsPage.types";

const { Option } = Select;

export interface ISectionFormProps {
  section: ReflectionSection;
  metricDisplay?: React.ReactNode;
  comment: React.ReactNode;
  sessionId: string;
  userUID: string;
}

export function SectionForm(props: ISectionFormProps) {
  const [updateMap, setUpdateMap] = React.useState(
    new Map<string, ReflectionSectionQuestion>()
  );
  const [saving, setSaving] = React.useState(false);
  const [initialValues, setInitialValues] = React.useState<any>(null);

  React.useEffect(() => {
    fillInitialValues();
  }, []);

  const onSave = async (values: any) => {
    setSaving(true);

    const updateMapObj = Object.fromEntries(updateMap);

    // console.log(Object.keys(updateMapObj).map((key) => updateMapObj[key]));

    let response = await apiHandler.updateReflections(
      props.sessionId,
      props.userUID,
      Object.keys(updateMapObj).map((key) => updateMapObj[key])
    );
    setSaving(false);
  };
  const onSaveFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const fillInitialValues = () => {
    let initialValues: Map<string, any> = new Map<string, any>();
    props.section.questions.forEach((question) => {
      console.log(question.id, question.onSelected.questionType);

      switch (question.onSelected.questionType) {
        case QuestionType.multiChoiceQuestion:
          console.log(question);

          const multipleSelectedCheckboxes = question.onSelected.multiChoiceQuestion?.options
            .filter((option) => option.selected)
            .map((option) => option.label);
          console.log(multipleSelectedCheckboxes);
          initialValues.set(question.id, multipleSelectedCheckboxes);

          // initialValues.set("2", multipleSelectedCheckboxes);
          // if (multipleSelectedCheckboxes) initialValues[question.id] = "ghfdg";
          console.log(initialValues.get(question.id));
          console.log(initialValues);

          break;

        // console.log("multipleSelectedCheckboxes", multipleSelectedCheckboxes);
        case QuestionType.freeResponseQuestion:
          console.log(13, question);

          initialValues.set(
            question.id,
            question.onSelected.freeResponseQuestion?.feild
          );
          // initialValues[question.id] =
          //   question.onSelected.freeResponseQuestion?.feild;
          // console.log(
          //   "freeResponseQuestion",
          //   question.onSelected.freeResponseQuestion?.feild
          // );
          break;
        case QuestionType.likertQuestion:
          initialValues.set(
            question.id,
            question.onSelected.likertQuestion?.value
          );
          // initialValues[question.id] =
          //   question.onSelected.likertQuestion?.value;
          // console.log(
          //   "likertQuestion",
          //   question.onSelected.likertQuestion?.value
          // );
          break;
        case QuestionType.singleChoiceQuestion:
          console.log("singleChoiceQuestion", question.onSelected);

          const singleSelectedCheckboxes = question.onSelected.singleChoiceQuestion?.options
            .filter((option) => option.selected)
            .map((option) => option.value);
          console.log(singleSelectedCheckboxes);

          initialValues.set(question.id, singleSelectedCheckboxes);
          // initialValues[question.id] = singleSelectedCheckboxes;
          // console.log("singleSelectedCheckboxes", singleSelectedCheckboxes);
          break;
        case QuestionType.ynQuestion:
          console.log(question.onSelected.ynQuestion);

          if (question.onSelected.ynQuestion?.no.selected) {
            // initialValues[question.id] = "no";
            initialValues.set(question.id, "no");
          } else if (question.onSelected.ynQuestion?.yes.selected) {
            // initialValues[question.id] = "yes";
            initialValues.set(question.id, "yes");
          }
          break;
        default:
          break;
      }
    });
    setInitialValues(Object.fromEntries(initialValues));
  };

  console.log(initialValues);

  if (initialValues === null) return <Spin />;

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "2em" }}>
      <Form
        name="sectionForm"
        initialValues={initialValues}
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
        {props.metricDisplay && <Form.Item>{props.metricDisplay}</Form.Item>}
        {props.comment && <Form.Item>{props.comment}</Form.Item>}

        {props.section.questions
          .sort((question) => question.priority)
          .map((question, i) => {
            if (!question.onSelected) return null;
            let currQuestion;
            switch (question.onSelected.questionType) {
              case QuestionType.freeResponseQuestion:
                console.log("freeResponseQuestion", question);

                return (
                  <Form.Item
                    key={i}
                    label={question.onSelected.prompt}
                    name={question.id}
                    required={question.required}
                  >
                    <TextArea
                      autoSize
                      disabled={saving}
                      allowClear
                      onChange={(event) => {
                        setUpdateMap(
                          new Map(
                            updateMap.set(question.id, {
                              ...question,
                              onSelected: {
                                ...question.onSelected,
                                freeResponseQuestion: {
                                  ...question.onSelected?.freeResponseQuestion,
                                  feild: event.target.value,
                                },
                              },
                            })
                          )
                        );
                      }}
                    />
                  </Form.Item>
                );
              case QuestionType.likertQuestion:
                currQuestion = question.onSelected.likertQuestion;

                let qMinValue = currQuestion?.minValue || 1;
                let qMaxValue = currQuestion?.maxValue || 5;
                if (qMaxValue < qMinValue) {
                  //flip them if the wrong way around
                  const temp = qMaxValue;
                  qMaxValue = qMinValue;
                  qMinValue = temp;
                }
                //Calculate marks
                var marks = [];
                for (
                  let markIndex = qMinValue;
                  markIndex <= qMaxValue;
                  markIndex++
                ) {
                  marks.push(markIndex);
                }

                return (
                  <Form.Item
                    key={i}
                    label={question.onSelected.prompt}
                    name={question.id}
                    required={question.required}
                  >
                    <Slider
                      disabled={saving}
                      style={{ width: `${marks.length * 50}px` }}
                      marks={marks.reduce(
                        (o, key) => ({ ...o, [key]: key.toString() }),
                        {}
                      )}
                      min={currQuestion?.minValue || 1}
                      max={currQuestion?.maxValue || 5}
                      value={currQuestion?.value || 1}
                      onAfterChange={(value: number) => {
                        setUpdateMap(
                          new Map(
                            updateMap.set(question.id, {
                              ...question,
                              onSelected: {
                                ...question.onSelected,
                                likertQuestion: {
                                  ...question.onSelected.likertQuestion,
                                  value: value,
                                },
                              },
                            })
                          )
                        );
                      }}
                    />
                  </Form.Item>
                );
              case QuestionType.multiChoiceQuestion:
                currQuestion = question.onSelected.multiChoiceQuestion;

                return (
                  <Form.Item
                    key={i}
                    label={question.onSelected.prompt}
                    name={question.id}
                    required={question.required}
                  >
                    <Checkbox.Group
                      disabled={saving}
                      style={{ display: "flex", flexDirection: "column" }}
                      options={currQuestion?.options}
                      onChange={(checkedValues) => {
                        setUpdateMap(
                          new Map(
                            updateMap.set(question.id, {
                              ...question,
                              onSelected: {
                                ...question.onSelected,
                                multiChoiceQuestion: {
                                  ...question.onSelected?.multiChoiceQuestion,
                                  options: question.onSelected
                                    .multiChoiceQuestion
                                    ? question.onSelected.multiChoiceQuestion?.options.map(
                                        (option) => {
                                          return {
                                            label: option.label,
                                            value: option.label,
                                            selected:
                                              checkedValues.findIndex(
                                                (value) =>
                                                  value.valueOf() ===
                                                  option.label
                                              ) !== -1,
                                          };
                                        }
                                      )
                                    : [],
                                },
                              },
                            })
                          )
                        );
                      }}
                    />
                  </Form.Item>
                );
              case QuestionType.singleChoiceQuestion:
                currQuestion = question.onSelected.singleChoiceQuestion;

                return (
                  <Form.Item
                    key={i}
                    label={question.onSelected.prompt}
                    name={question.id}
                    required={question.required}
                  >
                    <Select
                      disabled={saving}
                      placeholder={question.placeHolder}
                      allowClear
                      onChange={(value) => {
                        setUpdateMap(
                          new Map(
                            updateMap.set(question.id, {
                              ...question,
                              onSelected: {
                                ...question.onSelected,
                                singleChoiceQuestion: {
                                  ...question.onSelected?.singleChoiceQuestion,
                                  options: question.onSelected
                                    .singleChoiceQuestion
                                    ? question.onSelected.singleChoiceQuestion?.options.map(
                                        (option) => {
                                          let selected;
                                          if (Array.isArray(value)) {
                                            selected =
                                              value.findIndex(
                                                (a: any) =>
                                                  a.valueOf() === option.value
                                              ) !== -1;
                                          } else {
                                            //A single number
                                            selected = value === option.value;
                                          }
                                          return {
                                            label: option.value,
                                            value: option.value,
                                            selected: selected,
                                          };
                                        }
                                      )
                                    : [],
                                },
                              },
                            })
                          )
                        );
                      }}
                    >
                      {currQuestion?.options.map((option, i) => (
                        <Option
                          key={i}
                          value={option.value || option.label || i}
                        >
                          {option.value || option.label || i}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                );
              case QuestionType.ynQuestion:
                currQuestion = question.onSelected.ynQuestion;
                // console.log(question.id, 5461);

                return (
                  <Form.Item
                    key={i}
                    label={question.onSelected.prompt}
                    name={question.id}
                    required={question.required}
                  >
                    <Radio.Group
                      disabled={saving}
                      onChange={(event) => {
                        console.log(event.target.value);
                        setUpdateMap(
                          new Map(
                            updateMap.set(question.id, {
                              ...question,
                              onSelected: {
                                ...question.onSelected,
                                ynQuestion: {
                                  ...question.onSelected.ynQuestion,
                                  yes: {
                                    ...question.onSelected.ynQuestion?.yes,
                                    value: "",
                                    label: "",
                                    selected: event.target.value === "yes",
                                  },
                                  no: {
                                    ...question.onSelected?.ynQuestion?.no,
                                    value: "",
                                    label: "",
                                    selected: event.target.value === "no",
                                  },
                                },
                              },
                            })
                          )
                        );
                      }}
                    >
                      <Radio value="yes" checked={currQuestion?.yes.selected}>
                        Yes
                      </Radio>
                      <Radio value="no" checked={currQuestion?.no.selected}>
                        No
                      </Radio>
                    </Radio.Group>
                  </Form.Item>
                );
              default:
                return null;
            }
          })}
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button
            type="primary"
            htmlType="submit"
            loading={saving}
            disabled={saving}
          >
            Save
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
