import { Timestamp } from "firebase/firestore";

export const getFormattedDate = (): string => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const today = new Date();
  return today.toLocaleDateString("en-US", options);
};

export const getFormattedCustomDate = (timestamp: Timestamp): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
  };
  return timestamp.toDate().toLocaleDateString("en-US", options);
};
export const getFormattedTime = (): string => {
  const today = new Date();
  let hours = today.getHours();
  const minutes = today.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ?? 12; // the hour '0' should be '12'
  const minutesStr = minutes < 10 ? "0" + minutes : minutes.toString();
  return `${hours}:${minutesStr} ${ampm}`;
};
