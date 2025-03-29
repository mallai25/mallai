
import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Barcode, Plus, X, Save, Edit } from "lucide-react";
import { FIREBASE_DB } from '@/FirebaseConfig';
import { getAuth } from "firebase/auth";
import { doc, updateDoc } from 'firebase/firestore';

interface BarcodeManagerProps {
  initialBarcodes: any[];
  onUpdate?: (barcodes: any[]) => void;
  setHasChanges?: (hasChanges: boolean) => void;
}

const BarcodeManager = ({ 
  initialBarcodes = [], 
  onUpdate, 
  setHasChanges 
}: BarcodeManagerProps) => {
  const [barcodes, setBarcodes] = useState<any[]>(initialBarcodes);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    setBarcodes(initialBarcodes || []);
  }, [initialBarcodes]);

  const handleAddBarcode = () => {
    setBarcodes([...barcodes, { productName: '', barcodeNumber: '' }]);
    if (setHasChanges) setHasChanges(true);
  };

  const handleRemoveBarcode = (index: number) => {
    const newBarcodes = [...barcodes];
    newBarcodes.splice(index, 1);
    setBarcodes(newBarcodes);
    if (setHasChanges) setHasChanges(true);
  };

  const handleBarcodeChange = (index: number, field: string, value: string) => {
    const newBarcodes = [...barcodes];
    newBarcodes[index][field] = value;
    setBarcodes(newBarcodes);
    if (setHasChanges) setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage('');

    try {
      const user = getAuth().currentUser;
      if (user) {
        // Update user document with barcodes
        await updateDoc(doc(FIREBASE_DB, 'users', user.uid), {
          barcodes: barcodes
        });

        // Update company document with barcodes
        await updateDoc(doc(FIREBASE_DB, 'companies', user.uid), {
          barcodes: barcodes
        });

        if (onUpdate) onUpdate(barcodes);
        setSaveMessage('Barcodes saved successfully');
        setIsEditing(false);
        setTimeout(() => setSaveMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error saving barcodes:', error);
      setSaveMessage('Error saving barcodes');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">GS1 Standard Barcodes</h3>
          {barcodes.length > 0 && !isEditing && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1"
            >
              <Edit className="h-4 w-4" /> Edit Barcodes
            </Button>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-4">
            {barcodes.map((barcode, index) => (
              <div key={index} className="grid grid-cols-12 gap-4 p-4 bg-gray-50 rounded-lg relative">
                <div className="col-span-5">
                  <Label htmlFor={`productName-${index}`}>Product Name</Label>
                  <Input
                    id={`productName-${index}`}
                    value={barcode.productName}
                    onChange={(e) => handleBarcodeChange(index, 'productName', e.target.value)}
                    placeholder="Product name"
                    className="mt-1"
                  />
                </div>
                <div className="col-span-6">
                  <Label htmlFor={`barcodeNumber-${index}`}>Barcode Number</Label>
                  <div className="relative mt-1">
                    <Barcode className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      id={`barcodeNumber-${index}`}
                      value={barcode.barcodeNumber}
                      onChange={(e) => handleBarcodeChange(index, 'barcodeNumber', e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="Enter GS1 barcode number"
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="col-span-1 flex items-end justify-end">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleRemoveBarcode(index)}
                    className="h-10 w-10 rounded-full hover:bg-red-100 hover:text-red-600"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            <div className="flex justify-between pt-4">
              <Button 
                type="button" 
                onClick={handleAddBarcode}
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" /> Add Barcode
              </Button>

              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  onClick={() => {
                    setIsEditing(false);
                    setBarcodes(initialBarcodes);
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSave}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1"
                  disabled={isSaving}
                >
                  <Save className="h-4 w-4" /> {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
            
            {saveMessage && (
              <p className={`text-sm mt-2 ${saveMessage.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
                {saveMessage}
              </p>
            )}
          </div>
        ) : (
          <>
            {barcodes.length === 0 ? (
              <div className="text-center p-8 border border-dashed border-gray-300 rounded-lg">
                <Barcode className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 mb-4">No barcodes have been added yet.</p>
                <Button 
                  onClick={() => {
                    setIsEditing(true);
                    handleAddBarcode();
                  }}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1 mx-auto"
                >
                  <Plus className="h-4 w-4" /> Add Your First Barcode
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {barcodes.map((barcode, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{barcode.productName}</p>
                      <div className="flex items-center text-gray-500 text-sm">
                        <Barcode className="h-3.5 w-3.5 mr-1" />
                        <span>{barcode.barcodeNumber}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default BarcodeManager;
