import React, { useContext } from "react";
import { DataContext } from "providers/DataProvider/DataProvider";
import StudentRow, { StudentData } from "components/StudentRow/StudentRow";
import SimpleBar from "simplebar-react";
import "./List.scss";

interface Props {
  data: object;
  sortField?: string;
  sortDir?: "asc" | "desc";
  onSelected: (name: string) => void;
}

// TODO: Extract StudentList functionality to generic list component
export default function List(props: Props) {
  const dataContext = useContext(DataContext);

  const studentRows = React.useMemo<StudentData[]>(() => {
    const studentNames = dataContext.data.names;
    return studentNames.map((name) => ({
      name,
      ...dataContext.data.getLastCommunication(name),
    }));
  }, [dataContext.data]);

  const sortField = props.sortField ?? "name";
  const sortDir = props.sortDir ?? "asc";

  const sortedRows = React.useMemo<StudentData[]>(() => {
    let sortFunc: (a: StudentData, b: StudentData) => number;
    if (sortField === "date") {
      sortFunc = (a: StudentData, b: StudentData) => {
        // Dates might not be set if no communications
        if (a.date && !b.date) return 1;
        if (!a.date && b.date) return -1;
        if (!a.date && !b.date) return 0;
        return a.date.getTime() - b.date.getTime();
      };
    } else {
      sortFunc = (a: StudentData, b: StudentData) =>
        a.name.localeCompare(b.name);
    }

    if (sortDir === "desc") {
      const origSortFunc = sortFunc;
      sortFunc = (a: any, b: any) => origSortFunc(b, a);
    }

    return studentRows.sort(sortFunc);
  }, [studentRows, sortField, sortDir]);

  return (
    <div className="component list fill">
      <div className="list-headers">
        <div className="list-col name">Student Name</div>
        <div className="list-col date">Last Contacted</div>
        <div className="list-col details">Details</div>
      </div>
      <SimpleBar className="rows">
        {sortedRows.map((row) => (
          <StudentRow
            data={row}
            key={row.name}
            onClick={() => props.onSelected(row.name)}
          />
        ))}
      </SimpleBar>
    </div>
  );
}
