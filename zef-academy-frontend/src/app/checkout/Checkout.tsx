"use client";
import { Button } from "@mui/material";
import React from "react";
import checkout from "./actions/checkout";
import getStripe from "./stripe";

interface CheckoutProps {
    courseId : string;
}
const Checkout = ({courseId} : CheckoutProps) => {

const handleCheckout = async() => {
const session = await checkout(courseId);
const stripe = await getStripe();
await stripe?.redirectToCheckout({ sessionId: session.id });
}

  return (
    <Button variant="contained" sx={{ maxWidth: "25%" }} onClick={handleCheckout}>
      Buy Now
    </Button>
  );
};

export default Checkout;
