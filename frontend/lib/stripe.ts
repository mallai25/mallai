
import { loadStripe } from "@stripe/stripe-js";

// Use the provided public key
const stripePromise = loadStripe("pk_test_51QxVOzFxo9VeF5280PdWfv0kDSkySAoytRfwVpOpUDUDgkMgrfnigtyjBzTQmvVR8geyab16Gd6KXpPYaAHlDZlj00bAzblkFh");

export default stripePromise;
