import { useState } from "react";
import { Check, Copy, QrCode } from "lucide-react";
import { formatRoomCode } from "@/lib/liveQuiz";

// Kod PIN pokoju i kod QR, który przenosi ucznia prosto do dołączania.
export default function QRPanel({ code, link }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="rounded-3xl border border-primary/30 bg-card p-5">
      <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Kod pokoju</p>
      <p className="mt-1 font-display text-4xl font-semibold tracking-[0.12em] text-primary text-glow">
        {formatRoomCode(code)}
      </p>

      <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row">
        <div className="rounded-2xl bg-white p-2.5">
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=0&data=${encodeURIComponent(link)}`}
            alt={`Kod QR do pokoju ${formatRoomCode(code)}`}
            width={168}
            height={168}
            className="h-[168px] w-[168px]"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <QrCode className="h-3.5 w-3.5 text-primary" />
            Uczeń skanuje kod telefonem
          </p>
          <p className="mt-2 break-all rounded-xl border border-border bg-background/70 px-3 py-2 text-[11px] text-muted-foreground">
            {link}
          </p>
          <button
            type="button"
            onClick={copy}
            className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-[11px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Skopiowano link" : "Kopiuj link"}
          </button>
        </div>
      </div>
    </div>
  );
}