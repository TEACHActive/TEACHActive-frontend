import { Button, Table } from "antd";

import { Session } from "api/services/sessions/types";
import { CompareSessions } from "components/CompareSessions/compareSessions";
import { DateTime } from "luxon";
import React from "react";

import "./progress.scss";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Created At",
    dataIndex: "createdAtISO",
    key: "createdAtISO",
    render: (iso: string) => DateTime.fromISO(iso).toLocaleString(),
  },
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "UID",
    dataIndex: "userUID",
    key: "userUID",
  },
];

export interface IProgressPagePresentationalProps {
  sessions: Session[];
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
        columns={columns}
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
