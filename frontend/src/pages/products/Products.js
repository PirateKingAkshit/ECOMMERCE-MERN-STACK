import React, { useEffect, useState } from 'react'
import Items from './../../components/items/Items';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios'
import { Flex, Spinner } from '@chakra-ui/react';

const Products = () => {

   const [loading, setLoading] = useState(true);
   const [products, setProducts] = useState([]);
   const [query] = useSearchParams();
  const searchQuery = query.get("search");

  const fetchProducts = async() => {
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
        : await axios.get(
            `http://localhost:8080/api/products`,
            config
          );
      setProducts(data.products)
      console.log(data.products);
      setLoading(false)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchProducts();
  }, [searchQuery]);


  // if (!loading && searchQuery && !products.length) {
  //   return (
  //     <div className="no_prod_found">
  //       <img src="https://tadobasolutions.com/img/nproduct.png" />
  //     </div>
  //   );
  // }
  
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