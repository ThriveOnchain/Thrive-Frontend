"use client";
import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "./ui/input";

const inputRegex = /^\d*(?:\\[.])?\d*$/; // match escaped "." characters via in a non-capturing group
const escapeRegExp = (string: string) =>
  string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string

const numericInputProps: Partial<React.InputHTMLAttributes<HTMLInputElement>> =
  {
    placeholder: "0.0",
  };

const percentInputProps: Partial<React.InputHTMLAttributes<HTMLInputElement>> =
  {
    placeholder: "0",
    pattern: "^[0-9]*$",
    inputMode: "decimal",
    maxLength: 3,
  };

const textFieldVariants = cva(
  "",
  {
    variants: {
      size: {
        sm: "min-h-[36px] h-[36px] py-1",
        default: "min-h-[40px] h-[40px] py-2",
      },
      variant: {
        default:
          "",
        naked: "border-0 bg-transparent",
        outline:
          "flex items-center px-3 rounded-lg block border",
      },
      isError: {
        yes: "bg-red/10 text-red",
        no: "",
      },
      hasIcon: {
        yes: "pl-[40px]",
        no: "",
      },
      hasUnit: {
        yes: "rounded-r-none !border-r-0",
        no: "",
      },
    },
    defaultVariants: {
      variant: "default",
      hasIcon: "no",
      hasUnit: "no",
      size: "default",
      isError: "no",
    },
  },
);

type InputType = "text" | "number" | "percent";

interface TextFieldBaseProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    Omit<VariantProps<typeof textFieldVariants>, "isError"> {
  isError?: boolean;
  id?: string;
  icon?: LucideIcon;
  iconProps?: Omit<React.ComponentProps<"svg">, "width" | "height">;
  unit?: string;
}

interface TextFieldDynamicProps<T extends InputType> {
  type: T;
  maxDecimals?: T extends "number" ? number : never;
  onValueChange?(val: string): void;
}

export type TextFieldProps<T extends InputType> = TextFieldBaseProps &
  TextFieldDynamicProps<T>;

const isTypeText = (type: InputType): type is "text" => type === "text";
const isTypeNumber = (type: InputType): type is "number" => type === "number";
const isTypePercent = (type: InputType): type is "percent" =>
  type === "percent";

const Component = <T extends InputType>(
  {
    icon: Icon,
    iconProps,
    unit,
    variant,
    className,
    type,
    onChange,
    maxDecimals,
    size,
    onValueChange,
    isError,
    ...props
  }: TextFieldProps<T>,
  ref: React.ForwardedRef<HTMLInputElement>,
) => {
  const _onChange: React.InputHTMLAttributes<HTMLInputElement>["onChange"] = (
    e,
  ) => {
    const nextUserInput = e.target.value;
    if (typeof nextUserInput === "undefined") {
      return;
    }

    if (isTypeNumber(type)) {
      const val = `${nextUserInput}`.replace(/,/g, ".");
      if (onValueChange && val === "") onValueChange("");
      if (inputRegex.test(escapeRegExp(val))) {
        if (maxDecimals && val?.includes(".")) {
          const [, decimals] = val.split(".");
          if (onValueChange && decimals!.length <= maxDecimals) {
            onValueChange(val);
          }
        } else {
          if (onValueChange) onValueChange(val);
        }
      }
    } else if (isTypeText(type) && onValueChange) {
      onValueChange(nextUserInput);
    } else if (isTypePercent(type)) {
      const _nextUserInput = nextUserInput.replace(/,/g, ".").replace(/%/g, "");
      if (
        _nextUserInput === "" ||
        inputRegex.test(escapeRegExp(_nextUserInput))
      ) {
        if (onValueChange) onValueChange(_nextUserInput);
      }
    }

    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div className="relative flex items-center justify-between w-full group">
      {Icon ? <Icon className="absolute w-4 h-4 left-3" /> : null}
      <Input
        onChange={_onChange}
        className={textFieldVariants({
          isError: isError ? "yes" : "no",
          variant,
          hasIcon: Icon ? "yes" : "no",
          hasUnit: unit ? "yes" : "no",
          className: cn(className, "flex-grow flex-1 !outline-none !ring-0"),
        })}
        ref={ref}
        autoCorrect="off"
        autoCapitalize="none"
        spellCheck="false"
        autoComplete="off"
        {...(isTypeNumber(type) && numericInputProps)}
        {...(isTypePercent(type) && percentInputProps)}
        {...props}
      />
      {unit ? (
        <div
          className={textFieldVariants({
            isError: isError ? "yes" : "no",
            variant,
            size,
            className: "text-muted-foreground rounded-l-none !w-[unset]",
          })}
        >
          {unit}
        </div>
      ) : null}
    </div>
  );
};

const TextField = React.forwardRef(Component);
TextField.displayName = "TextField";

const TextFieldDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
});
TextFieldDescription.displayName = "TextFieldDescription";

export {
  TextField,
  type TextFieldBaseProps,
  TextFieldDescription,
  textFieldVariants,
};
