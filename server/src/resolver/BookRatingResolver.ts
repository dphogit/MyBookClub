import {
  Arg,
  Ctx,
  // Field,
  Mutation,
  Resolver,
  UseMiddleware,
  ObjectType,
} from "type-graphql";
import {
  CustomContext,
  // FieldError,
  BookRatingInput,
  ResolverResponse,
} from "../common/types";
import BookRating from "../entity/BookRating";
import isAuthenticated from "../middleware/isAuthenticated";
import createBookReviewValidation from "../validation/createBookReviewValidation";

// @ObjectType()
// class BookRatingResponse {
//   @Field(() => [FieldError], { nullable: true })
//   errors?: FieldError[];

//   @Field(() => BookRating, { nullable: true })
//   bookRating?: BookRating;
// }

@ObjectType()
class BookRatingResponse extends ResolverResponse(BookRating) {}

@Resolver()
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
      // Check if the volumeId already exists in the database
      const foundBookRating = await BookRating.findOne({
        where: { volumeId: bookRatingInput.volumeId },
      });
      if (foundBookRating) {
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
}

export default BookRatingResolver;
