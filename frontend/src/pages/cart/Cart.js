import React, { useEffect, useState } from 'react';
import { Box, Text, Image, Button, useToast } from '@chakra-ui/react';
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { UserState } from "./../../context/UserProvider";
import axios from "axios";
import { useLocation } from 'react-router-dom';



const Cart = () => {
  const { user } = UserState();
  const [cart, setCart] = useState([]);
  // const location = useLocation();
  const toast = useToast();

 const fetchCart = async () => {
   try {
     const config = {
       headers: {
         Authorization: `Bearer ${user.token}`,
       },
     };
     const { data } = await axios.get("http://localhost:8080/api/cart", config);
     setCart(data.items);
   } catch (error) {
     console.log(error);
   }
 };

 useEffect(() => {
   fetchCart();
 }, [user]);

 useEffect(() => {
   localStorage.setItem("cart", JSON.stringify(cart));
 }, [cart]);


 const decreaseQuantity = (productId) => {
   const updatedCart = cart.map((item) => {
     if (item.product._id === productId) {
       if (item.quantity > 1) {
         item.quantity--;
       } else {
         toast({
           title: "Minimum Quantity Reached",
           description: "Quantity cannot be less than 1.",
           status: "warning",
           duration: 2000,
           position:"top",
           isClosable: true,
         });
       }
     }
     return item;
   });

   setCart(updatedCart);
  //  localStorage.setItem("cart", JSON.stringify(updatedCart));
 };

 const increaseQuantity = (productId) => {
   const updatedCart = cart.map((item) => {
     if (item.product._id === productId) {
       if (item.quantity < 5) {
         item.quantity++;
       } else {
         toast({
           title: "Maximum Quantity Reached",
           description: "Quantity cannot be more than 5.",
           status: "warning",
           position: "top",
           duration: 2000,
           isClosable: true,
         });
       }
     }
     return item;
   });

   setCart(updatedCart);
  //  localStorage.setItem("cart", JSON.stringify(updatedCart));
  };
  
  const removeFromCart = (productId) => {
    const updatedCart = cart.filter((item) => item.product._id !== productId);
    setCart(updatedCart);
    // localStorage.setItem("cart", JSON.stringify(updatedCart));
  };  

  const cartTotal = () => {
    let total = 0;
    cart.forEach((item) => {
      total += item.product.price * item.quantity;
    });
    return total;
  };

  const SHIPPING_CHARGES = 50;


  return (
    <>
      {cart.length > 0 ? (
        <Box
   display="flex"
   justifyContent="space-around"
   alignItems="start"
   width="100%"
   padding="5px"
 >
   {/* Order Summary */}
   <Box
     width="65%"
     height="fit-content"
     padding="15px"
     boxShadow="md"
     backgroundColor="aqua"
     borderRadius="5px"
   >
     <Text fontSize="xl" mb="15px">
       Order Summary
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
         />
         <Box width="50%" height="fit-content">
           <a href={`/product/${item.product._id}`} className="cart_link">
             <Text fontSize="20px" fontWeight="bold">
               {item.product.name}
             </Text>
           </a>
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
             className="remove"
             onClick={() => removeFromCart(item.product._id)}
             fontFamily="Dancing Script"
             width="60%"
             height="35px"
             backgroundColor="rgb(112, 112, 245)"
             borderRadius="5px"
             color="white"
             fontSize="18px"
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
     boxShadow="md"
     backgroundColor="white"
     borderRadius="5px"
   >
     <Text fontSize="xl">Payment Summary</Text>
     {/* Subtotal */}
     <Text>
       Subtotal: <span style={{ color: "blue" }}>${cartTotal()}</span>
     </Text>
     {/* Shipping Fee */}
     <Text>
       Shipping Fee: <span style={{ color: "blue" }}>${SHIPPING_CHARGES}</span>
     </Text>
     <Box borderBottom="1px solid #ccc" my="2" />
     {/* Total */}
     <Text>
       Total:{" "}
       <span style={{ color: "blue" }}>${cartTotal() + SHIPPING_CHARGES}</span>
     </Text>
     <Box borderBottom="1px solid #ccc" my="2" />
   </Box>
 </Box>
      ) : (
        <Box textAlign="center">
          <Text fontSize="xl" mb="15px">
            Your cart is empty
          </Text>
        </Box>
      )}
    </>
  );
};

export default Cart;



 
