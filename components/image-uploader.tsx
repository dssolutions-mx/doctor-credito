"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, Upload, ChevronLeft, ChevronRight, Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { validateImageFile } from "@/lib/storage-helpers"
import { toast } from "sonner"
import Image from "next/image"

interface ImageFile {
  file: File
  preview: string
  id: string
}

interface ImageUploaderProps {
  images: ImageFile[]
  onChange: (images: ImageFile[]) => void
  maxImages?: number
  onError?: (error: string) => void
}

export function ImageUploader({
  images,
  onChange,
  maxImages = 10,
  onError,
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleFileSelect = useCallback(
    (files: FileList | null) => {
      if (!files) return

      const fileArray = Array.from(files)
      const remainingSlots = maxImages - images.length

      if (fileArray.length > remainingSlots) {
        const error = `Solo puedes agregar ${remainingSlots} imagen(es) más. Máximo ${maxImages} imágenes.`
        toast.error(error)
        onError?.(error)
        return
      }

      const newImages: ImageFile[] = []
      const errors: string[] = []

      fileArray.forEach((file) => {
        const validation = validateImageFile(file)
        if (!validation.valid) {
          errors.push(`${file.name}: ${validation.error}`)
          return
        }

        const preview = URL.createObjectURL(file)
        newImages.push({
          file,
          preview,
          id: Math.random().toString(36).substring(7),
        })
      })

      if (errors.length > 0) {
        errors.forEach((error) => toast.error(error))
        onError?.(errors.join('; '))
      }

      if (newImages.length > 0) {
        onChange([...images, ...newImages])
        toast.success(`${newImages.length} imagen(es) agregada(s)`)
      }
    },
    [images, maxImages, onChange, onError]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      handleFileSelect(e.dataTransfer.files)
    },
    [handleFileSelect]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const removeImage = useCallback(
    (id: string) => {
      const imageToRemove = images.find((img) => img.id === id)
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.preview)
      }
      onChange(images.filter((img) => img.id !== id))
      toast.success("Imagen eliminada")
    },
    [images, onChange]
  )

  const moveImage = useCallback(
    (id: string, direction: "left" | "right") => {
      const index = images.findIndex((img) => img.id === id)
      if (index === -1) return

      const newImages = [...images]
      const newIndex = direction === "left" ? index - 1 : index + 1

      if (newIndex < 0 || newIndex >= images.length) return

      // Swap images
      const temp = newImages[index]
      newImages[index] = newImages[newIndex]
      newImages[newIndex] = temp

      onChange(newImages)
    },
    [images, onChange]
  )

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-primary/50"
        )}
      >
        <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
        <p className="text-sm text-muted-foreground mb-4">
          Arrastra imágenes aquí o haz clic para seleccionar
        </p>
        <input
          type="file"
          id="image-upload"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          multiple
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => document.getElementById("image-upload")?.click()}
          disabled={images.length >= maxImages}
        >
          Seleccionar Imágenes
        </Button>
        <p className="text-xs text-muted-foreground mt-2">
          {images.length} / {maxImages} imágenes | Máximo 10MB por imagen
        </p>
      </div>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <Card key={image.id} className="overflow-hidden relative group">
              {/* Primary Badge */}
              {index === 0 && (
                <div className="absolute top-2 left-2 z-10">
                  <div className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-md flex items-center gap-1">
                    <Star className="h-3 w-3 fill-current" />
                    Principal
                  </div>
                </div>
              )}

              {/* Image */}
              <div className="relative aspect-[4/3] bg-muted">
                <Image
                  src={image.preview}
                  alt={`Preview ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Controls Overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {/* Move Left */}
                {index > 0 && (
                  <Button
                    type="button"
                    size="icon"
                    variant="secondary"
                    onClick={() => moveImage(image.id, "left")}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                )}

                {/* Remove */}
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  onClick={() => removeImage(image.id)}
                >
                  <X className="h-4 w-4" />
                </Button>

                {/* Move Right */}
                {index < images.length - 1 && (
                  <Button
                    type="button"
                    size="icon"
                    variant="secondary"
                    onClick={() => moveImage(image.id, "right")}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {/* Image Number */}
              <div className="absolute bottom-2 right-2 bg-black/75 text-white text-xs px-2 py-1 rounded">
                #{index + 1}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Helper Text */}
      {images.length > 0 && (
        <p className="text-xs text-muted-foreground">
          La primera imagen será la imagen principal. Usa las flechas para reordenar.
        </p>
      )}
    </div>
  )
}
