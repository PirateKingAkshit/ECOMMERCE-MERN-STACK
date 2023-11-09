import { Box, Flex, Image, Text, Button, Spinner } from "@chakra-ui/react";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { CartState } from "../../context/CartProvider";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { UserState } from "../../context/UserProvider";
import UpdateProductModal from "../admin/UpdateProductModal";
import DeleteProductModal from "../admin/DeleteProductModal";

const Product = () => {
  const {user}=UserState()
  const { addToCart } = CartState();
  const [product, setProduct] = useState([]);
  const [loading,setLoading] = useState();
  const { productId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
     fetchSingleProduct()
  },[])
  const fetchSingleProduct = async () => {
    setLoading(true);

    try {
      const config = {
        headers: {
          "Content-type": "Application/json",
        },
      };

      const { data } = await axios.get(
        `http://localhost:8080/api/products/${productId}`,
        config
      );
      setProduct(data);
      
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  if (!product) {
    navigate("/")
  }

  return (
    <>
      {loading ? (
        <>
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="black"
            size="xl"
            m={"200px 615px"}
            width={"100px"}
            height={"100px"}
          />
        </>
      ) : (
        <>
          <Flex m="4" p="2" borderWidth="1px" borderRadius="md">
            <Image
              src={product.image}
              alt={product.name}
              boxSize="200px"
              objectFit="contain"
              transition="transform 0.2s"
              _hover={{ transform: "scale(1.05)" }}
            />
            <Box ml="4">
              <Text fontWeight="bold" fontSize="xl" color="teal.500">
                {product.name}
              </Text>
              <Text fontSize="md" color="gray.600" fontStyle="italic" mt="2">
                {product.description}
              </Text>
              <Text fontSize="lg" mt="2" color="teal.700">
                ${product.price}
              </Text>
              <Text fontSize="md" color="green.500">
                Stock: {product.stock}
              </Text>
              <Text fontSize="md" color="purple.500">
                Brand: {product.brand}
              </Text>
              {user && user.isAdmin ? (
                <>
                  <Flex>
                    <UpdateProductModal item={product}>
                      <Button mr={5} colorScheme="yellow" variant="solid">
                        Update
                      </Button>
                    </UpdateProductModal>
                    <DeleteProductModal item={product}>
                      <Button colorScheme="red" variant="solid">
                        Delete
                      </Button>
                    </DeleteProductModal>
                  </Flex>
                </>
              ) : (
                <>
                  <Button
                    w={"100%"}
                    colorScheme="teal"
                    variant="solid"
                    leftIcon={<AddShoppingCartIcon />}
                    onClick={() => addToCart(product._id)}
                  >
                    Add to Cart
                  </Button>
                </>
              )}
            </Box>
          </Flex>
        </>
      )}
    </>
  );
};

export default Product;
