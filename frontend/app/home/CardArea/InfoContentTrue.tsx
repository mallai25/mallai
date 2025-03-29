'use client'

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload } from "lucide-react"
import Image from "next/image"

interface InfoContentTrueProps {
	formData: {
		name: string;
		description: string;
		category: string;
		weight: string;
		gtin: string;
		imageUrl?: string;
	};
	updateFormData: (field: string, value: string) => void;
	productImage: string | null;
	setProductImage: (image: string | null) => void;
	handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function InfoContentTrue({
	formData,
	updateFormData,
	productImage,
	setProductImage,
	handleImageUpload
}: InfoContentTrueProps) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
			<div className="space-y-4">
				<div className="space-y-2">
					<Input
						id="name"
						name="name"
						placeholder="Enter product name"
						value={formData.name}
						onChange={(e) => updateFormData('name', e.target.value)}
						className="max-w-[400px] rounded-[12px]"
					/>
				</div>
				<div className="space-y-2">
					<Textarea
						id="description"
						name="description"
						placeholder="Enter product description"
						value={formData.description}
						onChange={(e) => updateFormData('description', e.target.value)}
						className="h-32 max-w-[400px] rounded-[12px]" 
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="category">Category</Label>
					<Input
						id="category"
						name="category"
						placeholder="Enter category"
						value={formData.category}
						onChange={(e) => updateFormData('category', e.target.value)}
						className="max-w-[400px] rounded-[12px]"
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="weight">Weight</Label>
					<Input
						id="weight"
						name="weight"
						placeholder="Enter weight"
						value={formData.weight}
						onChange={(e) => updateFormData('weight', e.target.value)}
						className="max-w-[400px] rounded-[12px]"
					/>
				</div>
				<div className="space-y-2">
					<Input
						id="gtin"
						name="gtin"
						placeholder="Enter GTIN number"
						value={formData.gtin}
						onChange={(e) => updateFormData('gtin', e.target.value)}
						className="max-w-[400px] rounded-[12px]"
					/>
				</div>
			</div>

			<div className="space-y-4 mt-8 md:mt-6">
				<div className="border-2 border-dashed border-gray-300 rounded-[20px] p-4">
					<div className="relative w-full h-[240px] md:h-[320px]">
						{productImage ? (
							<Image
								src={productImage}
								alt="Product preview"
								fill
								style={{ objectFit: 'contain' }}
								className="rounded-lg w-full h-full"
							/>
						) : formData.imageUrl ? (
							<Image
								src={formData.imageUrl}
								alt="Product"
								fill
								style={{ objectFit: 'contain' }}
								className="rounded-lg w-full h-full"
							/>
						) : (
							<div className="flex flex-col items-center justify-center h-full bg-gray-50 rounded-lg">
								<Upload className="w-6 h-6 text-gray-400 mb-2" />
								<Label
									htmlFor="image"
									className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
								>
									Choose Image
								</Label>
								<p className="mt-2 text-sm text-gray-500 text-center">
									Drag and drop or click to upload
								</p>
							</div>
						)}
					</div>
					<input
						type="file"
						id="image"
						name="image"
						accept="image/*"
						className="hidden"
						onChange={handleImageUpload}
					/>
				</div>
			</div>
		</div>
	)
}