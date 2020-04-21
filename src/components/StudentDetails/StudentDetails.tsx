import React from "react";
import Button from "components/Button/Button";
import "./StudentDetails.scss";
import CommunicationList from "components/CommunicationList/CommunicationList";
import CommunicationForm from "components/CommunicationForm/CommunicationForm";

interface Props {
  name: string | null;
  onBack: () => void;
}

export default function StudentDetails(props: Props) {
  const [addCommunication, setAddCommunication] = React.useState(false);

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
      <div className="header">
        <div className="title">
          Communications with <strong>{props.name}</strong>
        </div>
        <Button
          text="Add Communication"
          icon="fas fa-plus"
          onClick={() => setAddCommunication(true)}
        />
      </div>
      <CommunicationList studentName={props.name} />
      {addCommunication && (
        <CommunicationForm
          onClose={() => setAddCommunication(false)}
          multi={false}
          studentName={props.name}
        />
      )}
    </div>
  );
}
