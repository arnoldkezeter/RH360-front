import { cn } from "../../../fonctions/fonction";
import React from "react";

export const Card = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return <div className={cn("rounded-2xl shadow-md border bg-white", className)} {...props} />;
};
