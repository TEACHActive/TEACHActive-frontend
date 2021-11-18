import React from "react";
import { SelectValue } from "antd/lib/select";
import { Layout, Avatar, Tooltip } from "antd";
import { CascaderOptionType, CascaderValueType } from "antd/lib/cascader";

import { useAppDispatch } from "app/hooks";
import { stringToHexColor } from "../../util";
import { UserOutlined } from "@ant-design/icons";
import { Session } from "api/services/sessions/types";
import { setSelectedSession } from "redux/sessionSlice";
import { SessionSelect } from "components/Session/sessionSelect";

import "./header.scss";

const { Header: AntHeader } = Layout;

export interface IHeaderPresentationalProps {
  sessions: Session[];
}

export function HeaderPresentational(props: IHeaderPresentationalProps) {
  const [options, setOptions] = React.useState<CascaderOptionType[]>([]);

  const dispatch = useAppDispatch();

  const constructSelectData = (
    sessions: Session[]
  ): { label: string; value: string }[] => {
    return sessions.map((session) => {
      return {
        label: session.name || session.createdAt.toLocaleString() || session.id,
        value: session.id,
      };
    });
  };

  const constructCascaderData = (sessions: Session[]): CascaderOptionType[] => {
    return getDistinctUIDsFromSessions(sessions).map((uid, i) => {
      return {
        value: uid,
        label: (
          <div className="cascaderDataLabel">
            <Avatar
              style={{
                backgroundColor: stringToHexColor(uid),
                margin: "3px",
              }}
              icon={<UserOutlined />}
              size="small"
            />
            <Tooltip placement="right" title={uid}>
              User {i + 1}
            </Tooltip>
          </div>
        ),
        isLeaf: false,
      };
    });
  };

  const displayRender = (
    distinctUIDs: string[],
    _: string[],
    selectedOptions?: CascaderOptionType[]
  ) => {
    if (!selectedOptions || (selectedOptions && selectedOptions.length === 0)) {
      return [];
    }

    const uid = selectedOptions[0].value || "";

    return (
      <div className="cascaderDisplayRender">
        <div>
          <Avatar
            style={{
              backgroundColor: stringToHexColor(uid.toString()),
              margin: "3px",
            }}
            icon={<UserOutlined />}
            size={16}
          />
          <Tooltip placement="bottom" title={uid}>
            User {distinctUIDs.findIndex((val) => val === uid) + 1}
          </Tooltip>
        </div>
        {selectedOptions.length > 1 && (
          <>
            <span style={{ marginLeft: "5px", marginRight: "5px" }}>
              {" > "}
            </span>
            {selectedOptions
              .slice(1)
              .map((option) => option.label)
              .join("-")}
          </>
        )}
      </div>
    );
  };

  const _setSelectedSession = (
    sessionId: string | null,
    sessions: Session[]
  ) => {
    if (!sessionId) {
      dispatch(setSelectedSession(undefined));
      return;
    }
    const matchingSession = sessions.find(
      (session) => session.id === sessionId
    );
    dispatch(setSelectedSession(matchingSession));
  };

  const getDistinctUIDsFromSessions = (sessions: Session[]): string[] => {
    return Array.from(
      new Set([...sessions.map((session) => session.userUID)])
    ).filter((uid) => uid);
  };

  const loadData = (
    sessions: Session[],
    selectedOptions?: CascaderOptionType[]
  ) => {
    if (!selectedOptions || (selectedOptions && selectedOptions.length === 0)) {
      return;
    }

    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;

    targetOption.loading = false;
    targetOption.children = sessions
      .filter((session) => session.userUID === targetOption.value)
      .map((session) => {
        const sessionIdentifer =
          session.name || session.createdAt.toLocaleString() || session.id;
        return {
          label: sessionIdentifer,
          value: session.id,
        };
      });
    setOptions([...options]);
  };

  React.useEffect(() => {
    const cascaderData = constructCascaderData(props.sessions);
    setOptions(cascaderData);
  }, [props.sessions]);

  const distinctUIDs = getDistinctUIDsFromSessions(props.sessions);
  const isAdmin = distinctUIDs.length > 1;

  return (
    <AntHeader className="header">
      <SessionSelect
        isAdmin={isAdmin}
        cascaderOptions={options}
        cascaderDisplayRender={(
          label: string[],
          selectedOptions?: CascaderOptionType[] | undefined
        ) =>
          displayRender(
            getDistinctUIDsFromSessions(props.sessions),
            label,
            selectedOptions
          )
        }
        cascaderLoadData={(selectedOptions?: CascaderOptionType[]) =>
          loadData(props.sessions, selectedOptions)
        }
        cascaderOnChange={(
          value: CascaderValueType,
          _?: CascaderOptionType[] | undefined
        ) =>
          _setSelectedSession(
            value[1] ? value[1].toString() : null,
            props.sessions
          )
        }
        selectOptions={constructSelectData(props.sessions)}
        selectOnChange={(value: SelectValue) =>
          _setSelectedSession(value?.toString() || "", props.sessions)
        }
      />
    </AntHeader>
  );
  // return (
  //   <AntHeader className="header">
  //     <div>
  //       {props.isAdmin ? (
  //         <>
  //           <Cascader
  //             options={props.cascaderData}
  //             style={{ width: "200px" }}
  //             displayRender={props.displayRender}
  //             loadData={props.loadData}
  //             onChange={(
  //               value: CascaderValueType,
  //               _?: CascaderOptionType[] | undefined
  //             ) =>
  //               props.setSelectedSession(value[1].toString(), props.sessions)
  //             }
  //           />
  //         </>
  //       ) : (
  //         <Select
  //           options={props.selectData}
  //           style={{ width: "200px" }}
  //           onChange={(value: SelectValue, _: any) =>
  //             props.setSelectedSession(value?.toString() || "", props.sessions)
  //           }
  //         />
  //       )}
  //     </div>
  //     <div>
  //       <LogoutButton type="default" />
  //     </div>
  //   </AntHeader>
  // );
}
