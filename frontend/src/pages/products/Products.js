import React, { useEffect, useState } from 'react'
import Items from './../../components/items/Items';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios'
import { Box, Button, Flex, Image, Spinner } from '@chakra-ui/react';


const Products = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [query] = useSearchParams();
  const searchQuery = query.get("search");
  const searchCategory = query.get("category");

  const fetchProducts = async () => {
    setLoading(true);

    try {
      const config = {
        headers: {
          "Content-type": "Application/json",
        },
      };

      const { data } = searchQuery
        ? await axios.get(
            `http://localhost:8080/api/products?search=${searchQuery}`,
            config
          )
        : searchCategory
        ? await axios.get(
            `http://localhost:8080/api/products?category=${searchCategory}`,
            config
          )
        : await axios.get(`http://localhost:8080/api/products`, config);
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
          src="https://evgracias.com/images/no-products.jpg" />
        <Box >
          {/* <p>No Products Found</p> */}
          <Button colorScheme='green' as={Link} to="/">
            Go to Main Page
          </Button>
        </Box>
      </Box>
    );
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
          <Flex flexDirection="row" flexWrap={"wrap"} px={4}>
            {products.map((item) => (
              <Items key={item._id} item={item} />
            ))}
          </Flex>
        </>
      )}
    </>
  );
}

export default Products