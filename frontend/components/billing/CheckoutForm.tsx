import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { doc, updateDoc } from "firebase/firestore";
import { FIREBASE_DB } from "@/FirebaseConfig";
import { toast } from "sonner";
import { UserType } from "@/types/user";

interface CheckoutFormProps {
  onSuccess: () => void;
  plan: string;
  userType: UserType;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ onSuccess, plan, userType }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || !currentUser) {
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success`,
        },
      });

      if (error) {
        toast.error(error.message || "Payment failed. Please try again.");
        return;
      }

      // Update user document with new subscription
      const userRef = doc(FIREBASE_DB, "users", currentUser.uid);
      await updateDoc(userRef, {
        subscriptionPlan: "premium",
        subscriptionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
      });

      toast.success("Payment successful! You're now on the Premium plan.");
      onSuccess();
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6">
      <PaymentElement className="mb-4 rounded-xl overflow-hidden" />
      <Button 
        type="submit" 
        className="w-full rounded-3xl"
        disabled={!stripe || isLoading}
      >
        {isLoading ? "Processing..." : `Subscribe to Premium Plan ($300)`}
      </Button>
    </form>
  );
};

export default CheckoutForm;
