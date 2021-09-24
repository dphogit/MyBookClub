import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Box, Divider, Grid, Heading, Stack, Text } from "@chakra-ui/layout";
import { Book as BookType } from "../common/types";
import ImageDisplay from "../components/Book/ImageDisplay";
import { Link, Button, Tag } from "@chakra-ui/react";
import parse from "react-html-parser";
import { AddIcon } from "@chakra-ui/icons";

interface Params {
  id: string;
}

const Book = () => {
  const { id } = useParams<Params>();
  const [book, setBook] = useState<BookType | null>(null);

  const handleAddBookToList = () => {
    // TODO Implement
    alert("Adding Book To List...");
  };

  useEffect(() => {
    const url = `https://www.googleapis.com/books/v1/volumes/${id}?fields=id,volumeInfo(title,authors,description,publishedDate,pageCount,infoLink,categories,publisher,imageLinks/thumbnail)`;

    try {
      fetch(url).then(async (res) => {
        const data: BookType = await res.json();

        console.log(data);
        setBook(data);
      });
    } catch (error) {
      console.log(error);
    }
  }, [id]);

  if (!book) {
    return <Heading>Loading...</Heading>;
  }

  return (
    <Box rounded="lg" boxShadow="xl" my="16" p="8">
      <Box>
        <Heading mb="4" isTruncated maxW="100%">
          {book.volumeInfo.title}
        </Heading>
        <Text fontSize="xl">
          {book.volumeInfo.authors
            ? book.volumeInfo.authors[0]
            : "Unknown Author"}
        </Text>
      </Box>
      <Divider my="8" />
      <Grid templateColumns="25% 75%">
        <Stack w="100%" spacing="6">
          <Link
            href={book.volumeInfo.infoLink}
            target="_blank"
            rel="noreferrer"
            w="100%"
          >
            <Box w="100%">
              <ImageDisplay imageLinks={book.volumeInfo.imageLinks} />
            </Box>
          </Link>
          <Button
            w="100%"
            colorScheme="blue"
            rightIcon={<AddIcon />}
            onClick={handleAddBookToList}
          >
            Add To Read List
          </Button>
        </Stack>
        <Stack ml="12" px="8" flexGrow={2} spacing="4">
          {!!book.volumeInfo.categories && (
            <Box>
              {book.volumeInfo.categories?.map((category) => (
                <Tag key={category} colorScheme="blue">
                  {category}
                </Tag>
              ))}
            </Box>
          )}
          <Box>{parse(book.volumeInfo.description)}</Box>
        </Stack>
      </Grid>
    </Box>
  );
};

export default Book;
