import { Box, Button, FormControl, FormLabel, HStack, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Textarea, useDisclosure, useToast } from '@chakra-ui/react';
import axios from 'axios';
import React, { useState } from 'react'
import { UserState } from '../../context/UserProvider';

const UpdateProductModal = ({ children, item }) => {

    const { isOpen, onOpen, onClose } = useDisclosure();

    const [name, setName] = useState(item.name);
    const [description, setDescription] = useState(item.description);
    const [price, setPrice] = useState(item.price);
    const [stock, setStock] = useState(item.stock);
    const [image, setImage] = useState(item.image);
    const toast = useToast();
    const { user} = UserState();
    const [loading, setLoading] = useState(false);

    const handleNameChange = (e) => {
      setName(e.target.value);
    };

    const handleDescriptionChange = (e) => {
      setDescription(e.target.value);
    };

    const handlePriceChange = (e) => {
      setPrice(e.target.value);
    };

    const handleStockChange = (e) => {
      setStock(e.target.value);
    };

    const handleImageChange = (e) => {
      setImage(e.target.value);
    };
    

    const handleProductUpdate = async(e) => {
     try {
       setLoading(true);
       const config = {
         headers: {
           Authorization: `Bearer ${user.token}`,
         },
       };
       await axios.put(
         `http://localhost:8080/api/products/${item._id}`,
         {
           name,
           description,
           price,
           category: item.category._id,
           stock,
           image,
           brand:item.brand
         },
         config
       );
       toast({
         title: "Product Updated",
         status: "success",
         duration: 2000,
         isClosable: true,
         position: "top",
       });
         setLoading(false);
         window.location.reload();
       
     } catch (error) {
       toast({
         title: "Warning",
         description: error.response.data.error,
         status: "warning",
         duration: 2000,
         isClosable: true,
         position: "top",
       });
       setLoading(false);
     }
    }
    
  return (
    <>
      <span onClick={onOpen}>{children}</span>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Product</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <HStack>
              <Box>
                <FormControl id="name" isRequired>
                  <FormLabel>Name</FormLabel>
                  <Input
                    type="text"
                    name="name"
                    value={name}
                    onChange={handleNameChange}
                  />
                </FormControl>
              </Box>
              <Box>
                <FormControl id="price" isRequired>
                  <FormLabel>Price</FormLabel>
                  <Input
                    type="number"
                    name="price"
                    value={price}
                    onChange={handlePriceChange}
                  />
                </FormControl>
              </Box>
            </HStack>
            <FormControl id="description" isRequired>
              <FormLabel>Description</FormLabel>
              <Textarea
                name="description"
                value={description}
                onChange={handleDescriptionChange}
                size="lg"
              />
            </FormControl>
            <FormControl id="stock" isRequired>
              <FormLabel>Stock</FormLabel>
              <Input
                type="number"
                name="stock"
                value={stock}
                onChange={handleStockChange}
              />
            </FormControl>
            <FormControl id="image">
              <FormLabel>Image</FormLabel>
              <Input
                type="text"
                name="image"
                value={image}
                onChange={handleImageChange}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="green"
              type="submit"
              onClick={()=>handleProductUpdate()}
              isLoading={loading}
            >
              Update
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default UpdateProductModal