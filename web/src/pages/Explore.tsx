import React, { useEffect, useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Box,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { SubmitHandler, useForm } from "react-hook-form";
import { Book, SearchedSessionStorage } from "../common/types";
import {
  getSearchedSessionStorage,
  setSearchedSessionStorage,
  getSearchedBookTitlesURL,
} from "../common/util";
import { BookSearchCard } from "../components";

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
    setValue,
    formState: { isSubmitting },
  } = useForm<SearchInput>();

  useEffect(() => {
    // See session storage to see if the user is intending to
    // navigate to what they searched before (e.g. pressing back)
    // Note: storage is cleared when pressed on the nav link
    const stored = getSearchedSessionStorage();
    if (stored) {
      const data: SearchedSessionStorage = JSON.parse(stored);
      setBooks(data.books);
      setValue("searched", data.query);
    }
  }, [setValue]);

  const handleSearch: SubmitHandler<SearchInput> = async ({ searched }) => {
    try {
      const response = await fetch(getSearchedBookTitlesURL(searched));
      const data: JSON = await response.json();

      if (data.items) {
        setBooks(data.items);
        setIsNotFound(false);

        setSearchedSessionStorage({
          books: data.items,
          query: searched.trim(),
        });
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
