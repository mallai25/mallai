
import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Building, Mail, Phone, Globe, MapPin, Flag, Home, Edit, Save } from "lucide-react";
import { FIREBASE_DB } from '@/FirebaseConfig';
import { getAuth } from "firebase/auth";
import { doc, updateDoc, collection, query, where, getDocs, writeBatch } from 'firebase/firestore';

interface CompanyInfoProps {
  initialInfo: any;
  setHasChanges?: (hasChanges: boolean) => void;
}

const CompanyInfo = ({ initialInfo, setHasChanges }: CompanyInfoProps) => {
  const [companyInfo, setCompanyInfo] = useState({
    companyName: '',
    registrationNumber: '',
    postalAddress: '',
    physicalAddress: '',
    country: '',
    province: '',
    city: '',
    zipCode: '',
    companyEmail: '',
    companyPhone: '',
    website: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (initialInfo) {
      setCompanyInfo({
        companyName: initialInfo.companyName || '',
        registrationNumber: initialInfo.registrationNumber || '',
        postalAddress: initialInfo.postalAddress || '',
        physicalAddress: initialInfo.physicalAddress || '',
        country: initialInfo.country || '',
        province: initialInfo.province || '',
        city: initialInfo.city || '',
        zipCode: initialInfo.zipCode || '',
        companyEmail: initialInfo.companyEmail || '',
        companyPhone: initialInfo.companyPhone || '',
        website: initialInfo.website || ''
      });
    }
  }, [initialInfo]);

  const handleChange = (field: string, value: string) => {
    setCompanyInfo(prev => ({ ...prev, [field]: value }));
    if (setHasChanges) setHasChanges(true);
  };

  const handleSave = async () => {
    setIsUpdating(true);
    setSaveSuccess(false);
    
    try {
      const user = getAuth().currentUser;
      if (user) {
        // Update user document
        const userRef = doc(FIREBASE_DB, 'users', user.uid);
        await updateDoc(userRef, {
          companyName: companyInfo.companyName,
          website: companyInfo.website,
          companyEmail: companyInfo.companyEmail,
          companyPhone: companyInfo.companyPhone,
        });

        // Update company document
        const companyRef = doc(FIREBASE_DB, 'companies', user.uid);
        await updateDoc(companyRef, {
          ...companyInfo,
          updatedAt: new Date().toISOString(),
        });

        // Update all products with new company name and website
        const productsRef = collection(FIREBASE_DB, 'products');
        const q = query(productsRef, where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        
        const batch = writeBatch(FIREBASE_DB);
        querySnapshot.docs.forEach((doc) => {
          batch.update(doc.ref, {
            brand: companyInfo.companyName,
            website: companyInfo.website
          });
        });
        await batch.commit();

        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating company information:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Company Information</h3>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-1"
            disabled={isUpdating}
          >
            {isEditing ? 'Cancel' : (
              <>
                <Edit className="h-4 w-4" /> Edit
              </>
            )}
          </Button>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="companyName" className="text-gray-700 font-medium">Company Name</Label>
              <div className="relative mt-1">
                <Building className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  id="companyName"
                  value={companyInfo.companyName}
                  onChange={(e) => handleChange('companyName', e.target.value)}
                  className="pl-10 border-2 rounded-xl py-6"
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="registrationNumber" className="text-gray-700 font-medium">
                Company Registration Number
              </Label>
              <div className="relative mt-1">
                <Building className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  id="registrationNumber"
                  value={companyInfo.registrationNumber}
                  onChange={(e) => handleChange('registrationNumber', e.target.value)}
                  className="pl-10 border-2 rounded-xl py-6"
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="postalAddress" className="text-gray-700 font-medium">Postal Address</Label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                id="postalAddress"
                value={companyInfo.postalAddress}
                onChange={(e) => handleChange('postalAddress', e.target.value)}
                className="pl-10 border-2 rounded-xl py-6"
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="physicalAddress" className="text-gray-700 font-medium">Physical Address</Label>
              <div className="relative mt-1">
                <Home className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  id="physicalAddress"
                  value={companyInfo.physicalAddress}
                  onChange={(e) => handleChange('physicalAddress', e.target.value)}
                  className="pl-10 border-2 rounded-xl py-6"
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="country" className="text-gray-700 font-medium">Country</Label>
              <div className="relative mt-1">
                <Flag className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  id="country"
                  value={companyInfo.country}
                  onChange={(e) => handleChange('country', e.target.value)}
                  className="pl-10 border-2 rounded-xl py-6"
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="province" className="text-gray-700 font-medium">Province/State</Label>
              <div className="relative mt-1">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  id="province"
                  value={companyInfo.province}
                  onChange={(e) => handleChange('province', e.target.value)}
                  className="pl-10 border-2 rounded-xl py-6"
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="city" className="text-gray-700 font-medium">City</Label>
              <div className="relative mt-1">
                <Building className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  id="city"
                  value={companyInfo.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  className="pl-10 border-2 rounded-xl py-6"
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="zipCode" className="text-gray-700 font-medium">
                Zip Code
              </Label>
              <div className="relative mt-1">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  id="zipCode"
                  value={companyInfo.zipCode}
                  onChange={(e) => handleChange('zipCode', e.target.value)}
                  className="pl-10 border-2 rounded-xl py-6"
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="companyEmail" className="text-gray-700 font-medium">Company Email</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  id="companyEmail"
                  type="email"
                  value={companyInfo.companyEmail}
                  onChange={(e) => handleChange('companyEmail', e.target.value)}
                  className="pl-10 border-2 rounded-xl py-6"
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="companyPhone" className="text-gray-700 font-medium">Company Phone Number</Label>
              <div className="relative mt-1">
                <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  id="companyPhone"
                  value={companyInfo.companyPhone}
                  onChange={(e) => handleChange('companyPhone', e.target.value)}
                  className="pl-10 border-2 rounded-xl py-6"
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="website" className="text-gray-700 font-medium">Website</Label>
            <div className="relative mt-1">
              <Globe className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                id="website"
                type="text"
                value={companyInfo.website}
                onChange={(e) => {
                  let value = e.target.value;
                  if (value && !value.startsWith('http')) {
                    value = `https://${value}`;
                  }
                  handleChange('website', value);
                }}
                className="pl-10 border-2 rounded-xl py-6"
                disabled={!isEditing}
              />
            </div>
          </div>

          {isEditing && (
            <div className="pt-2">
              <Button
                onClick={handleSave}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl flex items-center justify-center gap-2"
                disabled={isUpdating}
              >
                <Save className="h-4 w-4" />
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          )}

          {saveSuccess && (
            <p className="text-sm text-green-600 mt-2 text-center">
              Company information updated successfully!
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyInfo;
