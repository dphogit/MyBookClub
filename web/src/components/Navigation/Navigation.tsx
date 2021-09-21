import React from "react";
import { Box, Flex, Spacer, Heading } from "@chakra-ui/layout";
import NavItem from "./NavItem";
import { useMeQuery, useLogoutMutation } from "../../generated/graphql";
import { Button } from "@chakra-ui/button";
import { useApolloClient } from "@apollo/client";
import { useHistory } from "react-router";

const Navigation = () => {
  const apolloClient = useApolloClient();

  const history = useHistory();

  const { data, loading: meLoading } = useMeQuery();
  const [logoutMutation, { loading: logoutLoading }] = useLogoutMutation();

  const handleLogout = async () => {
    await logoutMutation();
    await apolloClient.resetStore();
    history.push("/authenticate");
  };

  let authNavItems;
  if (meLoading) {
    authNavItems = null; // Executing/Processing the query
  }

  if (data?.me) {
    // User is logged in
    authNavItems = (
      <>
        <NavItem path="/reviews/new">New Review</NavItem>
        <Box color="whiteAlpha.900" mr="12">
          {data.me.email}
        </Box>
        <Button
          variant="link"
          color="whiteAlpha.900"
          fontWeight="normal"
          style={{ textUnderlineOffset: "0.375rem" }}
          isLoading={logoutLoading}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </>
    );
  } else {
    // User is not logged in
    authNavItems = <NavItem path="/authenticate">Login / Register</NavItem>;
  }

  return (
    <Flex align="center" width="100%" backgroundColor="blue.600" px="24" py="5">
      <Box>
        <Heading color="whiteAlpha.900" size="lg">
          MyBookClub
        </Heading>
      </Box>

      <Spacer />
      <Flex mr="24">
        <NavItem path="/reviews">Reviews</NavItem>
        {authNavItems}
      </Flex>
    </Flex>
  );
};

export default Navigation;
