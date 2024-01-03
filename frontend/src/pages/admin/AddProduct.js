import {
  Box,
  Flex,
  Stack,
  HStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Heading,
  Textarea,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { UserState } from "../../context/UserProvider";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [cat, setCat] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState("");
  const [brand, setBrand] = useState("");
  const [categoryName, setCategoryName] = useState();
  const [categoryDesc, setCategoryDesc] = useState();
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const { user, category, fetchCategory } = UserState();
  const navigate = useNavigate()

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handlePriceChange = (e) => {
    setPrice(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCat(e.target.value);
  };

  const handleStockChange = (e) => {
    setStock(e.target.value);
  };

  const handleImageChange = (e) => {
    setImage(e.target.value);
  };

  const handleBrandChange = (e) => {
    setBrand(e.target.value);
  };



  const handleSubmit = async(e) => {
    e.preventDefault();
     try {
       setLoading(true);
       const config = {
         headers: {
           Authorization: `Bearer ${user.token}`,
         },
       };
       await axios.post(
         "http://localhost:8080/api/products",
         {
           name,
           description,
           price,
           category: cat,
           stock,
           image,
           brand
         },
         config
       );
       toast({
         title: "Product Added",
         status: "success",
         duration: 2000,
         isClosable: true,
         position: "top",
       });
       setLoading(false);
       navigate("/");
     } catch (error) {
       toast({
         title: "Warning",
         description: error.response.data.error,
         status: "warning",
         duration: 2000,
         isClosable: true,
         position: "top",
       });
       setLoading(false);
     }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleAddCategory = async () => {
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      await axios.post(
        "http://localhost:8080/api/categories",
        {
          name: categoryName,
          description: categoryDesc,
        },
        config
      );
      toast({
        title: "category Added",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      setCategoryDesc("")
      setCategoryName("")
      setLoading(false);
      fetchCategory()
      navigate("/addProduct");
    } catch (error) {
      toast({
        title: "Warning",
        description: error.response.data.error,
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
    }
    handleCloseModal();
  };

  return (
    <Flex align={"center"} justify={"center"} bg={"gray.50"} position="inherit">
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            Add Product
          </Heading>
        </Stack>
        <Box rounded={"lg"} bg={"white"} boxShadow={"lg"} p={8} w={"lg"}>
          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              <HStack>
                <Box>
                  <FormControl id="name" isRequired>
                    <FormLabel>Name</FormLabel>
                    <Input
                      type="text"
                      name="name"
                      value={name}
                      onChange={handleNameChange}
                      position="inherit"
                    />
                  </FormControl>
                </Box>
                <Box>
                  <FormControl id="price" isRequired>
                    <FormLabel>Price</FormLabel>
                    <Input
                      type="number"
                      name="price"
                      value={price}
                      onChange={handlePriceChange}
                      position="inherit"
                    />
                  </FormControl>
                </Box>
              </HStack>
              <FormControl id="description" isRequired>
                <FormLabel>Description</FormLabel>
                <Textarea
                  name="description"
                  value={description}
                  onChange={handleDescriptionChange}
                  size="lg"
                  position="inherit"
                />
              </FormControl>
              <FormControl
                id="category"
                display={"flex"}
                alignItems={"center"}
                isRequired
              >
                <FormLabel>Category</FormLabel>
                <Select
                  name="category"
                  value={cat}
                  onChange={handleCategoryChange}
                  placeholder="Select category"
                  width="65%"
                >
                  {category.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </Select>

                <Button
                  size="sm"
                  colorScheme="blue"
                  onClick={handleOpenModal}
                  ml={2}
                  isLoading={loading}
                >
                  Add Category
                </Button>

                <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                  <ModalOverlay />
                  <ModalContent>
                    <ModalHeader>Add Category</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                      <FormControl id="addCategoryForm">
                        <FormControl id="categoryName" isRequired>
                          <FormLabel>Category Name</FormLabel>
                          <Input
                            type="text"
                            name="categoryName"
                            value={categoryName}
                            onChange={(e) => {
                              setCategoryName(e.target.value);
                            }}
                          />
                        </FormControl>
                        <FormControl id="categoryDescription" isRequired>
                          <FormLabel>Description</FormLabel>
                          <Textarea
                            name="categoryDescription"
                            value={categoryDesc}
                            onChange={(e) => {
                              setCategoryDesc(e.target.value);
                            }}
                            size="lg"
                          />
                        </FormControl>
                      </FormControl>
                    </ModalBody>
                    <ModalFooter>
                      <Button
                        colorScheme="blue"
                        mr={3}
                        onClick={handleCloseModal}
                      >
                        Close
                      </Button>
                      <Button colorScheme="green" onClick={handleAddCategory}>
                        Save
                      </Button>
                    </ModalFooter>
                  </ModalContent>
                </Modal>
              </FormControl>
              <FormControl id="stock" isRequired>
                <FormLabel>Stock</FormLabel>
                <Input
                  type="number"
                  name="stock"
                  value={stock}
                  onChange={handleStockChange}
                />
              </FormControl>
              <FormControl id="image">
                <FormLabel>Image</FormLabel>
                <Input
                  type="text"
                  name="image"
                  value={image}
                  onChange={handleImageChange}
                />
              </FormControl>
              <FormControl id="brand">
                <FormLabel>Brand</FormLabel>
                <Input
                  type="text"
                  name="brand"
                  value={brand}
                  onChange={handleBrandChange}
                />
              </FormControl>
              <Button
                type="submit"
                size="lg"
                colorScheme="blue"
                isLoading={false} // Set to true when submitting
                loadingText="Submitting"
              >
                Add Product
              </Button>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Flex>
  );
};

export default AddProduct;
