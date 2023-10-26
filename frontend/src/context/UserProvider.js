import { useToast } from '@chakra-ui/react';
import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const UserContext = createContext();

const UserProvider = ({children}) => {
  const [user, setUser] = useState();
  const [category, setCategory] = useState([]);
  const navigate = useNavigate();
  
  const toast=useToast()
    
    useEffect(() => {
        try {
            const userData = JSON.parse(localStorage.getItem("userData"))
            if (userData) {
                setUser(userData)
            }
            else {
                console.log("User Not Logged In")
            }
            
        } catch (error) {
            console.error("Error parsing userData:", error);
        }
    }, [navigate])
  

  const logoutHandler = async () => {
    const localCart = JSON.parse(localStorage.getItem("cart"));
    if (localCart && localCart.length > 0) {
      await axios.put(
        "http://localhost:8080/api/cart/update",
        {
          items: localCart,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
    }

    // Clear the local storage cart
    localStorage.removeItem("cart");

    localStorage.removeItem("userData");
    toast({
      title: "User Logged Out Successfully",
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
    setUser(null);
  };


  const fetchCategory = async () => {
    const config = {
      headers: {
        "Content-type": "Application/json",
      },
    };
    const { data } = await axios.get(
      "http://localhost:8080/api/categories",
      config
    );
    setCategory(data.categories);
  };
  useEffect(() => {
    fetchCategory();
  }, []);


  return (
    <UserContext.Provider
      value={{ user, setUser,logoutHandler,category}}
    >
      {children}
    </UserContext.Provider>
  );
}

export const UserState = () => {
    return useContext(UserContext);
}

export default UserProvider