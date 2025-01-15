import * as React from "react";
import { cn } from "@/lib/utils";
import { Input, InputProps } from "@/components/ui/input";

export interface NumberInputProps extends Omit<InputProps, "type" | "value" | "onChange"> {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  ({ className, value, onChange, min, max, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = parseInt(e.target.value, 10);
      if (isNaN(newValue)) return;
      
      if (min !== undefined && newValue < min) {
        onChange(min);
        return;
      }
      
      if (max !== undefined && newValue > max) {
        onChange(max);
        return;
      }
      
      onChange(newValue);
    };

    return (
      <Input
        type="number"
        value={value}
        onChange={handleChange}
        min={min}
        max={max}
        className={cn("text-center w-32", className)}
        ref={ref}
        {...props}
      />
    );
  }
);

NumberInput.displayName = "NumberInput";

export { NumberInput };
