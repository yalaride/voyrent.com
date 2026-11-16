import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Slot } from "radix-ui";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Standard styles across the 3 columns:
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 border border-transparent shadow-xs rounded-full",

        // Neutral Secondary (Rows 1 & 2)
        outline:
          "border border-border-default bg-background-primary text-text-primary hover:bg-background-secondary hover:text-text-primary rounded-full",

        // Brand Secondary (Rows 3 & 4 with blue border & blue content)
        "outline-brand":
          "border border-primary bg-background-primary text-primary hover:bg-primary/10 hover:border-primary active:bg-primary/20 rounded-full",

        ghost:
          "bg-transparent text-primary hover:bg-primary/10 border border-transparent rounded-full",

        destructive:
          "bg-destructive text-primary-foreground hover:bg-destructive/90 border border-transparent rounded-full",

        // WhatsApp Examples
        "whatsapp-solid":
          "bg-success text-white hover:bg-success/90 border border-transparent shadow-xs rounded-full",
        "whatsapp-outline":
          "border border-success bg-background-primary text-success hover:bg-success/10 hover:border-success active:bg-success/20 rounded-full",
      },
      size: {
        // Group 1: Large Button (48px height, 24 L/R, 10 T/B, gap 10)
        lg: "h-12 px-6 py-2.5 gap-2.5 text-base rounded-full",

        // Group 2: Small Button (40px height, 16 L/R, 0 T/B, gap 4)
        sm: "h-10 px-4 py-0 gap-1 text-sm rounded-full",

        // Group 3: Icon + Text Button (178.5 × 48 px, 20 L, 24 R, 10 T/B, gap 8)
        "icon-text-lg":
          "h-12 w-[178.5px] pl-5 pr-6 py-2.5 gap-2 text-base rounded-full",

        // Group 4: Icon Only Button (135 × 40 px, 0 padding, gap 6)
        "icon-wide": "h-10 w-[135px] p-0 rounded-full",

        // Standard Icon utilities
        icon: "size-10 p-0 rounded-full",
        "icon-sm": "size-8 p-0 rounded-full",
        "icon-lg": "size-12 p-0 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "lg",
    },
  },
);

export interface ButtonProps
  extends React.ComponentProps<"button">, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

function Button({
  className,
  variant = "default",
  size = "lg",
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
