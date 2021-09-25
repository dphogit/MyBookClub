import { Resolver, Arg, Mutation, Query, ObjectType, Ctx } from "type-graphql";
import { hash, verify } from "argon2";

import User from "../entity/User";
import { CustomContext, ResolverResponse } from "../common/types";
import registerValidation from "../validation/registerValidation";
import { getRepository } from "typeorm";
import { COOKIE_NAME } from "../common/constants";

@ObjectType()
class UserResponse extends ResolverResponse(User) {}

@Resolver(() => User)
class UserResolver {
  // TODO Once usernames are added, need to change to a field resolver for email
  // so other users cannot see/request other peoples email.
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

    return { item: user };
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

    let user: User | undefined = undefined;

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
      user = await User.create({ email, password: hashedPassword }).save();
    } catch (error) {
      console.error(error);
    }

    return { item: user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() { req }: CustomContext
  ): Promise<UserResponse> {
    let user: User | undefined = undefined;

    try {
      // Password field in entity been config to not return password for security
      // We use query builder to be able to get the password column
      const userFound = await getRepository(User)
        .createQueryBuilder("user")
        .where("user.email = :email", { email })
        .select(["id", "password", "email"])
        .getRawOne();

      if (!userFound) {
        return {
          errors: [
            {
              field: "email",
              message: "No user with that email",
            },
          ],
        };
      }

      const isPasswordCorrect = await verify(userFound.password, password);
      if (!isPasswordCorrect) {
        return {
          errors: [
            {
              field: "password",
              message: "Password incorrect",
            },
          ],
        };
      }

      user = userFound;
      req.session.userId = userFound.id;
    } catch (error) {
      console.error(error);
    }

    return { item: user };
  }

  @Query(() => User, { nullable: true })
  me(@Ctx() { req }: CustomContext) {
    const { userId } = req.session;

    if (!userId) {
      return null;
    }
    return User.findOne(userId);
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: CustomContext) {
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        res.clearCookie(COOKIE_NAME);
        if (err) {
          console.log(err);
          resolve(false);
          return;
        }

        resolve(true);
      })
    );
  }
}

export default UserResolver;
