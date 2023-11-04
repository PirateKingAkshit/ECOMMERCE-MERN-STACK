import { Box, Button, Text, Spinner, Image, useToast } from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { UserState } from '../../context/UserProvider';
import { useNavigate } from 'react-router-dom';

const Order = () => {
  const [order, setOrder] = useState([])
  const { user } = UserState();
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate();
  const toast = useToast();
  
  useEffect(() => {
    fetchOrder();
  }, [user]);
  const fetchOrder = async () => {
    try {
      setLoading(true)
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get("http://localhost:8080/api/orders", config)
      setOrder(data)
      setLoading(false)
    }
    catch (error) {
      console.log(error)
    }
  }

   const handleCancelClick = async(orderId) => {
     
     try {
       setIsLoading(true)
       const config = {
         headers: {
           Authorization: `Bearer ${user.token}`,
         },
       };
       const { data } = await axios.put(
         "http://localhost:8080/api/orders/cancel",
         {orderId:orderId},
         config
       );

        toast({
          title: "Order Cancelled",
          status: "success",
          duration: 2000,
          isClosable: true,
          position: "top",
        });
       setIsLoading(false);
       setOrder(data)
      navigate("/")
     } catch (error) {
      toast({
        title: "Error",
        status: "error",
        description:error.message,
        duration: 2000,
        isClosable: true,
        position: "top",
      });
       setIsLoading(false)
     }
   };
  return (
    <>
      {loading ? (
        <>
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="black"
            size="xl"
            m={"200px 615px"}
            width={"100px"}
            height={"100px"}
          />
        </>
      ) : (
        <>
          {order.length > 0 ? (
              order.map((order) => {
              console.log(order)
              return (
                <Box
                  key={order._id}
                  m={3}
                  p="1"
                  display="flex"
                  borderWidth="2px"
                  height={"220px"}
                  borderRadius="md"
                >
                  <Box mr={"10px"}>
                    <Image
                      borderRadius="5px"
                      w={"150px"}
                      src={order.product.image}
                      onClick={() => navigate(`/product/${order.product._id}`)}
                    />
                  </Box>
                  <Box
                    display={"flex"}
                    flexDir={"column"}
                    justifyContent={"space-around"}
                  >
                    <Text fontWeight="bold">Order ID: {order._id}</Text>
                    {/* <Text>User ID: {order.user._id}</Text> */}
                    {/* <Text>Product ID: {order.product._id}</Text> */}
                    <Text>Item: {order.product.name}</Text>
                    <Text>Quantity: {order.quantity}</Text>
                    <Text>Total: ${order.total}</Text>
                    <Text>Status: {order.status}</Text>
                    <Text>
                      Ordered At: {new Date(order.createdAt).toLocaleString()}
                    </Text>
                    {order.status === "Pending" ||
                    order.status === "Shipped" ? (
                      <Button
                        isLoading={isLoading}
                        colorScheme="red"
                        mt="4"
                        onClick={() => handleCancelClick(order._id)}
                      >
                        Cancel Order
                      </Button>
                    ) : (
                      <></>
                    )}
                  </Box>
                </Box>
              );
            })
          ) : (
            <Box textAlign="center">
              <Text>No orders available.</Text>
              <Button
                colorScheme="blue"
                mt="4"
                onClick={() => navigate("/")}
              >
                Go to Main Page
              </Button>
            </Box>
          )}
        </>
      )}
    </>
  );
}

export default Order