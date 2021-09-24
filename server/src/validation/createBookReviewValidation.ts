import { BookRatingInput, ValidationResponse } from "../common/types";

const MINIMUM_RATING = 0;
const MAXIMUM_RATING = 5;

const registerValidation = ({
  rating,
}: BookRatingInput): ValidationResponse => {
  if (rating < MINIMUM_RATING || rating > MAXIMUM_RATING) {
    return [
      {
        field: "rating",
        message: "rating must be between 0 and 5 inclusive",
      },
    ];
  }

  return null;
};

export default registerValidation;
