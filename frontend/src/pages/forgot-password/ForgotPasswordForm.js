import {
  Button,
  FormControl,
  Flex,
  Heading,
  Input,
  Stack,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";



export default function ForgotPasswordForm() {
    const [email, setEmail] = useState();
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const requestResetHandler = async() => {
      try {
          setLoading(true);
            const config = {
              headers: {
                "Content-type": "application/json",
              },
            };
          const { data } = await axios.post("http://localhost:8080/api/user/forgot-password", { email }, config)
          
            toast({
              status:"success",
              description: `${data.message}`,
              duration: 1000,
              isClosable: true,
              position: "top",
            });
        setLoading(false);
        }
        catch (error) {
          toast({
            status: "success",
            description: `${error.response.data.message}`,
            duration: 1000,
            isClosable: true,
            position: "top",
          });
            setLoading(false);
        }
    }

  return (
    <Flex
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack
        spacing={4}
        w={"full"}
        maxW={"md"}
        bg={useColorModeValue("white", "gray.700")}
        rounded={"xl"}
        boxShadow={"lg"}
        p={6}
        my={12}
      >
        <Heading lineHeight={1.1} fontSize={{ base: "2xl", md: "3xl" }}>
          Forgot your password?
        </Heading>
        <Text
          fontSize={{ base: "sm", sm: "md" }}
          color={useColorModeValue("gray.800", "gray.400")}
        >
          You&apos;ll get an email with a reset link
        </Text>
        <FormControl id="email">
          <Input
            placeholder="your-email@example.com"
            _placeholder={{ color: "gray.500" }}
            type="email"
            value={email}
            onChange={(e)=>setEmail(e.currentTarget.value)}
          />
        </FormControl>
        <Stack spacing={6}>
          <Button
            bg={"blue.400"}
            color={"white"}
            _hover={{
              bg: "blue.500",
            }}
            onClick={requestResetHandler}
          >
            Request Reset
          </Button>
        </Stack>
      </Stack>
    </Flex>
  );
}
