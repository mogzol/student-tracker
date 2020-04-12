import React from "react";
import { Communication } from "providers/DataProvider/AppData";
import "./StudentRow.scss";

export interface StudentData extends Communication {
  name: string;
}

interface Props {
  data: StudentData;
  onClick: (e: React.MouseEvent) => void;
}

export default function StudentRow(props: Props) {
  const typeClassName = props.data.type?.toLowerCase().replace(/\s/g, "-");

  return (
    <div className="component student-row" onClick={props.onClick}>
      <div className="list-col name">{props.data.name}</div>
      <div className="list-col date">
        {props.data.date ? (
          <>
            <strong className="date">
              {props.data.date.toLocaleString(undefined, {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </strong>
            <br />
            By{" "}
            <strong className={`type ${typeClassName}`}>
              {props.data.type}
            </strong>
          </>
        ) : (
          <strong className="danger">Never</strong>
        )}
      </div>
      <div className="list-col details">{props.data.details}</div>
      <div className="delete" title="Delete Student">
        <i className="fas fa-trash" />
      </div>
    </div>
  );
}
