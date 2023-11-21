import { Box, HStack } from "@chakra-ui/react";

const StarRating = ({ onChange, value }) => {
  const stars = [1, 2, 3, 4, 5];

  return (
    <HStack>
      {stars.map((star, index) => (
        <Box
          fontSize="3xl"
          key={index}
          as="button"
          onClick={() => onChange(star)}
          color={star <= value ? "yellow.400" : "gray.300"}
        >
          ★
        </Box>
      ))}
    </HStack>
  );
};

export default StarRating;
