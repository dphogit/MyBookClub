import React from "react";
import {
  Box,
  Flex,
  Heading,
  LinkBox,
  LinkOverlay,
  Stack,
  Text,
} from "@chakra-ui/layout";
import { Book } from "../../common/types";
import ImageDisplay from "./ImageDisplay";
import { Link } from "react-router-dom";

interface BookSearchCardProps {
  book: Book;
}

const BookSearchCard = ({ book }: BookSearchCardProps) => {
  const {
    id,
    volumeInfo: { title, authors, imageLinks },
  } = book;

  return (
    <LinkBox as="div">
      <Flex rounded="lg" boxShadow="xl" margin="4">
        <Stack direction="column" p="4" w="60%" justifyContent="center">
          <LinkOverlay as={Link} to={`/reviews/${id}`}>
            <Heading fontSize="1rem" isTruncated>
              {title}
            </Heading>
          </LinkOverlay>
          <Text fontSize="0.75rem">
            {authors ? authors[0] : "Unknown Author"}
          </Text>
        </Stack>
        <Box w="40%">
          <ImageDisplay imageLinks={imageLinks} />
        </Box>
      </Flex>
    </LinkBox>
  );
};

export default BookSearchCard;
