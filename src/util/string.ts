// String manipulation helper functions
export function capitalize(str: string) {
  return str.replace(/\w\S*/g, function (s: string) {
    return s.charAt(0).toUpperCase() + s.substr(1);
  });
}
