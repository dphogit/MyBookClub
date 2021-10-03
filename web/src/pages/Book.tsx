import React, { useEffect, useRef, useState } from "react";
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
  Select,
  FormHelperText,
  ButtonProps,
  useToast,
  Box,
  Divider,
  Grid,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";
import { AddIcon, EditIcon, LockIcon } from "@chakra-ui/icons";
import {
  useCreateBookRatingMutation,
  BookStatus,
  BookRatingInput,
  useMeQuery,
  useGetBookRatingQuery,
  GetBookRatingDocument,
  GetBookRatingQuery,
  useEditBookRatingMutation,
  useDeleteBookRatingMutation,
} from "../generated/graphql";
import { ApolloCache } from "@apollo/client";
import { useParams } from "react-router";
import { SubmitHandler, useForm } from "react-hook-form";
import parse from "react-html-parser";
import sanitzeHtml from "sanitize-html";
import { useFetch } from "../hooks";
import { getBookByVolumeIdURL, successToastOptions } from "../common/util";
import { statuses, ratings } from "../common/data/options";
import {
  Book as BookType,
  BookResponseItem,
  ResponseError,
} from "../common/types";
import {
  ModalFormControl,
  ModalSelectOptions,
  ImageDisplay,
} from "../components";

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
  // HOOKS
  const { id: volumeId } = useParams<Params>();
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

  // MUTATION HOOKS
  const [createBookRatingMutation] = useCreateBookRatingMutation();
  const [editBookRatingMutation] = useEditBookRatingMutation();
  const [deleteBookRatingMutation] = useDeleteBookRatingMutation();

  // QUERY HOOKS
  const { data: meData, loading: meLoading } = useMeQuery();
  const { data: bookRatingData } = useGetBookRatingQuery({
    variables: {
      volumeId,
    },
  });

  const {
    state: { data: book, error, isLoading },
  } = useFetch<BookType>(getBookByVolumeIdURL(volumeId));

  useEffect(() => {
    // User already has rated, if this is the case they must also be authenticated
    // Preset the modal values here
    if (bookRatingData?.getBookRating) {
      setReviewState("EDIT");
      setValue("status", bookRatingData.getBookRating.status);
      setValue("rating", bookRatingData.getBookRating.rating as number | null);
      return;
    }

    // User is authenticated and has not rated, will need to rate to add to list
    if (meData?.me) {
      setReviewState("ADD");
    }
  }, [bookRatingData, meData, setValue]);

  // Watch for changes to the status user cannot submit a rating score when book is being planned to read
  useEffect(() => {
    if (watchSelectStatus === BookStatus.Plan) {
      setValue("rating", null);
    }
  }, [watchSelectStatus, setValue]);

  if (error) {
    return <Heading>Error Occured</Heading>;
  }

  if (isLoading || !book) {
    return <Heading>Loading...</Heading>;
  }

  const handleUserValidationErrors = (
    responseErrors: ResponseError[],
    volumeIdMsg: string
  ) => {
    responseErrors.forEach(({ field, message }) => {
      if (field === "rating" || field === "status") {
        // console.log(errors);
        setError(field, { message });
      }
      if (field === "volumeId") {
        throw new Error(volumeIdMsg);
      }
    });
  };

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
            if (data && data.createBookRating.item) {
              writeQueryToCache(cache, data.createBookRating.item); // Update the cache to immediately reflect changes upon opening modal
            }
          },
        });

        // Server side validation of user errors
        if (createBookResponse.data?.createBookRating.errors) {
          handleUserValidationErrors(
            createBookResponse.data.createBookRating.errors,
            "VolumeId already exists in your list"
          );
          return;
        }

        console.log("Added: ", createBookResponse.data?.createBookRating.item);
      } else if (reviewState === "EDIT") {
        const editBookResponse = await editBookRatingMutation({
          variables: { editInput: bookRatingInput },
          update: (cache, { data }) => {
            if (data && data.editBookRating.item) {
              writeQueryToCache(cache, data.editBookRating.item); // Update the cache to immediately reflect changes upon opening modal
            }
          },
        });

        // Server side validation of user errors
        if (editBookResponse.data?.editBookRating.errors) {
          handleUserValidationErrors(
            editBookResponse.data.editBookRating.errors,
            "No book with that volumeId can be found on your list"
          );
          return;
        }

        console.log("Edited: ", editBookResponse.data?.editBookRating.item);
      }

      const toastTitle =
        reviewState === "ADD" ? "Rating added" : "Rating edited";
      toast(successToastOptions(toastTitle, "We've saved your rating"));
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

    toast(successToastOptions("Rating removed", "We've removed your rating"));
    console.log("Removed: ", volumeId);
    onClose();
  };

  const writeQueryToCache = (
    cache: ApolloCache<any>,
    item: BookResponseItem
  ) => {
    cache.writeQuery<GetBookRatingQuery>({
      query: GetBookRatingDocument,
      variables: { volumeId },
      data: {
        getBookRating: {
          ...item,
          __typename: "BookRating",
        },
      },
    });
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
              <ModalFormControl
                label="Status"
                isRequired
                errorMessage={errors.status?.message}
              >
                <Select
                  placeholder="Select Status"
                  {...register("status", {
                    required: { value: true, message: "Status is required" },
                  })}
                >
                  <ModalSelectOptions options={statuses} />
                </Select>
              </ModalFormControl>
              <Divider />
              <ModalFormControl
                isRequired={false}
                label="Overall Rating"
                errorMessage={errors.rating?.message}
              >
                <Select
                  defaultValue={1}
                  {...register("rating")}
                  disabled={watchSelectStatus === BookStatus.Plan}
                >
                  <ModalSelectOptions options={ratings} />
                </Select>
                {watchSelectStatus === BookStatus.Plan && (
                  <FormHelperText>
                    Your rating will not be submitted if your status is "Plan To
                    Read"
                  </FormHelperText>
                )}
              </ModalFormControl>
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
