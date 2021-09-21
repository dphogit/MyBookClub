import React, { useState } from "react";
import { Button } from "@chakra-ui/button";
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
} from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Box, Center, Heading, Text } from "@chakra-ui/layout";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  useLoginMutation,
  MeQuery,
  MeDocument,
  useRegisterMutation,
} from "../generated/graphql";
import { useHistory } from "react-router";

// https://www.w3resource.com/javascript/form/email-validation.php
const EMAIL_REGEX = /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/;
const MIN_LENGTH_PASSWORD = 4;

type AuthFormData = {
  email: string;
  password: string;
};

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [successRegisterMsg, setSuccessRegisterMsg] = useState("");

  const history = useHistory();

  const {
    register,
    handleSubmit,
    setFocus,
    setError,
    formState: { isSubmitting, errors },
  } = useForm<AuthFormData>();

  const [loginMutation] = useLoginMutation();
  const [registerMutation] = useRegisterMutation();

  const handleLogin = async (values: AuthFormData) => {
    const loginResponse = await loginMutation({
      variables: values,
      update: (cache, { data }) => {
        cache.writeQuery<MeQuery>({
          query: MeDocument,
          data: {
            me: data?.login.user,
          },
        });
      },
    });

    // Handle server validation errors
    if (loginResponse.data?.login.errors) {
      loginResponse.data.login.errors.forEach(({ field, message }) => {
        if (field === "email" || field === "password") {
          setError(field, { message });
        }
      });
      return;
    }

    // Successful login => Redirect to home page
    console.log("Successful Sign In");
    history.push("/reviews");
  };

  const handleRegister = async (values: AuthFormData) => {
    const registerResponse = await registerMutation({
      variables: values,
    });

    // Handle server validation errors
    if (registerResponse.data?.register.errors) {
      registerResponse.data.register.errors.forEach(({ field, message }) => {
        if (field === "email" || field === "password") {
          setError(field, { message });
        }
      });
      return;
    }

    // Successful register => toggle to login with same values and display sucess message
    handleToggleForm();
    setSuccessRegisterMsg("Successful Register! Login with new account.");
  };

  const handleToggleForm = () => {
    setIsLogin((prevMode) => !prevMode);
    setFocus("email");
    setSuccessRegisterMsg("");
  };

  const handleAuthSubmit: SubmitHandler<AuthFormData> = async (values) => {
    if (isLogin) {
      await handleLogin(values);
      return;
    }

    await handleRegister(values);
  };

  return (
    <Center mt="16" id="auth-form">
      <Box w="80%">
        <Heading mb="4" align="center">
          {isLogin ? "Login" : "Register"}
        </Heading>
        <Center height="12" p="5">
          <Button
            variant="link"
            onClick={handleToggleForm}
            align="center"
            _hover={{ fontSize: "lg", color: "blue.700" }}
          >
            {isLogin
              ? "Don't have an account? Register."
              : "Already have an account? Login."}
          </Button>
        </Center>
        {successRegisterMsg && (
          <Text
            align="center"
            py="2"
            my="2"
            bgColor="green.300"
            color="green.800"
          >
            {successRegisterMsg}
          </Text>
        )}
        <form onSubmit={handleSubmit(handleAuthSubmit)}>
          <FormControl isRequired mb="4" isInvalid={!!errors.email}>
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input
              id="email"
              placeholder="Enter your email"
              type="email"
              autoFocus
              {...register("email", {
                required: { value: true, message: "Email cannot be empty" },
                pattern: {
                  value: EMAIL_REGEX,
                  message: "Please enter a valid email",
                },
              })}
            />
            <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
          </FormControl>
          <FormControl isRequired mb="4" isInvalid={!!errors.password}>
            <FormLabel htmlFor="password">Password</FormLabel>
            <Input
              id="password"
              placeholder="Enter your password"
              type="password"
              {...register("password", {
                required: { value: true, message: "Password cannot be empty" },
                minLength: {
                  value: MIN_LENGTH_PASSWORD,
                  message: isLogin
                    ? "Incorrect password"
                    : `Password must be at least ${MIN_LENGTH_PASSWORD} characters`,
                },
              })}
            />
            <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
          </FormControl>
          <Button
            colorScheme="blue"
            mt="4"
            isLoading={isSubmitting}
            type="submit"
          >
            {isLogin ? "Login" : "Register"}
          </Button>
        </form>
      </Box>
    </Center>
  );
};

export default Auth;
