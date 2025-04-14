"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, GripVertical, X } from "lucide-react"
import Image from "next/image"
import { FIREBASE_DB } from "../../../FirebaseConfig"
import { doc, updateDoc } from "firebase/firestore"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

import { arrayMove } from "@dnd-kit/sortable"

interface EditProductDialogProps {
  product: any
  open: boolean
  onOpenChange: (open: boolean) => void
  onProductUpdated: () => void
}

// Create a SortableItem component for the similar products
function SortableItem({ id, item, onRemove }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} className="mb-3">
      <Card className="border border-gray-200 hover:border-blue-300 transition-colors">
        <CardContent className="p-3 flex items-center">
          <div
            className="cursor-grab active:cursor-grabbing p-2 mr-2 text-gray-400 hover:text-gray-600 transition-colors"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-5 w-5" />
          </div>
          <div className="flex-shrink-0 relative w-12 h-12 rounded-md overflow-hidden mr-3 bg-gray-100">
            <Image
              src={item.imageUrl || "/placeholder.svg"}
              alt={item.name || "Product variant"}
              fill
              className="object-contain"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{item.name}</p>
            {item.price && <p className="text-xs text-emerald-600 font-semibold">{item.price}</p>}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="ml-2 text-gray-400 hover:text-red-500 transition-colors"
            onClick={() => onRemove(id)}
          >
            <X className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export function EditProductDialog({ product, open, onOpenChange, onProductUpdated }: EditProductDialogProps) {
  const [name, setName] = useState("")
  const [brand, setBrand] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [priceUnit, setPriceUnit] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [weight, setWeight] = useState("")
  const [similarProducts, setSimilarProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [newSimilarProduct, setNewSimilarProduct] = useState({
    name: "",
    price: "",
    imageUrl: "",
    description: "",
  })

  // Set up DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  useEffect(() => {
    if (product) {
      setName(product.name || "")
      setBrand(product.brand || "")
      setCategory(product.category || "")
      setDescription(product.description || "")
      setPrice(product.price || "")
      setPriceUnit(product.priceUnit || "")
      setImageUrl(product.imageUrl || product.imageSrc || "")
      setWeight(product.weight || "")
      setSimilarProducts(product.similarProducts || [])
    }
  }, [product])

  const handleAddSimilarProduct = () => {
    if (newSimilarProduct.name && newSimilarProduct.imageUrl) {
      const newId = Date.now().toString()
      setSimilarProducts([
        ...similarProducts,
        {
          ...newSimilarProduct,
          id: newId,
        },
      ])
      setNewSimilarProduct({
        name: "",
        price: "",
        imageUrl: "",
        description: "",
      })
    }
  }

  const handleRemoveSimilarProduct = (id: string) => {
    setSimilarProducts(similarProducts.filter((item) => item.id !== id))
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over.id) {
      setSimilarProducts((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)

        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const handleSaveChanges = async () => {
    if (!product || !product.id) return

    setLoading(true)
    try {
      const productRef = doc(FIREBASE_DB, "listingsMade", product.id)
      await updateDoc(productRef, {
        name,
        brand,
        category,
        description,
        price,
        priceUnit,
        imageUrl,
        weight,
        similarProducts,
        updatedAt: new Date(),
      })

      onProductUpdated()
      onOpenChange(false)
    } catch (error) {
      console.error("Error updating product:", error)
      alert("Failed to update product. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Input id="brand" value={brand} onChange={(e) => setBrand(e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beverage">Beverage</SelectItem>
                  <SelectItem value="Coffee">Coffee</SelectItem>
                  <SelectItem value="Snacks">Snacks</SelectItem>
                  <SelectItem value="Breakfast">Breakfast</SelectItem>
                  <SelectItem value="Personal Care">Personal Care</SelectItem>
                  <SelectItem value="Alcohol">Alcohol</SelectItem>
                  <SelectItem value="Supplements">Supplements</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Weight</Label>
              <Input id="weight" value={weight} onChange={(e) => setWeight(e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input id="price" value={price} onChange={(e) => setPrice(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="priceUnit">Price Unit</Label>
              <Input
                id="priceUnit"
                value={priceUnit}
                onChange={(e) => setPriceUnit(e.target.value)}
                placeholder="e.g., pack, bag, bottle"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <div className="flex gap-2">
              <Input id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
              {imageUrl && (
                <div className="flex-shrink-0 relative w-10 h-10 rounded-md overflow-hidden bg-gray-100">
                  <Image src={imageUrl || "/placeholder.svg"} alt={name} fill className="object-contain" />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <Label>Similar Products</Label>
              <span className="text-xs text-gray-500">Drag to reorder</span>
            </div>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={similarProducts.map((item) => item.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                  {similarProducts.map((item) => (
                    <SortableItem key={item.id} id={item.id} item={item} onRemove={handleRemoveSimilarProduct} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            <Card className="border-dashed border-gray-300">
              <CardContent className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="similarName" className="text-xs">
                      Name
                    </Label>
                    <Input
                      id="similarName"
                      value={newSimilarProduct.name}
                      onChange={(e) => setNewSimilarProduct({ ...newSimilarProduct, name: e.target.value })}
                      placeholder="Variant name"
                      className="h-8 text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="similarPrice" className="text-xs">
                      Price
                    </Label>
                    <Input
                      id="similarPrice"
                      value={newSimilarProduct.price}
                      onChange={(e) => setNewSimilarProduct({ ...newSimilarProduct, price: e.target.value })}
                      placeholder="Optional"
                      className="h-8 text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="similarImageUrl" className="text-xs">
                    Image URL
                  </Label>
                  <Input
                    id="similarImageUrl"
                    value={newSimilarProduct.imageUrl}
                    onChange={(e) => setNewSimilarProduct({ ...newSimilarProduct, imageUrl: e.target.value })}
                    placeholder="Image URL"
                    className="h-8 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="similarDescription" className="text-xs">
                    Description
                  </Label>
                  <Input
                    id="similarDescription"
                    value={newSimilarProduct.description}
                    onChange={(e) => setNewSimilarProduct({ ...newSimilarProduct, description: e.target.value })}
                    placeholder="Optional"
                    className="h-8 text-sm"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full mt-2"
                  onClick={handleAddSimilarProduct}
                  disabled={!newSimilarProduct.name || !newSimilarProduct.imageUrl}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Similar Product
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSaveChanges} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
