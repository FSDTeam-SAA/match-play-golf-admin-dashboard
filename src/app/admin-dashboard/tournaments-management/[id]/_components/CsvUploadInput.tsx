
// "use client"

// import { Upload } from "lucide-react"
// import { cn } from "@/lib/utils"

// interface CsvUploadInputProps {
//   onChange?: (file: File | null) => void
// }

// export default function CsvUploadInput({ onChange }: CsvUploadInputProps) {
//   return (
//     <label
//       className={cn(
//         "flex flex-col items-center justify-center w-full",
//         "h-[120px] border-2 border-dashed border-gray-300",
//         "rounded-lg cursor-pointer bg-white",
//         "hover:border-gray-400 transition"
//       )}
//     >
//       <div className="flex flex-col items-center justify-center text-center space-y-2">
//         <Upload className="w-6 h-6 text-gray-500" />
//         <p className="text-sm font-medium text-gray-700">Upload Now</p>
//         <p className="text-xs text-gray-500">or click to browse</p>
//       </div>

//       <input
//         type="file"
//         accept=".csv"
//         className="hidden"
//         onChange={(e) => {
//           const file = e.target.files?.[0] || null
//           onChange?.(file)
//         }}
//       />
//     </label>
//   )
// }




"use client"

import { Upload, X, FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import React from "react"

interface CsvUploadInputProps {
  onChange?: (file: File | null) => void
  value?: File | null // To control the current file (optional but recommended)
}

export default function CsvUploadInput({ onChange, value }: CsvUploadInputProps) {
  const [file, setFile] = useState<File | null>(value || null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null

    if (selectedFile && selectedFile.type !== "text/csv") {
      alert("Please upload a valid CSV file (.csv)")
      return
    }

    setFile(selectedFile)
    onChange?.(selectedFile)
  }

  const handleRemove = () => {
    setFile(null)
    onChange?.(null)
    // Reset the input value so user can re-upload the same file
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  const inputRef = React.useRef<HTMLInputElement>(null)

  const hasFile = !!file

  return (
    <label
      className={cn(
        "flex flex-col items-center justify-center w-full relative",
        "h-[120px] border-2 border-dashed rounded-lg cursor-pointer transition",
        hasFile
          ? "border-green-500 bg-green-50"
          : "border-gray-300 bg-white hover:border-gray-400"
      )}
    >
      {hasFile ? (
        <div className="flex items-center justify-center gap-3 text-green-700">
          <FileText className="w-8 h-8" />
          <div className="text-center">
            <p className="text-sm font-medium">{file.name}</p>
            <p className="text-xs text-green-600">
              {(file.size / 1024).toFixed(1)} KB
            </p>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handleRemove()
            }}
            className="absolute top-2 right-2 p-1 rounded-full bg-white shadow hover:bg-gray-100"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center space-y-2 py-6">
          <Upload className="w-8 h-8 text-gray-500" />
          <p className="text-sm font-medium text-gray-700">Upload CSV File</p>
          <p className="text-xs text-gray-500">Click to browse or drag & drop</p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept=".csv,text/csv"
        className="hidden"
        onChange={handleChange}
      />
    </label>
  )
}