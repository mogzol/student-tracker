import React from "react";
import "./FormField.scss";

interface Props {
  title: string;
  helpText?: string | JSX.Element;
  error?: string;
}

export default function FormField(props: React.PropsWithChildren<Props>) {
  return (
    <div className="component form-field">
      <div className="title">{props.title}</div>
      {props.children}
      {props.helpText && <div className="help-text">{props.helpText}</div>}
      {props.error && <div className="error">{props.error}</div>}
    </div>
  );
}
