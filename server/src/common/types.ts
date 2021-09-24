import { ObjectType, Field, InputType, Int } from "type-graphql";
import { Request, Response } from "express";
import { Session, SessionData } from "express-session";
import { books_v1 } from "@googleapis/books";

@ObjectType()
export class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@InputType()
export class BookRatingInput {
  @Field()
  volumeId: string;
  @Field()
  title: string;
  @Field(() => Int)
  rating: number;
  @Field(() => BookStatus)
  status: BookStatus;
}

export type ValidationResponse = FieldError[] | null;

export type CustomContext = {
  req: Request & {
    session: Session & Partial<SessionData> & { userId: string };
  };
  res: Response;
  googleBooks: books_v1.Books;
};

export enum BookStatus {
  PLAN = "Planning To Read",
  DROP = "Dropped",
  CURRENT = "Currently Watching",
  HOLD = "On Hold",
  COMPLETE = "Completed",
}
