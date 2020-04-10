import React from "react";
import "./Spinner.scss";

export enum SpinnerSize {
  Large = "large",
  Medium = "medium",
  Small = "small",
}

interface Props {
  size?: SpinnerSize;
}

export default function Spinner(props: Props) {
  return (
    <div className={`component spinner ${props.size ?? SpinnerSize.Medium}`}>
      <div className="inner rotate" />
    </div>
  );
}
