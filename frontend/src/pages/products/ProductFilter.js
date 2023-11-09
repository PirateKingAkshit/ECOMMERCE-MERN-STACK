import React, { useState } from "react";
import { Box, Input, Button } from "@chakra-ui/react";

const ProductFilter = ({ applyFilter }) => {
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const handleFilterApply = () => {
    applyFilter({ minPrice, maxPrice });
  };

  return (
    <Box border={1} >
      <Input
        mb={1}
        type="number"
        placeholder="Min Price"
        value={minPrice}
        onChange={(e) => setMinPrice(e.target.value)}
      />
      <Input
        type="number"
        placeholder="Max Price"
        value={maxPrice}
        onChange={(e) => setMaxPrice(e.target.value)}
        mb={1}
      />
      <Button colorScheme="blue" onClick={handleFilterApply}>Apply Filter</Button>
    </Box>
  );
};

export default ProductFilter;
