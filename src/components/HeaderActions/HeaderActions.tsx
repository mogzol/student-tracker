import React from "react";
import { GoogleContext } from "providers/GoogleProvider/GoogleProvider";
import Button from "components/Button/Button";
import StudentForm from "components/StudentForm/StudentForm";
import CommunicationForm from "components/CommunicationForm/CommunicationForm";
import { DataContext } from "providers/DataProvider/DataProvider";
import "./HeaderActions.scss";
import Spinner from "components/Spinner/Spinner";
import classNames from "classnames";
import Modal from "components/Modal/Modal";

export default function HeaderActions() {
  const googleContext = React.useContext(GoogleContext);
  const dataContext = React.useContext(DataContext);

  const [moreOpen, setMoreOpen] = React.useState(false);
  const [addStudents, setAddStudents] = React.useState(false);
  const [addCommunications, setAddCommunications] = React.useState(false);
  const [clearData, setClearData] = React.useState(false);

  const moreMenuRef = React.useRef<HTMLDivElement>(null);
  const moreButtonRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    function clickListener(e: MouseEvent) {
      if (
        e.target !== moreButtonRef.current &&
        !moreMenuRef.current?.contains(e.target as HTMLElement)
      ) {
        setMoreOpen(false);
      }
    }
    document.addEventListener("click", clickListener, true);
    return () => document.removeEventListener("click", clickListener);
  }, []);

  function menuItemClick(setter: (value: boolean) => void) {
    setMoreOpen(false);
    setter(true);
  }

  if (!googleContext.signedIn || dataContext.loading) {
    return null;
  }

  const showAddCommunications = dataContext.data.studentNames.length > 0;

  return (
    <div className={"component header-actions"}>
      <div className="row">
        <div className={classNames("saving-indicator", { hidden: !dataContext.saving })}>
          <Spinner size="small" /> Saving
        </div>
        <Button
          text="Sign Out"
          color="transparent"
          icon="fas fa-sign-out-alt"
          onClick={googleContext.signOut}
          disabled={dataContext.saving}
        />
      </div>
      <div className="row">
        <Button
          ref={moreButtonRef}
          text="More"
          color="transparent"
          icon="fas fa-chevron-down"
          onClick={() => setMoreOpen(!moreOpen)}
        />

        {showAddCommunications ? (
          <Button
            text="Add Communications"
            color="transparent"
            icon="fas fa-plus"
            onClick={() => setAddCommunications(true)}
          />
        ) : (
          <Button
            text="Add Students"
            color="transparent"
            icon="fas fa-user-plus"
            onClick={() => setAddStudents(true)}
          />
        )}
      </div>
      {moreOpen && (
        <div className="more-menu" ref={moreMenuRef}>
          {showAddCommunications && (
            <div className="option" onClick={() => menuItemClick(setAddStudents)}>
              <i className="fas fa-fw fa-user-plus" /> Add Students
            </div>
          )}
          <div className="option" onClick={() => dataContext.importData()}>
            <i className="fas fa-fw fa-file-import" /> Import Data
          </div>
          <div className="option" onClick={() => dataContext.exportData()}>
            <i className="fas fa-fw fa-file-export" /> Export Data
          </div>
          <div className="option" onClick={() => menuItemClick(setClearData)}>
            <i className="fas fa-fw fa-times-circle" /> Clear Data
          </div>
          <a
            href="https://github.com/mogzol/student-tracker"
            className="option"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fas fa-fw fa-code" /> Project Source
          </a>
        </div>
      )}
      {addStudents && <StudentForm onClose={() => setAddStudents(false)} />}
      {addCommunications && (
        <CommunicationForm onClose={() => setAddCommunications(false)} multi={true} />
      )}
      {clearData && (
        <Modal
          onClose={() => setClearData(false)}
          onSave={() => {
            dataContext.clearData();
            setClearData(false);
          }}
          title="Clear Data?"
          saveText="Delete Everything"
        >
          <div>
            This will <strong>delete all</strong> of your students, communications, and any other
            data in Student Communication Tracker.
            <br />
            <br />
            Are you sure you want to continue?
          </div>
        </Modal>
      )}
    </div>
  );
}
