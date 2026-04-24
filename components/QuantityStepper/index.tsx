"use client";

import React, { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Minus, Plus } from "lucide-react";

type QuantityStepperProps = {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  className?: string;
};

export default function QuantityStepper({
  value,
  min = 1,
  max,
  onChange,
  className = "",
}: QuantityStepperProps) {
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const updateValue = (newValue: number) => {
    if (newValue < min) return;
    if (max && newValue > max) return;

    setInternalValue(newValue);
    onChange(newValue);
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button
        variant="outline"
        size="icon"
        onClick={() => updateValue(internalValue - 1)}
        disabled={internalValue <= min}
      >
        <Minus className="h-4 w-4" />
      </Button>

      <Input
        type="number"
        value={internalValue}
        min={min}
        onChange={(e) => {
          const val = parseInt(e.target.value);
          setInternalValue(isNaN(val) ? min : val);
        }}
        onBlur={() => updateValue(internalValue)}
        className="w-16 h-9 text-center"
      />

      <Button
        variant="outline"
        size="icon"
        onClick={() => updateValue(internalValue + 1)}
        disabled={max ? internalValue >= max : false}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
