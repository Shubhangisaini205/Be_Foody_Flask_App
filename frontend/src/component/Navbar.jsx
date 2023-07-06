import React, { useState } from 'react';
import { Box, Flex, Link, Text, IconButton, Collapse, useDisclosure } from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
const loginUser = JSON.parse(localStorage.getItem("user"))
const Navbar = () => {
  const { isOpen, onToggle } = useDisclosure();
  const [isMobileNavVisible, setMobileNavVisible] = useState(false);

  const handleToggle = () => {
    setMobileNavVisible(!isMobileNavVisible);
  };
  console.log(loginUser)
  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding="1rem"
      bg="red.600" // Set your catchy color here
      color="white"
    >
      {/* Website Name */}
      <Box>
        <Link href="#" _hover={{ textDecoration: 'none' }}>
          <Text fontSize="lg" fontWeight="bold">
            Be_Foody 🤤🤤
          </Text>
        </Link>
      </Box>

      {/* Hamburger Menu Icon (Mobile) */}
      <IconButton
        icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
        variant="ghost"
        display={{ base: 'block', md: 'none' }}
        colorScheme='white'
        onClick={() => {
          onToggle();
          handleToggle();
        }}
        fontSize={"2rem"}
        aria-label="Toggle navigation"
      />

      {/* Navigation Links (Desktop) */}
      <Box display={{ base: 'none', md: 'flex' }}>
        <Link href="/" mr="4" _hover={{ textDecoration: 'none' }}>
          Menu
        </Link>
        {loginUser ? (
        <>
          <Link href="/take-orders" mr="4" _hover={{ textDecoration: 'none' }}>
          Take Orders
        </Link>

        <Link href="/orders" mr="4" _hover={{ textDecoration: 'none' }}>
          Orders
        </Link>
        {loginUser.role === "admin"? <Link href="/all-orders" mr="4" _hover={{ textDecoration: 'none' }}>
          All Orders
        </Link>:""}
        </>
      ):""}
        
       
        
        <Link href="/login" mr="4" _hover={{ textDecoration: 'none' }}>
          Login
        </Link>
        <Link href="/signup" _hover={{ textDecoration: 'none' }}>
          Signup
        </Link>
      </Box>

      {/* Mobile Menu (Collapsible) */}
      <Collapse in={isMobileNavVisible} animateOpacity>
        <Box pb={4} display={{ base: 'block', md: 'none' }}>
          <Link href="/" mr="4" _hover={{ textDecoration: 'none' }}>
            Menu
          </Link>
          {loginUser ? (
        <>
          <Link href="/take-orders" mr="4" _hover={{ textDecoration: 'none' }}>
          Take Orders
        </Link>

        <Link href="/orders" mr="4" _hover={{ textDecoration: 'none' }}>
          Orders
        </Link>
        {loginUser.role === "admin"? <Link href="/all-orders" mr="4" _hover={{ textDecoration: 'none' }}>
          All Orders
        </Link>:""}
        </>
      ):""}
        
          <Link href="/login" mr="4" _hover={{ textDecoration: 'none' }}>
            Login
          </Link>
          <Link href="/signup" _hover={{ textDecoration: 'none' }}>
            Signup
          </Link>
        </Box>
      </Collapse>
    </Flex>
  );
};

export default Navbar;
