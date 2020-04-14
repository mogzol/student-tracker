import React, { useContext } from "react";
import { DataContext } from "providers/DataProvider/DataProvider";
import { Communication } from "providers/DataProvider/AppData";
import List, { Column } from "components/List/List";

interface Props {
  studentName: string;
}

const columns: Column<Communication>[] = [
  { title: "Date", field: "date", sortable: true, width: 1.2 },
  { title: "Type", field: "type", sortable: true, width: 1 },
  { title: "Details", field: "details", sortable: false, width: 2.5 },
];

export default function CommunicationList(props: Props) {
  const dataContext = useContext(DataContext);

  const communications = React.useMemo<Communication[]>(
    () => dataContext.data.getCommunications(props.studentName),
    [dataContext.data, props.studentName]
  );

  return (
    <div className="component communication-list">
      <List
        columns={columns}
        data={communications}
        initialSortField="date"
        initialSortDir="desc"
        onDelete={(row) => console.log("Delete " + row)}
      />
    </div>
  );
}
