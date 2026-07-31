export function getAttendeesLabel(names: string[]) {
  if (names.length === 0) return "no one";
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} and ${names[1]}`;

  const extraCount = names.length - 2;
  return `${names[0]}, ${names[1]} +${extraCount} ${extraCount === 1 ? "other" : "others"}`;
}
