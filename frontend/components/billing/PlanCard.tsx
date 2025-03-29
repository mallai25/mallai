import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Construction } from "lucide-react";
import { PlanFeature, SubscriptionPlan } from "@/types/billing";
import { useNavigate } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { motion } from "framer-motion";
import { toast } from "@/components/ui/use-toast";

interface PlanCardProps {
  plan: SubscriptionPlan;
  onSelect: (plan: string) => void;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, onSelect }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const cardVariants = {
    hover: {
      y: -10,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  const checkVariants = {
    initial: { scale: 0 },
    animate: { scale: 1, transition: { type: "spring", stiffness: 500, damping: 30 } },
  };

  const handleSelectPlan = () => {
    if (plan.title.includes("Free")) {
      // Free plan selected
      onSelect("free");
    } else {
      // Premium plan selected
      onSelect("premium");
    }
  };

  const closePopover = () => {
    const popover = document.querySelector('[data-state="open"]');
    if (popover) {
      const trigger = popover.previousElementSibling as HTMLButtonElement;
      if (trigger) trigger.click();
    }
  };

  return (
    <motion.div
      initial="initial"
      whileHover="hover"
      variants={cardVariants}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card 
        className={`
          overflow-hidden shadow-lg rounded-3xl mb-4 
          ${plan.current ? 'border-[#FA2A55] border-2' : ''}
          ${plan.title.includes("Premium") ? 
            'bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white' : 
            'bg-white'
          }
        `}
      >
        <CardHeader className={plan.title.includes("Premium") ? "" : "bg-gray-50"}>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className={plan.title.includes("Premium") ? "text-white" : ""}>
                {plan.title}
              </CardTitle>
              <CardDescription className={`mt-1 ${plan.title.includes("Premium") ? "text-gray-300" : ""}`}>
                {plan.description}
              </CardDescription>
            </div>
            {plan.current && (
              <Badge className="bg-blue-600 rounded-full">Current</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className={`pt-6 ${plan.title.includes("Premium") ? "text-white" : "bg-white"}`}>
          <div className="mb-6">
            <p className="text-3xl font-bold">{plan.price}</p>
            {plan.price !== "Free" && (
              <p className="text-sm text-gray-500">per month, billed monthly</p>
            )}
            {plan.price === "Free" && (
              <p className="text-sm text-gray-500">free plan</p>
            )}
          </div>
          <div className="space-y-3">
            {plan.features.map((feature, idx) => (
              <motion.div
                key={idx}
                className="flex items-center gap-3"
                variants={checkVariants}
                initial="initial"
                animate="animate"
              >
                <div className={`w-5 h-5 rounded-full ${
                  plan.title.includes("Premium") ? "bg-blue-500" : "bg-green-500"
                } flex items-center justify-center`}>
                  {feature[plan.title.includes("Free") ? "free" : "premium"] && (
                    <Check className="text-white h-3 w-3" />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className={plan.title.includes("Premium") ? "text-gray-300" : "text-gray-700"}>
                    {feature.icon}
                  </span>
                  <span>{feature.name}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="mt-6">
          {plan.title.includes("Free") ? (
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full rounded-3xl" 
                  disabled={plan.current}
                >
                  {plan.current ? "Current Plan" : "Select Free Plan"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-96 p-6 rounded-3xl">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">{plan.title}</h3>
                  <p className="text-sm text-gray-600">
                    This Plan will be active when you open an account.
                  </p>
                  <div className="pt-2">
                    <p className="font-medium mb-2">Plan includes:</p>
                    <ul className="space-y-2">
                      {plan.features.filter(f => f.free).map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <Check className="text-green-500 h-4 w-4" />
                          <span className="text-sm">{feature.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex gap-2 justify-center pt-3">
                    <Button variant="outline" className="rounded-full" onClick={() => navigate("/login")}>
                      Login
                    </Button>
                    <Button className="rounded-full bg-[#FA2A55]" onClick={() => navigate("/register")}>
                      Create Account
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  className="w-full bg-[#FA2A55] hover:bg-[#E02348] rounded-3xl" 
                  disabled={plan.current}
                >
                  {plan.current ? "Current Plan" : "Upgrade to Premium"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-96 p-6 rounded-3xl text-center">
                <div className="flex flex-col items-center space-y-4">
                  <Construction className="h-16 w-16 text-[#FA2A55] mb-2" />
                  <h3 className="text-xl font-semibold">Coming Soon</h3>
                  <p className="text-gray-600">
                    The {plan.title} subscription will be available soon.
                  </p>
                  <div className="pt-2">
                    <p className="font-medium mb-2">Premium features include:</p>
                    <ul className="space-y-2">
                      {plan.features.filter(f => f.premium).map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <Check className="text-green-500 h-4 w-4" />
                          <span className="text-sm">{feature.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Button 
                    className="rounded-full bg-[#FA2A55] mt-4" 
                    onClick={closePopover}
                  >
                    Got it
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default PlanCard;
