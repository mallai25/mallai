'use client';

import { useState, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { 
  MessageCircle, 
  Image as ImageIcon, 
  Send, 
  X, 
  Sparkles, 
  Save,
  Cloud,
  Edit,
  ArrowLeft,
  Check
} from 'lucide-react';
import Image from 'next/image';
import axios from 'axios';

interface ChatMessage {
  id: number;
  role: string;
  content: string;
  imageUrl?: string | null;
}

interface AIGenerationInlineProps {
  onSelectImage: (imageUrl: string) => void;
}

export function AIGenerationInline({ onSelectImage }: AIGenerationInlineProps) {
  const [activeTab, setActiveTab] = useState("chat");
  const [chatInput, setChatInput] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bgRemovalInputRef = useRef<HTMLInputElement>(null);
  const [bgRemovalImage, setBgRemovalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [geminiMessage, setGeminiMessage] = useState<string | null>(null);
  const [savedDrafts, setSavedDrafts] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { toast } = useToast();
  
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: 1, role: 'system', content: 'Create a product image or upload & edit one' }
  ]);

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
    
    // Simulate AI response
    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'system',
        content: `I analyzed your request. Here's a suggested product image based on your input.`,
        imageUrl: selectedImage // For demo purposes we just show the same image back
      }]);
    }, 1000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
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

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/upload`, 
        formData
      );
      if (response.data.success) {
        return response.data.data.secure_url;
      }
      return null;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const handleBgRemovalImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsProcessing(true);
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setBgRemovalImage(event.target.result as string);
            setProcessedImage(null);
          }
        };
        reader.readAsDataURL(file);
        
        toast({
          title: "Success",
          description: "Image uploaded successfully",
        });
      } catch (error) {
        console.error('Error uploading image:', error);
        toast({
          title: "Error",
          description: "Failed to upload image",
          variant: "destructive"
        });
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleRemoveBackground = async () => {
    if (!selectedFile) return;
    
    setIsProcessing(true);
    setError(null);

    const formData = new FormData();
    formData.append('image_file', selectedFile);
    formData.append('size', 'auto');

    try {
      const response = await axios.post('https://api.remove.bg/v1.0/removebg', formData, {
        headers: {
          'X-Api-Key': 'EQAoTQVbrwdo5mcaRjfWKRab',
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'image/png' });
      const url = URL.createObjectURL(blob);
      setProcessedImage(url);
      
      toast({
        title: "Background removed",
        description: "Your image has been processed successfully.",
      });
    } catch (error) {
      console.error('Error removing background:', error);
      toast({
        title: "Error",
        description: "Failed to remove background. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const uploadToCloudinary = async (imageUrl: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      
      const formData = new FormData();
      formData.append('image', blob);

      const uploadResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/upload`,
        formData
      );

      if (uploadResponse.data.success) {
        return uploadResponse.data.data.secure_url;
      }
      throw new Error('Failed to upload to Cloudinary');
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      throw error;
    }
  };

  const handleSaveToDrafts = async (imageUrl: string) => {
    try {
      setIsProcessing(true);
      const cloudinaryUrl = await uploadToCloudinary(imageUrl);
      
      if (cloudinaryUrl) {
        setSavedDrafts(prev => [...prev, cloudinaryUrl]);
        setIsSaved(true);
        
        toast({
          title: "Success",
          description: "Image saved to drafts successfully",
        });

        setTimeout(() => {
          setIsSaved(false);
        }, 2000);
      }
    } catch (error) {
      console.error('Error saving draft:', error);
      toast({
        title: "Error",
        description: "Failed to save draft",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUseImage = (imageUrl: string) => {
    if (imageUrl) {
      onSelectImage(imageUrl);
    }
  };

  const handleGemini2Click = () => {
    setGeminiMessage("Coming soon! Gemini 2.0 advanced image editing capabilities.");
    
    setTimeout(() => {
      setGeminiMessage(null);
    }, 6000);
  };

  const handleUseDraftImage = async (imageUrl: string, isProcessedImage: boolean = false) => {
    try {
      let blob;
      if (isProcessedImage) {
        // If it's a processed image (blob URL), we already have the blob
        blob = await fetch(imageUrl).then(r => r.blob());
      } else {
        // If it's a remote URL (from drafts), fetch it first
        blob = await fetch(imageUrl).then(r => r.blob());
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSelectedImage(event.target.result as string);
          setActiveTab("chat");
        }
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error('Error loading image:', error);
      toast({
        title: "Error",
        description: "Failed to load image",
        variant: "destructive"
      });
    }
  };

  const renderChatContent = () => (
    <div className="flex flex-col items-center">
      <div className="w-full chat-prompt-area py-6 px-2 md:px-6 relative">
        <div className="mb-4 max-h-[38vh] overflow-y-auto">
          {chatMessages.map((message) => (
            <div 
              key={message.id} 
              className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}
            >
              <div 
                className={`inline-block max-w-[80%] px-4 py-2 rounded-2xl ${
                  message.role === 'user' 
                    ? 'bg-white border border-blue-100 shadow-sm' 
                    : 'bg-gray-50 text-gray-900'
                }`}
              >
                {message.imageUrl && (
                  <div className="mb-2">
                    <div className="relative w-[200px] h-[150px] mx-auto">
                      <Image 
                        src={message.imageUrl} 
                        alt="Image" 
                        fill
                        style={{ objectFit: 'contain' }}
                        className="rounded"
                      />
                    </div>
                    {message.role === 'system' && (
                      <div className="mt-2">
                        <Button 
                          size="sm" 
                          className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                          onClick={() => handleUseImage(message.imageUrl!)}
                        >
                          Use This Image
                        </Button>
                      </div>
                    )}
                  </div>
                )}
                <p>{message.content}</p>
              </div>
            </div>
          ))}
        </div>
        
        {geminiMessage && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-2xl">
            <p className="text-sm text-blue-800 flex items-start">
              <Sparkles className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-blue-500" />
              <span>{geminiMessage}</span>
            </p>
          </div>
        )}

        {selectedImage && (
          <div className="-left-2 w-16 h-16 z-10">
            <div className="relative w-full h-full">
              <Image
                src={selectedImage}
                alt="Selected"
                fill
                style={{ objectFit: 'contain' }}
                className="rounded-xl border shadow-sm p-1 bg-white"
              />
              <Button 
                variant="ghost" 
                size="sm" 
                className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-100 hover:bg-red-200 p-0" 
                onClick={() => setSelectedImage(null)}
              >
                <X size={10} />
              </Button>
            </div>
          </div>
        )}
        
        <div className="flex items-center gap-2 p-3 rounded-3xl bg-gray-50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] border border-gray-100">
          <div className="flex-1 bg-white rounded-2xl shadow-[4px_4px_10px_rgba(0,0,0,0.1),-4px_-4px_10px_rgba(255,255,255,0.9)]">
            <Textarea 
              placeholder="Enter the product image "
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 border-0 resize-none min-h-[40px] py-3 px-4 rounded-2xl bg-transparent"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full flex-shrink-0 bg-white shadow-[4px_4px_10px_rgba(0,0,0,0.1),-4px_-4px_10px_rgba(255,255,255,0.9)] hover:shadow-[inset_4px_4px_10px_rgba(0,0,0,0.1),inset_-4px_-4px_10px_rgba(255,255,255,0.9)] transition-shadow" 
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleImageUpload} 
            />
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
              <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/>
              <path d="M12 12v9"/>
              <path d="m16 16-4-4-4 4"/>
            </svg>
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full flex-shrink-0 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-[4px_4px_10px_rgba(0,0,0,0.1)] hover:shadow-[inset_4px_4px_10px_rgba(0,0,0,0.2)] transition-shadow"
            onClick={handleSendMessage}
            disabled={!chatInput.trim() && !selectedImage}
          >
            <Send size={18} className="text-white" />
          </Button>
        </div>
        
        <div className="mt-4 flex justify-end">
          <Button
            variant="outline"
            className="rounded-full text-sm px-3 py-1 h-8"
            onClick={handleGemini2Click}
          >
            <Edit className="mr-1 h-3 w-3" />
            <span className="whitespace-nowrap">Edit with Gemini 2.0</span>
          </Button>
        </div>
      </div>
    </div>
  );

  const renderBackgroundRemoverContent = () => (
    <Card className="border-none shadow-none p-0">
      <CardContent>       
        <div className="mb-6 flex flex-wrap justify-center gap-2 sm:gap-4">
          {!processedImage ? (
            <div 
              className={`inline-flex items-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 sm:px-6 py-2 rounded-full text-sm hover:from-indigo-600 hover:to-purple-700 cursor-pointer transition-all ${
                (!bgRemovalImage || isProcessing) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={() => {
                if (!bgRemovalImage || isProcessing) return;
                handleRemoveBackground();
              }}
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
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              <div
                className="inline-flex items-center bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 sm:px-6 py-2 rounded-full hover:from-green-600 hover:to-emerald-700 cursor-pointer transition-all"
                onClick={() => onSelectImage(processedImage)}
              >
                <ImageIcon className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                Choose
              </div>
              <div
                className="inline-flex items-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-3 sm:px-6 py-2 rounded-full hover:from-blue-600 hover:to-indigo-700 cursor-pointer transition-all"
                onClick={() => handleUseDraftImage(processedImage, true)}
              >
                <MessageCircle className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                Use
              </div>
              <Button
                className={`text-sm px-3 sm:px-6 ${
                  isSaved 
                    ? 'bg-emerald-500 hover:bg-emerald-600' 
                    : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700'
                } text-white px-6 py-2 rounded-full transition-all duration-200`}
                onClick={() => handleSaveToDrafts(processedImage)}
                disabled={isProcessing || isSaved}
              >
                {isSaved ? (
                  <>
                    <Check className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    Saved
                  </>
                ) : (
                  <>
                    <Save className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    Save
                  </>
                )}
              </Button>
              <div
                className="inline-flex items-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-3 sm:px-6 py-2 rounded-full hover:from-blue-600 hover:to-indigo-700 cursor-pointer transition-all"
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = processedImage;
                  link.download = `processed-image-${Date.now()}.png`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
              >
                <Cloud className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                Download
              </div>
            </div>
          )}
        </div>         
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div className="flex flex-col items-center">
            <div className="border-2 border-dashed border-gray-300 rounded-2xl w-full aspect-square flex items-center justify-center mb-4 overflow-hidden">
              {bgRemovalImage ? (
                <div className="relative w-full h-full">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Image 
                      src={bgRemovalImage} 
                      alt="Original" 
                      width={400}
                      height={400}
                      style={{ objectFit: 'contain', maxWidth: '100%', maxHeight: '100%' }}
                      className="p-2" 
                    />
                  </div>
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
                  <div 
                    className="inline-flex items-center px-4 py-2 rounded-full border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => bgRemovalInputRef.current?.click()}
                  >
                    <input 
                      type="file" 
                      ref={bgRemovalInputRef} 
                      className="hidden" 
                      accept="image/*" 
                      onChange={handleBgRemovalImageUpload} 
                    />
                    Select Image
                  </div>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-500">Original Image</p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="border-2 border-dashed border-gray-300 rounded-2xl w-full aspect-square flex items-center justify-center bg-gray-50 mb-4 overflow-hidden">
              {processedImage ? (
                <div className="relative w-full h-full">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Image 
                      src={processedImage} 
                      alt="Processed" 
                      width={400}
                      height={400}
                      style={{ objectFit: 'contain', maxWidth: '100%', maxHeight: '100%' }}
                      className="p-2" 
                    />
                  </div>
                </div>
              ) : bgRemovalImage ? (
                <div className="w-full h-full flex items-center justify-center relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Image 
                      src={bgRemovalImage} 
                      alt="Ready to process" 
                      width={400}
                      height={400}
                      style={{ objectFit: 'contain', maxWidth: '100%', maxHeight: '100%' }}
                      className="p-2 opacity-50" 
                    />
                  </div>
                  <div className="absolute text-center z-10">
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
      </CardContent>
    </Card>
  );

  const renderDraftsContent = () => (
    <div className="p-2 sm:p-4">
      {savedDrafts.length === 0 ? (
        <div className="text-center py-6 sm:py-8">
          <ImageIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500">No saved drafts yet</p>
          <p className="text-sm text-gray-400 mt-2">
            Process images and save them to drafts to see them here
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4">
          {savedDrafts.map((imageUrl, index) => (
            <div key={index} className="relative group">
              <div className="border rounded-lg overflow-hidden aspect-square relative">
                <Image
                  src={imageUrl}
                  alt={`Draft ${index + 1}`}
                  fill
                  style={{ objectFit: 'contain' }}
                  className="p-2"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div
                    className="inline-flex items-center px-4 py-2 rounded-lg bg-white hover:bg-gray-100 cursor-pointer transition-colors text-sm font-medium"
                    onClick={() => handleUseDraftImage(imageUrl)}
                  >
                    Use Image
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full">
      <Tabs defaultValue="chat" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4 flex space-x-1 rounded-full bg-white p-1 w-full max-w-[360px] mx-auto border-none">
          <TabsTrigger 
            value="chat" 
            className="rounded-full flex-1 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <MessageCircle className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Generate Image</span>
            <span className="sm:hidden">Generate</span>
          </TabsTrigger>
          <TabsTrigger 
            value="background" 
            className="rounded-full flex-1 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <ImageIcon className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Remove Background</span>
            <span className="sm:hidden">Remove BG</span>
          </TabsTrigger>
          <TabsTrigger 
            value="drafts" 
            className="rounded-full flex-1 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <Save className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Saved Drafts</span>
            <span className="sm:hidden">Drafts</span>
          </TabsTrigger>
        </TabsList>
      
        <TabsContent value="chat" className="w-full mt-0 px-0 sm:px-4">
          {renderChatContent()}
        </TabsContent>
        
        <TabsContent value="background" className="w-full mt-0 px-0 sm:px-4">
          {renderBackgroundRemoverContent()}
        </TabsContent>

        <TabsContent value="drafts" className="w-full mt-0 px-0 sm:px-4">
          {renderDraftsContent()}
        </TabsContent>
      </Tabs>
    </div>
  );
}