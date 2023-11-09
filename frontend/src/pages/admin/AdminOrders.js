// import { Box, Button, Text, Spinner, Image, useToast, Select } from "@chakra-ui/react";
// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { UserState } from "../../context/UserProvider";
// import { useNavigate } from "react-router-dom";

// const AdminOrder = () => {
//   const [order, setOrder] = useState([]);
//   const { user } = UserState();
//   const [loading, setLoading] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();
//   const toast = useToast();
//   const statusOptions = ["Pending", "Shipped", "Delivered"];

//   useEffect(() => {
//     fetchOrderForAdmin();
//   }, [user]);
//   const fetchOrderForAdmin = async () => {
//     try {
//       setLoading(true);
//       const config = {
//         headers: {
//           Authorization: `Bearer ${user?.token}`,
//         },
//       };
//       const { data } = await axios.get(
//         "http://localhost:8080/api/orders/admin",
//         config
//       );
//       setOrder(data);
//       setLoading(false);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const handleStatusChange = async (orderId,currentStatus) => {
//     try {
//       setIsLoading(true);
//       const config = {
//         headers: {
//           Authorization: `Bearer ${user?.token}`,
//         },
//       };
//       const { data } = await axios.put(
//         "http://localhost:8080/api/orders/status/change",
//         {
//           orderId,
//           currentStatus,
//         },
//         config
//       );

//       toast({
//         title: `Order ${currentStatus}`,
//         status: "success",
//         duration: 2000,
//         isClosable: true,
//         position: "top",
//       });
//       setIsLoading(false);
//       setOrder(data);
//       window.location.reload();
//     } catch (error) {
//       toast({
//         title: "Error",
//         status: "error",
//         description: error.message,
//         duration: 2000,
//         isClosable: true,
//         position: "top",
//       });
//       setIsLoading(false);
//     }
//   };
//   return (
//     <>
//       {loading ? (
//         <>
//           <Spinner
//             thickness="4px"
//             speed="0.65s"
//             emptyColor="gray.200"
//             color="black"
//             size="xl"
//             m={"200px 615px"}
//             width={"100px"}
//             height={"100px"}
//           />
//         </>
//       ) : (
//         <>
//           {order.length > 0 ? (
//             order.map((order) => {
//               return (
//                 <Box
//                   bgColor="gray.100"
//                   key={order._id}
//                   m={5}
//                   p="3"
//                   display="flex"
//                   borderWidth="2px"
//                   height={"220px"}
//                   borderRadius="md"
//                 >
                  // <Box width="200px" display="flex" mr={"10px"}>
                  //   <Image
                  //     borderRadius="5px"
                  //     width="200px"
                  //     alignItems="center"
                  //     justifyContent="center"
                  //     src={order.product.image}
                  //     onClick={() => navigate(`/product/${order.product._id}`)}
                  //   />
                  // </Box>
                  // <Box
                  //   display={"flex"}
                  //   flexDir={"column"}
                  //   justifyContent={"space-around"}
                  // >
                  //   <Text fontWeight="bold">Order ID: {order._id}</Text>
                  //   {/* <Text>User ID: {order.user._id}</Text> */}
                  //   {/* <Text>Product ID: {order.product._id}</Text> */}
                  //   <Text>Item: {order.product.name}</Text>
                  //   <Text>Quantity: {order.quantity}</Text>
                  //   <Text>Total: ${order.total}</Text>
                  //     <span style={{display:"flex"}}>
                  //       Status:
                  //       {order.status === "Cancelled" ? (
                  //         <>{"  Cancelled"}</>
                  //       ) : (
                  //         <Select
                  //           ml={1}
                  //           borderColor={"green.700"}
                  //           height="25px"
                  //           value={order.status}
                  //           onChange={(e) =>
                  //             handleStatusChange(
                  //               order._id,
                  //               e.currentTarget.value
                  //             )
                  //           }
                  //         >
                  //           {statusOptions.map((option) => (
                  //             <option key={option} value={option}>
                  //               {option}
                  //             </option>
                  //           ))}
                  //         </Select>
                  //       )}
                  //     </span>
                  //   <Text>
                  //     Ordered At: {new Date(order.createdAt).toLocaleString()}
                  //   </Text>
                  // </Box>
//                 </Box>
//               );
//             })
//           ) : (
//             <Box textAlign="center">
//               <Text>No orders available.</Text>
//               <Button colorScheme="blue" mt="4" onClick={() => navigate("/")}>
//                 Go to Main Page
//               </Button>
//             </Box>
//           )}
//         </>
//       )}
//     </>
//   );
// };

// export default AdminOrder;


import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Text,
  Spinner,
  Image,
  useToast,
  Select,
} from "@chakra-ui/react";
import axios from "axios";
import { UserState } from "../../context/UserProvider";
import { useNavigate } from "react-router-dom";

const AdminOrder = () => {
  const [order, setOrder] = useState([]);
  const { user } = UserState();
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("All");
  const navigate = useNavigate();
  const toast = useToast();
  const statusOptions = [ "Pending", "Shipped", "Delivered"];
  const filterOptions = ["All", "Pending", "Shipped", "Delivered", "Cancelled"];

  useEffect(() => {
    fetchOrderForAdmin();
  }, [user]);

  const fetchOrderForAdmin = async () => {
    if(user && user.token)
    {
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

  const handleStatusChange = async (orderId, currentStatus) => {
    try {
      
      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`,
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
      setOrder(data);
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

  const filteredOrders = order.filter((order) => {
    if (filterStatus === "All") {
      return true;
    }
    return order.status === filterStatus;
  });

  return (
    <>
      <Box my={2} mx={5} mb={4}>
        <label>Filter by Status: </label>
        <Select
          id="statusFilter"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          {filterOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
      </Box>

      {loading ? (
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
      ) : (
        <>
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <Box
                key={order._id}
                bgColor="gray.100"
                m={5}
                p="3"
                display="flex"
                borderWidth="2px"
                height={"220px"}
                borderRadius="md"
              >
                <Box width="200px" display="flex" mr={"10px"}>
                  <Image
                    borderRadius="5px"
                    width="200px"
                    alignItems="center"
                    justifyContent="center"
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
                  <span style={{ display: "flex" }}>
                    Status:
                    {order.status === "Cancelled" ? (
                      <>{"  Cancelled"}</>
                    ) : (
                      <Select
                        ml={1}
                        borderColor={"green.700"}
                        height="25px"
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order._id, e.currentTarget.value)
                        }
                      >
                        {statusOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </Select>
                    )}
                  </span>
                  <Text>
                    Ordered At: {new Date(order.createdAt).toLocaleString()}
                  </Text>
                </Box>
              </Box>
            ))
          ) : (
            <Box textAlign="center">
              <Text>No orders available.</Text>
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

export default AdminOrder;
