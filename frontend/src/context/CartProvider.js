import { useToast } from '@chakra-ui/react';
import axios from 'axios';
import React, { createContext, useContext, useState } from 'react'
import { UserState } from './UserProvider';


const CartContext = createContext()
const CartProvider = ({ children }) => {
    
    const { user } = UserState();
    const [cart, setCart] = useState([]);
    const toast = useToast();
    const SHIPPING_CHARGES = 50;

    const fetchCart = async () => {
      const localCart = JSON.parse(localStorage.getItem("cart"));
      if (localCart && localCart.length > 0) {
        setCart(localCart);
      } else {
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
          const { data } = await axios.get(
            "http://localhost:8080/api/cart",
            config
          );
          setCart(data.items);
        } catch (error) {
          console.log(error);
        }
      }
    };

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
              position: "top",
              isClosable: true,
            });
          }
        }
        return item;
      });

      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
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
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    const removeFromCart = (productId) => {
      const updatedCart = cart.filter((item) => item.product._id !== productId);
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    const cartTotal = () => {
      let total = 0;
      cart.forEach((item) => {
        total += item.product.price * item.quantity;
      });
      return total;
    };

    const addToCart = async (productId) => {
      if (!user) {
        toast({
          title: `Please Login First To Add Product To Cart`,
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      }
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        const { data } = await axios.post(
          "http://localhost:8080/api/cart/add",
          { product: productId, quantity: 1 },
          config
        );
        if (data) {
          toast({
            title: `product added to the cart`,
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "top",
          });
        }
      } catch (error) {
        console.log(error);
        //  error.response.data.error.map((err) => {
        //    toast({
        //      title: "Warning",
        //      description: err,
        //      status: "warning",
        //      duration: 5000,
        //      isClosable: true,
        //      position: "top",
        //    });
        //  });
      }
    };



  return (
    <CartContext.Provider value={{fetchCart,increaseQuantity,decreaseQuantity,removeFromCart,cartTotal,cart,setCart,SHIPPING_CHARGES,addToCart}}> 
        {children}
    </CartContext.Provider>
  )
}

export const CartState = () => {
    return useContext(CartContext);
}

export default CartProvider