import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Heading, Input, Select, useToast } from '@chakra-ui/react';
import {useNavigate} from "react-router-dom"
const SignupPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [email, setEmail] = useState('');
    const toast = useToast();
    const navigate = useNavigate()


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:11000/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password, role, email }),
            });

            if (response.ok) {
                // Signup successful
                let data = await response.json()
                console.log(data)
                toast({
                    title: 'Signup Successful',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                  });
                  navigate("/login")
            } else {
                // Handle signup error
                const errorData = await response.json();
                console.log('Signup error:', errorData.error);
                toast({
                    title: 'Signup Error',
                    description: errorData.error,
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                  });
            }
        } catch (error) {
            console.error('Error:', error);
            toast({
                title: 'Error',
                description: error.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
              });
        }
    };

    return (
        <Box maxW="sm" mx="auto" mt={8} p={4} borderWidth={1} borderColor="red.600" borderRadius="md">
            <Heading as="h2" mb={4} textAlign="center">
                Signup
            </Heading>
            <form onSubmit={handleSubmit}>
                <FormControl id="username" mb={4}>
                    <FormLabel>Username:</FormLabel>
                    <Input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        variant="outline"
                    />
                </FormControl>
                <FormControl id="email" mb={4}>
                    <FormLabel>Email:</FormLabel>
                    <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        variant="outline"
                    />
                </FormControl>
                <FormControl id="password" mb={4}>
                    <FormLabel>Password:</FormLabel>
                    <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        variant="outline"
                    />
                </FormControl>
                <FormControl id="role" mb={4}>
                    <FormLabel>Role:</FormLabel>
                    <Select value={role} onChange={(e) => setRole(e.target.value)} variant="outline">
                        <option value="">Select Role</option>
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                    </Select>
                </FormControl>

                <Button type="submit" colorScheme="red" size="lg" w="100%">
                    Sign Up
                </Button>
            </form>
        </Box>
    );
};

export default SignupPage;
