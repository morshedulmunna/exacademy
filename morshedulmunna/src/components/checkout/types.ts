/**
 * Common types and interfaces for checkout components
 */

export interface CourseData {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  instructor: {
    name: string;
    avatar?: string;
  };
  duration: string;
  lessons: number;
  students: number;
  image: string;
  features: string[];
}

export interface PaymentFormData {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
  email: string;
  agreeToTerms: boolean;
}

export type PaymentMethod = "stripe" | "sslcommerz";
