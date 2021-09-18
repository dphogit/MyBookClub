import {
  Resolver,
  Arg,
  Mutation,
  Query,
  ObjectType,
  Field,
} from "type-graphql";
import { hash } from "argon2";

import User from "../entity/User";
import { FieldError } from "../common/types";
import registerValidation from "../validation/registerValidation";

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
class UserResolver {
  @Query(() => UserResponse)
  async getUserById(@Arg("userId") userId: string): Promise<UserResponse> {
    let user: User | undefined = undefined;

    try {
      const userFound = await User.findOne(userId);
      if (!userFound) {
        throw new Error("no user"); // Thrown when userId is a valid UUID
      }

      user = userFound;
    } catch (error) {
      // Error code 22P02 is thrown when userId is NOT a valid UUID
      if ((error.code = "22P02" || error === "no user")) {
        return {
          errors: [{ field: "id", message: `No user found with id ${userId}` }],
        };
      }
      console.error(error);
    }

    return { user };
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("email") email: string,
    @Arg("password") password: string
  ): Promise<UserResponse> {
    const errors = registerValidation({ email, password });
    if (errors) {
      return { errors };
    }

    let newUser: User | undefined = undefined;

    try {
      const userFound = await User.findOne({ where: { email } });
      if (userFound) {
        return {
          errors: [
            {
              field: "email",
              message: "Email already in use",
            },
          ],
        };
      }

      const hashedPassword = await hash(password);
      newUser = await User.create({ email, password: hashedPassword }).save();
    } catch (error) {
      console.log(error);
    }

    return { user: newUser };
  }
}

export default UserResolver;
