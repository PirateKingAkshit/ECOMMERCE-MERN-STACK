import React, { createContext, useContext, useEffect, useState } from 'react'
import { createSearchParams, useNavigate } from 'react-router-dom';

const UserContext = createContext();

const UserProvider = ({children}) => {
    const [user, setUser] = useState();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState()
    const searchItem = () => {
      if (searchQuery) {
        navigate(`/?${createSearchParams({ search: searchQuery })}`);
      }
      setSearchQuery("");
    };

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
    },[navigate])

  return (
    <UserContext.Provider
      value={{ user, setUser, searchQuery, setSearchQuery, searchItem }}
    >
      {children}
    </UserContext.Provider>
  );
}

export const UserState = () => {
    return useContext(UserContext);
}

export default UserProvider