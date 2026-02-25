import { useState, useRef } from 'react'
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY || ''
const IMGBB_UPLOAD_URL = 'https://api.imgbb.com/1/upload'

interface ImageUploadProps {
  value?: string | null
  onChange?: (url: string | null) => void
  disabled?: boolean
  label?: string
}

export function ImageUpload({
  value,
  onChange,
  disabled = false,
  label = 'Course Image',
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (file: File) => {
    if (!IMGBB_API_KEY) {
      setError('ImgBB API key is not configured. Add VITE_IMGBB_API_KEY to your .env file.')
      return
    }

    const maxSize = 32 * 1024 * 1024
    if (file.size > maxSize) {
      setError('File size must be less than 32 MB.')
      return
    }

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file.')
      return
    }

    setUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('image', file)
      formData.append('key', IMGBB_API_KEY)

      const response = await fetch(IMGBB_UPLOAD_URL, {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        onChange?.(data.data.display_url)
      } else {
        setError('Upload failed. Please try again.')
      }
    } catch {
      setError('Upload failed. Please check your connection.')
    } finally {
      setUploading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleUpload(file)
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleRemove = () => {
    onChange?.(null)
    setError(null)
  }

  return (
    <div className="space-y-2">
      {label ? <p className="text-sm font-medium">{label}</p> : null}

      {value ? (
        <div className="relative inline-block">
          <img
            src={value}
            alt="Course"
            className="h-40 w-auto rounded-lg border border-border object-cover"
          />
          {!disabled && (
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute -right-2 -top-2 h-6 w-6 rounded-full"
              onClick={handleRemove}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      ) : (
        <div
          className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 p-6 transition-colors hover:border-primary/50 ${
            disabled ? 'pointer-events-none opacity-50' : ''
          }`}
          onClick={() => !disabled && !uploading && fileInputRef.current?.click()}
        >
          {uploading ? (
            <>
              <Loader2 className="mb-2 h-8 w-8 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Uploading...</p>
            </>
          ) : (
            <>
              <ImageIcon className="mb-2 h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Click to upload image</p>
              <p className="mt-1 text-xs text-muted-foreground">PNG, JPG, GIF up to 32MB</p>
            </>
          )}
        </div>
      )}

      {value && !disabled && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Upload className="mr-2 h-4 w-4" />
          )}
          Change Image
        </Button>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled || uploading}
      />

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
