import React, { useContext, RefObject } from "react";
import { GoogleContext } from "providers/GoogleProvider/GoogleProvider";
import Button from "components/Button/Button";
import "./HeaderActions.scss";

export default function HeaderActions() {
  const googleContext = useContext(GoogleContext);

  const [moreOpen, setMoreOpen] = React.useState(false);
  const moreMenuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function clickListener(e: MouseEvent) {
      if (!moreMenuRef.current?.contains(e.target as HTMLElement)) {
        setMoreOpen(false);
      }
    }
    document.addEventListener("click", clickListener, true);
    return () => document.removeEventListener("click", clickListener);
  }, []);

  if (!googleContext.signedIn) {
    return null;
  }

  return (
    <div className={"component header-actions"}>
      <div className="row">
        <Button
          text="Sign Out"
          color="transparent"
          icon="fas fa-sign-out-alt"
          onClick={googleContext.signOut}
        />
      </div>
      <div className="row">
        <Button
          text="More"
          color="transparent"
          icon="fas fa-chevron-down"
          onClick={() => setMoreOpen(!moreOpen)}
        />

        <Button
          text="Add Student"
          color="transparent"
          icon="fas fa-user-plus"
        />
      </div>
      {moreOpen && (
        <div className="more-menu box" ref={moreMenuRef}>
          <div className="option">
            <i className="fas fa-file-import" /> Import
          </div>
        </div>
      )}
    </div>
  );
}
