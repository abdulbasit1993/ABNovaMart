"use client";

import React, { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2, MapPin } from "lucide-react";
import apiService from "@/services/apiService";

export interface AddressFormData {
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export interface AddressPayload {
  shippingAddress: AddressFormData;
  billingAddress: AddressFormData;
  sameAsShipping: boolean;
}

interface SavedAddress {
  _id: string;
  userId: string;
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  addressType: string;
  isDefault: boolean;
  created_at: string;
  updated_at: string;
}

const emptyAddress: AddressFormData = {
  fullName: "",
  phone: "",
  addressLine: "",
  city: "",
  state: "",
  country: "",
  postalCode: "",
};

interface FieldErrors {
  [key: string]: string;
}

interface AddressSectionProps {
  onPayloadReady: (payload: AddressPayload | null) => void;
  onSavedAddressId: (id: string) => void;
  triggerValidation: boolean;
  onValidationResult: (isValid: boolean) => void;
}

function AddressFormFields({
  prefix,
  values,
  onChange,
  errors,
}: {
  prefix: string;
  values: AddressFormData;
  onChange: (field: keyof AddressFormData, value: string) => void;
  errors: FieldErrors;
}) {
  const field = (label: string, key: keyof AddressFormData, placeholder: string, type = "text") => (
    <div className="flex flex-col gap-1">
      <Label htmlFor={`${prefix}-${key}`} className="text-sm font-medium">
        {label} <span className="text-destructive">*</span>
      </Label>
      <Input
        id={`${prefix}-${key}`}
        type={type}
        placeholder={placeholder}
        value={values[key]}
        onChange={(e) => onChange(key, e.target.value)}
        className={errors[key] ? "border-destructive focus-visible:ring-destructive" : ""}
      />
      {errors[key] && (
        <p className="text-xs text-destructive">{errors[key]}</p>
      )}
    </div>
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {field("Full Name", "fullName", "John Doe")}
      {field("Phone", "phone", "+1 234 567 8900", "tel")}
      <div className="sm:col-span-2">
        {field("Address Line", "addressLine", "123 Main St, Apt 4B")}
      </div>
      {field("City", "city", "New York")}
      {field("State / Province", "state", "NY")}
      {field("Country", "country", "USA")}
      {field("Postal Code", "postalCode", "10001")}
    </div>
  );
}

function validateAddress(address: AddressFormData, prefix: string): FieldErrors {
  const errors: FieldErrors = {};
  const required: (keyof AddressFormData)[] = [
    "fullName", "phone", "addressLine", "city", "state", "country", "postalCode",
  ];
  required.forEach((key) => {
    if (!address[key].trim()) {
      errors[key] = "This field is required.";
    }
  });
  if (address.phone && !/^\+?[\d\s\-()]{7,20}$/.test(address.phone)) {
    errors["phone"] = "Enter a valid phone number.";
  }
  return errors;
}

export default function AddressSection({
  onPayloadReady,
  onSavedAddressId,
  triggerValidation,
  onValidationResult,
}: AddressSectionProps) {
  const [loading, setLoading] = useState(true);
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [hasFetched, setHasFetched] = useState(false);

  const [shipping, setShipping] = useState<AddressFormData>({ ...emptyAddress });
  const [billing, setBilling] = useState<AddressFormData>({ ...emptyAddress });
  const [sameAsShipping, setSameAsShipping] = useState(true);

  const [shippingErrors, setShippingErrors] = useState<FieldErrors>({});
  const [billingErrors, setBillingErrors] = useState<FieldErrors>({});

  // Fetch address
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await apiService.get("/addresses");
        const response = res?.data;
        if (response?.success && Array.isArray(response?.data)) {
          setSavedAddresses(response?.data);
        }
      } catch (err) {
        console.error("Failed to fetch addresses:", err);
      } finally {
        setLoading(false);
        setHasFetched(true);
      }
    };
    fetchAddresses();
  }, []);

  // Notify parent of saved shipping address ID when addresses are loaded
  useEffect(() => {
    if (!hasFetched || savedAddresses.length === 0) return;
    const shippingAddr =
      savedAddresses.find((a) => a.addressType === "shipping" && a.isDefault) ??
      savedAddresses.find((a) => a.addressType === "shipping") ??
      savedAddresses[0];
    onSavedAddressId(shippingAddr._id);
  }, [savedAddresses, hasFetched]);

  // Build payload whenever form data changes
  useEffect(() => {
    if (!hasFetched) return;
    if (savedAddresses.length > 0) {
      onPayloadReady(null); // address already on file
      return;
    }
    const payload: AddressPayload = {
      shippingAddress: shipping,
      billingAddress: sameAsShipping ? shipping : billing,
      sameAsShipping,
    };
    onPayloadReady(payload);
  }, [shipping, billing, sameAsShipping, savedAddresses, hasFetched]);

  // Run validation when triggered from parent
  useEffect(() => {
    if (!triggerValidation) return;
    if (savedAddresses.length > 0) {
      onValidationResult(true);
      return;
    }

    const sErrors = validateAddress(shipping, "shipping");
    setShippingErrors(sErrors);

    let bErrors: FieldErrors = {};
    if (!sameAsShipping) {
      bErrors = validateAddress(billing, "billing");
      setBillingErrors(bErrors);
    } else {
      setBillingErrors({});
    }

    const isValid =
      Object.keys(sErrors).length === 0 && Object.keys(bErrors).length === 0;
    onValidationResult(isValid);
  }, [triggerValidation]);

  const updateShipping = (field: keyof AddressFormData, value: string) => {
    setShipping((prev) => ({ ...prev, [field]: value }));
    setShippingErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const updateBilling = (field: keyof AddressFormData, value: string) => {
    setBilling((prev) => ({ ...prev, [field]: value }));
    setBillingErrors((prev) => ({ ...prev, [field]: "" }));
  };

  if (loading) {
    return (
      <div className="bg-card p-6 rounded-lg shadow-sm flex items-center gap-3 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span>Loading address information...</span>
      </div>
    );
  }

  // User has saved addresses — show them
  if (savedAddresses.length > 0) {
    const defaultAddr =
      savedAddresses.find((a) => a.addressType === "shipping" && a.isDefault) ??
      savedAddresses.find((a) => a.addressType === "shipping") ??
      savedAddresses[0];
    return (
      <div className="bg-card p-6 rounded-lg shadow-sm space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          Shipping Address
        </h2>
        <div className="bg-muted/40 border rounded-lg p-4 space-y-1 text-sm">
          <p className="font-semibold text-base">{defaultAddr.fullName}</p>
          <p className="text-muted-foreground">{defaultAddr.phone}</p>
          <p>{defaultAddr.addressLine}</p>
          <p>
            {defaultAddr.city}, {defaultAddr.state} {defaultAddr.postalCode}
          </p>
          <p>{defaultAddr.country}</p>
          {defaultAddr.isDefault && (
            <span className="inline-block mt-1 text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">
              Default Address
            </span>
          )}
        </div>
      </div>
    );
  }

  // No saved address — show form
  return (
    <div className="space-y-6">
      {/* Shipping Address */}
      <div className="bg-card p-6 rounded-lg shadow-sm space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          Shipping Address
        </h2>
        <AddressFormFields
          prefix="shipping"
          values={shipping}
          onChange={updateShipping}
          errors={shippingErrors}
        />

        {/* Same as Shipping checkbox */}
        <div className="flex items-center gap-2 pt-2">
          <Checkbox
            id="same-as-shipping"
            checked={sameAsShipping}
            onCheckedChange={(checked) => setSameAsShipping(!!checked)}
          />
          <Label htmlFor="same-as-shipping" className="cursor-pointer text-sm">
            Billing address same as shipping address
          </Label>
        </div>
      </div>

      {/* Billing Address — only when unchecked */}
      {!sameAsShipping && (
        <div className="bg-card p-6 rounded-lg shadow-sm space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Billing Address
          </h2>
          <AddressFormFields
            prefix="billing"
            values={billing}
            onChange={updateBilling}
            errors={billingErrors}
          />
        </div>
      )}
    </div>
  );
}