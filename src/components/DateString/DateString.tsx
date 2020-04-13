import React from "react";

interface Props {
  date: Date;
}

function dateTimeString(date: Date) {
  return date.toLocaleString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  });
}

function dateString(date: Date) {
  return date.toLocaleString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export default function DateString(props: Props) {
  return (
    <span title={dateTimeString(props.date)} className="date">
      {dateString(props.date)}
    </span>
  );
}
