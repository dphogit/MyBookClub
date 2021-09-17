import { FieldError } from "../common/types";

interface RegisterInput {
  email: string;
  password: string;
}

type RegisterValidationResponse = FieldError[] | null;

const MINIMUM_PASSWORD_LENGTH = 4;

const registerValidation = ({
  email,
  password,
}: RegisterInput): RegisterValidationResponse => {
  if (!email.includes("@")) {
    return [
      {
        field: "email",
        message: "invalid email",
      },
    ];
  }

  if (password.length < MINIMUM_PASSWORD_LENGTH) {
    return [
      {
        field: "password",
        message: `password must be at least ${MINIMUM_PASSWORD_LENGTH} characters long`,
      },
    ];
  }

  return null;
};

export default registerValidation;
