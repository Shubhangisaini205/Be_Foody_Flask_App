import { useState } from 'react';
import { Box, Button, FormControl, FormErrorMessage, FormLabel, Input, Text } from '@chakra-ui/react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  console.log({ email, password })
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
      
      let data = await response.json()
      console.log(data)
      

      // Perform any additional logic after successful login
    } catch (err) {
      setError(error.message);
      console.log(err)
    }
  };

  return (
    <Box maxW="sm" mx="auto" mt={8} p={4}>
      <Text fontSize="xl" color="red.600" mb={4}>
        Login Page
      </Text>
      <FormControl isInvalid={error}>
        <FormLabel>Email</FormLabel>
        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <FormLabel mt={2}>Password</FormLabel>
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
