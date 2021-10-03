import {
  BookRatingInput,
  ValidationResponse,
  BookStatus,
} from "../common/types";

const MINIMUM_RATING = 1;
const MAXIMUM_RATING = 5;

const registerValidation = ({
  rating,
  status,
}: BookRatingInput): ValidationResponse => {
  if (
    status != BookStatus.PLAN &&
    (rating < MINIMUM_RATING || rating > MAXIMUM_RATING)
  ) {
    return [
      {
        field: "rating",
        message: `rating must be between ${MINIMUM_RATING} and ${MAXIMUM_RATING} inclusive`,
      },
    ];
  }

  if (status === BookStatus.PLAN && rating) {
    return [
      {
        field: "status",
        message: "cannot give rating of show that has not been read yet",
      },
    ];
  }

  return null;
};

export default registerValidation;
