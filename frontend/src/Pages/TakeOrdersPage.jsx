import { useEffect, useState } from 'react';
import {
  Box,
  VStack,
  Grid,
  Image,
  Text,
  Checkbox,
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
} from '@chakra-ui/react';

const loginUser = JSON.parse(localStorage.getItem('user'));

function TakeOrderPage() {
  const [menu, setMenu] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [selectedDishes, setSelectedDishes] = useState([]);
  const toast = useToast();

  useEffect(() => {
    fetchMenu();
  }, []);

  async function fetchMenu() {
    try {
      const response = await fetch('http://localhost:11000/menu');
      const data = await response.json();
      const filteredMenu = data.data.menu.filter((dish) => dish.stock > 0); // Filter out dishes with stock less than 1
      setMenu(filteredMenu);
    } catch (error) {
      console.log(error);
    }
  }

  function handleCheckboxChange(dishId) {
    const isChecked = selectedDishes.includes(dishId);

    if (isChecked) {
      setSelectedDishes(selectedDishes.filter((id) => id !== dishId));
    } else {
      setSelectedDishes([...selectedDishes, dishId]);
    }
  }

  async function placeOrder() {
    if (!customerName || selectedDishes.length === 0) {
      toast({
        title: 'Incomplete Order',
        description: 'Please provide your name and select at least one dish.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const response = await fetch('http://localhost:11000/take-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer_name: customerName,
          dish_ids: selectedDishes,
          user_id: loginUser.user_id,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Order Placed',
          description: 'Your order has been placed successfully.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        setCustomerName('');
        setSelectedDishes([]);
      } else {
        toast({
          title: 'Error',
          description: data.error || 'An error occurred while placing the order.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        title: 'Error',
        description: 'An error occurred while placing the order.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  }

  return (
    <VStack w="90%" p={4} spacing={4} margin={"auto"}>
      <FormControl>
        <FormLabel htmlFor="customerName">Customer Name</FormLabel>
        <Input
          alignSelf="center"
          id="customerName"
          placeholder="Enter your name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />
      </FormControl>

      <Grid
        alignSelf="center"
        templateColumns={{ base: 'repeat(2, 1fr)', lg: 'repeat(7, 1fr)', md: 'repeat(6, 1fr)', sm: 'repeat(4, 1fr)' }}
        gap={4}
      >
        {menu.map((dish) => (
          <Box
            key={dish.dish_id}
            borderWidth="1px"
            borderRadius="md"
            p={2}
            gridColumn={{ base: 'span 1', md: 'auto' }}

          >
            <Box display="flex" justifyContent="center">
              <Image src={dish.dish_image} alt={dish.dish_name} boxSize={100} objectFit="cover" mb={1} />
            </Box>

            <Text fontWeight="bold" fontSize="md" mt={1}>
              {dish.dish_name}
            </Text>
            <Text>₹{dish.price}/-</Text>
            <Checkbox
              mt={1}
              isChecked={selectedDishes.includes(dish.dish_id)}
              onChange={() => handleCheckboxChange(dish.dish_id)}
            >
              Select
            </Checkbox>
          </Box>
        ))}
      </Grid>

      <Button colorScheme="red" mt={4} onClick={placeOrder}>
        Place Order
      </Button>
    </VStack>
  );
}

export default TakeOrderPage;
