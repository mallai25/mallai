
'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { 
  ChevronLeft, 
  ChevronRight, 
  MessageCircle, 
  Image as ImageIcon, 
  Send, 
  X, 
  Sparkles, 
  Save, 
  Edit,
  Cloud
} from 'lucide-react';
import NextImage from 'next/image';
import { BackgroundRemover } from "./BackgroundRemover/background-remover";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

// Define the ChatMessage interface to fix type errors
interface ChatMessage {
  id: number;
  role: string;
  content: string;
  imageUrl?: string | null;
}

export function AIGenerationsTab() {
  const [activeTab, setActiveTab] = useState("chat");
  const [tabsMinimized, setTabsMinimized] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bgRemovalInputRef = useRef<HTMLInputElement>(null);
  const [bgRemovalImage, setBgRemovalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [savedDrafts, setSavedDrafts] = useState<string[]>([]);
  const [geminiMessage, setGeminiMessage] = useState<string | null>(null);
  
  const { toast } = useToast();
  
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
      { id: 1, role: 'system', content: 'What do you want to create today?' }
  ]);

  // Simulate loading saved drafts from Firebase
  useEffect(() => {
    // This would typically be a Firebase fetch
    setTimeout(() => {
      setSavedDrafts([]);
    }, 1000);
  }, []);

  const handleSendMessage = () => {
    if (!chatInput.trim() && !selectedImage) return;
    
    // Add user message
    setChatMessages([...chatMessages, { 
      id: Date.now(), 
      role: 'user', 
      content: chatInput,
      imageUrl: selectedImage
    }]);
    
    setChatInput("");
    setSelectedImage(null);
    
    // Simulate AI response
    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'system',
        content: `I've analyzed your request. Here's a suggested response based on your input.`,
        imageUrl: null
      }]);
    }, 1000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real implementation, this would upload to Cloudinary
      // For now, we'll just use FileReader to preview
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSelectedImage(event.target.result as string);
          toast({
            title: "Image uploaded",
            description: "Your image has been processed successfully.",
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleBgRemovalImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setBgRemovalImage(event.target.result as string);
          setProcessedImage(null); // Clear any previous processed image
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveBackground = () => {
    if (!bgRemovalImage) return;
    
    setIsProcessing(true);
    toast({
      title: "Processing image",
      description: "Removing background from your product image...",
    });
    
    // In a real implementation, this would use the BackgroundRemover from the imported file
    // For now we'll simulate the processing
    setTimeout(() => {
      setIsProcessing(false);
      setProcessedImage(bgRemovalImage); // In a real app, this would be the processed image
      toast({
        title: "Background removed",
        description: "Your image has been processed successfully.",
      });
    }, 2000);
  };

  const handleSaveDraft = () => {
    if (processedImage) {
      // In a real implementation, this would save to Firebase
      setSavedDrafts(prev => [...prev, processedImage]);
      toast({
        title: "Draft saved",
        description: "Your processed image has been saved to drafts.",
      });
    }
  };

  const handleDownloadImage = () => {
    if (processedImage) {
      // Create an anchor element and trigger download
      const link = document.createElement('a');
      link.href = processedImage;
      link.download = `processed-image-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Image downloaded",
        description: "Your processed image has been downloaded.",
      });
    }
  };

  const handleGemini2Click = () => {
    setGeminiMessage("Coming soon! Gemini 2.0 advanced image editing capabilities will allow you to transform your product images with simple text prompts.");
    
    setTimeout(() => {
      setGeminiMessage(null);
    }, 6000);
  };

  return (
    <div className="flex h-full">
      {/* Side tabs */}
      <div className={`chat-sidebar block border-r ${tabsMinimized ? 'minimized' : 'expanded'} ${tabsMinimized ? 'sidebar-animate-out' : 'sidebar-animate-in'}`}>
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className={`font-medium ${tabsMinimized ? 'hidden' : 'block'}`}>AI Tools</h3>
          <Button 
            variant="ghost" 
            size="sm" 
            className="rounded-full"
            onClick={() => setTabsMinimized(!tabsMinimized)}
          >
            {tabsMinimized ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </Button>
        </div>
        <div className="p-2 mt-10 -ml-2">
          <Tabs defaultValue="chat" value={activeTab} onValueChange={setActiveTab} orientation="vertical">
            <TabsList className={`flex flex-col w-full space-y-1 bg-transparent ${tabsMinimized ? 'items-center' : ''}`}>
              <TabsTrigger 
                value="chat" 
                className={`ai-tab-trigger justify-start text-left px-3 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm w-full ${tabsMinimized ? 'justify-center' : ''}`}
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                {!tabsMinimized && <span>Chat</span>}
              </TabsTrigger>
              <TabsTrigger 
                value="background" 
                className={`ai-tab-trigger justify-start text-left px-3 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm w-full ${tabsMinimized ? 'justify-center' : ''}`}
              >
                <ImageIcon className="mr-2 h-4 w-4" />
                {!tabsMinimized && <span>Remove Background</span>}
              </TabsTrigger>
              <TabsTrigger 
                value="drafts" 
                className={`ai-tab-trigger justify-start text-left px-3 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm w-full ${tabsMinimized ? 'justify-center' : ''}`}
              >
                <Save className="mr-2 h-4 w-4" />
                {!tabsMinimized && <span>Saved Drafts</span>}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <Tabs value={activeTab} className="w-full">
          <TabsContent value="chat" className="w-full max-w-4xl mt-0 mx-auto">
            <div className="flex flex-col items-center">
              <h1 className="text-3xl font-bold mb-8">What do you want to create today?</h1>
            
              <div className="w-full chat-prompt-area p-6">
                <div className="mb-6 max-h-[60vh] overflow-y-auto">
                  {chatMessages.map((message) => (
                    <div 
                      key={message.id} 
                      className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}
                    >
                      <div 
                        className={`inline-block max-w-[80%] p-4 rounded-lg ${
                          message.role === 'user' 
                            ? 'bg-blue-100 text-blue-900' 
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        {message.imageUrl && (
                          <div className="mb-2">
                            <NextImage 
                              src={message.imageUrl} 
                              alt="User uploaded" 
                              width={200} 
                              height={150} 
                              className="rounded"
                              style={{ objectFit: 'contain' }}
                            />
                          </div>
                        )}
                        <p>{message.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {geminiMessage && (
                  <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-md">
                    <p className="text-sm text-blue-800 flex items-start">
                      <Sparkles className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-blue-500" />
                      <span>{geminiMessage}</span>
                    </p>
                  </div>
                )}
                
                {selectedImage && (
                  <div className="relative mb-4 w-40 h-40 mx-auto">
                    <NextImage
                      src={selectedImage}
                      alt="Selected"
                      fill
                      style={{ objectFit: 'contain' }}
                      className="rounded border p-1"
                    />
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-100 hover:bg-red-200 p-0" 
                      onClick={() => setSelectedImage(null)}
                    >
                      <X size={12} />
                    </Button>
                  </div>
                )}
                
                <div className="flex items-center gap-2 border rounded-full p-2 bg-white shadow-sm">
                  <Textarea 
                    placeholder="Enter your message here"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    className="flex-1 border-0 focus:ring-0 resize-none min-h-[40px] py-2 rounded-2xl"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full flex-shrink-0" 
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/*" 
                      onChange={handleImageUpload} 
                    />
                    <Cloud size={18} className="text-gray-500" />
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 flex-shrink-0"
                    onClick={handleSendMessage}
                    disabled={!chatInput.trim() && !selectedImage}
                  >
                    <Send size={18} className="text-white" />
                  </Button>
                </div>
                
                <div className="mt-4 text-right">
                  <Button
                    variant="outline"
                    className="rounded-full text-sm px-3 py-1 h-8"
                    onClick={handleGemini2Click}
                  >
                    <Edit className="mr-1 h-3 w-3" />
                    Edit with Gemini 2.0
                  </Button>
                </div>
                
                <div className="mt-4 text-center text-sm text-gray-500">
                  <p>Supported models: GPT-4o, Llama 3, Mistral AI, Claude 3.5 Sonnet</p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="background" className="w-full max-w-4xl mt-0 mx-auto">
            <Card className="border shadow-sm">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6">Background Removal</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col items-center">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg w-full aspect-square flex items-center justify-center mb-4 relative overflow-hidden">
                      {bgRemovalImage ? (
                        <div className="relative w-full h-full">
                          <NextImage 
                            src={bgRemovalImage} 
                            alt="Original" 
                            fill
                            style={{ objectFit: 'contain' }}
                            className="p-2" 
                          />
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="absolute top-2 right-2 bg-white/80 rounded-full" 
                            onClick={() => setBgRemovalImage(null)}
                          >
                            <X size={16} />
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center p-4">
                          <ImageIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                          <p className="text-gray-500 mb-4">Upload your product image</p>
                          <Button 
                            variant="outline" 
                            onClick={() => bgRemovalInputRef.current?.click()}
                            className="rounded-full"
                          >
                            <input 
                              type="file" 
                              ref={bgRemovalInputRef} 
                              className="hidden" 
                              accept="image/*" 
                              onChange={handleBgRemovalImageUpload} 
                            />
                            Select Image
                          </Button>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">Original Image</p>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg w-full aspect-square flex items-center justify-center bg-gray-50 mb-4 relative overflow-hidden">
                      {processedImage ? (
                        <div className="relative w-full h-full">
                          <NextImage 
                            src={processedImage} 
                            alt="Processed" 
                            fill
                            style={{ objectFit: 'contain' }}
                            className="p-2" 
                          />
                        </div>
                      ) : bgRemovalImage ? (
                        <div className="w-full h-full flex items-center justify-center">
                          <NextImage 
                            src={bgRemovalImage} 
                            alt="Ready to process" 
                            fill
                            style={{ objectFit: 'contain' }}
                            className="p-2 opacity-50" 
                          />
                          <div className="absolute text-center">
                            <p className="text-sm text-gray-500 mb-2">Press the button below to process</p>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center p-4">
                          <p className="text-gray-500">Processed result will appear here</p>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">Processed Image</p>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-center space-x-4">
                  {!processedImage ? (
                    <Button 
                      className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-2 rounded-full hover:from-indigo-600 hover:to-purple-700"
                      disabled={!bgRemovalImage || isProcessing}
                      onClick={handleRemoveBackground}
                    >
                      {isProcessing ? (
                        <>
                          <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-opacity-50 border-t-transparent rounded-full"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Remove Background
                        </>
                      )}
                    </Button>
                  ) : (
                    <div className="space-x-3">
                      <Button
                        className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-2 rounded-full hover:from-emerald-600 hover:to-teal-700"
                        onClick={handleSaveDraft}
                      >
                        <Save className="mr-2 h-4 w-4" />
                        Save to Drafts
                      </Button>
                      
                      <Button
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 rounded-full hover:from-blue-600 hover:to-indigo-700"
                        onClick={handleDownloadImage}
                      >
                        <Cloud className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  )}
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-md">
                  <p className="text-sm text-blue-800 flex items-start">
                    <Sparkles className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-blue-500" />
                    <span>
                      Our AI background removal technology is powered by advanced machine learning. 
                      For best results, use images with clear separation between the subject and background.
                    </span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="drafts" className="w-full max-w-4xl mt-0 mx-auto">
            <Card className="border shadow-sm">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6">Saved Drafts</h2>
                
                {savedDrafts.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {savedDrafts.map((draft, index) => (
                      <div key={index} className="relative aspect-square border rounded-lg overflow-hidden group">
                        <NextImage
                          src={draft}
                          alt={`Saved draft ${index + 1}`}
                          fill
                          style={{ objectFit: 'contain' }}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <Button size="sm" variant="outline" className="bg-white">
                            Use This Image
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <Save className="mx-auto h-10 w-10 text-gray-300 mb-4" />
                    <p className="text-gray-500">You don't have any saved drafts yet</p>
                    <p className="text-sm text-gray-400 mt-2">Process images and save them to see them here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}