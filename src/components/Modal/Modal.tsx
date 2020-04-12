import React from "react";
import ReactDOM from "react-dom";
import classNames from "classnames";
import "./Modal.scss";

const MODAL_ROOT = document.getElementById("modal-root") as HTMLElement;

interface Props {
  className?: string;
  icon?: string;
  width?: "narrow" | "normal";
}

export default function Modal(props: React.PropsWithChildren<Props>) {
  // We create the modals as independent <div>'s in the "modal-root" element so that multiple modals
  // can be displayed simultaneously. Using a lazy initial state (function as the useState param)
  // to avoid creating a new element every render which just ends up getting discarded.
  const [modalRootDiv] = React.useState(() => {
    console.log("made");
    return document.createElement("div");
  });

  React.useEffect(() => {
    MODAL_ROOT.appendChild(modalRootDiv);
    return () => {
      MODAL_ROOT.removeChild(modalRootDiv);
    };
  }, [modalRootDiv]);

  function renderModal() {
    return (
      <div
        className={classNames(
          "component modal fill flex-center",
          props.width,
          props.className
        )}
      >
        <div className="box flex-center">
          {props.icon && <i className={classNames("modal-icon", props.icon)} />}
          {props.children}
        </div>
      </div>
    );
  }

  return ReactDOM.createPortal(renderModal(), modalRootDiv);
}
