import React, { useContext } from "react";
import { DataContext } from "providers/DataProvider/DataProvider";
import { Communication } from "providers/DataProvider/AppData";
import List, { Column } from "components/List/List";
import CommunicationForm from "components/CommunicationForm/CommunicationForm";

interface Props {
  studentName: string;
}

const columns: Column<Communication>[] = [
  { title: "Date", field: "date", sortable: true, width: 1.2 },
  {
    title: "Type",
    field: "type",
    sortable: true,
    width: 1,
    renderer: (data) => {
      const typeClassName = data.type?.toLowerCase().replace(/\s/g, "-");
      return <strong className={`type ${typeClassName}`}>{data.type}</strong>;
    },
  },
  { title: "Details", field: "details", sortable: false, width: 2.5 },
];

export default function CommunicationList(props: Props) {
  const dataContext = useContext(DataContext);

  const [
    editCommunication,
    setEditCommunication,
  ] = React.useState<Communication | null>(null);

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
        onDelete={(c) => dataContext.removeCommunication(props.studentName, c)}
        onSelected={(c) => setEditCommunication(c)}
      />
      {editCommunication && (
        <CommunicationForm
          multi={false}
          studentName={props.studentName}
          initialCommunication={editCommunication}
          onClose={() => setEditCommunication(null)}
        />
      )}
    </div>
  );
}
