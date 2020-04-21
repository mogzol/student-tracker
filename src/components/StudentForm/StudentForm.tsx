import React from "react";
import FormField from "components/FormField/FormField";
import Modal from "components/Modal/Modal";
import { DataContext } from "providers/DataProvider/DataProvider";
import { capitalize } from "util/string";
import "./StudentForm.scss";

interface Props {
  onClose: () => void;
}

export default function StudentForm(props: Props) {
  const dataContext = React.useContext(DataContext);
  const [names, setNames] = React.useState<string[]>([]);
  const [error, setError] = React.useState("");

  function handleSave() {
    try {
      dataContext.addStudents(names);
      props.onClose();
    } catch (e) {
      setError(e.message);
    }
  }

  function textChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setNames(
      Array.from(
        new Set(
          e.target.value
            .split(/[,\n]/g)
            .map((v) => capitalize(v.trim()))
            .filter((v) => v)
        )
      )
    );
    setError("");
  }

  function renderNames() {
    if (!names.length) {
      return "";
    }

    return (
      <>
        Detected Names
        {` (${names.length}): `}
        {names.map((name) => (
          <div className="name" key={name}>
            {name}
          </div>
        ))}
      </>
    );
  }

  return (
    <Modal onClose={props.onClose} onSave={handleSave} title="Add New Students">
      <div className="component student-form">
        <div>
          Please enter the names of the students you would like to add,
          separated by either commas or new lines:
        </div>
        <FormField title="Student Names" helpText={renderNames()} error={error}>
          <textarea onChange={textChange} />
        </FormField>
      </div>
    </Modal>
  );
}
