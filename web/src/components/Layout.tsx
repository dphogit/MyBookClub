import React from "react";
import { Container } from "@chakra-ui/layout";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <Container maxWidth="container.md">{children}</Container>;
};

export default Layout;
