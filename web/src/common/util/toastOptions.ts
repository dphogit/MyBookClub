import { UseToastOptions } from "@chakra-ui/toast";

export const successToastOptions = (
  title: string,
  description: string
): UseToastOptions | undefined => {
  return {
    title,
    description,
    duration: 9000,
    position: "bottom",
    status: "success",
    isClosable: true,
  };
};
