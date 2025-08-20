import React from "react";
import { Button } from "@/components/ui/button";
import { CreditCard, Lock, Shield } from "lucide-react";
import Link from "next/link";

interface PaymentFormData {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
  email: string;
  agreeToTerms: boolean;
}

interface StripePaymentFormProps {
  formData: PaymentFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCardNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onExpiryDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  totalAmount: number;
}

/**
 * Stripe payment form component with card input fields
 */
export default function StripePaymentForm({
  formData,
  onInputChange,
  onCardNumberChange,
  onExpiryDateChange,
  onSubmit,
  isLoading,
  totalAmount,
}: StripePaymentFormProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center">
        <CreditCard className="w-5 h-5 mr-2" />
        Stripe Payment
      </h2>

      <form onSubmit={onSubmit} className="space-y-6">
        {/* Card Number */}
        <div>
          <label htmlFor="cardNumber" className="block text-sm font-medium text-foreground mb-2">
            Card Number
          </label>
          <input
            type="text"
            id="cardNumber"
            name="cardNumber"
            value={formData.cardNumber}
            onChange={onCardNumberChange}
            placeholder="1234 5678 9012 3456"
            maxLength={19}
            className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
            required
          />
        </div>

        {/* Card Holder Name */}
        <div>
          <label htmlFor="cardHolder" className="block text-sm font-medium text-foreground mb-2">
            Cardholder Name
          </label>
          <input
            type="text"
            id="cardHolder"
            name="cardHolder"
            value={formData.cardHolder}
            onChange={onInputChange}
            placeholder="John Doe"
            className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
            required
          />
        </div>

        {/* Expiry Date and CVV */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="expiryDate" className="block text-sm font-medium text-foreground mb-2">
              Expiry Date
            </label>
            <input
              type="text"
              id="expiryDate"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={onExpiryDateChange}
              placeholder="MM/YY"
              maxLength={5}
              className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
              required
            />
          </div>
          <div>
            <label htmlFor="cvv" className="block text-sm font-medium text-foreground mb-2">
              CVV
            </label>
            <input
              type="text"
              id="cvv"
              name="cvv"
              value={formData.cvv}
              onChange={onInputChange}
              placeholder="123"
              maxLength={4}
              className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
              required
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={onInputChange}
            placeholder="your@email.com"
            className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
            required
          />
          <p className="text-xs text-muted-foreground mt-1">Course access will be sent to this email</p>
        </div>

        {/* Terms and Conditions */}
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            id="agreeToTerms"
            name="agreeToTerms"
            checked={formData.agreeToTerms}
            onChange={onInputChange}
            className="mt-1 h-4 w-4 text-primary focus:ring-primary border-border rounded"
            required
          />
          <label htmlFor="agreeToTerms" className="text-sm text-muted-foreground">
            I agree to the{" "}
            <Link href="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </label>
        </div>

        {/* Security Notice */}
        <div className="bg-muted/50 border border-border rounded-lg p-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Shield className="w-4 h-4 mr-2" />
            <span>Your payment information is encrypted and secure</span>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading || !formData.agreeToTerms}
          className="w-full py-3 text-lg font-semibold"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Processing Payment...
            </>
          ) : (
            <>
              <Lock className="w-5 h-5 mr-2" />
              Complete Purchase - ৳{totalAmount}
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
