import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { X, Send } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import mascotAsset from "@/assets/edpath-assistant-mascot.png.asset.json";

type ChatMessage = { role: "user" | "assistant"; content: string };

export default function EdPathAssistant() {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const locale = i18n.language?.slice(0, 2) || "pt";
  const suggestions = t("assistant.suggestions", { returnObjects: true }) as string[];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading, open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("edpath:open-assistant", handler);
    return () => window.removeEventListener("edpath:open-assistant", handler);
  }, []);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const next: ChatMessage[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("edpath-assistant", {
        body: { messages: next, locale },
      });
      if (error) throw error;
      const reply = (data as any)?.reply ?? t("assistant.errorInline");
      setMessages([...next, { role: "assistant", content: reply }]);
    } catch (_e) {
      setMessages([...next, { role: "assistant", content: t("assistant.errorInline") }]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  }

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={t("assistant.openLabel")}
          className="fixed bottom-5 right-5 z-[100] flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-[hsl(var(--azul))] shadow-lg ring-2 ring-[hsl(var(--crimson))]/60 transition hover:scale-105 hover:bg-[hsl(var(--azul))]/90"
        >
          <img
            src={mascotAsset.url}
            alt={t("assistant.title")}
            className="h-full w-full object-cover"
          />
        </button>
      )}

      {open && (
        <div
          className={cn(
            "fixed z-[100] flex flex-col bg-white shadow-2xl",
            "inset-0 sm:inset-auto sm:bottom-5 sm:right-5 sm:h-[600px] sm:max-h-[80vh] sm:w-[400px] sm:rounded-2xl",
            "border border-navy/10 overflow-hidden",
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-3 border-b border-navy/10 bg-gradient-to-r from-[hsl(var(--azul))] to-[hsl(216_90%_64%)] px-4 py-3 text-white">
            <div className="flex items-center gap-3">
              <img
                src={mascotAsset.url}
                alt={t("assistant.title")}
                className="h-10 w-10 rounded-full object-cover bg-white/10 ring-2 ring-white/20"
              />
              <div>
                <h2 className="font-heading text-base font-bold leading-tight">
                  {t("assistant.title")}
                </h2>
                <p className="text-xs text-white/70 leading-snug">{t("assistant.subtitle")}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t("assistant.closeLabel")}
              className="rounded-md p-1 text-white/80 hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-slate-50">
            {messages.length === 0 && (
              <div className="space-y-4">
                <p className="text-sm text-navy/80 leading-relaxed">{t("assistant.greeting")}</p>
                <div className="flex flex-col gap-2">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => send(s)}
                      className="text-left text-sm text-navy border border-navy/15 bg-white rounded-lg px-3 py-2 hover:border-[hsl(var(--crimson))] hover:text-[hsl(var(--crimson))] transition"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <div
                key={i}
                className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed",
                    m.role === "user"
                      ? "bg-navy text-white rounded-br-sm"
                      : "bg-white text-navy border border-navy/10 rounded-bl-sm",
                  )}
                >
                  {m.role === "assistant" ? (
                    <div className="prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-a:text-[hsl(var(--crimson))] prose-a:underline">
                      <ReactMarkdown
                        components={{
                          a: ({ node, ...props }) => (
                            <a {...props} target="_blank" rel="noopener noreferrer" />
                          ),
                        }}
                      >
                        {m.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{m.content}</p>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-navy/10 rounded-2xl rounded-bl-sm px-3 py-2">
                  <span className="inline-flex gap-1">
                    <span className="h-2 w-2 rounded-full bg-navy/40 animate-bounce [animation-delay:-0.3s]" />
                    <span className="h-2 w-2 rounded-full bg-navy/40 animate-bounce [animation-delay:-0.15s]" />
                    <span className="h-2 w-2 rounded-full bg-navy/40 animate-bounce" />
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-navy/10 bg-white p-3">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t("assistant.placeholder")}
                rows={1}
                className="flex-1 resize-none rounded-lg border border-navy/15 px-3 py-2 text-sm font-body focus:border-navy focus:outline-none max-h-32"
              />
              <button
                type="button"
                onClick={() => send(input)}
                disabled={loading || !input.trim()}
                aria-label={t("assistant.send")}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-[hsl(var(--crimson))] text-white transition hover:bg-[hsl(var(--crimson))]/90 disabled:opacity-40"
              >
                <Send className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>
            <p className="mt-2 text-[11px] text-navy/50 leading-snug">
              {t("assistant.disclaimer")}
            </p>
          </div>
        </div>
      )}
    </>
  );
}