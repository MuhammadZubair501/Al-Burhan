// src/utils/imageHelper.ts
import { API_BASE_URL } from "../config/api";

/**
 * Get the full image URL for a profile image
 * @param imagePath - The path stored in database (e.g., "students/filename.jpg")
 * @param defaultImage - Optional default image path
 * @returns Full URL to the image
 */
export const getProfileImageUrl = (
  imagePath: string | null | undefined,
  defaultImage: string = '/default-avatar.png'
): string => {
  // If no image path, return default
  if (!imagePath) {
    return defaultImage;
  }

  // If it's already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // Remove leading slashes if any
  let cleanPath = imagePath.replace(/^\/+/, '');

  // If path doesn't start with profile_images, add it
  if (!cleanPath.startsWith('profile_images')) {
    cleanPath = `profile_images/${cleanPath}`;
  }

  return `${API_BASE_URL}/api/images/${cleanPath}`;
};

/**
 * Get image URL with error handling props
 */
export const getImageProps = (
  imagePath: string | null | undefined,
  fallbackImage: string = '/default-avatar.png'
) => {
  const src = getProfileImageUrl(imagePath, fallbackImage);
  
  return {
    src,
    onError: (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      e.currentTarget.src = fallbackImage;
    },
    // For debugging
    'data-image-path': imagePath || 'none',
    'data-full-url': src,
  };
};

/**
 * Check if image URL is valid
 */
export const isValidImageUrl = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok && response.headers.get('content-type')?.startsWith('image/') || false;
  } catch {
    return false;
  }
};

/**
 * Get the image URL for student
 */
export const getStudentImageUrl = (
  student: { profile_image_path?: string | null, first_name?: string },
  defaultImage?: string
): string => {
  return getProfileImageUrl(student?.profile_image_path, defaultImage);
};

/**
 * Get the image URL for teacher
 */
export const getTeacherImageUrl = (
  teacher: { profile_image_path?: string | null, first_name?: string },
  defaultImage?: string
): string => {
  return getProfileImageUrl(teacher?.profile_image_path, defaultImage);
};