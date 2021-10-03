import { Maybe } from "graphql/jsutils/Maybe";
import { BookStatus } from "../generated/graphql";

export interface Book {
  volumeInfo: BookData;
  id: string;
}

export interface BookData {
  authors?: string[];
  title: string;
  description: string;
  publishedDate: string;
  pageCount: number;
  infoLink: string;
  categories?: string[];
  publisher?: string;
  imageLinks?: {
    thumbnail: string;
    medium: string;
  };
}

export interface BookResponseItem {
  __typename?: "BookRating" | undefined;
  id: string;
  volumeId: string;
  title: string;
  rating?: Maybe<number> | undefined;
  status: BookStatus;
  creatorId: string;
}

export interface ResponseError {
  __typename?: "FieldError" | undefined;
  field: string;
  message: string;
}

export interface Option<T> {
  id: number;
  value: T;
  text: string;
}

export interface SearchedSessionStorage {
  books: Book[];
  query: string;
}
