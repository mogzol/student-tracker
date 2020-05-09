import React from "react";
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
  { title: "Student Name", field: "name", sortable: true, width: 1 },
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
  { title: "Details", field: "details", sortable: false, width: 1.8 },
];

export default function StudentList(props: Props) {
  const dataContext = React.useContext(DataContext);

  const studentRows = React.useMemo<StudentData[]>(() => {
    const studentNames = dataContext.data.studentNames;
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
        rowKey={(s) => s.name}
        deleteText="Delete Student"
        deleteModalText={(s) => (
          <div>
            {"Are you sure you want to delete the student "}
            <strong>{s.name}</strong>
            {" and all communications associated with them?"}
          </div>
        )}
        onSelected={(s) => props.onStudentSelected(s.name)}
        onDelete={(s) => dataContext.removeStudent(s.name)}
      />
    </div>
  );
}
