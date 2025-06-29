import { cn } from "../../../fonctions/fonction";
import React from "react";

export const CardContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return <div className={cn("p-4", className)} {...props} />;
};
