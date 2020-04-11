import React, { useContext } from "react";
import { GoogleContext } from "providers/GoogleProvider/GoogleProvider";
import "./HeaderActions.scss";

export default function HeaderActions() {
  const googleContext = useContext(GoogleContext);

  if (!googleContext.signedIn) {
    return null;
  }

  return (
    <div className={"component header-actions"}>
      <button
        className="button transparent sign-out"
        onClick={googleContext.signOut}
      >
        <i className={"fas fa-sign-out-alt"} /> Sign Out
      </button>
    </div>
  );
}
