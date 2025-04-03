import React, { useRef, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload } from 'lucide-react'

interface FileUploadProps {
  onFileChange: (file: File) => void
  accept?: string
  label?: string
}

export function FileUpload({ onFileChange, accept = "image/*", label = "Upload File" }: FileUploadProps) {
  const [fileName, setFileName] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setFileName(file.name)
      onFileChange(file)
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="file-upload">{label}</Label>
      <div className="flex items-center space-x-2">
        <Button
          type="button"
          variant="outline"
          className="w-full bg-emerald-600 hover:bg-white text-white hover:text-emerald-600 border-gray-300 hover:border-emerald-600 transition-all duration-200 rounded-full"
          onClick={handleButtonClick}
        >
          {fileName || "Choose file"}
          <Upload className="ml-2 h-4 w-4" />
        </Button>
        {fileName && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setFileName(null)
              if (fileInputRef.current) {
                fileInputRef.current.value = ''
              }
            }}
          >
            Clear
          </Button>
        )}
      </div>
      <Input
        id="file-upload"
        type="file"
        accept={accept}
        onChange={handleFileChange}
        ref={fileInputRef}
        className="hidden"
      />
    </div>
  )
}