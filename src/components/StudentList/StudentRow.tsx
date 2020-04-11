import React from "react";
import { Communication } from "providers/DataProvider/AppData";
import "./StudentRow.scss";
import { dateToString } from "tools/dateHelper";

export interface StudentData extends Communication {
  name: string;
}

interface Props {
  data: StudentData;
}

export default function StudentRow(props: Props) {
  const typeClassName = props.data.type.split(" ", 2)[0].toLowerCase();

  return (
    <div className="component student-row">
      <div className="list-col name">{props.data.name}</div>
      <div className="list-col date">
        <strong className="date">{dateToString(props.data.date)}</strong>
        <br />
        By{" "}
        <strong className={`type ${typeClassName}`}>{props.data.type}</strong>
      </div>
      <div className="list-col details">{props.data.details}</div>
      <div className="delete" title="Delete Student">
        <i className="fas fa-trash" />
      </div>
    </div>
  );
}
