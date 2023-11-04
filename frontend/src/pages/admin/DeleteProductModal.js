import React, { useState } from 'react'
import { UserState } from '../../context/UserProvider';
import {  Button, HStack, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure, useToast } from '@chakra-ui/react';
import axios from 'axios';

const DeleteProductModal = ({ children,item }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
    const { user } = UserState();
    const [loading, setLoading] = useState(false);

    const handleProductDelete = async () => {
        
        try {
          setLoading(true);
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
          await axios.delete(
            `http://localhost:8080/api/products/${item._id}`,
            config
          );
          toast({
            title: "Product Deleted",
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
          <ModalHeader>Delete Product</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb="4" fontWeight={"semibold"}>Are you sure you want to delete this item?</Text>
          </ModalBody>
          <ModalFooter>
            <HStack>
              <Button colorScheme="red" onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="blue"
                onClick={() => handleProductDelete()}
                isLoading={loading}
              >
                Yes
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default DeleteProductModal