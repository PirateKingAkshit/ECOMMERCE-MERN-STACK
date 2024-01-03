import React, { useEffect, useState } from 'react';
import { Box, Text, Image, Button, Toast, useToast, Spinner, Flex, HStack, Divider, IconButton, VStack } from '@chakra-ui/react';
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { CartState } from '../../context/CartProvider';
import { UserState } from '../../context/UserProvider';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Cart = () => {

  const{fetchCart,increaseQuantity,decreaseQuantity,removeFromCart,cartTotal,cart,setCart,SHIPPING_CHARGES,loading,cartLength}=CartState()
  const { user } = UserState();
  const toast = useToast();
   
  const navigate = useNavigate();

//   useEffect(() => {
//    fetchCart();
//  }, [user]);
  
    const orderHandler = async() => {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
      try {
        const { data } = await axios.post("http://localhost:8080/api/orders", { user: user._id, cart: cart, address: user.address, }, config)
        if (data) {
          navigate("/orders");
          toast({
            title: `Order Succesfull`,
            status: "success",
            duration: 2000,
            isClosable: true,
            position: "top",
          })

          setCart([]);

          localStorage.removeItem("cart");
          await axios.put(
            "http://localhost:8080/api/cart/update",
            {
              items: [],
            },
            config
          );
          
        }
      }
      catch (error) {
        console.log(error)
      }
      
      
    }

  return (
    <>
      {loading ? (
        <Flex align="center" justify="center" h="100vh">
          <Spinner w="80px" h="80px" color="teal.500" />
        </Flex>
      ) : (
        <Box px={10} py={2}>
          {cart.length > 0 ? (
            <Box
              display="flex"
              w="100%"
              padding={0}
              boxShadow="0 4px 20px rgba(0, 0, 0, 0.1)"
            >
              <Box width="70%" px={5}>
                <HStack w="100%" py={4} justifyContent="space-between">
                  <Text fontSize="larger" fontWeight="bold">
                    Shopping Carts
                  </Text>
                  <Text fontWeight="bold">{cartLength} Items</Text>
                </HStack>
                <Divider bg="black" h="1px" w="100%" />
                <HStack mb={5}>
                  <Text color="grey" w="45%" fontWeight="semibold">
                    Product Details
                  </Text>
                  <Text
                    textAlign="center"
                    color="grey"
                    w="21%"
                    fontWeight="semibold"
                  >
                    Quantity
                  </Text>
                  <Text
                    textAlign="center"
                    color="grey"
                    w="17%"
                    fontWeight="semibold"
                  >
                    Price
                  </Text>
                  <Text
                    textAlign="center"
                    color="grey"
                    w="17%"
                    fontWeight="semibold"
                  >
                    Total
                  </Text>
                </HStack>
                <div className='orders_scroll' style={{width:"100%", height:"400px", overflowY:"auto"}} >
                  {cart.map((item) => (
                    <HStack key={item.product._id} p={1} mb={5}>
                      <Box w="45%">
                        <Box display="flex" w="100%">
                          <Image
                            w="40%"
                            h="150px"
                            src={item.product.image}
                            borderRadius={5}
                            mr={2}
                          />
                          <VStack justifyContent="space-around" w="40%">
                            <Text fontWeight="bold" mr="auto">{item.product.name}</Text>
                            <Text fontSize="sm" color="gray" mr="auto">
                               Category: {item.product.category.name}
                            </Text>
                            <Text cursor="pointer" color="gray" mr="auto" onClick={() => removeFromCart(item.product._id)}>
                              Remove
                            </Text>
                          </VStack>
                        </Box>
                      </Box>
                      <Box w="21%">
                        <HStack w="100%" justifyContent="space-around">
                          <IconButton
                            size="sm"
                            icon={<RemoveIcon />}
                            onClick={() => decreaseQuantity(item.product._id)}
                            disabled={item.quantity === 1}
                          />
                          <Box borderWidth={2} borderColor="wheat">
                            <Text textAlign="center" w="30px">
                              {item.quantity}
                            </Text>
                          </Box>
                          <IconButton
                            size="sm"
                            icon={<AddIcon />}
                            onClick={() => increaseQuantity(item.product._id)}
                            disabled={item.quantity === 5}
                          />
                        </HStack>
                      </Box>
                      <Box w="17%">
                        <Text textAlign="center" fontSize="20px">
                          ${item.product.price}
                        </Text>
                      </Box>
                      <Box w="17%">
                        <Text textAlign="center" fontSize="20px">
                          ${item.product.price * item.quantity}
                        </Text>
                      </Box>
                    </HStack>
                  ))}
                </div>
              </Box>

              <Box width="30%" py={4} px={6} bg="whitesmoke">
                <Text fontSize="larger" mb={4} fontWeight="bold">
                  Order Summary 
                </Text>
                <Divider bg="black" h="1px" mb={10} />
                <HStack w="100%" justifyContent="space-between" mb={10}>
                  <Text fontWeight="bold">ITEMS {cartLength}</Text>
                  <Text color="lightslategray" fontWeight="semibold">
                    ${cartTotal()}
                  </Text>
                </HStack>
                <HStack w="100%" mb={10} justifyContent="space-between">
                  <Text fontWeight="bold">SHIPPING</Text>
                  <Text color="lightslategray" fontWeight="semibold">
                    ${SHIPPING_CHARGES}
                  </Text>
                </HStack>
                <Divider h="2px" bg="black" mb={10} />
                <HStack w="100%" mb={10} justifyContent="space-between">
                  <Text fontWeight="bold">TOTAL COST</Text>
                  <Text color="lightslategray" fontWeight="semibold">
                    ${cartTotal() + SHIPPING_CHARGES}
                  </Text>
                </HStack>
                <Button
                  colorScheme="messenger"
                  width={"100%"}
                  onClick={() => orderHandler()}
                  position="inherit"
                >
                  Order
                </Button>
              </Box>
            </Box>
          ) : (
            <Box textAlign="center">
              <Text>Your Cart Is Empty</Text>
              <Button colorScheme="blue" mt="4" onClick={() => navigate("/products")}>
                Buy Products
              </Button>
            </Box>
          )}
        </Box>
      )}
    </>
  );
};

export default Cart;



 
