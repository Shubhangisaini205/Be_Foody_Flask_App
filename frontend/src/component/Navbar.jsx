import React, { useState } from 'react';
import {
  Box,
  Flex,
  Link,
  Text,
  IconButton,
  Collapse,
  useDisclosure,
  useToast,
  VStack, // Add VStack from Chakra-UI
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';

const loginUser = JSON.parse(localStorage.getItem('user'));

const Navbar = () => {
  const { isOpen, onToggle } = useDisclosure();
  const [isMobileNavVisible, setMobileNavVisible] = useState(false);
  const toast = useToast();

  const handleToggle = () => {
    onToggle();
    setMobileNavVisible(!isMobileNavVisible);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    toast({
      title: 'Logged Out Successful',
      description: 'Come back Soon!!!',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    window.location = '/';
  };

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding="1rem"
      bg="red.600" // Set your catchy color here
      color="white"
      position="relative" // Add position relative to the navbar
    >
      {/* Website Name */}
      <Box>
        <Link href="/" _hover={{ textDecoration: 'none' }}>
          <Text fontSize="lg" fontWeight="bold">
            Be_Foody 🤤🤤
          </Text>
        </Link>
      </Box>

      {/* Mobile Menu (Collapsible) */}
      <Collapse in={isMobileNavVisible} animateOpacity>
        <Box
          pb={4}
          display={{ base: 'block', md: 'none' }}
          zIndex={999}
          position="absolute"
          top="100%"
          left={0}
          right={0}
          bg="red.500"
        >
          <VStack
            spacing={4}
            p={4}
            align="center"
            color="white"
            onClick={handleToggle} // Simplify onClick handler
          >
           
            <Link href="/" _hover={{ textDecoration: 'none' }}>
              Menu
            </Link>
            {loginUser ? (
              <>
                <Link href="/take-orders" _hover={{ textDecoration: 'none' }}>
                  Take Orders
                </Link>

                {loginUser.role === 'user' ? (
                  <Link href="/orders" _hover={{ textDecoration: 'none' }}>
                    Your Orders
                  </Link>
                ) : (
                  <Link href="/all-orders" _hover={{ textDecoration: 'none' }}>
                    All Orders
                  </Link>
                )}
              </>
            ) : (
              ''
            )}

            {loginUser ? (
              <Link href="#" _hover={{ textDecoration: 'none' }} onClick={handleLogout}>
                Logout
              </Link>
            ) : (
              <Link href="/login" _hover={{ textDecoration: 'none' }}>
                Login
              </Link>
            )}
            {!loginUser ? (
              <Link href="/signup" _hover={{ textDecoration: 'none' }}>
                Signup
              </Link>
            ) : (
              ''
            )}
          </VStack>
        </Box>
      </Collapse>

      {/* Hamburger Menu Icon (Mobile) */}
      <IconButton
        icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
        variant="ghost"
        display={{ base: 'block', md: 'none' }}
        colorScheme="white"
        onClick={handleToggle} // Simplify onClick handler
        fontSize="2rem"
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
            {loginUser.role === 'user' ? (
              <Link href="/orders" mr="4" _hover={{ textDecoration: 'none' }}>
                Your Orders
              </Link>
            ) : (
              <Link href="/all-orders" mr="4" _hover={{ textDecoration: 'none' }}>
                All Orders
              </Link>
            )}
          </>
        ) : (
          ''
        )}

        {loginUser ? (
          <Link href="#" mr="4" _hover={{ textDecoration: 'none' }} onClick={handleLogout}>
            Logout
          </Link>
        ) : (
          <Link href="/login" mr="4" _hover={{ textDecoration: 'none' }}>
            Login
          </Link>
        )}
        {!loginUser ? (
          <Link href="/signup" _hover={{ textDecoration: 'none' }}>
            Signup
          </Link>
        ) : (
          ''
        )}
      </Box>
    </Flex>
  );
};

export default Navbar;
