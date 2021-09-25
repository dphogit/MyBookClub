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
  useCreateBookReviewMutation,
  BookStatus,
  BookRatingInput,
  HaveIRatedBookYetDocument,
} from "../generated/graphql";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  useMeQuery,
  useHaveIRatedBookYetQuery,
  HaveIRatedBookYetQuery,
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
    formState: { isSubmitting, errors },
  } = useForm<AddBookData>();
  const watchSelectStatus = watch("status");

  const [createBookReviewMutation] = useCreateBookReviewMutation();
  const { data: meData, loading: meLoading } = useMeQuery();
  const { data: ratedYetData } = useHaveIRatedBookYetQuery({
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
    if (meData?.me && ratedYetData) {
      ratedYetData.haveIRatedAlready
        ? setReviewState("EDIT")
        : setReviewState("ADD");
    }
    // TODO Implement Edit Mode, Need To Load Existing Data And Set The Value Of Forms
  }, [meData, ratedYetData]);

  useEffect(() => {
    if (watchSelectStatus === BookStatus.Plan) {
      setValue("rating", null);
    }
  }, [watchSelectStatus, setValue]);

  if (!book) {
    return <Heading>Loading...</Heading>;
  }

  const handleAddBookSubmit: SubmitHandler<AddBookData> = async (values) => {
    // TODO Check For Editing Mode And Adapt Query And Response Handle Here
    const bookRatingInput: BookRatingInput = {
      status: values.status,
      rating: values.rating ? +values.rating : null,
      title: book.volumeInfo.title,
      volumeId: book.id,
    };
    try {
      const createBookResponse = await createBookReviewMutation({
        variables: { input: bookRatingInput },
        update: (cache) => {
          // Update the cache to immediately show changes on modal button
          cache.writeQuery<HaveIRatedBookYetQuery>({
            query: HaveIRatedBookYetDocument,
            variables: { volumeId },
            data: {
              haveIRatedAlready: true,
            },
          });
          console.log(cache);
        },
      });

      // Validation of user errors
      if (createBookResponse.data?.createBookRating.errors) {
        createBookResponse.data.createBookRating.errors.forEach(
          ({ field, message }) => {
            if (field === "rating" || field === "status") {
              setError(field, { message });
            }
            if (field === "volumeId") {
              throw new Error("VolumeId already exists in your list");
            }
          }
        );
        return;
      }

      // Successfully added review
      toast({
        title: "Review added",
        description: "We've saved your review",
        duration: 5000,
        position: "bottom",
        status: "success",
        isClosable: true,
      });

      console.log(
        "Added Book: " +
          JSON.stringify(createBookResponse.data?.createBookRating.item)
      );
      onClose();
    } catch (error) {
      console.error(error);
    }
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
            {/* TODO Text Is Not Sanitized And Comes Straight From API */}
            <Box>{parse(book.volumeInfo.description)}</Box>
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
