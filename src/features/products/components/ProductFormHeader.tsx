"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface ProductFormHeaderProps {
  title: string;
  description: string;
  backUrl?: string;
}

export function ProductFormHeader({ 
  title, 
  description, 
  backUrl = "/dashboard" 
}: ProductFormHeaderProps) {
  return (
    <div className="mb-6">
      <Link
        href={backUrl}
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Link>
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}