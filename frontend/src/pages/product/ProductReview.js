import { Button, HStack, Icon, IconButton, Text, VStack } from '@chakra-ui/react'
import React from 'react'
import { Link } from 'react-router-dom';
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";

const ProductReview = ({ fetchedReview, productId }) => {
  return (
    <>
      <HStack w="100%" justifyContent="space-between" borderWidth={2} p={5}>
        <Text fontSize="2xl" fontWeight="bold">
          Ratings & Reviews
        </Text>
        {/* <Link to={`/review/${productId}`}>
          <Button
            borderWidth="2"
            boxShadow="md"
            colorScheme="facebook"
            color="white"
          >
            Rate Product
          </Button>
        </Link> */}
      </HStack>
      {fetchedReview &&
        fetchedReview.map((r) => (
          <VStack key={r._id} w="100%" alignItems="start" borderWidth={2} p={5}>
            <Text
              fontSize="sm"
              bg="red"
              mr="5px"
              color="white"
              p={1}
              borderRadius={4}
            >
              {r.rating} ★
            </Text>
            <Text fontWeight="semibold">{r.review}</Text>
            <HStack color="gray.500" fontWeight="bold" fontStyle="italic">
              <Text>{r.user.name}</Text>
              <Text color="white" bg="gray.600" borderRadius="50%" w="20px" h="20px" textAlign="center"><DoneOutlinedIcon fontSize="5px" /></Text>
              <Text>Certified Buyer, {r.user.address.state}</Text>
            </HStack>
          </VStack>
        ))}
    </>
  );
};

export default ProductReview