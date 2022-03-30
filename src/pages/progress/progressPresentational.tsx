import React from "react";
import { DateTime } from "luxon";
import { Button, Table } from "antd";
import { ColumnGroupType, ColumnsType, ColumnType } from "antd/lib/table";

import { Session } from "api/services/sessions/types";
import { CompareSessions } from "components/CompareSessions/compareSessions";

import "./progress.scss";

const columns: (
  | (ColumnGroupType<Session> & { adminOnly: boolean })
  | (ColumnType<Session> & { adminOnly: boolean })
)[] = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    sorter: (a: Session, b: Session) => {
      const aName = a.name || a.createdAtISO;
      const bName = b.name || b.createdAtISO;
      return bName.localeCompare(aName);
    },
    // sortDirections: ["ascend", "descend", "ascend"],
    adminOnly: false,
  },
  {
    title: "Created At",
    dataIndex: "createdAtISO",
    key: "createdAtISO",
    render: (iso: string) => DateTime.fromISO(iso).toLocaleString(),
    sorter: (a: Session, b: Session) => {
      const aDate = DateTime.fromISO(a.createdAtISO);
      const bDate = DateTime.fromISO(b.createdAtISO);
      return bDate.diff(aDate, "seconds").seconds;
    },
    // sortDirections: ["ascend", "descend", "ascend"],
    adminOnly: false,
  },
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    adminOnly: true,
  },
  {
    title: "UID",
    dataIndex: "userUID",
    key: "userUID",
    sorter: (a: Session, b: Session) => {
      return b.userUID.localeCompare(a.userUID);
    },
    // sortDirections: ["ascend", "descend", "ascend"],
    adminOnly: true,
  },
];

export interface IProgressPagePresentationalProps {
  sessions: Session[];
  isAdmin: boolean;
}

export function ProgressPagePresentational(
  props: IProgressPagePresentationalProps
) {
  const [selectedRows, setSelectedRows] = React.useState<Session[]>([]);
  const [currentComparison, setCurrentComparison] = React.useState<Session[]>(
    []
  );

  const rowSelection = {
    selectedRows,
    onChange: setSelectedRows,
  };

  const doComparison = () => {
    setCurrentComparison(selectedRows);
  };

  let compareButtonDisabled = false,
    compareButtonText = "Compare Selected";

  if (selectedRows.length < 2) {
    compareButtonDisabled = true;
    compareButtonText = `Select ${2 - selectedRows.length} more to compare`;
  } else if (currentComparison) {
    compareButtonText = "Modify Comparison";
    if (
      selectedRows.map((session) => session.id).join("") !==
      currentComparison.map((session) => session.id).join("")
    ) {
      // Different comparison
      compareButtonDisabled = false;
    } else {
      // Same comparison
      compareButtonDisabled = true;
    }
  }

  return (
    <div className="progressPagePresentational">
      <Table
        rowSelection={{
          onChange: (selectedRowKeys, selectedRows) =>
            setSelectedRows(selectedRows),
        }}
        rowKey={(record) => record.id}
        dataSource={props.sessions}
        columns={columns.filter((col) =>
          props.isAdmin ? true : !col.adminOnly
        )}
      />
      <div>
        <Button
          type="primary"
          disabled={compareButtonDisabled}
          onClick={doComparison}
        >
          {compareButtonText}
        </Button>
      </div>
      {currentComparison && <CompareSessions sessions={currentComparison} />}
    </div>
  );
}
