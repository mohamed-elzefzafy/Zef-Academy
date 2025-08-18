"use client";
import { Button } from "@mui/material";
import React from "react";
// import checkout from "./actions/checkout";
import getStripe from "./stripe";
import { useCheckoutStripeMutation } from "@/redux/slices/api/checkoutiSlice";

interface CheckoutProps {
  courseId: string;
}
const Checkout = ({ courseId }: CheckoutProps) => {
  const [checkoutStripe] = useCheckoutStripeMutation();
  const handleCheckout = async () => {
    const session = await checkoutStripe({courseId}).unwrap();
    const stripe = await getStripe();
    await stripe?.redirectToCheckout({ sessionId: session.id });
  };

  return (
    <Button
      variant="text"
      sx={{ maxWidth: "25%", textTransform: "capitalize" }}
      onClick={handleCheckout}
    >
      Buy Now
    </Button>
  );
};

export default Checkout;
