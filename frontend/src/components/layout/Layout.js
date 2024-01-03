import { Box } from '@chakra-ui/react'
import React from 'react'
import Navbar from '../navbar/Navbar'
import Footer from '../footer/Footer'

const Layout = ({children}) => {
  return (
    <Box w="100%" h="100vh">
          <Navbar />
          {children}
    </Box>
  )
}

export default Layout