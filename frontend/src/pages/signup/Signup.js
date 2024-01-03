import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightElement,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [houseNo, setHouseNo] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      toast({
        title: "Password Do Not Match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "http://localhost:8080/api/user/register",
        {
          name,
          email,
          password,
          phoneNumber,
          address: { houseNo, city, zip, state, country },
        },
        config
      );
      toast({
        title: "SignUp Successfull",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      localStorage.setItem("userData", JSON.stringify(data));
      setLoading(false);
      navigate("/");
    } catch (error) {
      error.response.data.error.map((err) => {
        toast({
          title: "Warning",
          description: err,
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        setLoading(false);
        return null;
      });
    }
  };

  return (
    <Box
      maxW="md"
      mx="auto"
      my={4}
      p={6}
      borderWidth={1}
      borderRadius="lg"
      boxShadow="2xl"
    >
      <Text
        fontSize="2xl"
        fontWeight={"bold"}
        mb={4}
        textAlign={"center"}
        color="blue"
      >
        SignUp
      </Text>
      <form onSubmit={handleSubmit}>
        <Stack spacing={4}>
          <FormControl>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              required
              bg="white"
              color="teal.800"
            />
          </FormControl>
          <FormControl>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              required
              bg="white"
              color="teal.800"
            />
          </FormControl>
          <FormControl>
            <InputGroup>
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                bg="white"
                color="teal.800"
              />
              <InputRightElement width="4.5rem">
                <IconButton
                  h="1.75rem"
                  size="sm"
                  onClick={() => setShowPassword(!showPassword)}
                  icon={
                    showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />
                  }
                />
              </InputRightElement>
            </InputGroup>
          </FormControl>
          <FormControl>
            <InputGroup>
              <Input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                required
                bg="white"
                color="teal.800"
              />
              <InputRightElement width="4.5rem">
                <IconButton
                  h="1.75rem"
                  size="sm"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  icon={
                    showConfirmPassword ? (
                      <VisibilityIcon />
                    ) : (
                      <VisibilityOffIcon />
                    )
                  }
                />
              </InputRightElement>
            </InputGroup>
          </FormControl>
          ;
          <FormControl>
            <InputGroup>
              <InputLeftAddon children="+91" />
              <Input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Phone Number"
                required
                bg="white"
                color="teal.800"
              />
            </InputGroup>
          </FormControl>
          <FormControl>
            <Input
              type="text"
              value={houseNo}
              onChange={(e) => setHouseNo(e.target.value)}
              placeholder="House No."
              required
              bg="white"
              color="teal.800"
            />
          </FormControl>
          <HStack spacing={4}>
            <FormControl>
              <Input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
                required
                bg="white"
                color="teal.800"
              />
            </FormControl>

            <FormControl>
              <Input
                type="text"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                placeholder="ZIP"
                required
                bg="white"
                color="teal.800"
              />
            </FormControl>
          </HStack>
          <HStack spacing={4}>
            <FormControl>
              <Input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="State"
                required
                bg="white"
                color="teal.800"
              />
            </FormControl>

            <FormControl>
              <Input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Country"
                required
                bg="white"
                color="teal.800"
              />
            </FormControl>
          </HStack>
          ;
          <Button
            type="submit"
            colorScheme="blue"
            isLoading={loading}
            bg="teal.500"
            color="white"
          >
            Signup
          </Button>
        </Stack>
      </form>
      <Text mt={2} color="teal.800">
        Not registered yet?{" "}
        <Link to="/login" color="blue.500">
          <span style={{color:"blue"}}>Login</span>
        </Link>
      </Text>
    </Box>
  );
};

export default Signup;



