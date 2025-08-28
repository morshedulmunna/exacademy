import React from "react";
import PaymentMethodSelector from "./PaymentMethodSelector";
import StripePaymentForm from "./StripePaymentForm";
import SSLCommerzPaymentForm from "./SSLCommerzPaymentForm";
import { CourseData } from "./types";
import { useCheckout } from "@/hooks/useCheckout";

interface CheckoutFormProps {
  courseData: CourseData;
  onPaymentSuccess: () => void;
  onPaymentError: (error: Error) => void;
}

/**
 * Main checkout form component that manages payment method selection and form state
 */
export default function CheckoutForm({ courseData, onPaymentSuccess, onPaymentError }: CheckoutFormProps) {
  const { isLoading, setIsLoading, selectedPaymentMethod, paymentForm, handleInputChange, handleCardNumberChange, handleExpiryDateChange, handlePaymentMethodChange } = useCheckout();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // In real app, integrate with payment gateway here
      console.log("Payment processed:", { paymentForm, selectedPaymentMethod });

      if (selectedPaymentMethod === "stripe") {
        // Handle Stripe payment
        console.log("Processing Stripe payment...");
      } else {
        // Handle SSL Commerz payment
        console.log("Processing SSL Commerz payment...");
      }

      onPaymentSuccess();
    } catch (error) {
      console.error("Payment failed:", error);
      onPaymentError(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="lg:col-span-2">
      {/* Payment Method Selection */}
      <PaymentMethodSelector selectedMethod={selectedPaymentMethod} onMethodChange={handlePaymentMethodChange} />

      {/* Payment Form */}
      {selectedPaymentMethod === "stripe" ? (
        <StripePaymentForm formData={paymentForm} onInputChange={handleInputChange} onCardNumberChange={handleCardNumberChange} onExpiryDateChange={handleExpiryDateChange} onSubmit={handleSubmit} isLoading={isLoading} totalAmount={courseData.price} />
      ) : (
        <SSLCommerzPaymentForm formData={paymentForm} onInputChange={handleInputChange} onSubmit={handleSubmit} isLoading={isLoading} totalAmount={courseData.price} />
      )}
    </div>
  );
}
