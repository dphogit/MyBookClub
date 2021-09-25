import {
  Arg,
  Ctx,
  Mutation,
  Resolver,
  UseMiddleware,
  ObjectType,
  Query,
} from "type-graphql";
import {
  CustomContext,
  BookRatingInput,
  ResolverResponse,
} from "../common/types";
import BookRating from "../entity/BookRating";
import isAuthenticated from "../middleware/isAuthenticated";
import createBookReviewValidation from "../validation/createBookReviewValidation";

@ObjectType()
class BookRatingResponse extends ResolverResponse(BookRating) {}

@Resolver(() => BookRating)
class BookRatingResolver {
  @Mutation(() => BookRatingResponse)
  @UseMiddleware(isAuthenticated)
  async createBookRating(
    @Arg("bookRatingInput", () => BookRatingInput)
    bookRatingInput: BookRatingInput,
    @Ctx() { req, googleBooks }: CustomContext
  ): Promise<BookRatingResponse> {
    let bookRating: BookRating | undefined;

    // Validate input
    const errors = createBookReviewValidation(bookRatingInput);
    if (errors) {
      return { errors };
    }

    try {
      // Check if the volumeId already exists in the database and belongs to the user
      const foundBookRating = await BookRating.findOne({
        where: { volumeId: bookRatingInput.volumeId },
      });
      if (foundBookRating?.creatorId === req.session.userId) {
        return {
          errors: [
            {
              field: "volumeId",
              message: "rating with that volumeId already exists in your list",
            },
          ],
        };
      }

      // Check if the volumeId is a valid/registered one in Google Books API
      // Will throw error with code 503 if not valid
      await googleBooks.volumes.get({
        volumeId: bookRatingInput.volumeId,
        projection: "lite", // restricts the data retrieved for performance
      });

      bookRating = await BookRating.create({
        ...bookRatingInput,
        creatorId: req.session.userId,
      }).save();
    } catch (error) {
      if (error.code === 503) {
        return {
          errors: [
            {
              field: "volumeId",
              message: "not a registered or valid volume id",
            },
          ],
        };
      }

      console.error(error);
    }

    return { item: bookRating };
  }

  @Query(() => Boolean)
  async haveIRatedAlready(
    @Ctx() { req }: CustomContext,
    @Arg("volumeId") volumeId: string
  ): Promise<boolean> {
    if (!req.session.id) {
      return false; // User may not be logged in
    }

    try {
      // Find a book and turn it into boolean. Found => True, Not Found => False
      return !!(await BookRating.findOne({
        where: { volumeId: volumeId, creatorId: req.session.userId },
      }));
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}

export default BookRatingResolver;
