import { Link } from "@chakra-ui/layout";
import React from "react";
import { NavLink } from "react-router-dom";

interface NavLinkProps {
  path: string;
  children: React.ReactNode;
  onClick?: () => void;
}

const NavItem = ({ path, children, onClick }: NavLinkProps) => {
  return (
    <Link
      as={NavLink}
      color="whiteAlpha.900"
      mr="12"
      _active={{ fontWeight: "bold" }}
      _activeLink={{ fontWeight: "bold" }}
      style={{ textUnderlineOffset: "0.375rem" }}
      to={path}
      exact
      onClick={onClick}
    >
      {children}
    </Link>
  );
};

export default NavItem;
