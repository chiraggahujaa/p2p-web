import {
  UseFormRegister,
  UseFormWatch,
  UseFormSetValue,
  FieldErrors,
  UseFormReset
} from "react-hook-form";
import {
  ProductFormData,
} from "../validation/productFormSchema";

// Props for form sections
export interface ProductFormSectionProps {
  register: UseFormRegister<ProductFormData>;
  watch: UseFormWatch<ProductFormData>;
  setValue: UseFormSetValue<ProductFormData>;
  errors: FieldErrors<ProductFormData>;
  mode: 'create' | 'edit';
}

// Union type for components that can handle both modes
export type BasicInfoSectionProps = ProductFormSectionProps;
export type PricingSectionProps = ProductFormSectionProps;

// Product form data hook props
export interface UseProductFormDataProps {
  productId: string | undefined;
  mode: 'create' | 'edit';
  isAuthenticated: boolean;
  reset: UseFormReset<ProductFormData>;
  setUploadedImages: (images: import("@/types/items").UploadedFile[]) => void;
}
