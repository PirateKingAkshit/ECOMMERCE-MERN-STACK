
import React, { useEffect, useState } from "react";
import Items from "./../../components/items/Items";
import { Link, createSearchParams, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { Box, Button, Flex, Image,Spinner } from "@chakra-ui/react";
import ProductFilter from "./ProductFilter"; // Import the ProductFilter component
import Pagination from "./Pagination";

const Products = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [query] = useSearchParams();
  const searchQuery = query.get("search");
  const searchCategory = query.get("category");
  const [currentPage, setCurrentPage] = useState(1);
  const [price, setPrice] = useState({
    minPrice: "",
    maxPrice: "",
  });
  const [initialPageSet, setInitialPageSet] = useState(false);
  const navigate = useNavigate();

  const fetchProducts = async (filterParams) => {

    setLoading(true);
    setPrice({
      ...price,
      minPrice: filterParams.minPrice,
      maxPrice: filterParams.maxPrice,
    });
    const shouldSetPageToOne =
      currentPage > 1 && (searchCategory || searchQuery) && !initialPageSet;

    if (shouldSetPageToOne) {
      setCurrentPage(1);
      setInitialPageSet(true); // Marking that initial page has been set
    }

    const params = {
      search: searchQuery,
      category: searchCategory,
      minPrice: filterParams.minPrice,
      maxPrice: filterParams.maxPrice,
      page: shouldSetPageToOne ? 1 : currentPage,
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

      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProducts(price);
    // eslint-disable-next-line
  }, [searchQuery, searchCategory, currentPage]);

  return (
    <Flex>
      <Box w="15%" p={4}>
        <ProductFilter applyFilter={fetchProducts} />
      </Box>
      <Box w="85%">
        {loading ? (
          <Flex align="center" justify="center" h="100vh">
            <Spinner w="80px" h="80px" color="teal.500" />
          </Flex>
        ) : (
          <>
            {products.products.length > 0 ? (
              <>
                <Flex flexDirection="row" flexWrap="wrap">
                  {products.products.map((item) => (
                    <Items key={item._id} item={item} />
                  ))}
                </Flex>
                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(products.count / 12)}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              </>
            ) : (
              <>
                <Box textAlign="center">
                  <Image
                    width={"400px"}
                    mx="auto"
                    src="https://evgracias.com/images/no-products.jpg"
                  />
                  <Box>
                    <Button colorScheme="green" as={Link} to="/">
                      Go to Main Page
                    </Button>
                  </Box>
                </Box>
              </>
            )}
          </>
        )}
      </Box>
    </Flex>
  );
};

export default Products;
