import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ChakraProvider } from "@chakra-ui/react";
import {BrowserRouter} from "react-router-dom"
import UserProvider from './context/UserProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
        <UserProvider>
      <ChakraProvider>
          <App />
      </ChakraProvider>
        </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);
