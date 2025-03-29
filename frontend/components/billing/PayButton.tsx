
import React, { useState } from 'react';
import { useCheckout } from '@stripe/react-stripe-js';
import { Button } from "@/components/ui/button";

const PayButton = () => {
  const { confirm } = useCheckout();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const handleClick = () => {
    setLoading(true);
    confirm().then((result) => {
      if (result.type === 'error') {
        setError(result.error);
      }
      setLoading(false);
    });
  };

  return (
    <div>
      <Button 
        onClick={handleClick} 
        disabled={loading} 
        className="w-full bg-[#FA2A55] hover:bg-[#E02348] rounded-xl" 
      >
        {loading ? "Processing..." : "Pay Now"}
      </Button>
      {error && <div className="text-red-500 mt-2">{error.message}</div>}
    </div>
  );
};

export default PayButton;
