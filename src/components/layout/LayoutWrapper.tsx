import React from "react";
import { clsx, type ClassValue } from "clsx";

function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export const SITE_CONTAINER_CLASS =
  "w-full xl:max-w-[1280px] 2xl:max-w-[1440px] max-w-[1440px] mx-auto px-4 sm:px-8";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export default function LayoutWrapper({
  children,
  className,
  ...props
}: Props) {
  return (
    <div className={cn(SITE_CONTAINER_CLASS, className)} {...props}>
      {children}
    </div>
  );
}
