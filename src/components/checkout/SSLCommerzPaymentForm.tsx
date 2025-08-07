import React from "react";
import { Button } from "@/components/ui/button";
import { CreditCard, Lock, Globe } from "lucide-react";
import Link from "next/link";

interface PaymentFormData {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
  email: string;
  agreeToTerms: boolean;
}

interface SSLCommerzPaymentFormProps {
  formData: PaymentFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  totalAmount: number;
}

/**
 * SSL Commerz payment form component for Bangladesh payments
 */
export default function SSLCommerzPaymentForm({
  formData,
  onInputChange,
  onSubmit,
  isLoading,
  totalAmount,
}: SSLCommerzPaymentFormProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center">
        <CreditCard className="w-5 h-5 mr-2" />
        SSL Commerz Payment
      </h2>

      <form onSubmit={onSubmit} className="space-y-6">
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

        {/* SSL Commerz Info */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Globe className="w-5 h-5 text-blue-500 mt-0.5" />
            <div>
              <h4 className="font-medium text-foreground">SSL Commerz Payment Gateway</h4>
              <p className="text-sm text-muted-foreground mt-1">
                You will be redirected to SSL Commerz secure payment page where you can pay using:
              </p>
              <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                <li>• Mobile Banking (bKash, Nagad, Rocket, etc.)</li>
                <li>• Internet Banking</li>
                <li>• Credit/Debit Cards</li>
                <li>• Bank Transfer</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Payment Methods Preview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="flex flex-col items-center p-3 bg-muted/30 rounded-lg">
            <div className="w-8 h-8 bg-green-500 rounded-full mb-2"></div>
            <span className="text-xs text-muted-foreground text-center">bKash</span>
          </div>
          <div className="flex flex-col items-center p-3 bg-muted/30 rounded-lg">
            <div className="w-8 h-8 bg-blue-500 rounded-full mb-2"></div>
            <span className="text-xs text-muted-foreground text-center">Nagad</span>
          </div>
          <div className="flex flex-col items-center p-3 bg-muted/30 rounded-lg">
            <div className="w-8 h-8 bg-purple-500 rounded-full mb-2"></div>
            <span className="text-xs text-muted-foreground text-center">Rocket</span>
          </div>
          <div className="flex flex-col items-center p-3 bg-muted/30 rounded-lg">
            <div className="w-8 h-8 bg-red-500 rounded-full mb-2"></div>
            <span className="text-xs text-muted-foreground text-center">Cards</span>
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="w-5 h-5 bg-green-500 rounded-full mt-0.5"></div>
            <div>
              <h4 className="font-medium text-foreground">Secure Payment</h4>
              <p className="text-sm text-muted-foreground">
                SSL Commerz is a trusted payment gateway in Bangladesh with bank-level security.
              </p>
            </div>
          </div>
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

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading || !formData.agreeToTerms}
          className="w-full py-3 text-lg font-semibold"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Redirecting to SSL Commerz...
            </>
          ) : (
            <>
              <Lock className="w-5 h-5 mr-2" />
              Proceed to SSL Commerz - ৳{totalAmount}
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
