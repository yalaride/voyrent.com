import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Slot } from "radix-ui";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "border border-transparent bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",

        outline:
          "border border-border-default bg-background-primary text-text-primary hover:bg-background-secondary hover:text-text-primary",
        "outline-brand":
          "border border-border-default bg-background-primary text-primary hover:border-primary hover:bg-primary/10 active:bg-primary/20",

        ghost:
          "border border-transparent bg-transparent text-primary hover:bg-primary/10",

        destructive:
          "border border-transparent bg-destructive text-primary-foreground hover:bg-destructive/90",

        "whatsapp-solid":
          "border border-transparent bg-success text-white shadow-xs hover:bg-success/90",

        "whatsapp-outline":
          "border border-border-default bg-background-primary text-success hover:border-success hover:bg-success/10 active:bg-success/20",

        // Legacy aliases kept for backwards compatibility
        "outline-call":
          "border border-border-default bg-background-primary text-primary hover:border-primary hover:bg-primary/10 active:bg-primary/20",
        "outline-whatsapp":
          "border border-border-default bg-background-primary text-success hover:border-success hover:bg-success/10 active:bg-success/20",
      },
      size: {
        lg: "h-12 gap-2.5 px-6 py-2.5 text-base [&_svg:not([class*='size-'])]:size-5",
        sm: "h-10 gap-1.5 px-4 py-0 text-sm [&_svg:not([class*='size-'])]:size-4",

        "icon-text-lg":
          "h-12 w-[178.5px] gap-2 pl-5 pr-6 py-2.5 text-base [&_svg:not([class*='size-'])]:size-5",

        "icon-text-sm":
          "h-10 gap-2 px-4 py-0 text-sm [&_svg:not([class*='size-'])]:size-4",

        "icon-wide": "h-10 w-[135px] p-0 [&_svg:not([class*='size-'])]:size-5",

        icon: "size-10 p-0 [&_svg:not([class*='size-'])]:size-5",
        "icon-sm": "size-8 p-0 [&_svg:not([class*='size-'])]:size-4",
        "icon-lg": "size-12 p-0 [&_svg:not([class*='size-'])]:size-5",
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
  type,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      type={asChild ? undefined : (type ?? "button")}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Button, buttonVariants };
