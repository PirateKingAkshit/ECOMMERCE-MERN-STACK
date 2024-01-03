import { Box, Button, HStack, Image, Text, VStack } from "@chakra-ui/react";
import React from "react";
import { createSearchParams, useNavigate } from "react-router-dom";

const MainPageItems = () => {
  const navigate = useNavigate();

  const sectionStyle = {
    backgroundColor: "white",
    borderRadius: "10px",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
    padding: "20px",
    width: "100%",
    marginTop: "20px",
  };

  const renderSection = (title, items, categoryId) => (
    <Box as="section" style={sectionStyle}>
      <HStack justifyContent="space-between" mb={5}>
        <Text fontWeight="semibold" fontSize="3xl">
          {title}
        </Text>
        <Button
          bg="transparent"
          textDecoration="underline"
          onClick={() => {
            navigate(
              `/products/?${createSearchParams({ category: categoryId })}`
            );
          }}
        >
          See More
        </Button>
      </HStack>
      <HStack w="100%" justifyContent="space-around">
        {items.map((item) => (
          <VStack key={item.id}>
            <Image
              src={item.src}
              height="300px"
              width="250px"
              borderRadius="8px"
            />
            <HStack justifyContent="space-between" w="100%">
              <Text fontWeight="bold">{item.title}</Text>
              <Text fontWeight="bold" color="blueviolet">
                ${item.price}
              </Text>
            </HStack>
          </VStack>
        ))}
      </HStack>
    </Box>
  );

  const mobileProducts = [
    {
      id: "1",
      src: "https://i.dummyjson.com/data/products/1/thumbnail.jpg",
      title: "iPhone 9",
      price: "1499",
    },
    {
      id: "2",
      src: "https://i.dummyjson.com/data/products/5/thumbnail.jpg",
      title: "Huawei Pro",
      price: "499",
    },
    {
      id: "3",
      src: "https://i.dummyjson.com/data/products/2/thumbnail.jpg",
      title: "iPhone X",
      price: "899",
    },
  ];
  const laptops = [
    {
      id: "1",
      src: "https://i.dummyjson.com/data/products/7/thumbnail.jpg",
      title: "Samsung Galaxy Book",
      price: "1499",
    },
    {
      id: "2",
      src: "https://i.dummyjson.com/data/products/6/thumbnail.png",
      title: "MacBook Pro",
      price: "1749",
    },
    {
      id: "3",
      src: "https://i.dummyjson.com/data/products/10/thumbnail.jpeg",
      title: "HP Pavilion 15-DK1056WM",
      price: "1099",
    },
  ];
  const skincare = [
    {
      id: "1",
      src: "https://i.dummyjson.com/data/products/18/thumbnail.jpg",
      title: "Oil Free Moisturizer 100ml",
      price: "40",
    },
    {
      id: "2",
      src: "https://i.dummyjson.com/data/products/19/thumbnail.jpg",
      title: "Skin Beauty Serum",
      price: "46",
    },
    {
      id: "3",
      src: "https://i.dummyjson.com/data/products/16/thumbnail.jpg",
      title: "Hyaluronic Acid Serum",
      price: "19",
    },
  ];
  const menWatches = [
    {
      id: "1",
      src: "https://i.dummyjson.com/data/products/64/thumbnail.jpg",
      title: "Leather Strap Skeleton Watch",
      price: "46",
    },
    {
      id: "2",
      src: "https://i.dummyjson.com/data/products/61/thumbnail.jpg",
      title: "Leather Straps Wristwatch",
      price: "120",
    },
    {
      id: "3",
      src: "https://i.dummyjson.com/data/products/62/thumbnail.jpg",
      title: "Waterproof Leather Brand Watch",
      price: "46",
    },
  ];
  const Jewelry = [
    {
      id: "1",
      src: "https://i.dummyjson.com/data/products/76/thumbnail.jpg",
      title: "Silver Ring Set Women",
      price: "70",
    },
    {
      id: "2",
      src: "https://i.dummyjson.com/data/products/80/thumbnail.jpg",
      title: "Chain Pin Tassel Earrings",
      price: "45",
    },
    {
      id: "3",
      src: "https://i.dummyjson.com/data/products/78/thumbnail.jpg",
      title: "Rhinestone Korean Style",
      price: "30",
    },
  ];
  return (
    <>
      {renderSection(
        "MOBILE PRODUCTS",
        mobileProducts,
        "654e815b76318eaaabf75238"
      )}
      {renderSection("LAPTOPS", laptops, "654e817576318eaaabf7523b")}
      {renderSection("SKINCARE", skincare, "654e818376318eaaabf75241")}
      {renderSection("MENS WATCHES", menWatches, "654e81d576318eaaabf7525c")}
      {renderSection("JEWELRY", Jewelry, "654e81eb76318eaaabf75265")}
    </>
  );
};

export default MainPageItems;
