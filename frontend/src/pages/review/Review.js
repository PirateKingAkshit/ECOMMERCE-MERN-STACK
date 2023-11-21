import React, { useEffect, useState } from "react";
import { Box, Button, Flex, HStack, Image, Spinner, Text, Textarea, VStack, useToast } from "@chakra-ui/react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import StarRating from "./StartRaing"
import { UserState } from "../../context/UserProvider";

const Review = () => {
  const { user } = UserState();
  const { productId } = useParams();
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchedReview, setFetchedReview] = useState();
  const [rating, setRating] = useState();
  const [reviewText, setReviewText] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [ratingError, setRatingError] = useState("");
  const ratingValue = [["Very Bad","red"], ["Bad","orange"], ["Good","blue"], ["Very Good","yellow"],["Excellent","gold"]];
  const toast = useToast();
  
    
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


  const fetchReview = async () => {
    if (user && user.token) {
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
          const { data } = await axios.get(
            `http://localhost:8080/api/review/user/${productId}`,
            config
          );
          setFetchedReview(data)
          setRating(data.userRating)
          setReviewText(data.userReview);
        } catch (error) {
          console.log(error);
        }
    }
    
  }

   useEffect(() => {
     fetchSingleProduct();
   }, [user]);
  
    useEffect(() => {
      fetchReview();
    }, [user]);
    
    const handleRatingChange = (newRating) => {
      setRating(newRating);
    };

    const handleSubmit = async() => {
        if (!rating > 0 ) {
            setRatingError("Please select a rating !!!")
            return;
        }
        if (reviewText.trim() === "") {
            setReviewError("Please enter review !!!");
            return;
        }

        if (user && user.token) {
            setIsLoading(true)
            try {
              const config = {
                headers: {
                  Authorization: `Bearer ${user.token}`,
                },
              }
              await axios.post(`http://localhost:8080/api/review`,{productId:productId,review:reviewText,rating:rating},config)
              toast({
                title: "Review Added",
                status: "success",
                duration: 1000,
                isClosable: true,
                position: "top",
              });
              setIsLoading(false);
              window.location.reload()
            }
            catch (error) {
                console.log(error)
                setIsLoading(false)
             }
        }
  }

  return (
    <>
      {loading ? (
        <Flex align="center" justify="center" h="100vh">
          <Spinner w="80px" h="80px" color="teal.500" />
        </Flex>
      ) : (
        <VStack display="flex" flexDir="column" m="30px">
          <HStack
            w="100%"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            boxShadow="base"
            p={5}
            borderWidth={1}
          >
            <Text fontWeight="bold" fontSize="2xl">
              Ratings & Reviews
            </Text>
            <Flex>
              <Flex direction="column">
                <Text fontWeight="semibold">{product.name}</Text>
                <HStack alignItems="center" justifyContent="center">
                  <Text
                    fontWeight="bold"
                    fontSize="sm"
                    bg="red"
                    mr="5px"
                    color="white"
                    p={1}
                    borderRadius={4}
                  >
                    {fetchedReview && fetchedReview.averageRating} ★
                  </Text>
                  <Text fontSize="2xl">
                    ({fetchedReview && fetchedReview.noOfReviews})
                  </Text>
                </HStack>
              </Flex>
              <Link to={`/product/${productId}`}>
                <Box mx={1} borderWidth={2} borderRadius={5} p={1}>
                  <Image src={product.image} w="70px" h="50px" />
                </Box>
              </Link>
            </Flex>
          </HStack>

          <Flex
            w="100%"
            boxShadow="base"
            p={5}
            flexDir="column"
            justifyContent="start"
            alignItems="start"
            borderWidth={1}
          >
            <Text fontWeight="semibold" fontSize="lg">
              Rate this product
            </Text>
            <Flex alignItems="center">
              <StarRating onChange={handleRatingChange} value={rating} />
              <Text
                fontSize="lg"
                ml={5}
                color={rating > 0 && ratingValue[rating - 1][1]}
                fontWeight="semibold"
              >
                {rating > 0 ? ratingValue[rating - 1][0] : ""}
                {ratingError}
              </Text>
            </Flex>
          </Flex>

          <Flex
            w="100%"
            boxShadow="base"
            p={5}
            flexDir="column"
            justifyContent="start"
            alignItems="start"
            borderWidth={1}
          >
            <Text fontWeight="semibold" fontSize="lg" mb={2}>
              Review this product
            </Text>
            <Text fontSize="lg" fontWeight="semibold" color="red">
              {reviewError}
            </Text>
            <Textarea
              borderWidth={2}
              placeContent="start"
              placeholder="Description"
              value={reviewText}
              onChange={(e) => setReviewText(e.currentTarget.value)}
              minH="100px"
              maxH="120px"
            />
            <Button
              float="inline-start"
              ml="auto"
              mt={5}
              colorScheme="orange"
              onClick={() => handleSubmit()}
              isLoading={isLoading}
            >
              Submit Review
            </Button>
          </Flex>
        </VStack>
      )}
    </>
  );
};

export default Review;
