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
      value={{ user, setUser,category}}
    >
      {children}
    </UserContext.Provider>
  );
}

export const UserState = () => {
    return useContext(UserContext);
}

export default UserProvider