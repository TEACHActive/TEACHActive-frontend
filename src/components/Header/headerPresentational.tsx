import React from "react";
import { DateTime } from "luxon";
import { useSelector } from "react-redux";
import { SelectValue } from "antd/lib/select";
import { Layout, Avatar, Tooltip } from "antd";
import { CascaderOptionType, CascaderValueType } from "antd/lib/cascader";

import { useAppDispatch } from "app/hooks";
import { stringToHexColor } from "../../util";
import { UserOutlined } from "@ant-design/icons";
import { ISession } from "api/services/sessions/types";
import { SessionSelect } from "components/Session/sessionSelect";
import { selectSelectedSession, setSelectedSession } from "redux/sessionSlice";

import "./header.scss";

const { Header: AntHeader } = Layout;

export interface IHeaderPresentationalProps {
  sessions: ISession[];
  isAdmin: boolean;
}

export function HeaderPresentational(props: IHeaderPresentationalProps) {
  const [options, setOptions] = React.useState<CascaderOptionType[]>([]);
  const selectedSession = useSelector(selectSelectedSession);

  const dispatch = useAppDispatch();

  const constructSelectData = (
    sessions: ISession[]
  ): { label: string; value: string; dateTime: DateTime }[] => {
    return sessions.map((session) => {
      return {
        label:
          session.name ||
          DateTime.fromISO(session.createdAtISO).toLocaleString() ||
          session.id,
        value: session.id,
        dateTime: DateTime.fromISO(session.createdAtISO),
      };
    });
  };

  const constructCascaderData = (
    sessions: ISession[]
  ): CascaderOptionType[] => {
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
              User {uid.slice(0, 4)}
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
    selectedOptions?: CascaderOptionType[],
    selectedSession?: ISession
  ) => {
    const hasSelectedOptions = selectedOptions && selectedOptions.length > 0;
    if (!hasSelectedOptions && !selectedSession) {
      return [];
    }
    let augmentedSelectedOptions = [...selectedOptions!];

    //TODO: update cascader and select to show selected session if already set

    const uid = augmentedSelectedOptions[0].value || "";

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
            User {distinctUIDs.find((val) => val === uid)?.slice(0, 4)}
          </Tooltip>
        </div>
        {augmentedSelectedOptions.length > 1 && (
          <>
            <span style={{ marginLeft: "5px", marginRight: "5px" }}>
              {" > "}
            </span>
            {augmentedSelectedOptions
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
    sessions: ISession[]
  ) => {
    if (!sessionId) {
      dispatch(setSelectedSession(undefined));
      return;
    }
    const matchingSession = sessions.find(
      (session) => session.id === sessionId
    );
    if (!matchingSession) {
      dispatch(setSelectedSession(undefined));
      return;
    }
    const { id, name, userUID, performance, createdAtISO } = matchingSession;
    dispatch(
      setSelectedSession({
        id,
        name,
        userUID,
        performance,
        createdAtISO,
      })
    );
  };

  const getDistinctUIDsFromSessions = (sessions: ISession[]): string[] => {
    return Array.from(
      new Set([...sessions.map((session) => session.userUID)])
    ).filter((uid) => uid);
  };

  const loadData = (
    sessions: ISession[],
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
          session.name ||
          DateTime.fromISO(session.createdAtISO).toLocaleString() ||
          session.id;
        return {
          label: sessionIdentifer,
          value: session.id,
        };
      });
    // new Map() < year,
    //   Map < month,
    //   { label: sessionIdentifer, value: session.id } >>
    // const _map = new Map<
    //   number,
    //   Map<number, { label: string; value: string }>
    // >();

    // sessions
    //   .filter((session) => session.userUID === targetOption.value)
    //   .forEach((session) => {
    //     const sessionIdentifer =
    //       session.name || session.createdAt.toLocaleString() || session.id;

    //     let yearMap =
    //       _map.get(session.createdAt.year) ||
    //       new Map<number, { label: string; value: string }>();
    //     yearMap.set(session.createdAt.month, {
    //       label: sessionIdentifer,
    //       value: session.id,
    //     });

    //     _map.set(session.createdAt.year, yearMap);
    //   });
    // const a = Object.entries(Object.fromEntries(_map)).map((t) => {
    //   const children = Object.entries(Object.fromEntries(t[1])).map((month) => {
    //     return { label: month[1].label, value: month[1].value };
    //   });

    //   return { label: t[0], value: t[0], children: children };
    // });
    // console.log(a);

    setOptions([...options]);
  };

  React.useEffect(() => {
    const cascaderData = constructCascaderData(props.sessions);
    setOptions(cascaderData);
    if (selectedSession) {
      // Todo: Update header if selected session is already set
    }
  }, [props.sessions, selectedSession]);

  const distinctUIDs = getDistinctUIDsFromSessions(props.sessions);
  //const isAdmin = distinctUIDs.length > 1; // Todo: Modify this to check is admin from user

  return (
    <AntHeader className="header">
      <SessionSelect
        selectedSession={selectedSession}
        isAdmin={props.isAdmin}
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
}
