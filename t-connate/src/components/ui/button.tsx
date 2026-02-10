import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/20 active:scale-[0.98]",
        destructive:
          "bg-destructive text-destructive-foreground shadow-lg hover:bg-destructive/90 hover:shadow-destructive/20",
        outline:
          "border border-border bg-transparent hover:bg-secondary hover:text-secondary-foreground hover:border-primary/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-secondary hover:text-secondary-foreground",
        link:
          "text-primary underline-offset-4 hover:underline",
        glow:
          "bg-primary text-primary-foreground shadow-lg hover:shadow-xl active:scale-[0.98]",
        glass:
          "bg-card/70 backdrop-blur-xl border border-border/50 text-foreground hover:border-primary/50 hover:bg-card/80",
        success:
          "bg-success text-primary-foreground shadow-lg hover:bg-success/90",
        warning:
          "bg-warning text-primary-foreground shadow-lg hover:bg-warning/90",
        danger:
          "bg-error text-primary-foreground shadow-lg hover:bg-error/90",
        unimount:
          "bg-unimount/20 text-unimount border border-unimount/40 hover:bg-unimount/30",
        quadmount:
          "bg-quadmount/20 text-quadmount border border-quadmount/40 hover:bg-quadmount/30",
        motion:
          "bg-motion/20 text-motion border border-motion/40 hover:bg-motion/30",
        gyro:
          "bg-gyro/20 text-gyro border border-gyro/40 hover:bg-gyro/30",
        atmos:
          "bg-atmos/20 text-atmos border border-atmos/40 hover:bg-atmos/30",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-lg px-6 text-base",
        xl: "h-14 rounded-xl px-8 text-lg",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
        "icon-lg": "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
