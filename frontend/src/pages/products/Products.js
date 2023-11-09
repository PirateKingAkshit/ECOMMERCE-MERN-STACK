
import React, { useEffect, useState } from "react";
import Items from "./../../components/items/Items";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import { Box, Button, Flex, Image, Spinner } from "@chakra-ui/react";
import ProductFilter from "./ProductFilter"; // Import the ProductFilter component

const Products = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [query] = useSearchParams();
  const searchQuery = query.get("search");
  const searchCategory = query.get("category");

  const fetchProducts = async () => {
    setLoading(true);
    const params = {
      search: searchQuery,
      category: searchCategory,
    };
    try {
      const config = {
        headers: {
          "Content-type": "Application/json",
        },
      };

      const { data } = await axios.get(`http://localhost:8080/api/products`, {
        params,
        ...config,
      });
      setProducts(data.products);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const applyFilter = async (filterParams) => {
    setLoading(true);
    const params = {
      search: searchQuery,
      category: searchCategory,
      minPrice: filterParams.minPrice,
      maxPrice: filterParams.maxPrice,
    };
    try {
      const config = {
        headers: {
          "Content-type": "Application/json",
        },
      };

      const { data } = await axios.get(`http://localhost:8080/api/products`, {
        params,
        ...config,
      });
      setProducts(data.products);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line
  }, [searchQuery, searchCategory]);

  if (!loading && searchQuery && !products.length) {
    return (
      <Box textAlign="center">
        <Image
          width={"400px"}
          mx={490}
          src="https://evgracias.com/images/no-products.jpg"
        />
        <Box>
          <Button colorScheme="green" as={Link} to="/">
            Go to Main Page
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Flex>
      <Box w="15%" p={4} >
        {/* Render the ProductFilter component and pass the applyFilter function */}
        <ProductFilter applyFilter={applyFilter} />
      </Box>
      <Box w="85%" >
        {loading ? (
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
        ) : (
          <Flex flexDirection="row" flexWrap={"wrap"} >
            {products.map((item) => (
              <Items key={item._id} item={item} />
            ))}
          </Flex>
        )}
      </Box>
    </Flex>
  );
};

export default Products;
