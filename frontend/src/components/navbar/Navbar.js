import React, { useState } from 'react'
import { Box, Input, InputGroup, InputLeftElement, Text,useDisclosure, MenuItem,Menu, MenuButton, MenuList, MenuDivider, Button, InputRightElement, useToast, } from "@chakra-ui/react";
import SearchIcon from "@mui/icons-material/Search";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import InboxIcon from "@mui/icons-material/Inbox";
import LogoutIcon from "@mui/icons-material/Logout";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Link, createSearchParams, useNavigate } from 'react-router-dom'
import { UserState } from '../../context/UserProvider';
import axios from 'axios';

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState();
  const toast = useToast();
  const navigate = useNavigate()
  const { user,setUser,category } = UserState();

  
  
  const searchItem = () => {
    if (searchQuery) {
      navigate(`/?${createSearchParams({ search: searchQuery })}`);
    }
    setSearchQuery("");
  };

  const logoutHandler = async() => {
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
    navigate("/")
  }

  const handleCartClick = () => {
    if (!user) {
      toast({
        title: "Please Log In",
        description: "You need to be logged in to view your cart.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    navigate("/cart");
  };


  
  
  
  return (
    <>
      <Box
        display={"flex"}
        bg={"black"}
        p={4}
        justifyContent={"space-around"}
        alignItems={"center"}
      >
        <Box
          cursor="pointer"
          onClick={() => {
            navigate("/");
            setSelectedCategory("All");
          }}
        >
          <Text fontSize={"4xl"} color={"white"}>
            Urban<span style={{ color: "blue" }}>Utopia</span>
          </Text>
        </Box>

        <Box w={"50%"}>
          <InputGroup>
            <InputLeftElement>
              <SearchIcon onClick={searchItem} style={{ color: "white" }} />
            </InputLeftElement>
            <Input
              size={"md"}
              variant={"outline"}
              type="text"
              placeholder="Search for Products"
              _placeholder={{ color: "white" }}
              fontSize={"xl"}
              color={"lightblue"}
              pb={1}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.currentTarget.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  searchItem();
                }
              }}
            />
            <InputRightElement width="5rem">
              <Menu>
                <MenuButton
                  fontWeight={"semibold"}
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  borderRadius={4}
                  w={"100%"}
                  h={"100%"}
                  bg={"white"}
                  color={"black"}
                  overflowY={"hidden"}
                >
                  {selectedCategory}
                </MenuButton>
                <MenuList>
                  <MenuItem
                    onClick={() => {
                      setSelectedCategory("All");
                      navigate("/");
                    }}
                  >
                    All
                  </MenuItem>
                  {category.map((cat) => (
                    <MenuItem
                      key={cat._id}
                      onClick={() => {
                        setSelectedCategory(cat.name);
                        navigate(
                          `/?${createSearchParams({ category: cat._id })}`
                        );
                      }}
                    >
                      {cat.name}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            </InputRightElement>
          </InputGroup>
        </Box>

        <Box>
          <Menu isOpen={isOpen}>
            <MenuButton
              color={"white"}
              variant="ghost"
              borderRadius={5}
              bg={"black"}
              _hover={{ color: "blue" }}
              fontSize={"25px"}
              fontWeight="normal"
              onMouseEnter={onOpen}
              onMouseLeave={onClose}
              w={200}
            >
              <PersonOutlineIcon />
              {user ? <>Account</> : <>Log In</>}
              {isOpen ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
            </MenuButton>
            <MenuList onMouseEnter={onOpen} onMouseLeave={onClose}>
              <MenuItem fontSize={"20px"} _hover={{ color: "blue" }}>
                <PersonOutlineIcon />
                {user ? (
                  <>My Profile</>
                ) : (
                  <Link to="/login">
                    <div>Log In</div>
                  </Link>
                )}
              </MenuItem>
              <MenuDivider />
              {user && user.isAdmin && (
                <>
                  <Link to="/adminOrders">
                    <MenuItem fontSize={"20px"} _hover={{ color: "blue" }}>
                      <InboxIcon />
                      Orders
                    </MenuItem>
                  </Link>
                  <MenuDivider />
                </>
              )}
              {user && !user.isAdmin && (
                <>
                  <Link to="/orders">
                    <MenuItem fontSize={"20px"} _hover={{ color: "blue" }}>
                      <InboxIcon />
                      Orders
                    </MenuItem>
                  </Link>
                  <MenuDivider />
                </>
              )}

              {user && user.isAdmin && (
                <>
                  <Link to="/addProduct">
                  <MenuItem
                    fontSize={"20px"}
                    _hover={{ color: "blue" }}
                  >
                      <AddCircleOutlineIcon />
                      Add Product
                  </MenuItem>
                    </Link>
                  <MenuDivider />
                </>
              )}

              {user && (
                <MenuItem
                  fontSize={"20px"}
                  _hover={{ color: "blue" }}
                  onClick={() => logoutHandler()}
                >
                  <Link to="/">
                    <LogoutIcon />
                    Logout
                  </Link>
                </MenuItem>
              )}
            </MenuList>
          </Menu>
        </Box>

        {user && user.isAdmin ? (
          <></>
        ) : (
          <Button
            _hover={{ color: "blue" }}
            fontSize={"25px"}
            colorScheme="black"
            onClick={handleCartClick}
          >
            <ShoppingCartIcon /> Cart
          </Button>
        )}
        {/* <Button
            _hover={{ color: "blue" }}
            fontSize={"25px"}
            colorScheme="black"
            onClick={handleCartClick}
          >
            <ShoppingCartIcon /> Cart
          </Button> */}
      </Box>
    </>
  );
}

export default Navbar