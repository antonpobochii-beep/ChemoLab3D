import { Link } from "@tanstack/react-router";
import { ScanEye } from "lucide-react";
import { cn } from "@/lib/utils";

// Wejście do trybu AR z każdego modułu 3D — model otwiera się od razu na kamerze.
export default function ARLauncher({ modelId, label = "Tryb AR", className = "" }) {
  return (
    <Link
      to="/ar"
      search={modelId ? { model: modelId } : {}}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary",
        className
      )}
    >
      <ScanEye className="h-4 w-4" />
      {label}
    </Link>
  );
}