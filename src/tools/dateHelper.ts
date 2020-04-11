// Not using a library like Luxon or Moment because they are a huge dependency and I don't care
// about i18n for this app and don't really do much with dates

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function dateToString(date: Date) {
  const dayOfWeek = DAYS[date.getDay()];
  const dayOfMonth = date.getDate();
  const month = MONTHS[date.getMonth()];

  return `${dayOfWeek}, ${month} ${dayOfMonth}`;
}
