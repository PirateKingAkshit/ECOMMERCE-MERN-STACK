import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Text,
  Spinner,
  Image,
  useToast,
  Flex,
  VStack,
  HStack,
  Checkbox,
} from "@chakra-ui/react";
import axios from "axios";
import { UserState } from "../../context/UserProvider";
import { useNavigate } from "react-router-dom";

const Order = () => {
  const [order, setOrder] = useState([]);
  const { user } = UserState();
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const filterStatusOptions = ["Pending", "Shipped", "Delivered", "Cancelled"];
  const [selectedStatuses, setSelectedStatuses] = useState([]);

  useEffect(() => {
    fetchOrder();
  }, [user]);

  const fetchOrder = async () => {
    if (user && user.token) {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `http://localhost:8080/api/orders/user`,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        setOrder(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleCancelClick = async (orderId) => {
    try {
      setIsLoading(true);
      const { data } = await axios.put(
        "http://localhost:8080/api/orders/cancel",
        { orderId },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      toast({
        title: "Order Cancelled",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      setIsLoading(false);
      fetchOrder()
    } catch (error) {
      toast({
        title: "Error",
        status: "error",
        description: error.message,
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      setIsLoading(false);
    }
  };

  const handleCheckboxChange = (status) => {
    setSelectedStatuses((prevStatuses) => {
      if (prevStatuses.includes(status)) {
        return prevStatuses.filter((s) => s !== status);
      } else {
        return [...prevStatuses, status];
      }
    });
  };

  const filteredOrders = order.filter((orderItem) => {
    if (selectedStatuses.length === 0) {
      return true;
    }
    return selectedStatuses.includes(orderItem.status);
  });

  return (
    <Flex p={5} justify="space-between">
      <Box
        display={"flex"}
        flexDir={"column"}
        w="200px"
        h="200px"
        p="4"
        m={5}
        boxShadow="lg"
        borderRadius="5px"
        borderWidth={1}
      >
        <Text mb="2" fontWeight="bold">
          Filter by Status:
        </Text>
        {filterStatusOptions.map((status) => (
          <Checkbox
            key={status}
            onChange={() => handleCheckboxChange(status)}
            isChecked={selectedStatuses.includes(status)}
            position="inherit"
            mb="2"
          >
            {status}
          </Checkbox>
        ))}
      </Box>

      <Flex w="80%" direction="column">
        {loading ? (
          <Flex align="center" justify="center" h="100vh">
            <Spinner w="80px" h="80px" color="teal.500" />
          </Flex>
        ) : (
          <VStack spacing={4}>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <Box
                  key={order._id}
                  p={4}
                  w="100%"
                  borderWidth="1px"
                  borderRadius="md"
                  boxShadow="md"
                >
                  <HStack spacing={10} align="center">
                    <Box w="200px">
                      <Image
                        borderRadius="5px"
                        w="100%"
                        maxW="200px"
                        src={order.product.image}
                        alt={order.product.name}
                        onClick={() =>
                          navigate(`/product/${order.product._id}`)
                        }
                      />
                    </Box>
                    <VStack align="start" spacing={2}>
                      <Text fontWeight="bold" fontSize="xl">
                        Oorder Id: {order._id}
                      </Text>
                      <Text fontWeight="bold" fontSize="xl">
                        {order.product.name}
                      </Text>
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
                          mt={4}
                          onClick={() => handleCancelClick(order._id)}
                          position="inherit"
                        >
                          Cancel Order
                        </Button>
                      ) : null}
                    </VStack>
                    <VStack align="start">
                      <Text fontWeight="bold" fontSize="lg">
                        Delivery Address
                      </Text>
                      <Text fontWeight="bold">{order.user.name}</Text>
                      <Text>{order.address.houseNo}</Text>
                      <Text>{order.address.city}</Text>
                      <Text>{order.address.state}</Text>
                      <Text>
                        {order.address.zip} {order.address.country}
                      </Text>
                      <Text fontWeight="normal">
                        <span style={{ fontWeight: "bold" }}>
                          Phone Number:{" "}
                        </span>
                        {order.user.phoneNumber}
                      </Text>
                    </VStack>
                    {order.status === "Delivered" && (
                      <Box>
                        <Button
                          colorScheme="teal"
                          mt={4}
                          position="inherit"
                          onClick={() =>
                            navigate(`/review/${order.product._id}`)
                          }
                        >
                          Rate & Review Product
                        </Button>
                      </Box>
                    )}
                  </HStack>
                </Box>
              ))
            ) : (
              <VStack mt={8}>
                <Text fontSize="xl">No orders available.</Text>
                <Button colorScheme="teal" mt={4} onClick={() => navigate("/")}>
                  Go to Main Page
                </Button>
              </VStack>
            )}
          </VStack>
        )}
      </Flex>
    </Flex>
  );
};

export default Order;

