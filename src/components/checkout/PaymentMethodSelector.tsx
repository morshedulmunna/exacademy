import React from "react";
import { Shield, CreditCard, Globe } from "lucide-react";
import { PaymentMethod } from "./types";

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod;
  onMethodChange: (method: PaymentMethod) => void;
}

/**
 * Payment method selector component for choosing between Stripe and SSL Commerz
 */
export default function PaymentMethodSelector({ selectedMethod, onMethodChange }: PaymentMethodSelectorProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold text-foreground mb-6">Choose Payment Method</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Stripe Option */}
        <button type="button" onClick={() => onMethodChange("stripe")} className={`p-4 border-2 rounded-lg transition-all duration-200 ${selectedMethod === "stripe" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}>
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${selectedMethod === "stripe" ? "bg-primary text-white" : "bg-muted"}`}>
              <CreditCard className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-foreground">Stripe</h3>
              <p className="text-sm text-muted-foreground">International payments</p>
            </div>
          </div>
        </button>

        {/* SSL Commerz Option */}
        <button type="button" onClick={() => onMethodChange("sslcommerz")} className={`p-4 border-2 rounded-lg transition-all duration-200 ${selectedMethod === "sslcommerz" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}>
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${selectedMethod === "sslcommerz" ? "bg-primary text-white" : "bg-muted"}`}>
              <Globe className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-foreground">SSL Commerz</h3>
              <p className="text-sm text-muted-foreground">Bangladesh payments</p>
            </div>
          </div>
        </button>
      </div>

      {/* Payment Method Info */}
      <div className="mt-4 p-4 bg-muted/30 rounded-lg">
        {selectedMethod === "stripe" ? (
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-green-500 mt-0.5" />
            <div>
              <h4 className="font-medium text-foreground">Stripe Payment</h4>
              <p className="text-sm text-muted-foreground">Secure international payments with credit/debit cards, Apple Pay, Google Pay, and more.</p>
            </div>
          </div>
        ) : (
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-green-500 mt-0.5" />
            <div>
              <h4 className="font-medium text-foreground">SSL Commerz Payment</h4>
              <p className="text-sm text-muted-foreground">Secure Bangladesh payments with mobile banking, internet banking, and local cards.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
