
import React, { useEffect, useState } from "react";
import Items from "../../components/items/Items";
import {
  Link,
  createSearchParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import axios from "axios";
import {
  Box,
  Button,
  Flex,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
} from "@chakra-ui/react";
import ProductFilter from "./ProductFilter"; // Import the ProductFilter component
import Pagination from "./Pagination";
import { UserState } from "../../context/UserProvider";

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState("Category");
  const { user, setUser, category } = UserState();
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
     <Flex p={2}>
       <Flex flexDir="column" w="15%" p={4} backgroundColor="#f9f9f9">
         <ProductFilter applyFilter={fetchProducts} />
         <Menu >
           <MenuButton
             mt={5}
             as={Button}
             fontWeight="semibold"
             borderRadius={4}
             w="100%"
             h="50px"
             bg="#ecf0f1"
             color="#2c3e50"
             overflowY="hidden"
           >
             {selectedCategory}
           </MenuButton>
           <MenuList minWidth="170px" maxHeight="250px" overflowY="scroll">
             <MenuItem
               onClick={() => {
                 setSelectedCategory("All");
                 navigate("/products");
               }}
             >
               All
             </MenuItem>
             {category.map((cat) => (
               <MenuItem
                 key={cat._id}
                 onClick={() => {
                   setSelectedCategory(cat.name);
                   navigate(`/products/?${createSearchParams({ category: cat._id })}`);
                 }}
               >
                 {cat.name}
               </MenuItem>
             ))}
           </MenuList>
         </Menu>
       </Flex>
       <Box w="85%" p={2}>
         {loading ? (
           <Flex align="center" justify="center" h="100vh">
             <Spinner w="80px" h="80px" color="teal.500" />
           </Flex>
         ) : (
           <>
             {products.products.length > 0 ? (
               <>
                 <Box display="flex" flexDirection="row" flexWrap="wrap">
                   {products.products.map((item) => (
                     <Items key={item._id} item={item} />
                   ))}
                 </Box>
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
                     width="400px"
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

