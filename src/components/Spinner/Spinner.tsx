import React from "react";
import "./Spinner.scss";

interface Props {
  size?: "small" | "medium" | "large";
}

export default function Spinner(props: Props) {
  return (
    <div className={`component spinner ${props.size}`}>
      <div className="inner rotate" />
    </div>
  );
}
