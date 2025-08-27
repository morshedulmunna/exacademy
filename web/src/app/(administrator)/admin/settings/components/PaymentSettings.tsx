import React from "react";
import { CreditCard } from "lucide-react";
import { SettingsSection } from "./SettingsSection";
import { FormField } from "./FormField";

/**
 * Payment settings section component
 */
export const PaymentSettings: React.FC = () => (
  <SettingsSection
    icon={<CreditCard className="w-6 h-6" />}
    title="Payment Settings"
    iconBgColor="bg-green-100 dark:bg-green-900/20"
    iconColor="text-green-600 dark:text-green-400"
  >
    <FormField
      label="Currency"
      type="select"
      options={[
        { value: "USD", label: "USD ($)" },
        { value: "EUR", label: "EUR (€)" },
        { value: "GBP", label: "GBP (£)" },
        { value: "CAD", label: "CAD (C$)" }
      ]}
    />
    
    <FormField
      label="Stripe Publishable Key"
      type="text"
      defaultValue="pk_test_..."
    />
    
    <FormField
      label="Commission Rate (%)"
      type="number"
      defaultValue={10}
      min={0}
      max={50}
      step={0.1}
    />
    
    <FormField
      label="Auto-payout Enabled"
      type="checkbox"
      defaultValue={true}
      placeholder="Automatically pay out instructor earnings"
    />
  </SettingsSection>
);

