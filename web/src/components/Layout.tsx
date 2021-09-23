import React from "react";
import { Container } from "@chakra-ui/layout";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <Container maxWidth="container.lg">{children}</Container>;
};

export default Layout;
