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
import bookRatingValidation from "../validation/bookRatingValidation";

@ObjectType()
class BookRatingResponse extends ResolverResponse(BookRating) {}

@Resolver(() => BookRating)
class BookRatingResolver {
  @Query(() => BookRating, { nullable: true })
  async getBookRating(
    @Ctx() { req }: CustomContext,
    @Arg("volumeId") volumeId: string
  ): Promise<BookRating | null> {
    try {
      if (!req.session.userId) {
        return null;
      }

      const bookRating = await BookRating.findOne({
        where: { creatorId: req.session.userId, volumeId },
      });
      if (!bookRating) {
        return null;
      }

      return bookRating;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  @Mutation(() => BookRatingResponse)
  @UseMiddleware(isAuthenticated)
  async createBookRating(
    @Arg("bookRatingInput", () => BookRatingInput)
    bookRatingInput: BookRatingInput,
    @Ctx() { req, googleBooks }: CustomContext
  ): Promise<BookRatingResponse> {
    let bookRating: BookRating | undefined;

    // Validate input
    const errors = bookRatingValidation(bookRatingInput);
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

  @Mutation(() => BookRatingResponse)
  @UseMiddleware(isAuthenticated)
  async editBookRating(
    @Ctx() { req }: CustomContext,
    @Arg("bookRatingInput") bookRatingInput: BookRatingInput
  ): Promise<BookRatingResponse> {
    let bookRating: BookRating | undefined;

    const errors = bookRatingValidation(bookRatingInput);
    if (errors) {
      return { errors };
    }

    try {
      // Validate input
      const ratingFound = await BookRating.findOne({
        where: {
          volumeId: bookRatingInput.volumeId,
          creatorId: req.session.userId,
        },
      });

      if (!ratingFound) {
        return {
          errors: [
            {
              field: "volumeId",
              message:
                "book rating with that volume id for user could not be found",
            },
          ],
        };
      }

      ratingFound.rating = bookRatingInput.rating;
      ratingFound.status = bookRatingInput.status;
      ratingFound.title = bookRatingInput.title;

      bookRating = await ratingFound.save();
    } catch (error) {
      console.error(error);
    }

    return { item: bookRating };
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuthenticated)
  async deleteBookRating(
    @Arg("volumeId") volumeId: string,
    @Ctx() { req }: CustomContext
  ): Promise<boolean> {
    try {
      const bookRating = await BookRating.findOne({
        where: { volumeId, creatorId: req.session.userId },
      });

      if (!bookRating) {
        return false;
      }

      if (bookRating.creatorId !== req.session.userId) {
        throw new Error("Unauthorized");
      }

      await BookRating.delete({ volumeId, creatorId: req.session.userId });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}

export default BookRatingResolver;
