import React, { useContext } from "react";
import { GoogleContext } from "providers/GoogleProvider/GoogleProvider";
import Button from "components/Button/Button";
import "./HeaderActions.scss";

export default function HeaderActions() {
  const googleContext = useContext(GoogleContext);

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
        <Button text="More" color="transparent" icon="fas fa-chevron-down" />
        <Button
          text="Add Student"
          color="transparent"
          icon="fas fa-user-plus"
        />
      </div>
    </div>
  );
}
