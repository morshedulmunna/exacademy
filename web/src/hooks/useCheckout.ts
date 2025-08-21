import { useCallback, useMemo, useState } from "react";

/**
 * Payment method options supported by the checkout flow
 */
export type PaymentMethod = "stripe" | "sslcommerz";

/**
 * Shape of the payment form data collected from the user
 */
export interface PaymentFormData {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string; // MM/YY
  cvv: string;
  email: string;
  agreeToTerms: boolean;
}

/**
 * Return type for the useCheckout hook
 */
export interface UseCheckoutReturn {
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  selectedPaymentMethod: PaymentMethod;
  paymentForm: PaymentFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCardNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleExpiryDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePaymentMethodChange: (method: PaymentMethod) => void;
}

/**
 * useCheckout manages checkout UI state: selected payment method and form fields.
 * Formatting helpers ensure consistent card number and expiry date inputs.
 */
export function useCheckout(): UseCheckoutReturn {
  const [isLoadingState, setIsLoadingState] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>("sslcommerz");
  const [paymentForm, setPaymentForm] = useState<PaymentFormData>(() => ({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
    email: "",
    agreeToTerms: false,
  }));

  const setIsLoading = useCallback((value: boolean) => setIsLoadingState(value), []);

  const handlePaymentMethodChange = useCallback((method: PaymentMethod) => {
    setSelectedPaymentMethod(method);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type } = e.target;
    const value = type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value;
    setPaymentForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleCardNumberChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    // Keep only digits, limit to 16 digits and group as XXXX XXXX XXXX XXXX
    const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
    const grouped = raw.replace(/(\d{4})(?=\d)/g, "$1 ");
    setPaymentForm((prev) => ({ ...prev, cardNumber: grouped }));
  }, []);

  const handleExpiryDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    // Keep only digits, limit to 4 digits and format as MM/YY with clamp of month
    const digits = e.target.value.replace(/\D/g, "").slice(0, 4);
    let mm = digits.slice(0, 2);
    let yy = digits.slice(2, 4);
    if (mm.length === 2) {
      const month = Math.min(Math.max(parseInt(mm || "0", 10), 1), 12);
      mm = month.toString().padStart(2, "0");
    }
    const formatted = yy ? `${mm}/${yy}` : mm;
    setPaymentForm((prev) => ({ ...prev, expiryDate: formatted }));
  }, []);

  // Memoize return to avoid re-renders for consumers
  return useMemo(
    () => ({
      isLoading: isLoadingState,
      setIsLoading,
      selectedPaymentMethod,
      paymentForm,
      handleInputChange,
      handleCardNumberChange,
      handleExpiryDateChange,
      handlePaymentMethodChange,
    }),
    [isLoadingState, selectedPaymentMethod, paymentForm, setIsLoading, handleInputChange, handleCardNumberChange, handleExpiryDateChange, handlePaymentMethodChange]
  );
}

export default useCheckout;
