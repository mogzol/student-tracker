import React from "react";
import classNames from "classnames";
import "./Sidebar.scss";
import Button from "components/Button/Button";

export enum SidebarTabs {
  Communications,
  Activities,
}

interface Props {
  selected: SidebarTabs;
}

export default function Sidebar(props: Props) {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <div className={classNames("component sidebar", { expanded })}>
      <Button
        text="Collapse sidebar"
        color="transparent"
        className="menu-toggle"
        icon={`fas fa-lg fa-fw ${expanded ? "fa-arrow-left" : "fa-bars"}`}
        title={expanded ? undefined : "Expand Sidebar"}
        onClick={() => setExpanded(!expanded)}
      />
      <div className="divider" />
      <Button
        text="Communications"
        className={classNames({
          selected: props.selected === SidebarTabs.Communications,
        })}
        color="transparent"
        icon="fas fa-comment-dots fa-lg fa-fw"
        title={expanded ? undefined : "Communications"}
      />
      <Button
        text="Activities"
        className={classNames({
          selected: props.selected === SidebarTabs.Activities,
        })}
        color="transparent"
        icon="fas fa-clipboard-list fa-lg fa-fw"
        title={expanded ? undefined : "Activities"}
      />
    </div>
  );
}
