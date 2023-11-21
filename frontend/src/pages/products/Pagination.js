import React, { useState } from 'react';
import { Box, Button, Flex } from '@chakra-ui/react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const [pages, setPages] = useState(Array.from({ length: totalPages }, (_, i) => i + 1));

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      onPageChange(newPage);
      const newPages = Array.from({ length: totalPages }, (_, i) => i + 1);
      setPages(newPages);
    }
  };

  return (
    <Flex justify="center" my={4}>
      {pages.map((page) => (
        <Box key={page} mx={1}>
          <Button
            size="sm"
            onClick={() => handlePageChange(page)}
            bgColor={page === currentPage ? "blue" : "gray"}
            color={"white"}
          >
            {page}
          </Button>
        </Box>
      ))}
    </Flex>
  );
};

export default Pagination;
