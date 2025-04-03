'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Upload, Gift } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { VideoStack } from "./video-stack";
import Image from "next/image"
import Link from "next/link";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

import JakePaul from './Thumbnails/JakeGloves.jpg'
import PrPackage from './Thumbnails/PrPackage.jpg'

export function Rewards() {

  const stamps = [
    { date: "06/01", stamped: true },
    { date: "06/15", stamped: true },
    { date: "06/28", stamped: false },
    { date: "07/05", stamped: false },
    { date: "07/12", stamped: false },
    { date: "", stamped: false },
  ];

  const steps = [
    {
      number: 1,
      title: "Buy ItsCalledW Product",
      description: "Purchase W item from any Walmart outlets"
    },
    {
      number: 2,
      title: "Keep Your Receipt",
      description: "Take a picture of your purchase receipt"
    },
    {
      number: 3,
      title: "Share Your Experience",
      description: "Upload your receipt and tell us what you think"
    },
    {
      number: 4,
      title: "Win Prizes",
      description: "Top participants will recieve Prizes from ItsCalledW and Jake Paul!"
    }
  ];

  const prizes = [
    {
      title: "Win Signed Boxing Gloves",
      description: "Get a pair Signed by Jake Paul!",
      image: JakePaul
    },
    {
      title: "Get ItsCalledW Pr Package!",
      description: "A Mystery items Pack from ItsCalledW",
      image: PrPackage
    },
  ]

    const [receiptImage, setReceiptImage] = useState(null);
    const [showParticipantDialog, setShowParticipantDialog] = useState(false);
    const [participantData, setParticipantData] = useState({
      name: "",
      email: "",
      address: "",
      location: ""
    });
  
    const handleReceiptUpload = (e) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setReceiptImage(event.target.result);
        };
        reader.readAsDataURL(file);
      }
    };
  
    const handleSubmitEntry = () => {
      if (receiptImage) {
        setShowParticipantDialog(true);
      }
    };
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setParticipantData(prev => ({
        ...prev,
        [name]: value
      }));
    };

  return (
    <div className="space-y-4 sm:space-y-8 bg-gradient-to-b from-white to-yellow-50/30 min-h-screen pb-6 sm:pb-6">
      {/* VideoStack at the top */}
      <VideoStack />

      {/* Hero Section */}
      <div className="relative w-full h-[180px] sm:h-[250px] md:h-[300px] rounded-3xl mb-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/90 to-yellow-600/90 z-10" />
        <div className="absolute inset-0 bg-[url('/rewards-hero.jpg')] bg-cover bg-center" />
        <div className="relative z-20 h-full flex items-center justify-center">
          <div className="text-center space-y-2 sm:space-y-4 px-4 max-w-[90%] sm:max-w-2xl mx-auto">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
              Win Big with ItsCalledW
            </h1>
            <p className="text-sm sm:text-base md:text-xl text-white/90 max-w-xs sm:max-w-none mx-auto">
              Get to Win a pair of signed Boxing Gloves from Jake Paul and ItsCalledW Pr Package
            </p>
          </div>
        </div>
      </div>

      <div className="pt-1"></div>

      <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-0">
        {/* Main Content Grid */}
        <div className="space-y-4 sm:space-y-8 lg:grid lg:grid-cols-12 lg:gap-8 lg:space-y-0">
          {/* Main Column */}
          <div className="lg:col-span-8 space-y-4 sm:space-y-8">
            {/* Steps Section */}
            <Card className="overflow-hidden border-none shadow-lg">
              <CardHeader className="bg-white py-3 px-4">
                <CardTitle className="text-base sm:text-xl font-bold text-yellow-700">How It Works</CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-6 sm:pt-2 pt-2">
                <ScrollArea className="w-full">
                  <div className="flex space-x-3 sm:space-x-6 pb-4">
                    {steps.map((step) => (
                      <div 
                        key={step.number}
                        className="flex-none w-[280px] sm:w-[300px] bg-white rounded-xl p-3 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-yellow-100"
                      >
                        <div className='flex w-full justify-center'>
                          <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-700 font-bold text-base sm:text-xl mb-2 sm:mb-4">
                          {step.number}
                        </div>
                        </div>
                        <div className='flex w-full justify-center'>
                          <h4 className="font-semibold text-sm sm:text-lg mb-1 sm:mb-2">{step.title}</h4>
                        </div>
                        <div className='flex w-full justify-center'>
                        <p className="text-xs sm:text-base text-gray-600 text-center">{step.description}</p>
                        </div>
                        
                      </div>
                    ))}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Prizes Section */}
            <Card className="overflow-hidden border-none shadow-lg">
              <CardHeader className=" bg-white py-3 px-4">
                <CardTitle className="text-base sm:text-xl font-bold text-yellow-700">Available Prizes</CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-4">
              <div className="max-w-4xl mx-auto px-4 py-0">
      <div className="flex flex-wrap -mx-4">
        {prizes.map((prize, index) => (
          <div key={index} className="w-full md:w-1/2 px-4 mb-8">
            <div className="group">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
                <Image
                  className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                  src={prize.image}
                  alt=""
                /> 
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-black/20 z-10" />
                <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-4 z-20">
                  <div className="bg-yellow-500 text-white text-xs sm:text-sm font-semibold px-2 py-0.5 sm:px-3 sm:py-1 rounded-full w-fit mb-1 sm:mb-2">
                    Special Prize
                  </div>
                  <h3 className="text-base sm:text-xl font-bold text-white mb-0.5 sm:mb-1">{prize.title}</h3>
                  <p className="text-xs sm:text-sm text-white/90 line-clamp-2">{prize.description}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    {/* Login Button */}
            <div className="w-full mt-4 bg-blue-50 rounded-xl p-4 border border-blue-100 shadow-sm">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-blue-700 font-medium text-sm sm:text-base text-center sm:text-left">
                  Login and keep track of your participation activity in this rewards campaign from the brand.
                </p>
                <Link href="/join">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6">
                    Login
                  </Button>
                </Link>
              </div>
            </div>
              </CardContent>
            </Card>

            {/* Mobile Upload and Progress Sections */}
            <div className="block lg:hidden space-y-4">
              {/* Upload Section */}
              <Card className="overflow-hidden border-none shadow-lg">
                                  <CardHeader className="bg-white py-2.5 px-3 sm:px-4">
                                    <CardTitle className="text-sm sm:text-lg font-bold text-yellow-700">Upload Receipt</CardTitle>
                                  </CardHeader>
                                  <CardContent className="p-3 sm:p-4">
                                    <div className="space-y-3">
                                      <div className="aspect-video sm:aspect-[4/3] rounded-lg overflow-hidden relative group cursor-pointer bg-yellow-50 hover:bg-yellow-100/50 transition-colors"
                                           onClick={() => document.getElementById('receipt-upload')?.click()}>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                          {receiptImage ? (
                                            <img src={receiptImage} alt="Receipt" className="w-full h-full object-contain" />
                                          ) : (
                                            <div className="text-center">
                                              <Upload className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-500 mx-auto mb-1.5 sm:mb-2" />
                                              <p className="text-xs sm:text-sm text-gray-600">Click to upload your receipt</p>
                                            </div>
                                          )}
                                        </div>
                                        <Input
                                          type="file"
                                          className="hidden"
                                          id="receipt-upload"
                                          accept="image/*"
                                          onChange={handleReceiptUpload}
                                        />
                                      </div>
                                      <Button 
                                        className="w-full bg-yellow-500 hover:bg-yellow-600 text-white transition-colors py-1.5 text-xs sm:text-sm font-medium"
                                        onClick={handleSubmitEntry}
                                        disabled={!receiptImage}
                                      >
                                        Submit Entry
                                      </Button>
                                    </div>
                                  </CardContent>
                                </Card>

              {/* Progress Section */}
              <Card className="overflow-hidden border-none shadow-lg">
                <CardHeader className="bg-white py-2.5 px-3 sm:px-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm sm:text-lg font-bold text-yellow-700">Your Progress</CardTitle>
                    <div className="bg-yellow-100 text-yellow-700 text-[10px] sm:text-sm px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full">
                      2/6 Uploaded
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-2.5 sm:p-4">
                  <div className="space-y-2.5 sm:space-y-4">
                    <div className="grid grid-cols-3 gap-1 sm:gap-2">
                      {stamps.slice(0, 6).map((stamp, i) => (
                        <div key={i} className="aspect-square relative">
                          {stamp.stamped ? (
                            <div className="w-full h-full bg-yellow-500 rounded-md flex items-center justify-center shadow-sm">
                              <span className="text-white text-[10px] sm:text-sm font-bold">✓</span>
                            </div>
                          ) : (
                            <div className="w-full h-full rounded-md border border-dashed border-yellow-200 flex items-center justify-center hover:bg-yellow-50 transition-colors">
                              <span className="text-yellow-200 text-[8px] sm:text-xs">{i + 1}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="bg-yellow-50 rounded-md p-1.5 sm:p-2 text-center">
                      <p className="text-[10px] sm:text-sm text-yellow-700">Upload more receipts to increase your chances!</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Desktop Right Column - Upload and Progress */}
                        <div className="hidden lg:block lg:col-span-4 space-y-8">
                          {/* Upload Section */}
                          <Card className="overflow-hidden border-none shadow-lg">
                            <CardHeader className="border-b bg-white py-2.5 px-3 sm:px-4">
                              <CardTitle className="text-sm sm:text-lg font-bold text-yellow-700">Upload Receipt</CardTitle>
                            </CardHeader>
                            <CardContent className="p-3 sm:p-4">
                              <div className="space-y-3">
                                <div className="aspect-video sm:aspect-[4/3] rounded-lg overflow-hidden relative group cursor-pointer bg-yellow-50 hover:bg-yellow-100/50 transition-colors"
                                     onClick={() => document.getElementById('desktop-receipt-upload')?.click()}>
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    {receiptImage ? (
                                      <img src={receiptImage} alt="Receipt" className="w-full h-full object-contain" />
                                    ) : (
                                      <div className="text-center">
                                        <Upload className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-500 mx-auto mb-1.5 sm:mb-2" />
                                        <p className="text-xs sm:text-sm text-gray-600">Click to upload your receipt</p>
                                      </div>
                                    )}
                                  </div>
                                  <Input
                                    type="file"
                                    className="hidden"
                                    id="desktop-receipt-upload"
                                    accept="image/*"
                                    onChange={handleReceiptUpload}
                                  />
                                </div>
                                <Button 
                                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-white transition-colors py-1.5 text-xs sm:text-sm font-medium"
                                  onClick={handleSubmitEntry}
                                  disabled={!receiptImage}
                                >
                                  Submit Entry
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
              
                          {/* Progress Section */}
                          <Card className="overflow-hidden border-none shadow-lg">
                            <CardHeader className="border-b bg-white py-2.5 px-3 sm:px-4">
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-sm sm:text-lg font-bold text-yellow-700">Your Progress</CardTitle>
                                <div className="bg-yellow-100 text-yellow-700 text-[10px] sm:text-sm px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full">
                                  2/6 Uploaded
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent className="p-2.5 sm:p-4">
                              <div className="space-y-2.5 sm:space-y-4">
                                <div className="grid grid-cols-3 gap-1 sm:gap-2">
                                  {stamps.slice(0, 9).map((stamp, i) => (
                                    <div key={i} className="aspect-square relative">
                                      {stamp.stamped ? (
                                        <div className="w-full h-full bg-yellow-500 rounded-md flex items-center justify-center shadow-sm">
                                          <span className="text-white text-[10px] sm:text-sm font-bold">✓</span>
                                        </div>
                                      ) : (
                                        <div className="w-full h-full rounded-md border border-dashed border-yellow-200 flex items-center justify-center hover:bg-yellow-50 transition-colors">
                                          <span className="text-yellow-200 text-[8px] sm:text-xs">{i + 1}</span>
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                                <div className="bg-yellow-50 rounded-md p-1.5 sm:p-2 text-center">
                                  <p className="text-[10px] sm:text-sm text-yellow-700">Upload more receipts to increase your chances!</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
        </div>
      </div>

      {/* Participant Information Dialog */}
                <Dialog open={showParticipantDialog} onOpenChange={setShowParticipantDialog}>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>Complete Your Entry</DialogTitle>
                      <DialogDescription>
                        This is a demo. Your information will not be saved.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="name">Full Name</Label>
                          <Input 
                            id="name" 
                            name="name" 
                            value={participantData.name} 
                            onChange={handleInputChange} 
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input 
                            id="email" 
                            name="email" 
                            type="email" 
                            value={participantData.email} 
                            onChange={handleInputChange} 
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="address">Address</Label>
                          <Input 
                            id="address" 
                            name="address" 
                            value={participantData.address} 
                            onChange={handleInputChange} 
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="location">Location</Label>
                          <Input 
                            id="location" 
                            name="location" 
                            value={participantData.location} 
                            onChange={handleInputChange} 
                            className="mt-1"
                          />
                        </div>
                      </div>
                      
                      <div className="flex flex-col">
                        <Label>Your Receipt</Label>
                        <div className="mt-1 bg-gray-50 border border-gray-200 rounded-lg overflow-hidden h-full">
                          {receiptImage && (
                            <img src={receiptImage} alt="Receipt" className="w-full h-full object-contain" />
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <DialogFooter className="flex w-full justify-between">
                                <Button 
                                  type="button" 
                                  variant="outline" 
                                  onClick={() => setShowParticipantDialog(false)}
                                  className="w-full rounded-3xl "
                                >
                                  Close
                                </Button>
                                <Link href="/join" className="w-full">
                                  <Button className="w-full bg-blue-600 hover:bg-blue-700 rounded-3xl py-2.5">
                                    Create Account to Track Participation
                                  </Button>
                                </Link>
                              </DialogFooter>
                  </DialogContent>
                </Dialog>
    </div>
  );
}