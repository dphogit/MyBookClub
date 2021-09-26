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
  ButtonProps,
  useToast,
} from "@chakra-ui/react";
import parse from "react-html-parser";
import { AddIcon, EditIcon, LockIcon } from "@chakra-ui/icons";
import {
  useCreateBookRatingMutation,
  BookStatus,
  BookRatingInput,
  useMeQuery,
  useGetBookRatingQuery,
} from "../generated/graphql";
import { SubmitHandler, useForm } from "react-hook-form";
import sanitzeHtml from "sanitize-html";
import {
  useEditBookRatingMutation,
  useDeleteBookRatingMutation,
} from "../generated/graphql";
import {
  GetBookRatingDocument,
  GetBookRatingQuery,
} from "../generated/graphql";

interface Params {
  id: string;
}

type AddBookData = {
  status: BookStatus;
  rating: number | null;
};

type ReviewState = "UNAUTHENTICATED" | "EDIT" | "ADD";

const ADD_BOOK_REVIEW_FORM_ID = "add-book-review";

const Book = () => {
  const { id: volumeId } = useParams<Params>();

  const [book, setBook] = useState<BookType | null>(null);
  const [reviewState, setReviewState] =
    useState<ReviewState>("UNAUTHENTICATED");

  const openModalRef = useRef<HTMLButtonElement>(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const toast = useToast();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<AddBookData>();
  const watchSelectStatus = watch("status");

  const [createBookRatingMutation] = useCreateBookRatingMutation();
  const [editBookRatingMutation] = useEditBookRatingMutation();
  const [deleteBookRatingMutation] = useDeleteBookRatingMutation();

  const { data: meData, loading: meLoading } = useMeQuery();
  const { data: bookRatingData } = useGetBookRatingQuery({
    variables: {
      volumeId,
    },
  });

  useEffect(() => {
    const url = `https://www.googleapis.com/books/v1/volumes/${volumeId}?fields=id,volumeInfo(title,authors,description,publishedDate,pageCount,infoLink,categories,publisher,imageLinks/thumbnail)`;

    try {
      fetch(url).then(async (res) => {
        const data: BookType = await res.json();

        console.log(data);
        setBook(data);
      });
    } catch (error) {
      console.error(error);
    }
  }, [volumeId]);

  useEffect(() => {
    // User already has rated, if this is the case they must also be authenticated
    if (bookRatingData?.getBookRating) {
      setReviewState("EDIT"); // Preset the modal values here
      setValue("status", bookRatingData.getBookRating.status);
      setValue("rating", bookRatingData.getBookRating.rating as number | null);
      return;
    }

    // User is authenticated and has not rated, will need to rate to add to list
    if (meData?.me) {
      setReviewState("ADD");
    }
  }, [bookRatingData, meData, setValue]);

  useEffect(() => {
    if (watchSelectStatus === BookStatus.Plan) {
      setValue("rating", null);
    }
  }, [watchSelectStatus, setValue]);

  if (!book) {
    return <Heading>Loading...</Heading>;
  }

  const handleReviewSubmit: SubmitHandler<AddBookData> = async (values) => {
    const bookRatingInput: BookRatingInput = {
      status: values.status,
      rating: values.rating ? +values.rating : null,
      title: book.volumeInfo.title,
      volumeId: book.id,
    };

    try {
      if (reviewState === "ADD") {
        const createBookResponse = await createBookRatingMutation({
          variables: { input: bookRatingInput },
          update: (cache, { data }) => {
            // Update the cache to immediately show changes on modal button
            if (!data || !data.createBookRating.item) {
              return;
            }

            cache.writeQuery<GetBookRatingQuery>({
              query: GetBookRatingDocument,
              variables: { volumeId },
              data: {
                getBookRating: {
                  ...data.createBookRating.item,
                  __typename: "BookRating",
                },
              },
            });
          },
        });

        // Server side validation of user errors
        if (createBookResponse.data?.createBookRating.errors) {
          createBookResponse.data.createBookRating.errors.forEach(
            ({ field, message }) => {
              if (field === "rating" || field === "status") {
                setError(field, { message });
              }
              if (field === "volumeId") {
                // Client side should protect this error from occuring
                throw new Error("VolumeId already exists in your list");
              }
            }
          );
          return;
        }

        console.log("Added: ", createBookResponse.data?.createBookRating.item);
      } else if (reviewState === "EDIT") {
        const editBookResponse = await editBookRatingMutation({
          variables: { editInput: bookRatingInput },
          update: (cache, { data }) => {
            // Update the cache to immediately reflect changes upon opening modal
            if (!data || !data.editBookRating.item) {
              return;
            }

            cache.writeQuery<GetBookRatingQuery>({
              query: GetBookRatingDocument,
              variables: { volumeId },
              data: {
                getBookRating: {
                  ...data.editBookRating.item,
                  __typename: "BookRating",
                },
              },
            });
          },
        });

        // Server side validation of user errors
        if (editBookResponse.data?.editBookRating.errors) {
          editBookResponse.data.editBookRating.errors.forEach(
            ({ field, message }) => {
              if (field === "rating" || field === "status") {
                setError(field, { message });
              }
              if (field === "volumeId") {
                // Client side should protect this error from occuring
                throw new Error(
                  "No book with that volumeId can be found on your list"
                );
              }
            }
          );
          return;
        }

        console.log("Edited: ", editBookResponse.data?.editBookRating.item);
      }

      // Successfully saved review
      toast({
        title: reviewState === "ADD" ? "Rating added" : "Rating edited",
        description: "We've saved your rating",
        duration: 9000,
        position: "bottom",
        status: "success",
        isClosable: true,
      });
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    await deleteBookRatingMutation({
      variables: { volumeId },
      update: (cache) => {
        cache.evict({
          id: "ROOT_QUERY",
          fieldName: "getBookRating",
          args: { volumeId },
        });
        cache.gc();
      },
    });

    reset({ rating: null, status: undefined }); // Reset the values of the form

    toast({
      title: "Rating removed",
      description: "We've removed your rating",
      duration: 9000,
      position: "bottom",
      status: "success",
      isClosable: true,
    });
    console.log("Removed: ", volumeId);
    onClose();
  };

  // Adapt button depending on what their review status of the book is.
  let openModalBtnProps: ButtonProps;
  switch (reviewState) {
    case "UNAUTHENTICATED":
      openModalBtnProps = {
        children: "Sign In To Add",
        rightIcon: <LockIcon />,
        disabled: true,
      };
      break;
    case "ADD":
      openModalBtnProps = {
        children: "Add To Read List",
        rightIcon: <AddIcon />,
      };
      break;
    case "EDIT":
      openModalBtnProps = {
        children: "Edit My Review",
        rightIcon: <EditIcon />,
      };
      break;
    default:
      console.log("Error is here");
      throw new Error("Review State Error"); // Should not reach here
  }

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
              onClick={onOpen}
              isLoading={meLoading}
              ref={openModalRef}
              {...openModalBtnProps}
            />
          </Stack>
          <Stack ml="12" px="8" flexGrow={2} spacing="4">
            {!!book.volumeInfo.categories && (
              <Box>
                {book.volumeInfo.categories?.map((category) => (
                  <Tag key={category} colorScheme="blue" mb="3" mr="3">
                    {category}
                  </Tag>
                ))}
              </Box>
            )}
            <Box>{parse(sanitzeHtml(book.volumeInfo.description))}</Box>
          </Stack>
        </Grid>
      </Box>
      <Modal
        finalFocusRef={openModalRef}
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
              onSubmit={handleSubmit(handleReviewSubmit)}
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
            {reviewState === "EDIT" && (
              <Button colorScheme="red" mr="auto" onClick={handleDelete}>
                Delete
              </Button>
            )}
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
