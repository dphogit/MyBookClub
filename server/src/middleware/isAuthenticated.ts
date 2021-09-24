import { MiddlewareFn } from "type-graphql";
import { CustomContext } from "../common/types";

const isAuthenticated: MiddlewareFn<CustomContext> = ({ context }, next) => {
  if (!context.req.session.userId) {
    throw new Error("Not Authenticated");
  }

  return next();
};

export default isAuthenticated;
