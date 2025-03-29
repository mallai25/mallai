
'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Edit2, Eye, Trash2, Upload, X, Sparkles, Pencil } from "lucide-react";
import { FIREBASE_DB, FIREBASE_AUTH } from "@/FirebaseConfig";
import { doc, updateDoc, deleteDoc, collection, onSnapshot } from "firebase/firestore";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';

export default function DashboardComponent({ 
  userName, 
  allStepsCompleted, 
  showWelcome 
}: { 
  userName: string;
  allStepsCompleted: boolean;
  showWelcome: boolean;
}) {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [productImage, setProductImage] = useState(null);
  const fileInputRef = useRef(null);
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [aiPrompt, setAIPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editedProduct, setEditedProduct] = useState({
    name: '',
    description: '',
    category: '',
    weight: '',
    gtin: '',
    imageUrl: ''
  });
  const { toast } = useToast();
  
  useEffect(() => {
    const user = FIREBASE_AUTH.currentUser;
    if (!user) return;

    const productsCollection = collection(FIREBASE_DB, "listedProducts");
    const unsubscribe = onSnapshot(productsCollection, (snapshot) => {
      const productsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(productsData);
    });

    return () => unsubscribe();
  }, []);

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setViewOpen(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setEditedProduct({
      name: product.name || '',
      description: product.description || '',
      category: product.category || '',
      weight: product.weight || '',
      gtin: product.gtin || '',
      imageUrl: product.imageUrl || ''
    });
    setProductImage(product.imageUrl || null);
    setEditOpen(true);
  };

  const handleDeleteProduct = (product) => {
    setSelectedProduct(product);
    setDeleteOpen(true);
  };

  const confirmDeleteProduct = async () => {
    if (!selectedProduct) return;
    
    setLoading(true);
    try {
      await deleteDoc(doc(FIREBASE_DB, "listedProducts", selectedProduct.id));
      toast({
        title: "Product deleted",
        description: "The product has been removed successfully.",
      });
      setDeleteOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product: " + error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProductImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateImage = () => {
    setIsGenerating(true);
    // Simulate AI generation delay
    setTimeout(() => {
      setIsGenerating(false);
      setShowAIDialog(false);
      // This would be where the actual AI image generation would happen
    }, 2000);
  };

  const saveEditedProduct = async () => {
    if (!selectedProduct) return;
    
    setLoading(true);
    try {
      const productRef = doc(FIREBASE_DB, "listedProducts", selectedProduct.id);
      
      // Update product data in Firestore
      await updateDoc(productRef, {
        name: editedProduct.name,
        description: editedProduct.description,
        category: editedProduct.category,
        weight: editedProduct.weight,
        gtin: editedProduct.gtin,
        imageUrl: productImage || editedProduct.imageUrl
      });
      
      toast({
        title: "Product updated",
        description: "The product has been updated successfully.",
      });
      setEditOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update product: " + error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <div className="relative h-48 bg-gray-100">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-contain"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-400">No image</p>
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <div className="mb-4">
                <h3 className="font-semibold text-lg truncate">{product.name}</h3>
                <p className="text-gray-500 text-sm">{product.category}</p>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2 mb-4">{product.description}</p>
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewProduct(product)}
                >
                  <Eye className="mr-1 h-4 w-4" />
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditProduct(product)}
                >
                  <Edit2 className="mr-1 h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteProduct(product)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="mr-1 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* View Product Dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Product Details</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-4">
              <div className="relative h-64 bg-gray-100 rounded-md overflow-hidden">
                {selectedProduct.imageUrl ? (
                  <Image
                    src={selectedProduct.imageUrl}
                    alt={selectedProduct.name}
                    fill
                    className="object-contain"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-400">No image</p>
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-xl">{selectedProduct.name}</h3>
                <p className="text-gray-500">{selectedProduct.category}</p>
              </div>
              <div>
                <p className="text-gray-700">{selectedProduct.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Weight</p>
                  <p>{selectedProduct.weight}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">GTIN</p>
                  <p>{selectedProduct.gtin}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <Input
                      id="edit-name"
                      value={editedProduct.name}
                      onChange={(e) => setEditedProduct({...editedProduct, name: e.target.value})}
                    />
                  </div>

                  <div>
                    <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <Textarea
                      id="edit-description"
                      value={editedProduct.description}
                      onChange={(e) => setEditedProduct({...editedProduct, description: e.target.value})}
                      className="h-24"
                    />
                  </div>

                  <div>
                    <label htmlFor="edit-category" className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <Input
                      id="edit-category"
                      value={editedProduct.category}
                      onChange={(e) => setEditedProduct({...editedProduct, category: e.target.value})}
                    />
                  </div>

                  <div>
                    <label htmlFor="edit-weight" className="block text-sm font-medium text-gray-700 mb-1">
                      Weight
                    </label>
                    <Input
                      id="edit-weight"
                      value={editedProduct.weight}
                      onChange={(e) => setEditedProduct({...editedProduct, weight: e.target.value})}
                    />
                  </div>

                  <div>
                    <label htmlFor="edit-gtin" className="block text-sm font-medium text-gray-700 mb-1">
                      GTIN
                    </label>
                    <Input
                      id="edit-gtin"
                      value={editedProduct.gtin}
                      onChange={(e) => setEditedProduct({...editedProduct, gtin: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Image
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    {!productImage ? (
                      <div className="flex flex-col items-center justify-center h-[240px]">
                        <div className="flex space-x-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Image
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowAIDialog(true)}
                          >
                            <Sparkles className="w-4 h-4 mr-2" />
                            Generate with AI
                          </Button>
                        </div>
                        <p className="mt-2 text-sm text-gray-500 text-center">
                          Drag and drop or select an option
                        </p>
                      </div>
                    ) : (
                      <div className="relative w-full h-[240px]">
                        <Image
                          src={productImage}
                          alt="Product Preview"
                          fill
                          style={{ objectFit: 'contain' }}
                          className="rounded-lg"
                        />
                        <div className="absolute top-2 right-2 flex space-x-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full bg-black/40 hover:bg-black/60 z-10"
                            onClick={() => setShowEditDialog(true)}
                          >
                            <Pencil className="h-4 w-4 text-white" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full bg-black/40 hover:bg-black/60 z-10"
                            onClick={() => setProductImage(null)}
                          >
                            <X className="h-4 w-4 text-white" />
                          </Button>
                        </div>
                      </div>
                    )}
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-4">
                <Button variant="outline" onClick={() => setEditOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={saveEditedProduct} disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete this product? This action cannot be undone.</p>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDeleteProduct}
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* AI Image Generation Dialog */}
      <Dialog open={showAIDialog} onOpenChange={setShowAIDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Generate Product Image with AI</DialogTitle>
            <DialogDescription>
              Describe the product image you'd like to generate.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Enter a detailed description of the product image you want to generate..."
              value={aiPrompt}
              onChange={(e) => setAIPrompt(e.target.value)}
              className="h-32"
            />
            <div className="mt-4 p-4 rounded-md bg-blue-50 border border-blue-100">
              <p className="text-sm text-blue-800 flex items-center">
                <Sparkles className="w-4 h-4 mr-2 text-blue-500" />
                This feature will be available soon! We're working on integrating advanced AI image generation.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAIDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleGenerateImage} 
              disabled={!aiPrompt.trim() || isGenerating}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
            >
              {isGenerating ? "Generating..." : "Generate Image"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Image</DialogTitle>
            <DialogDescription>
              Enhance your product image with AI-powered editing tools.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="relative w-full h-[240px] rounded-md overflow-hidden mb-4">
              {productImage && (
                <Image
                  src={productImage}
                  alt="Product Preview"
                  fill
                  style={{ objectFit: 'contain' }}
                />
              )}
            </div>
            <div className="flex justify-between items-center space-x-2">
              <Button variant="outline" size="sm">
                Enhance
              </Button>
              <Button variant="outline" size="sm">
                Remove Background
              </Button>
              <Button variant="outline" size="sm">
                Crop
              </Button>
            </div>
            <div className="mt-4 p-4 rounded-md bg-blue-50 border border-blue-100">
              <p className="text-sm text-blue-800 flex items-center">
                <Sparkles className="w-4 h-4 mr-2 text-blue-500" />
                Advanced image editing powered by Gemini 2.0 will be available soon!
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowEditDialog(false)}>
              Apply Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}