// components/Portal.tsx
import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  children: ReactNode;
}

export default function Portal({ children }: PortalProps) {
  const elRef = useRef<HTMLDivElement | null>(null);

  if (!elRef.current) {
    elRef.current = document.createElement('div');
    elRef.current.id = 'modal-root';
    // Style to ensure it's above everything
    elRef.current.style.position = 'fixed';
    elRef.current.style.inset = '0';
    elRef.current.style.zIndex = '99';
    elRef.current.style.pointerEvents = 'none';
  }

  useEffect(() => {
    const el = elRef.current!;
    document.body.appendChild(el);
    return () => {
      if (el.parentNode) {
        el.parentNode.removeChild(el);
      }
    };
  }, []);

  return createPortal(
    <div style={{ pointerEvents: 'auto' }}>
      {children}
    </div>,
    elRef.current
  );
}