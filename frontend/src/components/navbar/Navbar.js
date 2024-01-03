

import React, { useState } from "react";
import {
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  useDisclosure,
  MenuItem,
  Menu,
  MenuButton,
  MenuList,
  MenuDivider,
  Button,
  InputRightElement,
  useToast,
  HStack,
} from "@chakra-ui/react";
import SearchIcon from "@mui/icons-material/Search";
import CategoryIcon from "@mui/icons-material/Category";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import { Link, createSearchParams, useNavigate } from "react-router-dom";
import { UserState } from "../../context/UserProvider";
import axios from "axios";
import LogoutIcon from "@mui/icons-material/Logout";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import InboxIcon from "@mui/icons-material/Inbox";
import { CartState } from "../../context/CartProvider";
import Products from '../../pages/products/Products';

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState();
  const toast = useToast();
  const navigate = useNavigate();
  const { user, setUser, category } = UserState();
  const { cartLength } = CartState();

  const searchItem = () => {
    if (searchQuery) {
      navigate(`/products?${createSearchParams({ search: searchQuery })}`);
    }
    setSearchQuery("");
  };

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
    navigate("/");
    window.location.reload();
  };

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
        // position="sticky"
        // top={0}
        display={"flex"}
        // bg={"#2c3e50"}
        bg={"blue"}
        p={4}
        justifyContent={"space-around"}
        alignItems={"center"}
        borderBottom="1px"
        borderColor="white"
      >
        <Box
          cursor="pointer"
          onClick={() => {
            navigate("/");
            setSelectedCategory("All");
          }}
        >
          <Text fontSize={"4xl"} color={"#ecf0f1"}>
            Urban<span style={{ color: "yellow" }}>Utopia</span>
          </Text>
        </Box>

        <Box w={"40%"}>
          <InputGroup>
            <InputLeftElement>
              <SearchIcon onClick={searchItem} style={{ color: "#ecf0f1" }} />
            </InputLeftElement>
            <Input
              size="md"
              variant={"outline"}
              type="text"
              placeholder="Search for Products"
              _placeholder={{ color: "#ecf0f1" }}
              fontSize={"xl"}
              color={"#ecf0f1"}
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
            {/* <InputRightElement width="5rem">
              <Menu>
                <MenuButton
                  fontWeight={"semibold"}
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  borderRadius={4}
                  w={"100%"}
                  h={"100%"}
                  bg={"#ecf0f1"}
                  color={"#2c3e50"}
                  overflowY={"hidden"}
                >
                  {selectedCategory}
                </MenuButton>
                <MenuList
                  minWidth={"170px"}
                  maxHeight="250px"
                  overflowY={"scroll"}
                >
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
            </InputRightElement> */}
          </InputGroup>
        </Box>

        <Link to="/products">
          <Box bg="transparent">
            <Text
              fontSize={"25px"}
              fontWeight="normal"
              _hover={{ color: "yellow" }}
              color="white"
            >
              <CategoryIcon />
              Products
            </Text>
          </Box>
        </Link>

        <Box>
          <Menu isOpen={isOpen}>
            <MenuButton
              color={"#ecf0f1"}
              variant="ghost"
              borderRadius={5}
              // bg={"#2c3e50"}
              // _hover={{ color: "#3498db" }}
              _hover={{ color: "yellow" }}
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
                  <Link to="/profile">
                    <>Profile</>
                  </Link>
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
                    <MenuItem fontSize={"20px"} _hover={{ color: "blue" }}>
                      <AddCircleOutlineIcon />
                      Add Product
                    </MenuItem>
                  </Link>
                  <MenuDivider />
                </>
              )}

              {user && (
                <>
                  <MenuItem fontSize={"20px"} _hover={{ color: "blue" }}>
                    <Link to="/change-password">
                      <LockOpenOutlinedIcon />
                      Change Password
                    </Link>
                  </MenuItem>
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
          <HStack alignItems="center">
            <Button
              _hover={{ color: "yellow" }}
              // _hover={{ color: "#3498db" }}
              fontSize={"25px"}
              colorScheme="black"
              onClick={handleCartClick}
              position="relative"
            >
              <ShoppingCartIcon /> Cart
              {cartLength > 0 ? (
                cartLength >= 9 ? (
                  <Text
                    position="inherit"
                    bottom="20px"
                    right="75px"
                    ml={2}
                    borderWidth={2}
                    borderColor="#e74c3c"
                    color="#2c3e50"
                    borderRadius="50%"
                    bg="#f1c40f"
                    p={1}
                    w="27px"
                    h="27px"
                    fontSize="15px"
                    fontWeight="bold"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    9+
                  </Text>
                ) : (
                  <Text
                    position="inherit"
                    bottom="20px"
                    right="75px"
                    ml={2}
                    borderWidth={2}
                    borderColor="#e74c3c"
                    color="#2c3e50"
                    borderRadius="50%"
                    bg="#f1c40f"
                    p={1}
                    w="27px"
                    h="27px"
                    fontSize="15px"
                    fontWeight="bold"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    {cartLength}
                  </Text>
                )
              ) : (
                <></>
              )}
            </Button>
          </HStack>
        )}
      </Box>
    </>
  );
};

export default Navbar;

