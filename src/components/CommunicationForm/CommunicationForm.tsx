import React from "react";
import Modal from "components/Modal/Modal";
import FormField from "components/FormField/FormField";
import DatePicker from "react-datepicker";
import { DataContext } from "providers/DataProvider/DataProvider";
import { Communication } from "providers/DataProvider/AppData";
import "./CommunicationForm.scss";

interface Props {
  onClose: () => void;
  multi: boolean;
  studentName?: string; // Ignored if multi = true
  initialCommunication?: Communication;
}

type CommunicationType = "email" | "phone" | "other";

export default function CommunicationForm(props: Props) {
  if (!props.multi && !props.studentName) {
    throw new Error("Must provide student name if multi select disabled");
  }

  if (props.multi && props.initialCommunication) {
    throw new Error("Cannot use multi with initialCommunication");
  }

  const dataContext = React.useContext(DataContext);

  const [date, setDate] = React.useState<Date | null>(
    props.initialCommunication?.date ?? new Date()
  );

  let initialType: CommunicationType = "email";
  let initialCustomType = "";
  if (props.initialCommunication?.type) {
    initialType =
      props.initialCommunication.type === "email" || props.initialCommunication.type === "phone"
        ? props.initialCommunication.type
        : "other";
    initialCustomType = initialType === "other" ? props.initialCommunication.type : "";
  }

  const [type, setType] = React.useState<CommunicationType>(initialType);
  const [customType, setCustomType] = React.useState(initialCustomType);

  const [details, setDetails] = React.useState(props.initialCommunication?.details ?? "");

  const [dateError, setDateError] = React.useState("");
  const [typeError, setTypeError] = React.useState("");
  const [detailsError, setDetailsError] = React.useState("");

  function getType() {
    let selectedType: string = type;
    if (selectedType === "other") {
      selectedType = customType;
    }

    return selectedType.toLowerCase().trim();
  }

  function handleSave() {
    let error = false;

    if (!date) {
      setDateError("Please enter a date");
      error = true;
    }
    if (type === "other" && !customType) {
      setTypeError("Please enter a communication type");
      error = true;
    }
    if (!details) {
      setDetailsError("Please enter some details");
      error = true;
    }

    if (error) {
      return;
    }

    // Currently, multi adds to all students
    let names: string[];
    if (props.multi) {
      names = dataContext.data.names;
    } else {
      names = [props.studentName as string];
    }

    const communication: Communication = {
      date: date as Date,
      type: getType(),
      details: details.trim(),
    };

    if (!props.initialCommunication) {
      dataContext.addCommunications(names, communication);
    } else {
      dataContext.replaceCommunication(names[0], props.initialCommunication, communication);
    }

    props.onClose();
  }

  const title = `${props.initialCommunication ? "Edit" : "Add"} Communication${
    props.multi ? "s" : ` for ${props.studentName}`
  }`;

  return (
    <Modal title={title} width="auto" onClose={props.onClose} onSave={handleSave}>
      <div className="component communication-form">
        {props.multi && (
          <FormField title="For Students">
            <select value="all" onChange={() => null /* TODO: this */}>
              <option value="all">All Students</option>
              <option value="select" disabled>
                Choose Students (not implemented, use details page instead)
              </option>
            </select>
          </FormField>
        )}
        <FormField title="Date Contacted" error={dateError}>
          <DatePicker
            selected={date}
            onChange={(date) => {
              setDate(date);
              setDateError("");
            }}
            showTimeSelect={true}
            timeIntervals={15}
            dateFormat="PP p"
          />
        </FormField>
        <FormField title="Contacted By" error={typeError}>
          <div className="select-type">
            <select
              value={type}
              onChange={(e) => {
                setType(e.target.value as CommunicationType);
                setCustomType("");
                setTypeError("");
              }}
            >
              <option value="email">Email</option>
              <option value="phone">Phone</option>
              <option value="other">Other</option>
            </select>
            {type === "other" && (
              <input
                type="text"
                value={customType}
                placeholder="Communication type"
                onChange={(e) => {
                  setCustomType(e.target.value);
                  setTypeError("");
                }}
              />
            )}
          </div>
        </FormField>
        <FormField title="Details" error={detailsError}>
          <textarea
            value={details}
            onChange={(e) => {
              setDetails(e.target.value);
              setDetailsError("");
            }}
          />
        </FormField>
      </div>
    </Modal>
  );
}
