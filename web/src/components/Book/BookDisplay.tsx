import React from "react";
import { Box, Flex, Heading, Stack, Text } from "@chakra-ui/layout";
import { BookData } from "../../common/types";
import ImageDisplay from "./ImageDisplay";

interface BookDisplayProps {
  bookData: BookData;
}

const BookDisplay = ({ bookData }: BookDisplayProps) => {
  return (
    <Flex rounded="lg" boxShadow="xl" margin="4">
      <Stack direction="column" p="4" w="60%" justifyContent="center">
        <Heading fontSize="1rem" isTruncated>
          {bookData.title}
        </Heading>
        <Text fontSize="0.75rem">
          {bookData.authors ? bookData.authors[0] : "Unknown Author"}
        </Text>
      </Stack>
      <Box w="40%">
        <ImageDisplay imageLinks={bookData.imageLinks} />
      </Box>
    </Flex>
  );
};

export default BookDisplay;
