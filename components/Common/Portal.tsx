"use client";

import { ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  children: ReactNode;
  selector?: string;
}

const Portal = ({ children, selector = 'body' }: PortalProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  const element = document.querySelector(selector);
  if (!element) return null;

  return createPortal(children, element);
};

export default Portal;
