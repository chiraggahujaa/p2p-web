"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ProductFormData,
  productFormSchema
} from "../validation/productFormSchema";

export function useCreateProductForm() {
  const createDefaultValues: ProductFormData = {
    title: "",
    description: "",
    categoryId: "",
    condition: "good",
    rentPricePerDay: 0,
    securityAmount: 0,
    deliveryMode: "none",
    minRentalDays: 1,
    maxRentalDays: 30,
    isNegotiable: false,
    tags: [],
    location: null,
    status: undefined, // Optional for create mode
  };

  return useForm({
    resolver: zodResolver(productFormSchema),
    defaultValues: createDefaultValues,
    mode: "onChange",
  });
}

export function useEditProductForm() {
  const editDefaultValues: ProductFormData = {
    title: "",
    description: "",
    categoryId: "",
    condition: "good",
    rentPricePerDay: 0,
    securityAmount: 0,
    deliveryMode: "none",
    minRentalDays: 1,
    maxRentalDays: 30,
    isNegotiable: false,
    tags: [],
    location: null,
    status: "available", // Optional - will be set for edit mode
  };

  return useForm({
    resolver: zodResolver(productFormSchema),
    defaultValues: editDefaultValues,
    mode: "onChange",
  });
}