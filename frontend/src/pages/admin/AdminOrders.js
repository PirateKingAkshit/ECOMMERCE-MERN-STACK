import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Text,
  Spinner,
  Image,
  useToast,
  Select,
  Flex,
  Checkbox,
} from "@chakra-ui/react";
import axios from "axios";
import { UserState } from "../../context/UserProvider";
import { useNavigate } from "react-router-dom";

const AdminOrder = () => {
  const [order, setOrder] = useState([]);
  const { user } = UserState();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const statusOptions = ["Pending", "Shipped", "Delivered"];
  const filterStatusOptions = ["Pending", "Shipped", "Delivered", "Cancelled"];
  const [selectedStatuses, setSelectedStatuses] = useState([]);

  const fetchOrderForAdmin = async () => {
    if (user && user.token) {
      try {
        setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.get(
          "http://localhost:8080/api/orders/admin",
          config
        );
        setOrder(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    fetchOrderForAdmin();
  }, [user]);

  const handleStatusChange = async (orderId, currentStatus) => {
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "http://localhost:8080/api/orders/status/change",
        {
          orderId,
          currentStatus,
        },
        config
      );

      toast({
        title: `Order ${currentStatus}`,
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);

      fetchOrderForAdmin();
    } catch (error) {
      toast({
        title: "Error",
        status: "error",
        description: error.message,
        duration: 2000,
        isClosable: true,
        position: "top",
      });
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
    <Flex p={5} justifyContent="space-evenly">
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
            mb="2"
            position="inherit"
          >
            {status}
          </Checkbox>
        ))}
      </Box>

      <Box flex="1" ml="4">
        {loading ? (
          <Flex align="center" justify="center" h="100vh">
            <Spinner w="80px" h="80px" color="teal.500" />
          </Flex>
        ) : (
          <>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((orderItem) => (
                <Box
                  key={orderItem._id}
                  m={5}
                  p="3"
                  display="flex"
                  borderWidth="1px"
                  borderRadius="md"
                  boxShadow="lg"
                >
                  <Image
                    borderRadius="5px"
                    width="150px"
                    src={orderItem.product.image}
                    alt={orderItem.product.name}
                    cursor="pointer"
                    onClick={() =>
                      navigate(`/product/${orderItem.product._id}`)
                    }
                  />
                  <Box ml="4">
                    <Text fontWeight="bold">Order ID: {orderItem._id}</Text>
                    <Text>Item: {orderItem.product.name}</Text>
                    <Text>Quantity: {orderItem.quantity}</Text>
                    <Text>Total: ${orderItem.total}</Text>
                    <Flex alignItems="center">
                      <Text>Status:</Text>
                      {orderItem.status === "Cancelled" ? (
                        <>{"  Cancelled"}</>
                      ) : (
                        <Select
                          ml={1}
                          borderColor={"green.700"}
                          height="25px"
                          value={orderItem.status}
                          position="inherit"
                          onChange={(e) =>
                            handleStatusChange(
                              orderItem._id,
                              e.currentTarget.value
                            )
                          }
                        >
                          {statusOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </Select>
                      )}
                    </Flex>
                    <Text fontSize="sm">
                      Ordered At:{" "}
                      {new Date(orderItem.createdAt).toLocaleString()}
                    </Text>
                  </Box>
                </Box>
              ))
            ) : (
              <Box textAlign="center">
                <Text fontSize="xl" fontWeight="bold" mb={4}>
                  No orders available.
                </Text>
                <Button colorScheme="blue" onClick={() => navigate("/")}>
                  Go to Main Page
                </Button>
              </Box>
            )}
          </>
        )}
      </Box>
    </Flex>
  );
};

export default AdminOrder;
