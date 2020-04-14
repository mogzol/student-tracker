import React, { useContext } from "react";
import { DataContext } from "providers/DataProvider/DataProvider";
import { Communication } from "providers/DataProvider/AppData";
import List, { Column } from "components/List/List";
import DateString from "components/DateString/DateString";
import "./StudentList.scss";

// Extends partial because if no communications exist then we'll only have name
export interface StudentData extends Partial<Communication> {
  name: string;
}

interface Props {
  onStudentSelected: (name: string) => void;
}

const columns: Column<StudentData>[] = [
  { title: "Student Name", field: "name", sortable: true, width: 1.2 },
  {
    title: "Last Contacted",
    field: "date",
    sortable: true,
    width: 1,
    renderer: (data) => {
      if (!data.date) {
        return <strong className="danger">Never</strong>;
      }

      const typeClassName = data.type?.toLowerCase().replace(/\s/g, "-");
      return (
        <>
          <DateString date={data.date} />
          <br />
          By <strong className={`type ${typeClassName}`}>{data.type}</strong>
        </>
      );
    },
  },
  { title: "Details", field: "details", sortable: false, width: 1.6 },
];

export default function StudentList(props: Props) {
  const dataContext = useContext(DataContext);

  const studentRows = React.useMemo<StudentData[]>(() => {
    const studentNames = dataContext.data.names;
    return studentNames.map((name) => ({
      name,
      ...dataContext.data.getLastCommunication(name),
    }));
  }, [dataContext.data]);

  return (
    <div className="component student-list fill">
      <List
        columns={columns}
        data={studentRows}
        initialSortField="name"
        rowKey={(row) => row.name}
        deleteText="Delete Student"
        deleteModalText={(row) => (
          <div>
            {"Are you sure you want to delete "}
            <strong>{row.name}</strong>
            {"?"}
          </div>
        )}
        onSelected={(row) => props.onStudentSelected(row.name)}
        onDelete={(row) => console.log("Delete " + row.name)}
      />
    </div>
  );
}
