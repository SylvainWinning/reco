import type * as React from "react";

import type { ButtonVariantProps } from "./button-variants";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, ButtonVariantProps {
  asChild?: boolean;
}
