import React, { useEffect, useState } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, Heading, Box, Container, VStack } from '@chakra-ui/react';

function OrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      const response = await fetch('http://localhost:11000/review-orders');
      const data = await response.json();
      console.log(data);
      setOrders(data.data.orders);
    } catch (error) {
      console.log(error);
    }
  }

  function getStatusColor(status) {
    switch (status) {
      case 'received':
        return 'gray.200';
      case 'preparing':
        return 'orange.200';
      case 'ready To Pick':
        return 'pink.300';
      case 'delivered':
        return 'teal.400';
      default:
        return 'white';
    }
  }

  return (
    <Box bg="gray.50" py={10}>
      <Container maxW="container.lg">
        <VStack spacing={6} align="center">
          <Heading as="h1" color="red.500" fontSize={{ base: '2xl', md: '3xl' }}>
            Order Page
          </Heading>
          <Table variant="simple">
            <Thead bg="red.500">
              <Tr>
                <Th color="white">Order ID</Th>
                <Th color="white">Customer Name</Th>
                <Th color="white">Dish IDs</Th>
                <Th color="white">Dish Names</Th>
                <Th color="white">Total Price</Th>
                <Th color="white">Status</Th>
              </Tr>
            </Thead>
            <Tbody>
  {orders.map((order) => (
    <Tr key={order.order_id} bg={getStatusColor(order.status)}>
      <Td>{order.order_id}</Td>
      <Td>{order.customer_name}</Td>
      <Td>
        <VStack align="start" spacing={1}>
          {order.dish_ids.map((dishId) => (
            <li key={dishId}>{dishId}</li>
          ))}
        </VStack>
      </Td>
      <Td>
        <VStack align="start" spacing={1}>
          {order.name.map((dish) => (
            <Box key={dish.dish_id}>{dish}</Box>
          ))}
        </VStack>
      </Td>
      <Td>{order.total_price}</Td>
      <Td>{order.status}</Td>
      
    </Tr>
  ))}
</Tbody>
          </Table>
        </VStack>
      </Container>
    </Box>
  );
}

export default OrdersPage;
