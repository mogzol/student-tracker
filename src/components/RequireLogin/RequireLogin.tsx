import React from "react";
import { GoogleContext } from "providers/GoogleProvider/GoogleProvider";
import Spinner from "components/Spinner/Spinner";
import Button from "components/Button/Button";
import Modal from "components/Modal/Modal";
import "./RequireLogin.scss";

export default function RequireLogin(props: React.PropsWithChildren<{}>) {
  const googleContext = React.useContext(GoogleContext);

  if (!googleContext.ready || googleContext.signingIn) {
    return <Spinner />;
  }

  if (!googleContext.signedIn) {
    return (
      <Modal className="login" width="narrow">
        <div className="title">Please Sign In</div>
        <div className="text">
          Student Communication Tracker uses your Google Drive account to store
          data. Please sign in with Google using the button below.
        </div>
        <Button text="Sign In with Google" onClick={googleContext.signIn} />
        <div className="disclaimer">
          This will only gives the app access to its own data. Other data in
          your drive will not be accessed or modified. No information about you
          will be stored.
        </div>
      </Modal>
    );
  }

  return <>{props.children}</>;
}
