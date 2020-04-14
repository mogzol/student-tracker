import React from "react";
import classNames from "classnames";
import "./Button.scss";

interface ButtonProps {
  text: string;
  color?: "primary" | "transparent";
  size?: "normal" | "small";
  icon?: string;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

function Button(props: ButtonProps, ref: React.Ref<HTMLButtonElement>) {
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
      ref={ref}
      className={classNames(
        "component button",
        props.className,
        props.color,
        props.size
      )}
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

// Allowing Button to accept ref in case react-tiny-popover ever fixes
// its deprecated findDOMNode usage
export default React.forwardRef(Button);
