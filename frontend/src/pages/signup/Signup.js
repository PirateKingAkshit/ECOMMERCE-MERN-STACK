import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
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
import { useNavigate } from "react-router-dom";

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
        setLoading(false)
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
        {name,email,password,phoneNumber,address:{houseNo,city,zip,state,country}},
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
          setLoading(false)
      });
       
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={8} p={6} borderWidth={1} borderRadius="lg">
      <Text fontSize="2xl" fontWeight={"bold"} mb={4} textAlign={"center"}>
        SignUp
      </Text>
      <form onSubmit={handleSubmit}>
        <Stack spacing={4}>
          <FormControl isInvalid={name === ""}>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
            />
          </FormControl>

          <FormControl isInvalid={email === ""}>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
            />
          </FormControl>

          <FormControl isInvalid={password === ""}>
            <InputGroup>
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

          <FormControl isInvalid={confirmPassword !== password}>
            <InputGroup>
              <Input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
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

          <FormControl isInvalid={phoneNumber === ""}>
            <InputGroup>
              <InputLeftAddon children="+91" />
              <Input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Phone Number"
              />
            </InputGroup>
          </FormControl>

          <FormControl isInvalid={houseNo === ""}>
            <Input
              type="text"
              value={houseNo}
              onChange={(e) => setHouseNo(e.target.value)}
              placeholder="House No."
            />
          </FormControl>

          <FormControl isInvalid={city === ""}>
            <Input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City"
            />
          </FormControl>

          <FormControl isInvalid={zip === ""}>
            <Input
              type="text"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              placeholder="ZIP"
            />
          </FormControl>

          <FormControl isInvalid={state === ""}>
            <Input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="State"
            />
          </FormControl>

          <FormControl isInvalid={country === ""}>
            <Input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Country"
            />
          </FormControl>

          <Button type="submit" colorScheme="blue" isLoading={loading}>
            Signup
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default Signup;
