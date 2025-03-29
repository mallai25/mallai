'use client';

import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
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
  Cloud,
  Check,
  Trash2
} from 'lucide-react';
import NextImage from 'next/image';
import { getAuth } from "firebase/auth";
import { doc, updateDoc, getDoc, arrayUnion } from 'firebase/firestore';
import { FIREBASE_DB } from '../../FirebaseConfig';

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
  const [isSaved, setIsSaved] = useState(false);
  interface DraftImage {
    url: string;
    createdAt: string;
  }
  const [savedDrafts, setSavedDrafts] = useState<(string | DraftImage)[]>([]);
  const [geminiMessage, setGeminiMessage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  const { toast } = useToast();
  
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
      { id: 1, role: 'system', content: 'Create a product image or upload & edit one' }
  ]);

  // Simulate loading saved drafts from Firebase
  useEffect(() => {
    const unsubscribe = getAuth().onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
        // Fetch existing drafts
        fetchUserDrafts(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchUserDrafts = async (userId: string) => {
    try {
      const userDoc = await getDoc(doc(FIREBASE_DB, 'users', userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setSavedDrafts(userData.draftImages || []);
      }
    } catch (error) {
      console.error('Error fetching drafts:', error);
      toast({
        title: "Error",
        description: "Failed to load saved drafts",
        variant: "destructive"
      });
    }
  };

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
        content: `I analyzed your request. Here's a suggested response based on your input.`,
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
        // Upload to Cloudinary first
        const cloudinaryUrl = await uploadImage(file);
        
        if (cloudinaryUrl) {
          setSelectedFile(file);
          setBgRemovalImage(cloudinaryUrl);
          setProcessedImage(null); // Clear any previous processed image
          
          toast({
            title: "Success",
            description: "Image uploaded successfully",
          });
        }
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
    toast({
      title: "Processing image",
      description: "Removing background from your product image...",
    });
    
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
      // Convert blob URL to blob
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

  const handleSaveDraft = async () => {
    if (!processedImage || !currentUser) return;
    
    try {
      setIsProcessing(true);
      // Upload processed image to Cloudinary
      const formData = new FormData();
      const response = await fetch(processedImage);
      const blob = await response.blob();
      formData.append('image', blob);
      
      const cloudinaryResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/upload`,
        formData
      );

      if (!cloudinaryResponse.data.success) {
        throw new Error('Failed to upload to Cloudinary');
      }

      const cloudinaryUrl = cloudinaryResponse.data.data.secure_url;
      
      // Save to Firebase with metadata
      const userRef = doc(FIREBASE_DB, 'users', currentUser.uid);
      const newDraft = {
        url: cloudinaryUrl,
        createdAt: new Date().toISOString(),
        type: 'processedImage'
      };

      await updateDoc(userRef, {
        draftImages: arrayUnion(newDraft)
      });

      // Update local state
      setSavedDrafts(prev => [...prev, newDraft]);
      setIsSaved(true);
      
      toast({
        title: "Success",
        description: "Image saved to drafts successfully",
      });

      // Reset saved state after 2 seconds
      setTimeout(() => {
        setIsSaved(false);
      }, 2000);
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
    setGeminiMessage("Coming soon! Gemini 2.0 advanced image editing capabilities.");
    
    setTimeout(() => {
      setGeminiMessage(null);
    }, 6000);
  };

  const handleDeleteDraft = async (draftToDelete: string | DraftImage) => {
    if (!currentUser) return;
    
    try {
      const userRef = doc(FIREBASE_DB, 'users', currentUser.uid);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const currentDrafts = userDoc.data().draftImages || [];
        const updatedDrafts = currentDrafts.filter((draft: string | DraftImage) => {
          if (typeof draft === 'string' && typeof draftToDelete === 'string') {
            return draft !== draftToDelete;
          }
          if (typeof draft === 'object' && typeof draftToDelete === 'object') {
            return draft.url !== draftToDelete.url;
          }
          return true;
        });
        
        await updateDoc(userRef, {
          draftImages: updatedDrafts
        });
        
        setSavedDrafts(updatedDrafts);
        
        toast({
          title: "Success",
          description: "Draft deleted successfully",
        });
      }
    } catch (error) {
      console.error('Error deleting draft:', error);
      toast({
        title: "Error",
        description: "Failed to delete draft",
        variant: "destructive"
      });
    }
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

  const renderDraftsContent = () => (
    <Card className="border-none shadow-none p-0">
      <CardContent className="p-6">                
        {savedDrafts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {savedDrafts.map((draft, index) => (
              <div key={index} className="relative aspect-square border rounded-lg overflow-hidden group">
                <NextImage
                  src={typeof draft === 'string' ? draft : draft.url}
                  alt={`Saved draft ${index + 1}`}
                  fill
                  style={{ objectFit: 'contain' }}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="bg-white/90 hover:bg-white absolute transform -translate-y-8"
                    onClick={() => handleUseDraftImage(typeof draft === 'string' ? draft : draft.url)}
                  >
                    Use Image
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="absolute bottom-2 right-2 h-8 w-8 p-0 bg-white/80 hover:bg-red-50 hover:text-red-600 rounded-full"
                    onClick={() => handleDeleteDraft(draft)}
                  >
                    <Trash2 className="h-4 w-4" />
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
  );

  return (
    <div className="flex lg:h-full flex-col lg:flex-row">
      {/* Side tabs - becomes top tabs on mobile */}
      <div className={`chat-sidebar block border-b lg:border-b-0 lg:border-r ${tabsMinimized ? 'minimized' : 'expanded'} ${tabsMinimized ? 'sidebar-animate-out' : 'sidebar-animate-in'}`}>
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className={`font-medium ${tabsMinimized ? 'hidden' : 'block'}`}>AI Tools</h3>
          <Button 
            variant="ghost" 
            size="sm" 
            className="rounded-full hidden lg:block" // Hide minimize button on mobile
            onClick={() => setTabsMinimized(!tabsMinimized)}
          >
            {tabsMinimized ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </Button>
        </div>
        <div className="p-2 lg:mt-10 lg:-ml-2">
          <Tabs 
            defaultValue="chat" 
            value={activeTab} 
            onValueChange={setActiveTab} 
            orientation={window.innerWidth >= 1024 ? "vertical" : "horizontal"} // Change orientation based on screen size
            className="w-full"
          >
            <TabsList className={`flex lg:flex-col w-full space-y-0 lg:space-y-1 space-x-1 lg:space-x-0 bg-transparent ${tabsMinimized ? 'lg:items-center' : ''}`}>
              <TabsTrigger 
                value="chat" 
                className={`ai-tab-trigger rounded-xl flex-1 lg:flex-none justify-center lg:justify-start text-center lg:text-left px-3 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm w-full ${tabsMinimized ? 'lg:justify-center' : ''}`}
              >
                <MessageCircle className="lg:mr-2 h-4 w-4" />
                <span className={`${tabsMinimized ? 'lg:hidden' : ''} hidden lg:inline-block`}>Chat</span>
              </TabsTrigger>
              <TabsTrigger 
                value="background" 
                className={`ai-tab-trigger rounded-xl flex-1 lg:flex-none justify-center lg:justify-start text-center lg:text-left px-3 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm w-full ${tabsMinimized ? 'lg:justify-center' : ''}`}
              >
                <ImageIcon className="lg:mr-2 h-4 w-4" />
                <span className={`${tabsMinimized ? 'lg:hidden' : ''} hidden lg:inline-block`}>Remove Background</span>
              </TabsTrigger>
              <TabsTrigger 
                value="drafts" 
                className={`ai-tab-trigger rounded-xl flex-1 lg:flex-none justify-center lg:justify-start text-center lg:text-left px-3 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm w-full ${tabsMinimized ? 'lg:justify-center' : ''}`}
              >
                <Save className="lg:mr-2 h-4 w-4" />
                <span className={`${tabsMinimized ? 'lg:hidden' : ''} hidden lg:inline-block`}>Saved Drafts</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center p-2">
        <Tabs value={activeTab} className="w-full">
          <TabsContent value="chat" className="w-full mt-2 md:mt-0 mx-auto">
            <div className="flex flex-col items-center">
              <h1 className="text-3xl text-center font-bold mb-6">What will you create?</h1>
            
              <div className="w-full chat-prompt-area py-6 px-2 md:px-6 relative"> {/* Added relative positioning */}
                <div className="mb-4 max-h-[38vh] overflow-y-auto">
                  {chatMessages.map((message) => (
                    <div 
                      key={message.id} 
                      className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}
                    >
                      <div 
                        className={`inline-block max-w-[80%] px-4 py-2 rounded-2xl bg-white border ${
                          message.role === 'user' 
                            ? 'border-blue-100 shadow-[0_2px_8px_rgba(0,0,0,0.05)] ' 
                            : 'bg-gray-50 text-gray-900'
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
                      <NextImage
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
                      placeholder="Enter product image you want to generate"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      className="flex-1 border-0 focus:ring-0 resize-none min-h-[40px] py-3 px-4 rounded-2xl bg-transparent"
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
                    <Cloud size={18} className="text-gray-500" />
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
                
                <div className="mt-4 flex flex-col sm:flex-row justify-between gap-4 sm:gap-2">
                  <div className="flex items-center gap-2 border rounded-full px-3 py-1.5 w-full sm:w-[330px] order-2 sm:order-1">
                    <div className="flex items-center justify-center w-5 h-5 rounded-full border border-gray-200">
                      <div className="w-2 h-2 rounded-full bg-red-400"></div>
                    </div>
                    <span className="text-sm text-gray-500 whitespace-nowrap">API Connected</span>
                    <span className="text-sm text-gray-400 border-l pl-2 ml-2 truncate">GPT-4o, Gemini 2.0</span>
                  </div>
                  <Button
                    variant="outline"
                    className="rounded-full text-sm px-3 py-1 h-8 w-full sm:w-auto order-1 sm:order-2"
                    onClick={handleGemini2Click}
                  >
                    <Edit className="mr-1 h-3 w-3" />
                    <span className="whitespace-nowrap">Edit with Gemini 2.0</span>
                  </Button>
                </div>
                
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="background" className="w-full max-w-4xl mt-0 mx-auto">
            <Card className="border-none shadow-none p-0">
              <CardContent>       
              <div className="mb-6 flex justify-center space-x-4">
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
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 rounded-full hover:from-blue-600 hover:to-indigo-700"
                        onClick={() => handleUseDraftImage(processedImage, true)}
                      >
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Use Image
                      </Button>
                      <Button
                        className={`${
                          isSaved 
                            ? 'bg-emerald-500 hover:bg-emerald-600' 
                            : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700'
                        } text-white px-6 py-2 rounded-full transition-all duration-200`}
                        onClick={handleSaveDraft}
                        disabled={isProcessing || isSaved}
                      >
                        {isSaved ? (
                          <>
                            <Check className="mr-2 h-4 w-4" />
                            Saved
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Save to Drafts
                          </>
                        )}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col items-center">
                    <div className="border-2 border-dashed border-gray-300 rounded-2xl w-full aspect-square flex items-center justify-center mb-4 relative overflow-hidden">
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
                    <div className="border-2 border-dashed border-gray-300 rounded-2xl w-full aspect-square flex items-center justify-center bg-gray-50 mb-4 relative overflow-hidden">
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
                
                
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="drafts" className="w-full max-w-4xl mt-0 mx-auto">
            {renderDraftsContent()}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}