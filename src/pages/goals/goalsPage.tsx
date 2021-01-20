import * as React from "react";
import { Typography, Collapse, Tag, Button } from "antd";
import { stringToHexColor } from "../../util";

import "./goalsPage.css";

const { Title } = Typography;
const { Panel } = Collapse;

export interface IGoalsPageProps {}

export default function GoalsPage(props: IGoalsPageProps) {
  const [reflectionActiveKeys, setReflectionActiveKeys] = React.useState<
    string[]
  >([]);
  const reflections = [
    {
      title: "Reflection1",
      timestamp: "2021-01-20T18:27:44.117Z",
      content: "This is the first reflection",
      tags: ["tag1", "tag2"],
    },
  ];

  return (
    <div>
      <div className="goalsReflectionsSection">
        <Title>Goals</Title>
      </div>

      <div className="goalsReflectionsSection">
        <Title>Reflections</Title>
        <div className="goalsReflectionsContent">
          <div className="reflectionsCollapseControlButtons--top">
            <Button
              onClick={() => {
                setReflectionActiveKeys(
                  reflections.map((reflection: any, i: number) => `${i}`)
                );
              }}
            >
              Expand All
            </Button>
            <Button
              onClick={() => {
                setReflectionActiveKeys([]);
              }}
            >
              Collapse All
            </Button>
          </div>
          <Collapse
            activeKey={reflectionActiveKeys}
            onChange={(key: string | string[]) => {
              let keyArr: string[] = [];
              if (typeof key == "string") {
                keyArr = [key];
              } else {
                keyArr = key;
              }

              setReflectionActiveKeys([...keyArr]);
            }}
          >
            {reflections.map((reflection: any, i: number) => (
              <Panel header={reflection.title} key={i}>
                <p>{reflection.content}</p>
                <div style={{ display: "flex" }}>
                  {reflection.tags.map((tag: string, j: number) => (
                    <Tag key={j} color={stringToHexColor(tag)}>
                      {tag}
                    </Tag>
                  ))}
                </div>
              </Panel>
            ))}
          </Collapse>
          <div className="reflectionsCollapseControlButtons--bottom">
            <Button type="primary" onClick={() => {}}>
              New Reflection
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
