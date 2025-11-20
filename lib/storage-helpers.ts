import { createClient } from '@/lib/supabase/client'

/**
 * Upload a single vehicle image to Supabase Storage
 * @param file - The image file to upload
 * @param vehicleId - The ID of the vehicle
 * @returns The public URL of the uploaded image
 */
export async function uploadVehicleImage(
  file: File,
  vehicleId: string
): Promise<{ url: string | null; error: string | null }> {
  try {
    const supabase = createClient()

    // Generate unique filename with timestamp
    const timestamp = Date.now()
    const fileExt = file.name.split('.').pop()
    const fileName = `${vehicleId}/${timestamp}.${fileExt}`

    // Upload file to storage
    const { data, error } = await supabase.storage
      .from('vehicle-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (error) {
      console.error('Error uploading image:', error)
      return { url: null, error: error.message }
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('vehicle-images')
      .getPublicUrl(data.path)

    return { url: publicUrl, error: null }
  } catch (error) {
    console.error('Unexpected error uploading image:', error)
    return {
      url: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Upload multiple vehicle images to Supabase Storage
 * @param files - Array of image files to upload
 * @param vehicleId - The ID of the vehicle
 * @returns Array of public URLs for the uploaded images
 */
export async function uploadMultipleVehicleImages(
  files: File[],
  vehicleId: string
): Promise<{ urls: string[]; errors: string[] }> {
  const urls: string[] = []
  const errors: string[] = []

  for (const file of files) {
    const { url, error } = await uploadVehicleImage(file, vehicleId)
    if (url) {
      urls.push(url)
    }
    if (error) {
      errors.push(`${file.name}: ${error}`)
    }
  }

  return { urls, errors }
}

/**
 * Delete a vehicle image from Supabase Storage
 * @param imageUrl - The public URL of the image to delete
 * @returns Success status and error if any
 */
export async function deleteVehicleImage(
  imageUrl: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = createClient()

    // Extract the file path from the public URL
    const url = new URL(imageUrl)
    const pathParts = url.pathname.split('/vehicle-images/')
    if (pathParts.length < 2) {
      return { success: false, error: 'Invalid image URL' }
    }

    const filePath = pathParts[1]

    // Delete from storage
    const { error } = await supabase.storage
      .from('vehicle-images')
      .remove([filePath])

    if (error) {
      console.error('Error deleting image:', error)
      return { success: false, error: error.message }
    }

    return { success: true, error: null }
  } catch (error) {
    console.error('Unexpected error deleting image:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Delete all images for a vehicle
 * @param vehicleId - The ID of the vehicle
 * @returns Success status and error if any
 */
export async function deleteAllVehicleImages(
  vehicleId: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = createClient()

    // List all files in the vehicle folder
    const { data: files, error: listError } = await supabase.storage
      .from('vehicle-images')
      .list(vehicleId)

    if (listError) {
      console.error('Error listing images:', listError)
      return { success: false, error: listError.message }
    }

    if (!files || files.length === 0) {
      return { success: true, error: null }
    }

    // Delete all files
    const filePaths = files.map((file) => `${vehicleId}/${file.name}`)
    const { error: deleteError } = await supabase.storage
      .from('vehicle-images')
      .remove(filePaths)

    if (deleteError) {
      console.error('Error deleting images:', deleteError)
      return { success: false, error: deleteError.message }
    }

    return { success: true, error: null }
  } catch (error) {
    console.error('Unexpected error deleting images:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Validate image file
 * @param file - The file to validate
 * @returns Validation result with error message if invalid
 */
export function validateImageFile(file: File): {
  valid: boolean
  error: string | null
} {
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Tipo de archivo no permitido. Use JPG, PNG o WebP.',
    }
  }

  // Check file size (10MB max)
  const maxSize = 10 * 1024 * 1024 // 10MB in bytes
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'El archivo es demasiado grande. Máximo 10MB.',
    }
  }

  return { valid: true, error: null }
}
