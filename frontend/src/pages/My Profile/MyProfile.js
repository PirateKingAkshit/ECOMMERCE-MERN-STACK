import React, { useState } from "react";
import {
  Flex,
  FormControl,
  FormLabel,
  Input,
  Button,
  Stack,
  Heading,
  Box,
  useToast,
} from "@chakra-ui/react";
import { UserState } from "../../context/UserProvider";
import axios from "axios";

export default function UserProfileEdit() {
    
  const { user, setUser } = UserState();
  const toast = useToast();
  const [loading,setLoading] = useState();

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      address: {
        ...user.address,
        [name]: value,
      },
    });
  };

  const handlePhoneNumberChange = (e) => {
    setUser({
      ...user,
      phoneNumber: e.target.value,
    });
  };

  
  const handleFormSubmit = async(e) => {

    try {
      setLoading(true)
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const {data}=await axios.put(
        "http://localhost:8080/api/user/update",
        {
          phoneNumber: user.phoneNumber,
          address: user.address,
        },
        config
      );
      if (data) {
        localStorage.removeItem("userData");
        localStorage.setItem("userData", JSON.stringify(data));
        toast({
          title: "User Updated",
          status: "success",
          duration: 2000,
          isClosable: true,
          position: "top",
        });
        setLoading(false);

        window.reload();
     }
      
    }
    catch (error) {
      console.log(error)
      setLoading(false);
    }
     
  }; 

    return (
      <>
        {user && (
          <Flex
            minH={"100vh"}
            align={"center"}
            justify={"center"}
            bgColor="white.800"
          >
            <Stack
              spacing={1}
              w={"full"}
              maxW={"md"}
              bgColor={"white"}
              rounded={"xl"}
              boxShadow={"lg"}
              p={6}
            >
              <Heading fontSize={{ base: "2xl", sm: "3xl" }}>
                User Profile
              </Heading>
              <FormControl id="name">
                <FormLabel>Name</FormLabel>
                <Input
                  cursor={"default"}
                  placeholder="Name"
                  borderColor={"grey"}
                  value={user.name}
                  isReadOnly
                />
              </FormControl>
              <FormControl id="email">
                <FormLabel>Email address</FormLabel>
                <Input
                  cursor={"default"}
                  borderColor={"grey"}
                  placeholder="your-email@example.com"
                  value={user.email}
                  isReadOnly
                />
              </FormControl>
              <FormControl id="phoneNumber">
                <FormLabel>Phone Number</FormLabel>
                <Input
                  borderColor={"blue"}
                  placeholder="Phone Number"
                  value={user.phoneNumber}
                  onChange={handlePhoneNumberChange}
                  type="number"
                />
              </FormControl>
              <FormControl id="houseNo">
                <FormLabel>House No.</FormLabel>
                <Input
                  borderColor={"blue"}
                  type="text"
                  name="houseNo"
                  value={user.address.houseNo}
                  onChange={handleAddressChange}
                  placeholder="House No."
                />
              </FormControl>

              <Flex direction="row" align="center" justify="space-between">
                <Box w="45%">
                  <FormControl id="city">
                    <FormLabel>City</FormLabel>
                    <Input
                      borderColor={"blue"}
                      type="text"
                      name="city"
                      value={user.address.city}
                      onChange={handleAddressChange}
                      placeholder="City"
                    />
                  </FormControl>
                </Box>
                <Box w="45%">
                  <FormControl id="state">
                    <FormLabel>State</FormLabel>
                    <Input
                      borderColor={"blue"}
                      type="text"
                      name="state"
                      value={user.address.state}
                      onChange={handleAddressChange}
                      placeholder="State"
                    />
                  </FormControl>
                </Box>
              </Flex>
              <Flex direction="row" align="center" justify="space-between">
                <Box w="45%">
                  <FormControl id="zip">
                    <FormLabel>ZIP Code</FormLabel>
                    <Input
                      borderColor={"blue"}
                      type="text"
                      name="zip"
                      value={user.address.zip}
                      onChange={handleAddressChange}
                      placeholder="ZIP Code"
                    />
                  </FormControl>
                </Box>
                <FormControl id="country" w="45%">
                  <FormLabel>Country</FormLabel>
                  <Input
                    borderColor={"blue"}
                    type="text"
                    name="country"
                    value={user.address.country}
                    onChange={handleAddressChange}
                    placeholder="Country"
                  />
                </FormControl>
              </Flex>
              <Button
                bg={"blue.400"}
                mt={3}
                color={"white"}
                w="full"
                isLoading={loading}
                onClick={handleFormSubmit}
                _hover={{
                  bg: "blue.500",
                }}
              >
                Update
              </Button>
            </Stack>
          </Flex>
        )}
      </>
    );
}
