import React, { useState } from "react";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Box, SimpleGrid, Text } from "@chakra-ui/layout";
import { SubmitHandler, useForm } from "react-hook-form";
import { SearchIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/button";
import BookSearchCard from "../components/Book/BookSearchCard";
import { Book } from "../common/types";

interface SearchInput {
  searched: string;
}

interface JSON {
  items: Book[] | undefined;
}

const BookSearch = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isNotFound, setIsNotFound] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const handleSearch: SubmitHandler<SearchInput> = async ({ searched }) => {
    try {
      const trimmedSearch = searched.trim();
      const url = `https://www.googleapis.com/books/v1/volumes?q=${trimmedSearch}+intitle:${trimmedSearch}&maxResults=12&fields=kind,items(id,volumeInfo(title,authors,description,publishedDate,pageCount,infoLink,categories,publisher,imageLinks/thumbnail))`;

      const response = await fetch(url);
      const data: JSON = await response.json();

      if (data.items) {
        setBooks(data.items);
        setIsNotFound(false);
      } else {
        setBooks([]);
        setIsNotFound(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box my="8">
      <Box px="4">
        <form onSubmit={handleSubmit(handleSearch)}>
          <FormControl id="book-search">
            <FormLabel>Book</FormLabel>
            <Input
              type="text"
              {...register("searched")}
              placeholder="Enter a title..."
            />
          </FormControl>
          <Button
            leftIcon={<SearchIcon />}
            type="submit"
            mt="4"
            isLoading={isSubmitting}
          >
            Search
          </Button>
        </form>
      </Box>
      <Box mt="12">
        {!!books.length && (
          <Text mb="4" mx="4">
            Search results found:{" "}
          </Text>
        )}
        <SimpleGrid columns={{ sm: 2, md: 3 }}>
          {isNotFound
            ? "No Results Found"
            : books.map((book) => <BookSearchCard book={book} key={book.id} />)}
        </SimpleGrid>
      </Box>
    </Box>
  );
};

export default BookSearch;
