<Box
  display="flex"
  justifyContent="space-around"
  alignItems="start"
  width="100%"
  padding="5px"
>
  <Box
    width="65%"
    height="fit-content"
    padding="15px"
    boxShadow="md"
    backgroundColor="aqua"
    borderRadius="5px"
  >
    <Text fontSize="xl" mb="15px">
      Order Summary
    </Text>
    Mapping through cart items
    {cart.map((item) => (
      <Box
        key={item.product._id}
        display="flex"
        justifyContent="space-around"
        width="100%"
        marginBottom="20px"
        boxShadow="md"
        backgroundColor="white"
        borderRadius="5px"
      >
        <Image
          // src={item.product.image}
          src={
            "https://rukminim2.flixcart.com/image/612/612/xif0q/mobile/k/w/k/-original-imagg2abzhxjckxu.jpeg?q=70"
          }
          alt=""
          boxSize="150px"
          borderRadius="10px"
          padding="10px 0px"
        />
        <Box width="50%" height="fit-content">
          <a href={"/product/" + item.product._id} className="cart_link">
            <Text fontSize="20px" fontWeight="bold">
              {item.product.name}
            </Text>
          </a>
          <Text color="blueviolet" fontSize="20px">
            ${item.product.price}
          </Text>
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="space-evenly"
        >
          <Box display="flex" alignItems="center">
            <Button
              size="sm"
              onClick={() => decreaseQuantity(item.product._id)}
              disabled={item.quantity === 1}
            >
              <RemoveIcon />
            </Button>
            <Text fontSize="30px" color="blue">
              {item.quantity}
            </Text>
            <Button
              size="sm"
              onClick={() => increaseQuantity(item.product._id)}
            >
              <AddIcon />
            </Button>
          </Box>
          <Button
            className="remove"
            onClick={() => removeFromCart(item.product._id)}
            fontFamily="Dancing Script"
            width="60%"
            height="35px"
            backgroundColor="rgb(112, 112, 245)"
            borderRadius="5px"
            color="white"
            fontSize="18px"
          >
            Remove
          </Button>
        </Box>
      </Box>
    ))}
  </Box>

  <Box
    width="25%"
    position="sticky"
    top="20px"
    padding="10px"
    boxShadow="md"
    backgroundColor="white"
    borderRadius="5px"
  >
    <Text fontSize="xl">Payment Summary</Text>
    <Text>
      {/* Subtotal: <span style={{ color: "blue" }}>${cartTotal()}</span> */}
      Subtotal: <span style={{ color: "blue" }}>$2000</span>
    </Text>
    <Text>
      Shipping Fee: <span style={{ color: "blue" }}>₹{SHIPPING_CHARGES}</span>
    </Text>
    <Box borderBottom="1px solid #ccc" my="2" />
    <Text>
      Total:{" "}
      <span style={{ color: "blue" }}>
        {/* ${cartTotal() + SHIPPING_CHARGES} */}
        $2000
      </span>
    </Text>
    <Box borderBottom="1px solid #ccc" my="2" />
  </Box>
</Box>;
