import React from "react";
import classNames from "classnames";
import "./Button.scss";

interface ButtonProps {
  text: string;
  color?: "primary" | "transparent";
  size?: "normal" | "small";
  icon?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export default function Button(props: ButtonProps) {
  function handleClick(e: React.MouseEvent) {
    // If clicked via mouse, unfocus after click for better appearance
    // e.detail is how many clicks happened. For keyboards, it will be 0
    if (e.detail !== 0) {
      (e.target as HTMLElement).blur();
    }

    props.onClick?.(e);
  }

  return (
    <button
      className={classNames("component button", props.color, props.size)}
      onClick={handleClick}
    >
      {props.icon && (
        <>
          <i className={props.icon} />{" "}
        </>
      )}
      {props.text}
    </button>
  );
}
