import React from "react";
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
} from "@chakra-ui/form-control";

interface ModalFormControlProps {
  label: string;
  children: React.ReactNode;
  errorMessage?: string;
  isRequired: boolean;
}

const ModalFormControl = ({
  label,
  children,
  errorMessage,
  isRequired,
}: ModalFormControlProps) => {
  return (
    <FormControl my="4" isRequired={isRequired}>
      <FormLabel>{label}</FormLabel>
      {children}
      {errorMessage && <FormErrorMessage>{errorMessage}</FormErrorMessage>}
    </FormControl>
  );
};

export default ModalFormControl;
