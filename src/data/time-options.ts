export const birthMinuteOptions = Array.from({ length: 60 }, (_, minute) => {
  const value = String(minute).padStart(2, "0");
  return { value, label: value };
});
