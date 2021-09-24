import React from "react";
import { Box, Flex, Spacer, Heading } from "@chakra-ui/layout";
import NavItem from "./NavItem";
import { useMeQuery, useLogoutMutation } from "../../generated/graphql";
import { useApolloClient } from "@apollo/client";
import { useHistory } from "react-router";
import {
  Menu,
  MenuButton,
  Button,
  MenuList,
  MenuGroup,
  MenuItem,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";

const Navigation = () => {
  const apolloClient = useApolloClient();

  const history = useHistory();

  const { data, loading } = useMeQuery();
  const [logoutMutation] = useLogoutMutation();

  const handleLogout = async () => {
    await logoutMutation();
    await apolloClient.resetStore();
    history.push("/authenticate");
  };

  let authenticatedNavItems;
  if (loading) {
    authenticatedNavItems = null; // Executing/Processing the query
  }

  if (data?.me) {
    // User is logged in
    authenticatedNavItems = (
      <>
        <Menu isLazy>
          <MenuButton px="4" as={Button} rightIcon={<ChevronDownIcon />}>
            Profile
          </MenuButton>
          <MenuList>
            <MenuGroup title={data.me.email}>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </MenuGroup>
          </MenuList>
        </Menu>
      </>
    );
  } else {
    // User is not logged in
    authenticatedNavItems = (
      <NavItem path="/authenticate">Login / Register</NavItem>
    );
  }

  return (
    <Flex align="center" width="100%" bgColor="blue.600" px="24" py="5">
      <Box>
        <Heading color="whiteAlpha.900" size="lg">
          MyBookClub
        </Heading>
      </Box>

      <Spacer />
      <Flex mr="24" alignItems="center">
        <NavItem path="/books">Reviews</NavItem>
        {authenticatedNavItems}
      </Flex>
    </Flex>
  );
};

export default Navigation;
