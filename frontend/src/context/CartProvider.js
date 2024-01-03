import { useToast } from '@chakra-ui/react';
import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react'
import { UserState } from './UserProvider';


const CartContext = createContext()
const CartProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const { user } = UserState();
    const [cart, setCart] = useState([]);
    const toast = useToast();
    const SHIPPING_CHARGES = 50;
    const[cartLength,setCartLength]=useState()

    const fetchCart = async () => {
      if (user && user.token) {
        try {
          setLoading(true);
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
          const { data } = await axios.get(
            "http://localhost:8080/api/cart",
            config
          );
          if (data) {
            localStorage.setItem("cart", JSON.stringify(data.items));
            setCart(data.items)
            setCartLength(data.items.length)
          }
          setLoading(false);
        } catch (error) {
          console.log(error);
        }
      }
  };
  
   useEffect(() => {
     fetchCart();
   }, [user]);


    const decreaseQuantity = async(productId) => {
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

        await axios.put(
          "http://localhost:8080/api/cart/update",
          {
            items: updatedCart,
          },
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
    };

    const increaseQuantity = async(productId) => {
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
      await axios.put(
        "http://localhost:8080/api/cart/update",
        {
          items: updatedCart,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
    };

  const removeFromCart = async (productId) => {
      setCartLength(cartLength - 1);
      const updatedCart = cart.filter((item) => item.product._id !== productId);
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
        await axios.put(
          "http://localhost:8080/api/cart/update",
          {
            items: updatedCart,
          },
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
    };

    const cartTotal = () => {
      let total = 0;
      cart.forEach((item) => {
        total += item.product.price * item.quantity;
      });
      return total;
    };

  const addToCart = async (productId) => {
    setCartLength(cartLength+1)
      if (!user) {
        toast({
          title: `Please Login First To Add Product To Cart`,
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        return;
      }

      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

         await axios.post(
          "http://localhost:8080/api/cart/add",
          { product: productId, quantity: 1 },
          config
        );
      } catch (error) {
        console.log(error);
        
      }
    };




  return (
    <CartContext.Provider
      value={{
        fetchCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        cartTotal,
        cart,
        setCart,
        SHIPPING_CHARGES,
        addToCart,
        loading,
        cartLength,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const CartState = () => {
    return useContext(CartContext);
}

export default CartProvider