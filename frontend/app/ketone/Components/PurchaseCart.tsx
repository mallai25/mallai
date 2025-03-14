import Image from 'next/image'
import { useState } from 'react'
import { CreditCard, ShoppingCart, MapPin, ArrowRight, ArrowLeft, Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import WalmartLogo from '../Images/Walmart.png'
import KetoneLogo from '../Images/Ketonelogo.jpg'
import PublixtLogo from '../Images/Publixlogo.png'

interface ProductCardProps {
  name: string
  description: string
  storeLocations: Array<{ name: string; address: string }>
}

export const ProductCard = ({ name, description, storeLocations }: ProductCardProps) => {
  const [isProcessing, setIsProcessing] = useState(false)
  const [activeTab, setActiveTab] = useState<'purchase' | 'retail-partners'>('purchase')
  const [processingStates, setProcessingStates] = useState<boolean[]>([false, false, false])

  const storeData = [
    { 
      name: "Ketone-IQ", 
      location: "", 
      distance: "Online", 
      price: "$4",
      cents: "50",
      logo: KetoneLogo
    },
    { 
      name: "Walmart", 
      location: "Houston, TX", 
      distance: "Supercenter", 
      price: "$4",
      cents: "50",
      logo: WalmartLogo
    },
    { 
      name: "Publix", 
      location: "Atlanta, GA", 
      distance: "Neighborhood Market", 
      price: "$4",
      cents: "50",
      logo: PublixtLogo
    }
  ];

  const totalPrice = storeData.reduce((sum, store) => {
    const dollars = parseFloat(store.price.replace('$', ''));
    const cents = parseFloat(store.cents) / 100;
    return sum + dollars + cents;
  }, 0).toFixed(2);

  const handlePurchase = () => {
    setIsProcessing(true)
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
    }, 2000)
  }

  const handleStoreClick = (index: number) => {
    const newProcessingStates = [...processingStates];
    newProcessingStates[index] = true;
    setProcessingStates(newProcessingStates);
    
    setTimeout(() => {
      const resetStates = [...processingStates];
      resetStates[index] = false;
      setProcessingStates(resetStates);
    }, 2000);
  };

  return (
    <Card className="w-full max-w-md">
      <CardContent className="pb-4 pl-5 pr-5">
        <div className="space-y-2">
          <Accordion type="single" collapsible className="border-none">
              <AccordionItem value="purchase" className="border-none">
                <AccordionTrigger className="[&>svg]:text-emerald-400 pb-0 pt-4 cursor-pointer">Direct Purchase</AccordionTrigger>
                {activeTab === 'purchase' ? (
                  <AccordionContent>
                    <div className="space-y-2 mt-3">
                      <Label htmlFor={`card-number-`}>Card Number</Label>
                      <Input id={`card-number-`} placeholder="1234 5678 9012 3456" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <div className="space-y-2">
                        <Label htmlFor={`expiry-`}>Expiry Date</Label>
                        <Input id={`expiry-`} placeholder="MM/YY" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`cvc-`}>CVC</Label>
                        <Input id={`cvc-`} placeholder="123" />
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <div className="flex flex-col">
                        <div className="flex justify-between items-center mb-2">
                          <Button 
                            className="bg-gradient-to-br from-cyan-400 to-cyan-500 hover:from-cyan-500 hover:to-cyan-600 text-white flex rounded-full items-center gap-2 transition-all duration-200 shadow shadow-cyan-500/20 hover:shadow-cyan-500/30 active:scale-95"
                            onClick={() => setActiveTab('retail-partners')}
                          >
                            Retail Partners
                            <div className="bg-cyan-400/50 ml-1 text-white flex justify-center items-center rounded-xl p-1 backdrop-blur-sm">
                              <ArrowRight className="w-2 h-2" />
                            </div>
                          </Button>
                          <div className="text-gray-500 font-medium">
                            Total: $4.50
                          </div>
                        </div>
                        <Button 
                          className="w-full bg-emerald-500 rounded-xl hover:bg-emerald-600 mt-4 text-white" 
                          onClick={handlePurchase}
                          disabled={isProcessing}
                        >
                          {isProcessing ? 'Processing...' : 'Purchase Now'}
                          <CreditCard className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </AccordionContent>
                ) : (
                  <AccordionContent>
                    <div className="space-y-4 mt-4 mb-6">
                      {storeData.map((store, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-xl border border-gray-200 hover:border-emerald-200 transition-colors duration-200">
                          <div className="flex items-center gap-3">
                            <div className="min-w-[2.75rem] w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center p-1.5 shrink-0">
                              <Image
                                src={store.logo}
                                alt={`${store.name} logo`}
                                width={40}
                                height={40}
                                className="object-contain rounded-full w-full h-full"
                              />
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900">{store.name}</h3>
                              <p className="text-sm text-gray-500">{store.location} • {store.distance}</p>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handleStoreClick(index)}
                            disabled={processingStates[index]}
                            className={`bg-gradient-to-br from-emerald-400 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 text-white rounded-full transition-all duration-200 shadow shadow-emerald-500/20 hover:shadow-emerald-500/30 active:scale-95 ${processingStates[index] ? 'opacity-70 cursor-not-allowed' : ''}`}
                          >
                            <div className='relative'>
                              {processingStates[index] ? '' : `${store.price}`}
                            </div>
                              <div className='relative -ml-2 mt-0.2'>
                              <span className="text-xs">{processingStates[index] ? 'Confirmed..' : `${store.cents} /serving`}</span>
                              </div>
                          </Button>
                        </div>
                      ))}
                    </div>
                    <div className="mt-2">
                      <Button 
                        className="bg-gradient-to-br from-emerald-400 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 text-white flex rounded-full items-center gap-2 transition-all duration-200 shadow shadow-emerald-500/20 hover:shadow-emerald-500/30 active:scale-95"
                        onClick={() => setActiveTab('purchase')}
                      >
                        <div className="bg-emerald-400/50 mr-1 text-white flex justify-center items-center rounded-xl p-1 backdrop-blur-sm">
                          <ArrowLeft className="w-2 h-2" />
                        </div>
                      </Button>
                    </div>
                  </AccordionContent>
                )}
              </AccordionItem>
            
          </Accordion>
        </div>
      </CardContent>
    </Card>
  )
}