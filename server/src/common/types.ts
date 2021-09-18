import { ObjectType, Field } from "type-graphql";
import { Request, Response } from "express";
import { Session, SessionData } from "express-session";

@ObjectType()
export class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

export type CustomContext = {
  req: Request & {
    session: Session & Partial<SessionData> & { userId: string };
  };
  res: Response;
};
