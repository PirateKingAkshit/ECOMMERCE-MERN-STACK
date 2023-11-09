import React from "react";
import { Box, Image, Text, Button, Flex } from "@chakra-ui/react";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { CartState } from "../../context/CartProvider";
import { useNavigate } from "react-router-dom";
import { UserState } from "../../context/UserProvider";
import UpdateProductModal from "../../pages/admin/UpdateProductModal";
import DeleteProductModal from "../../pages/admin/DeleteProductModal";

const Items = ({ item }) => {
  const { addToCart } = CartState();
  const navigate = useNavigate()
  const { user } = UserState();
  
  return (
    <>
      {item.stock > 0 && (
        <Box
          borderWidth="1px"
          borderRadius="lg"
          overflow="hidden"
          p="3"
          maxW="250px"
          m="4"
          boxShadow="0 4px 6px rgba(0,0,0,0.1), 0 6px 8px rgba(0,0,0,0.1)"
          transition="transform 0.2s, box-shadow 0.2s"
          _hover={{
            transform: "scale(1.01)",
            boxShadow:
              "0 8px 12px rgba(0,0,0,0.1), 0 12px 16px rgba(0,0,0,0.1)",
          }}
          display={"flex"}
          flexDir={"column"}
          justifyContent={"space-between"}
        >
          <Image
            src={item.image}
            alt={""}
            mb="4"
            maxW={"220px"}
            maxH={"300px"}
            onClick={() => navigate(`/product/${item._id}`)}
          />
          <Box>
            <Text fontWeight="bold" fontSize="lg" mb="2">
              {item.name}
            </Text>
            <Text
              color="blue.600"
              mb="2"
              fontSize={"xl"}
              fontWeight={"semibold"}
            >
              ${item.price}
            </Text>
            <Text color="gray.500" mb="4">
              Brand: {item.brand}
            </Text>
            {user && user.isAdmin ? (
              <>
                <Flex justifyContent="space-around">
                  <UpdateProductModal item={item}>
                    <Button colorScheme="yellow" variant="solid">
                      Update
                    </Button>
                  </UpdateProductModal>
                  <DeleteProductModal item={item}>
                    <Button colorScheme="red" variant="solid">
                      Delete
                    </Button>
                  </DeleteProductModal>
                </Flex>
              </>
            ) : (
              <>
                {item.stock < 11 && item.stock > 0 && (
                  <Text color="red.500" mb="4">
                    Hurry! Only {item.stock} left in stock.
                  </Text>
                )}
                <Button
                  w={"100%"}
                  colorScheme="teal"
                  variant="solid"
                  leftIcon={<AddShoppingCartIcon />}
                  onClick={() => addToCart(item._id)}
                >
                  Add to Cart
                </Button>
              </>
            )}
          </Box>
        </Box>
      )}
    </>
  );
};

export default Items;



