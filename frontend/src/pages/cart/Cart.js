import React, { useEffect } from 'react';
import { Box, Text, Image, Button } from '@chakra-ui/react';
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { CartState } from '../../context/CartProvider';
import { UserState } from '../../context/UserProvider';

const Cart = () => {

  const{fetchCart,increaseQuantity,decreaseQuantity,removeFromCart,cartTotal,cart,SHIPPING_CHARGES}=CartState()
  const { user } = UserState();
 useEffect(() => {
   fetchCart();
   // eslint-disable-next-line
 }, [user]);

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



 
