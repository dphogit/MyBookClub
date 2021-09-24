import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { Box, Divider, Grid, Heading, Stack, Text } from "@chakra-ui/layout";
import { Book as BookType } from "../common/types";
import ImageDisplay from "../components/Book/ImageDisplay";
import {
  Link,
  Button,
  Tag,
  Modal,
  ModalOverlay,
  useDisclosure,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  FormControl,
  Select,
  FormLabel,
  FormHelperText,
  FormErrorMessage,
} from "@chakra-ui/react";
import parse from "react-html-parser";
import { AddIcon } from "@chakra-ui/icons";
import {
  useCreateBookReviewMutation,
  BookStatus,
  BookRatingInput,
} from "../generated/graphql";
import { SubmitHandler, useForm } from "react-hook-form";

interface Params {
  id: string;
}

type AddBookData = {
  status: BookStatus;
  rating: number | null;
};

const ADD_BOOK_REVIEW_FORM_ID = "add-book-review";

const Book = () => {
  const { id } = useParams<Params>();

  const [book, setBook] = useState<BookType | null>(null);

  const addBookToListRef = useRef<HTMLButtonElement>(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { isSubmitting, errors },
  } = useForm<AddBookData>();
  const watchSelectStatus = watch("status");

  const [createBookReviewMutation] = useCreateBookReviewMutation();

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

  useEffect(() => {
    if (watchSelectStatus === BookStatus.Plan) {
      setValue("rating", null);
    }
  }, [watchSelectStatus, setValue]);

  if (!book) {
    return <Heading>Loading...</Heading>;
  }

  const handleAddBookSubmit: SubmitHandler<AddBookData> = async (values) => {
    const bookRatingInput: BookRatingInput = {
      status: values.status,
      rating: values.rating ? +values.rating : null,
      title: book.volumeInfo.title,
      volumeId: book.id,
    };
    try {
      const createBookResponse = await createBookReviewMutation({
        variables: { input: bookRatingInput },
      });

      if (createBookResponse.data?.createBookRating.errors) {
        createBookResponse.data.createBookRating.errors.forEach(
          ({ field, message }) => {
            if (field === "rating" || field === "status") {
              setError(field, { message });
            }
          }
        );
        return;
      }

      console.log(
        "Added Book: " +
          JSON.stringify(createBookResponse.data?.createBookRating.item)
      );
      onClose();
    } catch (error) {
      console.error(error); // Not Authenticated catches here
    }
  };

  /*
   * TODO
   * Better UX of unauthenticated user should not be able to open modal.
   * Backend already prevent and error is handled.
   */
  return (
    <>
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
              onClick={onOpen}
              ref={addBookToListRef}
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
      <Modal
        finalFocusRef={addBookToListRef}
        isOpen={isOpen}
        onClose={onClose}
        size="xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{book.volumeInfo.title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form
              id={ADD_BOOK_REVIEW_FORM_ID}
              onSubmit={handleSubmit(handleAddBookSubmit)}
            >
              <FormControl isRequired my="4">
                <FormLabel>Status</FormLabel>
                <Select
                  placeholder="Select Status"
                  {...register("status", {
                    required: { value: true, message: "Status is required" },
                  })}
                >
                  <option value={BookStatus.Current}>Currently Reading</option>
                  <option value={BookStatus.Complete}>Completed</option>
                  <option value={BookStatus.Plan}>Plan to Read</option>
                  <option value={BookStatus.Hold}>On Hold</option>
                  <option value={BookStatus.Drop}>Dropped</option>
                </Select>
                {errors.rating && (
                  <FormErrorMessage>{errors.rating.message}</FormErrorMessage>
                )}
              </FormControl>
              <Divider />
              <FormControl my="4">
                <FormLabel>Overall Rating</FormLabel>
                <Select
                  placeholder="--"
                  {...register("rating")}
                  disabled={watchSelectStatus === BookStatus.Plan}
                >
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                  <option value={5}>5</option>
                </Select>
                {watchSelectStatus === BookStatus.Plan && (
                  <FormHelperText>
                    Your rating will not be submitted if your status is "Plan To
                    Read"
                  </FormHelperText>
                )}
                {errors.status && (
                  <FormErrorMessage>{errors.status.message}</FormErrorMessage>
                )}
              </FormControl>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="gray" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              type="submit"
              form={ADD_BOOK_REVIEW_FORM_ID}
              isLoading={isSubmitting}
            >
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Book;
