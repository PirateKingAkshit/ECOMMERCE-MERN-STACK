import {
  Box,
  Flex,
  Image,
  Text,
  Button,
  Spinner,
  VStack,
  Icon,
  HStack,
} from "@chakra-ui/react";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { CartState } from "../../context/CartProvider";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { UserState } from "../../context/UserProvider";
import UpdateProductModal from "../admin/UpdateProductModal";
import DeleteProductModal from "../admin/DeleteProductModal";
import ProductReview from "./ProductReview";
import StarIcon from "@mui/icons-material/Star";
import StarHalfIcon from "@mui/icons-material/StarHalf";

const Product = () => {
  const { user } = UserState();
  const { addToCart } = CartState();
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState();
  const { productId } = useParams();
  const navigate = useNavigate();
  const [fetchedReview, setFetchedReview] = useState();
  const [productRating, setProductRating] = useState();
  const [noOfReviews, setNoOfReviews] = useState();

  useEffect(() => {
    fetchSingleProduct();
  }, []);
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

  const fetchReviews = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:8080/api/review/${productId}`
      );
      setFetchedReview(data.result);
      setProductRating(data.averageRating);
      setNoOfReviews(data.noOfReviews);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const renderStars = () => {
    if (productRating) {
      const filledStars = Math.floor(productRating); // Number of filled stars
      const hasHalfStar = productRating - filledStars >= 0.5; // Check for half star

      const stars = [];
      for (let i = 0; i < 5; i++) {
        if (i < filledStars) {
          // Render filled star
          stars.push(<Icon key={i} as={StarIcon} color="yellow.400" />);
        } else if (hasHalfStar && i === filledStars) {
          // Render half star if applicable
          stars.push(<Icon key={i} as={StarHalfIcon} color="yellow.400" />);
        } else {
          // Render empty star
          stars.push(<Icon key={i} as={StarIcon} color="gray.300" />);
        }
      }
      return stars;
    }
    return null; // Return null if fetchedReview data is not available
  };

  if (!product) {
    navigate("/");
  }

  return (
    <>
      {loading ? (
        <>
          <Flex align="center" justify="center" h="100vh">
            <Spinner w="80px" h="80px" color="teal.500" />
          </Flex>
        </>
      ) : (
        <>
          <VStack p={6}>
            <Flex w="100%" m="4" p="2" borderWidth="1px" borderRadius="md">
              <Image
                src={product.image}
                alt={product.name}
                boxSize="400px"
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

                <HStack>
                  {renderStars()}
                  {productRating && (
                    <Text
                      fontSize="sm"
                      bg="blue"
                      mr="5px"
                      color="white"
                      p={1}
                      borderRadius="25%"
                    >
                      {productRating}
                    </Text>
                  )}
                  {noOfReviews && <Text fontSize="lg">({noOfReviews})</Text>}
                </HStack>

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
                      mt={3}
                      w={"fit-content"}
                      colorScheme="green"
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
            <ProductReview
              fetchedReview={fetchedReview}
              productId={productId}
            />
          </VStack>
        </>
      )}
    </>
  );
};

export default Product;
