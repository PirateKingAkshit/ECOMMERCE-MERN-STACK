import React from "react";
import { Box, Image, Flex, Text, Button } from "@chakra-ui/react";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";

const Items = ({item}) => {
  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p="3"
      maxW="250px"
      m="10"
      boxShadow="0 4px 6px rgba(0,0,0,0.1), 0 6px 8px rgba(0,0,0,0.1)"
      transition="transform 0.2s, box-shadow 0.2s"
      _hover={{
        transform: "scale(1.01)",
        boxShadow: "0 8px 12px rgba(0,0,0,0.1), 0 12px 16px rgba(0,0,0,0.1)",
      }}
      display={"flex"}
      flexDir={"column"}
      justifyContent={"space-between"}
    >
      <Image src={item.image} alt={""} mb="4" maxW={"220px"} maxH={"300px"} />
      <Box>
        <Text fontWeight="bold" fontSize="lg" mb="2">
          {item.name}
        </Text>
        <Text color="blue.600" mb="2" fontSize={"xl"} fontWeight={"semibold"}>
          ${item.price}
        </Text>
        <Text color="gray.500" mb="4">
          Brand: {item.brand}
        </Text>
        <Button
          w={"100%"}
          colorScheme="teal"
          variant="solid"
          leftIcon={<AddShoppingCartIcon />}
        >
          Add to Cart
        </Button>
      </Box>
    </Box>
  );
};

export default Items;



