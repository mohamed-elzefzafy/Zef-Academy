import {loadStripe , Stripe} from "@stripe/stripe-js"

let stripePromise : Stripe | null = null;


const getStripe = async () => {
if (!stripePromise) {
    stripePromise = await loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PuBLIC_KEY!
    )
}

return stripePromise;
}

export default getStripe;