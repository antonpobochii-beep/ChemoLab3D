import { useEffect, useRef, useState } from "react";
import { Camera, CameraOff } from "lucide-react";
import { cn } from "@/lib/utils";

// Tło z kamery: scena AR, a po odmowie dostępu — ciemne studio laboratoryjne.
export default function ARCamera({ enabled, children, className = "" }) {
  const videoRef = useRef(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setError(false);
      return undefined;
    }

    let stream;
    if (!navigator.mediaDevices?.getUserMedia) {
      setError(true);
      return undefined;
    }

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" }, audio: false })
      .then((nextStream) => {
        stream = nextStream;
        if (videoRef.current) {
          videoRef.current.srcObject = nextStream;
          videoRef.current.play?.().catch(() => {});
        }
      })
      .catch(() => setError(true));

    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [enabled]);

  return (
    <div className={cn("relative overflow-hidden rounded-3xl border border-border bg-background", className)}>
      <video
        ref={videoRef}
        playsInline
        muted
        className={cn(
          "absolute inset-0 h-full w-full object-cover transition-opacity duration-500",
          enabled && !error ? "opacity-100" : "opacity-0"
        )}
      />

      {!enabled || error ? (
        <div className="mesh-grid absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,hsl(168_60%_18%),hsl(222_46%_6%)_70%)]" />
      ) : null}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background/45" />

      {error ? (
        <div className="absolute left-1/2 top-4 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full border border-border bg-background/90 px-3 py-1.5 text-[11px] text-muted-foreground">
          <CameraOff className="h-3.5 w-3.5" />
          Brak dostępu do kamery — tryb studyjny
        </div>
      ) : null}

      {!enabled ? (
        <div className="absolute left-1/2 top-4 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full border border-border bg-background/90 px-3 py-1.5 text-[11px] text-muted-foreground">
          <Camera className="h-3.5 w-3.5" />
          Kamera wyłączona
        </div>
      ) : null}

      {children}
    </div>
  );
}