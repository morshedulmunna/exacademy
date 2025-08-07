import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { PaymentFormData, PaymentMethod } from "@/components/checkout/types";

/**
 * Custom hook for managing checkout state and logic
 */
export function useCheckout() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>("stripe");
  const [paymentForm, setPaymentForm] = useState<PaymentFormData>({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
    email: session?.user?.email || "",
    agreeToTerms: false,
  });

  useEffect(() => {
    // Update email if user is logged in
    if (session?.user?.email) {
      setPaymentForm((prev) => ({ ...prev, email: session.user.email || "" }));
    }
  }, [session?.user?.email]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setPaymentForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setPaymentForm((prev) => ({ ...prev, cardNumber: formatted }));
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    setPaymentForm((prev) => ({ ...prev, expiryDate: formatted }));
  };

  const handlePaymentMethodChange = (method: PaymentMethod) => {
    setSelectedPaymentMethod(method);
    // Reset form when switching payment methods
    setPaymentForm({
      cardNumber: "",
      cardHolder: "",
      expiryDate: "",
      cvv: "",
      email: session?.user?.email || "",
      agreeToTerms: false,
    });
  };

  const resetForm = () => {
    setPaymentForm({
      cardNumber: "",
      cardHolder: "",
      expiryDate: "",
      cvv: "",
      email: session?.user?.email || "",
      agreeToTerms: false,
    });
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
    resetForm,
  };
}
