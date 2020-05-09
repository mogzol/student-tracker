import React from "react";
import List, { Column } from "components/List/List";
import { DataContext } from "providers/DataProvider/DataProvider";
import { StudentData } from "components/StudentList/StudentList";

interface ActivityData {
  name: string;
  assigned: Date;
  completedRatio: [number, number]; // An array of two numbers, representing, ie, 12/23
  details: string;
}

interface Props {
  onActivitySelected: (activityName: string) => void;
}

const columns: Column<ActivityData>[] = [
  { title: "Activity Name", field: "name", sortable: true, width: 1 },
  { title: "Assigned", field: "assigned", sortable: true, width: 1 },
  {
    title: "Total Completed",
    field: "completedRatio",
    sortable: true,
    renderer: (row) => (
      <div>
        `${row.completedRatio[0]}/${row.completedRatio[1]}`
      </div>
    ),
    width: 1,
  },
  { title: "Details", field: "details", sortable: false, width: 1.8 },
];

export default function ActivityList(props: Props) {
  const dataContext = React.useContext(DataContext);

  const activityRows = React.useMemo<ActivityData[]>(() => {
    const totalStudents = dataContext.data.studentNames.length;
    const activityNames = Object.keys(dataContext.data.activities);
    return activityNames.map((name) => {
      const activity = dataContext.data.activities[name];
      return {
        name,
        assigned: activity.assigned,
        completedRatio: [Object.keys(activity.completed).length, totalStudents],
        details: activity.details,
      };
    });
  }, [dataContext.data]);

  return (
    <div className="component student-list fill">
      <List
        columns={columns}
        data={activityRows}
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
        onSelected={(a) => props.onActivitySelected(a.name)}
        onDelete={(a) => /*dataContext.removeStudent(a.name)*/ alert("remove")}
      />
    </div>
  );
}
