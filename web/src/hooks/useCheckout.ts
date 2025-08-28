import { useState } from "react";
import { PaymentFormData, PaymentMethod } from "@/components/checkout/types";

/**
 * Custom hook for managing checkout form state and payment methods
 */
export function useCheckout() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>("stripe");
  const [paymentForm, setPaymentForm] = useState<PaymentFormData>({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
    email: "",
    agreeToTerms: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setPaymentForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Format card number with spaces every 4 digits
    const formatted = value
      .replace(/\s/g, "")
      .replace(/(\d{4})/g, "$1 ")
      .trim();
    setPaymentForm((prev) => ({
      ...prev,
      cardNumber: formatted,
    }));
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Format expiry date as MM/YY
    const formatted = value
      .replace(/\D/g, "")
      .replace(/^(\d{2})/, "$1/")
      .substring(0, 5);
    setPaymentForm((prev) => ({
      ...prev,
      expiryDate: formatted,
    }));
  };

  const handlePaymentMethodChange = (method: PaymentMethod) => {
    setSelectedPaymentMethod(method);
  };

  return {
    isLoading,
    setIsLoading,
    selectedPaymentMethod,
    paymentForm,
    handleInputChange,
    handleCardNumberChange,
    handleExpiryDateChange,
    handlePaymentMethodChange,
  };
}
