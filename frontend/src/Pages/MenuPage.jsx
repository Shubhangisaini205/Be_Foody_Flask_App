import React, { useEffect, useState } from 'react';
import {
  Box,
  Image,
  Text,
  VStack,
  Grid,
  Button,
  Spacer,
  HStack,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
} from '@chakra-ui/react';
import { DeleteIcon, EditIcon, AddIcon } from '@chakra-ui/icons';

function MenuPage() {
  const [menu, setMenu] = useState([]);
  const [userRole, setUserRole] = useState('Admin');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedDish, setSelectedDish] = useState(null);
  const [editedDishName, setEditedDishName] = useState('');
  const [editedDishPrice, setEditedDishPrice] = useState(0);
  const [editedDishStock, setEditedDishStock] = useState(0);
  const [newDishName, setNewDishName] = useState('');
  const [newDishPrice, setNewDishPrice] = useState(0);
  const [newDishStock, setNewDishStock] = useState(0);
  const [newDishImage, setNewDishImage] = useState('');
  const [newDishId, setNewDishId] = useState(0);
  const toast = useToast();

  useEffect(() => {
    fetchMenu();
  }, []);

  async function fetchMenu() {
    try {
      const response = await fetch('http://localhost:11000/menu');
      const data = await response.json();
      setMenu(data);
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteDish(dishId) {
    try {
      const response = await fetch(`http://localhost:11000/delete-dish/${dishId}`, { method: 'DELETE' });
      const data = await response.json();
      console.log(data.message);
      fetchMenu(); // Refresh the menu after deleting the dish
      toast({
        title: 'Dish Deleted',
        description: 'The dish has been successfully deleted.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.log(error);
    }
  }

  function openEditModal(dish) {
    setSelectedDish(dish);
    setEditedDishName(dish.dish_name);
    setEditedDishPrice(dish.price);
    setEditedDishStock(dish.stock);
    setEditModalOpen(true);
  }

  function closeEditModal() {
    setSelectedDish(null);
    setEditedDishName('');
    setEditedDishPrice(0);
    setEditedDishStock(0);
    setEditModalOpen(false);
  }

  async function saveEditedDish() {
    try {
      const response = await fetch(`http://localhost:11000/update-dish/${selectedDish.dish_id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dish_name: editedDishName,
          price: editedDishPrice,
          stock: +editedDishStock,
        }),
      });
      const data = await response.json();
      console.log(data.message);
      fetchMenu(); // Refresh the menu after editing the dish
      toast({
        title: 'Dish Updated',
        description: 'The dish has been successfully updated.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      closeEditModal();
    } catch (error) {
      console.log(error);
    }
  }

  async function addDish() {
    try {
      const response = await fetch('http://localhost:11000/add-dish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dish_id: +newDishId,
          dish_name: newDishName,
          price: newDishPrice,
          stock: newDishStock,
          dish_image: newDishImage,
        }),
      });
      const data = await response.json();
      console.log(data.message);
      fetchMenu(); // Refresh the menu after adding the dish
      toast({
        title: 'Dish Added',
        description: 'The dish has been successfully added.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      closeAddModal();
    } catch (error) {
      console.log(error);
    }
  }

  function openAddModal() {
    setNewDishName('');
    setNewDishPrice(0);
    setNewDishStock(0);
    setNewDishImage('');
    setAddModalOpen(true);
  }

  function closeAddModal() {
    setAddModalOpen(false);
  }

  return (
    <Box w="80%" mx="auto" mt={"30px"}>
      <Grid
        templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }}
        gap={4}
        justifyContent="center"
      >
        {menu.map((dish) => (
          <Box
            key={dish.dish_id}
            borderWidth="1px"
            borderRadius="md"
            p={4}
            transition="transform 0.3s"
            _hover={{ transform: 'scale(1.05)' }}
            cursor="pointer"
            boxShadow="lg"
            overflow="hidden"
            position="relative"
          >
            <Image src={dish.dish_image} alt={dish.dish_name} h={200} objectFit="cover" mb={4} />
            <Text fontWeight="bold" fontSize="xl" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
              {dish.dish_name}
            </Text>
            <Text>₹{dish.price}/-</Text>
            <Text>{dish.availability === 'YES' ? 'In Stock' : 'Out of Stock'}</Text>

            {userRole === 'Admin' && (
              <HStack mt={4} spacing={2}>
                <Text>{dish.stock} in Stock</Text>
                <Button
                  colorScheme="red"
                  leftIcon={<DeleteIcon />}
                  onClick={() => deleteDish(dish.dish_id)}
                ></Button>
                <Button colorScheme="teal" leftIcon={<EditIcon />} onClick={() => openEditModal(dish)}></Button>
              </HStack>
            )}
          </Box>
        ))}
      </Grid>

      {/* Edit Modal */}
      {selectedDish && (
        <Modal isOpen={editModalOpen} onClose={closeEditModal}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Edit Dish</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl>
                <FormLabel>Dish Name</FormLabel>
                <Input value={editedDishName} onChange={(e) => setEditedDishName(e.target.value)} />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Price</FormLabel>
                <NumberInput value={editedDishPrice} onChange={(value) => setEditedDishPrice(value)} step={0.01}>
                  <NumberInputField />
                </NumberInput>
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Stock</FormLabel>
                <NumberInput value={editedDishStock} onChange={(value) => setEditedDishStock(value)} step={1}>
                  <NumberInputField />
                </NumberInput>
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={saveEditedDish}>
                Save
              </Button>
              <Button variant="ghost" onClick={closeEditModal}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}

      {/* Add Modal */}
      <Modal isOpen={addModalOpen} onClose={closeAddModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Dish</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mt={4}>
              <FormLabel>Dish Id</FormLabel>
              <NumberInput value={newDishId} onChange={(value) => setNewDishId(value)} step={1}>
                <NumberInputField />
              </NumberInput>
            </FormControl>
            <FormControl>
              <FormLabel>Dish Name</FormLabel>
              <Input value={newDishName} onChange={(e) => setNewDishName(e.target.value)} />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Image</FormLabel>
              <Input value={newDishImage} onChange={(e) => setNewDishImage(e.target.value)}></Input>
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Price</FormLabel>
              <NumberInput value={newDishPrice} onChange={(value) => setNewDishPrice(value)} step={0.01}>
                <NumberInputField />
              </NumberInput>
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Stock</FormLabel>
              <NumberInput value={newDishStock} onChange={(value) => setNewDishStock(value)} step={1}>
                <NumberInputField />
              </NumberInput>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={addDish}>
              Add
            </Button>
            <Button variant="ghost" onClick={closeAddModal}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Add Dish Button */}
      {userRole === 'Admin' && (
        <Button
          colorScheme="teal"
          size="lg"
          position="fixed"
          right="2rem"
          bottom="2rem"
          zIndex="10"
          onClick={openAddModal}
        >
          <AddIcon mr={2} /> Add Dish
        </Button>
      )}
    </Box>
  );
}

export default MenuPage;
