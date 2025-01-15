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
    const [inputValue, setInputValue] = React.useState(value.toString());

    React.useEffect(() => {
      setInputValue(value.toString());
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setInputValue(val);

      // If empty or not a number, don't update
      if (val === '' || isNaN(Number(val))) return;

      const newValue = parseInt(val, 10);

      // Don't update if outside bounds
      if (min !== undefined && newValue < min) return;
      if (max !== undefined && newValue > max) return;

      onChange(newValue);
    };

    const handleBlur = () => {
      // On blur, if empty or invalid, reset to min or current value
      if (inputValue === '' || isNaN(Number(inputValue))) {
        const resetValue = min !== undefined ? min : value;
        setInputValue(resetValue.toString());
        onChange(resetValue);
        return;
      }

      const newValue = parseInt(inputValue, 10);

      // On blur, enforce min/max bounds
      if (min !== undefined && newValue < min) {
        setInputValue(min.toString());
        onChange(min);
        return;
      }

      if (max !== undefined && newValue > max) {
        setInputValue(max.toString());
        onChange(max);
        return;
      }
    };

    return (
      <Input
        type="number"
        value={inputValue}
        onChange={handleChange}
        onBlur={handleBlur}
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