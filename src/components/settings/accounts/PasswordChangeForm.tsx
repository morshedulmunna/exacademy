"use client";

import React, { useState } from "react";

type Props = object;

export default function PasswordChangeForm({}: Props) {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // Clear errors on change
  };

  const validate = () => {
    const newErrors: typeof errors = {
      newPassword: "",
      confirmPassword: "",
    };

    if (!formData.newPassword) {
      newErrors.newPassword = "New Password is required.";
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters long.";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm Password is required.";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      // Submit form logic
      console.log("Form submitted:", formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="new-password" className="text-sm font-medium text-foreground">
            New Password
          </label>
          <input
            type="password"
            id="new-password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            className={`w-full px-3 py-2 bg-background border rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent ${
              errors.newPassword 
                ? "border-destructive focus:ring-destructive/20" 
                : "border-border hover:border-input"
            }`}
            placeholder="Enter new password"
          />
          {errors.newPassword && (
            <p className="text-sm text-destructive">{errors.newPassword}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="confirm-password" className="text-sm font-medium text-foreground">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirm-password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`w-full px-3 py-2 bg-background border rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent ${
              errors.confirmPassword 
                ? "border-destructive focus:ring-destructive/20" 
                : "border-border hover:border-input"
            }`}
            placeholder="Confirm new password"
          />
          {errors.confirmPassword && (
            <p className="text-sm text-destructive">{errors.confirmPassword}</p>
          )}
        </div>
      </div>
      
      <button
        type="submit"
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        Change Password
      </button>
    </form>
  );
}
