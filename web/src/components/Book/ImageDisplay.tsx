import React from "react";
import { Center, Text } from "@chakra-ui/layout";
import { Image } from "@chakra-ui/image";

interface ImageDisplayProps {
  imageLinks?: {
    thumbnail: string;
  };
}

const ImageDisplay = ({ imageLinks }: ImageDisplayProps) => {
  const dimensions = { height: "100%", width: "100%" };

  return imageLinks ? (
    <Image
      src={imageLinks.thumbnail}
      alt={imageLinks.thumbnail}
      {...dimensions}
    />
  ) : (
    <Center bgColor="gray.400" {...dimensions} px="4">
      <Text>No Preview Image</Text>
    </Center>
  );
};

export default ImageDisplay;
