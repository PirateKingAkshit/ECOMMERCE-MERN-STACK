import React, { useEffect, useState } from 'react';
import { Box, Text, Image, Button, Toast, useToast, Spinner, Flex } from '@chakra-ui/react';
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { CartState } from '../../context/CartProvider';
import { UserState } from '../../context/UserProvider';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Cart = () => {

  const{fetchCart,increaseQuantity,decreaseQuantity,removeFromCart,cartTotal,cart,setCart,SHIPPING_CHARGES,loading}=CartState()
  const { user } = UserState();
  const toast = useToast();
   
  const navigate = useNavigate();

  useEffect(() => {
   fetchCart();
 }, [user]);
  
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
        <>
          {cart.length > 0 ? (
            <Box
              mt={5}
              display="flex"
              justifyContent="space-around"
              alignItems="start"
              width="100%"
              padding="5px"
            >
              {/* Cart Summary */}
              <Box
                width="65%"
                height="fit-content"
                padding="15px"
                boxShadow="md"
                backgroundColor="aqua"
                borderRadius="5px"
              >
                <Text fontSize="xl" mb="15px">
                  Cart Summary
                </Text>
                {cart.map((item) => (
                  <Box
                    key={item.product._id}
                    display="flex"
                    justifyContent="space-around"
                    width="100%"
                    marginBottom="20px"
                    boxShadow="md"
                    backgroundColor="white"
                    borderRadius="5px"
                  >
                    <Image
                      src={item.product.image}
                      alt=""
                      boxSize="150px"
                      borderRadius="10px"
                      padding="10px 0px"
                      onClick={() => navigate(`/product/${item.product._id}`)}
                    />
                    <Box width="50%" height="fit-content">
                      <Text fontSize="20px" fontWeight="bold">
                        {item.product.name}
                      </Text>
                      <Text color="blueviolet" fontSize="20px">
                        ${item.product.price}
                      </Text>
                    </Box>
                    <Box
                      display="flex"
                      flexDirection="column"
                      justifyContent="space-evenly"
                    >
                      <Box display="flex" alignItems="center">
                        <Button
                          size="sm"
                          onClick={() => decreaseQuantity(item.product._id)}
                          disabled={item.quantity === 1}
                        >
                          <RemoveIcon />
                        </Button>
                        <Text fontSize="30px" color="blue">
                          {item.quantity}
                        </Text>
                        <Button
                          size="sm"
                          onClick={() => increaseQuantity(item.product._id)}
                          disabled={item.quantity === 5}
                        >
                          <AddIcon />
                        </Button>
                      </Box>
                      <Button
                        onClick={() => removeFromCart(item.product._id)}
                        colorScheme="messenger"
                        width={"100%"}
                      >
                        Remove
                      </Button>
                    </Box>
                  </Box>
                ))}
              </Box>

              {/* Payment Summary */}
              <Box
                width="25%"
                position="sticky"
                top="20px"
                padding="10px"
                boxShadow="lg"
                backgroundColor="white"
                borderRadius="5px"
              >
                <Text fontSize="xl">Payment Summary</Text>
                {/* Subtotal */}
                <Text>
                  Subtotal:{" "}
                  <span style={{ color: "blue" }}>${cartTotal()}</span>
                </Text>
                {/* Shipping Fee */}
                <Text>
                  Shipping Fee:{" "}
                  <span style={{ color: "blue" }}>${SHIPPING_CHARGES}</span>
                </Text>
                <Box borderBottom="1px solid #ccc" my="2" />
                {/* Total */}
                <Text>
                  Total:{" "}
                  <span style={{ color: "blue" }}>
                    ${cartTotal() + SHIPPING_CHARGES}
                  </span>
                </Text>
                <Box borderBottom="1px solid #ccc" my="2" />
                <Button
                  colorScheme="messenger"
                  width={"100%"}
                  onClick={() => orderHandler()}
                >
                  Order
                </Button>
              </Box>
            </Box>
          ) : (
            <Box textAlign="center">
              <Text>Your Cart Is Empty</Text>
              <Button colorScheme="blue" mt="4" onClick={() => navigate("/")}>
                Go to Main Page
              </Button>
            </Box>
          )}
        </>
      )}
    </>
  );
};

export default Cart;



 
