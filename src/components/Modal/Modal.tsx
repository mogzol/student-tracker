import React from "react";
import ReactDOM from "react-dom";
import classNames from "classnames";
import Button from "components/Button/Button";
import "./Modal.scss";

const MODAL_ROOT = document.getElementById("modal-root") as HTMLElement;

interface Props {
  className?: string;
  icon?: string;
  title?: string;
  width?: "narrow" | "normal" | "auto";
  onClose?: () => void;
  onSave?: () => void;
  saveText?: string;
}

export default function Modal(props: React.PropsWithChildren<Props>) {
  // We create the modals as independent <div>'s in the "modal-root" element so that multiple modals
  // can be displayed simultaneously. Using a lazy initial state (function as the useState param)
  // to avoid creating a new element every render which just ends up getting discarded.
  const [modalRootDiv] = React.useState(() => {
    return document.createElement("div");
  });

  React.useEffect(() => {
    MODAL_ROOT.appendChild(modalRootDiv);
    return () => {
      MODAL_ROOT.removeChild(modalRootDiv);

      // Something weird happens with text selections if you close and open modals, so clear
      // selection on close
      window.getSelection()?.removeAllRanges();
    };
  }, [modalRootDiv]);

  function renderButtons() {
    if (!props.onClose && !props.onSave) {
      return;
    }

    const buttons: JSX.Element[] = [];

    if (props.onClose) {
      buttons.push(
        <Button
          text={props.onSave ? "Cancel" : "Close"}
          color="transparent"
          onClick={props.onClose}
        />
      );
    }

    if (props.onSave) {
      buttons.push(
        <Button text={props.saveText ?? "Save"} color="transparent" onClick={props.onSave} />
      );
    }

    return (
      <div className="modal-buttons">
        {buttons.map((b, i) => (
          <div key={i}>{b}</div>
        ))}
      </div>
    );
  }

  function renderModal() {
    return (
      <div className={classNames("component modal fill flex-center", props.width, props.className)}>
        <div className="box flex-center">
          {props.icon && <i className={classNames("modal-icon", props.icon)} />}
          {props.title && <div className="modal-title">{props.title}</div>}
          {props.children}
          {renderButtons()}
        </div>
      </div>
    );
  }

  return ReactDOM.createPortal(renderModal(), modalRootDiv);
}
