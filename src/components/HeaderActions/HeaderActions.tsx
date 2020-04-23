import React, { useContext } from "react";
import { GoogleContext } from "providers/GoogleProvider/GoogleProvider";
import Button from "components/Button/Button";
import StudentForm from "components/StudentForm/StudentForm";
import CommunicationForm from "components/CommunicationForm/CommunicationForm";
import { DataContext } from "providers/DataProvider/DataProvider";
import "./HeaderActions.scss";
import Spinner from "components/Spinner/Spinner";
import classNames from "classnames";

export default function HeaderActions() {
  const googleContext = useContext(GoogleContext);
  const dataContext = useContext(DataContext);

  const [moreOpen, setMoreOpen] = React.useState(false);
  const [addStudents, setAddStudents] = React.useState(false);
  const [addCommunications, setAddCommunications] = React.useState(false);

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

  if (!googleContext.signedIn) {
    return null;
  }

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

        <Button
          text="Add Communications"
          color="transparent"
          icon="fas fa-plus"
          onClick={() => setAddCommunications(true)}
        />
      </div>
      {moreOpen && (
        <div className="more-menu" ref={moreMenuRef}>
          <div className="option" onClick={() => menuItemClick(setAddStudents)}>
            <i className="fas fa-fw fa-user-plus" /> Add Students
          </div>
          <div className="option" onClick={() => dataContext.importData()}>
            <i className="fas fa-fw fa-file-import" /> Import Data
          </div>
          <div className="option" onClick={() => dataContext.exportData()}>
            <i className="fas fa-fw fa-file-export" /> Export Data
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
    </div>
  );
}
