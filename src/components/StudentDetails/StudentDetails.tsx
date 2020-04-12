import React from "react";
import { DataContext } from "providers/DataProvider/DataProvider";
import Button from "components/Button/Button";
import "./StudentDetails.scss";

interface Props {
  name: string | null;
  onBack: () => void;
}

export default function StudentDetails(props: Props) {
  const dataContext = React.useContext(DataContext);

  if (!props.name) {
    return null;
  }

  return (
    <div className="component student-details fill">
      <Button
        text="Back to List"
        icon="fas fa-arrow-left"
        color="transparent"
        onClick={props.onBack}
      />
      <div className="title">
        Communications with <strong>{props.name}</strong>
      </div>
    </div>
  );
}
