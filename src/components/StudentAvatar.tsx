// src/components/StudentAvatar.tsx
import React, { useState } from 'react';
import { API_BASE_URL } from '../config/api';

interface StudentAvatarProps {
  student: {
    profile_image_path?: string | null;
    first_name?: string;
    last_name?: string;
  };
  size?: 'small' | 'medium' | 'large' | number;
  className?: string;
  fallbackText?: string;
}

const StudentAvatar: React.FC<StudentAvatarProps> = ({
  student,
  size = 'medium',
  className = '',
  fallbackText,
}) => {
  const [imageError, setImageError] = useState(false);

  const getImageUrl = (): string => {
    if (!student?.profile_image_path || imageError) {
      return '/default-avatar.png';
    }
    return `${API_BASE_URL}/api/images/profile_images/${student.profile_image_path}`;
  };

  const getInitials = (): string => {
    const first = student?.first_name?.charAt(0) || '';
    const last = student?.last_name?.charAt(0) || '';
    return (first + last).toUpperCase() || fallbackText || '?';
  };

  const getSize = (): string => {
    if (typeof size === 'number') {
      return `${size}px`;
    }
    const sizes = {
      small: '32px',
      medium: '48px',
      large: '64px',
    };
    return sizes[size] || '48px';
  };

  const sizeValue = getSize();

  return (
    <div
      className={`student-avatar ${className}`}
      style={{
        width: sizeValue,
        height: sizeValue,
        borderRadius: '50%',
        overflow: 'hidden',
        backgroundColor: '#e0e0e0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <img
        src={getImageUrl()}
        alt={`${student?.first_name || 'Student'} ${student?.last_name || ''}`}
        onError={() => setImageError(true)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
      {imageError && (
        <span
          style={{
            fontSize: typeof size === 'number' ? `${size * 0.4}px` : '16px',
            fontWeight: 'bold',
            color: '#666',
          }}
        >
          {getInitials()}
        </span>
      )}
    </div>
  );
};

export default StudentAvatar;