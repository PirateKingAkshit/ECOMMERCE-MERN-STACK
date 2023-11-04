import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  Input,
  Stack,
  Text,
  Link,
  InputRightElement,
  IconButton,
  InputGroup,
  useToast,
} from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import axios from "axios";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const toast = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "http://localhost:8080/api/user/login",
        formData,
        config
      );
      toast({
        title: "Login Successfull",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      localStorage.setItem("userData", JSON.stringify(data));
      setLoading(false);
      navigate("/");
    } catch (error) {
      const errors = error.response.data.error;

      if (Array.isArray(errors)) {
        errors.forEach((err) => {
          toast({
            title: "Warning",
            description: err,
            status: "warning",
            duration: 2000,
            isClosable: true,
            position: "top",
          });
          setLoading(false);
        });
      } else {
        toast({
          title: "Warning",
          description: errors,
          status: "warning",
          duration: 2000,
          isClosable: true,
          position: "top",
        });
        setLoading(false);
      }

    }
  };

  return (
    <Box maxW="md" mx="auto" mt={8} p={6} borderWidth={1} borderRadius="lg">
      <Text fontSize="2xl" fontWeight={"bold"} mb={4} textAlign={"center"}>
        Login
      </Text>
      <form onSubmit={handleLogin}>
        <Stack spacing={4}>
          <FormControl isInvalid={formData.email === ""}>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
            />
          </FormControl>

          <FormControl isInvalid={formData.password === ""}>
            <InputGroup>
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
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

          <Button type="submit" colorScheme="blue" isLoading={loading}>
            Login
          </Button>
          <Button colorScheme="red" onClick={() => {
            setFormData({ ...formData,email:"deepak@gmail.com",password:"deepak@123"  });
          }}>
            Guest User Credential
          </Button>

          <Text mt={2}>
            Not registered yet?{" "}
            <Link as={RouterLink} to="/signup" color="blue.500">
              Sign Up
            </Link>
          </Text>
        </Stack>
      </form>
    </Box>
  );
};

export default Login;
