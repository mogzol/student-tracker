import React from "react";
import { GoogleContext } from "providers/GoogleProvider/GoogleProvider";
import Spinner, { SpinnerSize } from "components/Spinner/Spinner";
import "./RequireLogin.scss";

export default function RequireLogin(props: React.PropsWithChildren<{}>) {
  const googleContext = React.useContext(GoogleContext);

  if (!googleContext.ready || googleContext.signingIn) {
    return <Spinner size={SpinnerSize.Medium} />;
  }

  if (!googleContext.signedIn) {
    return (
      <div className="component require-login overlay flex-center">
        <div className="box modal flex-center">
          <div className="title">Please Sign In</div>
          <div className="text">
            Student Communication Tracker uses your Google Drive account to
            store data. Please sign in with Google using the button below.
          </div>
          <button onClick={googleContext.signIn} className="button">
            Sign In with Google
          </button>
          <div className="disclaimer">
            Note: This only gives the app access to its own data. Other data in
            your drive will not be accessed or modified. No information about
            you will be stored.
          </div>
        </div>
      </div>
    );
  }

  return <>{props.children}</>;
}
