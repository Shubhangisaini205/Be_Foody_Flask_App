import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const toast = useToast();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:11000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      let data = await response.json();
      console.log(data);

      // Store user details except password in local storage
      localStorage.setItem('user', JSON.stringify(data.user));

      toast({
        title: 'Login Successful',
        description: 'You have successfully logged in.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Navigate to menu page
      window.location="/"

      // Perform any additional logic after successful login
    } catch (err) {
      setError(err.message);
      toast({
        title: 'Login Error',
        description: err.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      console.log(err);
    }
  };

  return (
    <Box
      maxW="sm"
      mx="auto"
      mt={8}
      p={4}
      borderWidth={1}
      borderColor="red.600"
      borderRadius="md"
    >
      <Heading as="h2" mb={4} textAlign="center">
        Login
      </Heading>
      <FormControl isInvalid={error}>
        <FormLabel>Email:</FormLabel>
        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <FormLabel mt={2}>Password:</FormLabel>
        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <FormErrorMessage>{error}</FormErrorMessage>
        <Button colorScheme="red" mt={4} onClick={handleLogin}>
          Login
        </Button>
      </FormControl>
    </Box>
  );
};

export default LoginPage;
