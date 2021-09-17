import { Resolver, Arg, Mutation, Query } from "type-graphql";

import User from "../entity/User";

@Resolver()
class UserResolver {
  @Query(() => String)
  async hello() {
    return "Hello Book Club!";
  }

  @Mutation(() => Boolean)
  async register(
    @Arg("email") email: string,
    @Arg("password") password: string
  ) {
    try {
      await User.insert({ email, password });
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}

export default UserResolver;
