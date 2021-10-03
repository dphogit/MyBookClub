import { BookStatus } from "../../generated/graphql";
import { Option } from "../types";

export const statuses: Option<BookStatus>[] = [
  { id: 1, text: "Currently Reading", value: BookStatus.Current },
  { id: 2, text: "Completed", value: BookStatus.Complete },
  { id: 3, text: "Plan to Read", value: BookStatus.Plan },
  { id: 4, text: "On Hold", value: BookStatus.Hold },
  { id: 5, text: "Drop", value: BookStatus.Drop },
];

export const ratings: Option<number>[] = [
  { id: 1, text: "1", value: 1 },
  { id: 2, text: "2", value: 2 },
  { id: 3, text: "3", value: 3 },
  { id: 4, text: "4", value: 4 },
  { id: 5, text: "5", value: 5 },
];
