import { useEffect, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import MetricsBar from "./components/MetricsBar";
import HeroScreen from "./components/HeroScreen";
import ChatScreen from "./components/ChatScreen";
import SharedComposer from "./components/SharedComposer";
import SettingsDrawer from "./components/SettingsDrawer";

import { useCommunityStats } from "./hooks/useCommunityStats";
import { trackFootprintEvent } from "./lib/trackFootprintEvent";
import { generateContent, type GeminiPayload } from "./lib/gemini";
import { calculateFootprint } from "./lib/footprint";
import {
  STORAGE,
  safeLoad,
  safeLoadString,
  safeSave,
  safeSaveString,
} from "./lib/storage";

import type { ChatItem, LastUsage, SessionEntry } from "./types/chat";
import LearnMorePage from "./pages/LearnMorePage";

type BrowserSpeechRecognition = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onstart: ((this: BrowserSpeechRecognition, ev: Event) => void) | null;
  onend: ((this: BrowserSpeechRecognition, ev: Event) => void) | null;
  onerror:
    | ((
        this: BrowserSpeechRecognition,
        ev: { error?: string; message?: string }
      ) => void)
    | null;
  onresult:
    | ((
        this: BrowserSpeechRecognition,
        ev: {
          resultIndex: number;
          results: ArrayLike<
            ArrayLike<{
              transcript: string;
            }> & { isFinal?: boolean }
          >;
        }
      ) => void)
    | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};

type SpeechRecognitionCtor = new () => BrowserSpeechRecognition;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  }
}

const NOTICE_DISMISSED_KEY = "gft_notice_dismissed";

function getSpeechRecognitionCtor(): SpeechRecognitionCtor | null {
  if (typeof window === "undefined") return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function sanitizeHistory(raw: unknown): ChatItem[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((item) => item && typeof item === "object")
    .map((item: any) => ({
      id: typeof item.id === "string" ? item.id : uid(),
      role: item.role === "assistant" ? "assistant" : "user",
      content: typeof item.content === "string" ? item.content : "",
      isLoading: false,
    }));
}

function AppShell() {
  const [hydrated, setHydrated] = useState(false);

  const [menuOpen, setMenuOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("gemini-2.5-flash");
  const [menuPinned, setMenuPinned] = useState(false);

  const [composerValue, setComposerValue] = useState("");
  const [warning, setWarning] = useState("");
  const [showNotice, setShowNotice] = useState(true);

  const [history, setHistory] = useState<ChatItem[]>([]);
  const [sessionEntries, setSessionEntries] = useState<SessionEntry[]>([]);
  const [totalWater, setTotalWater] = useState(0);
  const [totalCO2, setTotalCO2] = useState(0);
  const [requests, setRequests] = useState(0);
  const [lastUsage, setLastUsage] = useState<LastUsage>({
    model: "—",
    prompt: 0,
    response: 0,
  });
  const [loading, setLoading] = useState(false);

  const [micSupported, setMicSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);
  const voiceBaseValueRef = useRef("");

  const hasChat = history.length > 0;
  const stats = useCommunityStats();

  useEffect(() => {
    setMicSupported(Boolean(getSpeechRecognitionCtor()));

    setApiKey(safeLoadString(STORAGE.apiKey, ""));
    setModel(safeLoadString(STORAGE.model, "gemini-2.5-flash"));

    const pinned = safeLoadString(STORAGE.menuPinned, "0") === "1";
    setMenuPinned(pinned);
    setMenuOpen(pinned);

    const storedHistory = sanitizeHistory(safeLoad(STORAGE.history, []));
    setHistory(storedHistory);

    const storedEntries = safeLoad<SessionEntry[]>(STORAGE.sessionEntries, []);
    setSessionEntries(Array.isArray(storedEntries) ? storedEntries : []);

    const totals = safeLoad<{
      totalWater?: number;
      totalCO2?: number;
      requests?: number;
      last?: LastUsage;
    }>(STORAGE.totals, {});

    setTotalWater(Number(totals.totalWater || 0));
    setTotalCO2(Number(totals.totalCO2 || 0));
    setRequests(Number(totals.requests || 0));
    setLastUsage(
      totals.last || {
        model: "—",
        prompt: 0,
        response: 0,
      }
    );

    const dismissed = safeLoadString(NOTICE_DISMISSED_KEY, "0") === "1";
    setShowNotice(!dismissed);

    setHydrated(true);

    return () => {
      recognitionRef.current?.abort();
      recognitionRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    safeSaveString(STORAGE.apiKey, apiKey);
    safeSaveString(STORAGE.model, model);
    safeSaveString(STORAGE.menuPinned, menuPinned ? "1" : "0");
    safeSave(STORAGE.history, history);
    safeSave(STORAGE.sessionEntries, sessionEntries);
    safeSave(STORAGE.totals, {
      totalWater,
      totalCO2,
      requests,
      last: lastUsage,
    });
    safeSaveString(NOTICE_DISMISSED_KEY, showNotice ? "0" : "1");
  }, [
    hydrated,
    apiKey,
    model,
    menuPinned,
    history,
    sessionEntries,
    totalWater,
    totalCO2,
    requests,
    lastUsage,
    showNotice,
  ]);

  useEffect(() => {
    if (menuPinned) setMenuOpen(true);
  }, [menuPinned]);

  useEffect(() => {
    if (hasChat) {
      requestAnimationFrame(() => {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: "smooth",
        });
      });
    }
  }, [history, hasChat]);

  function buildPayload(userText: string): GeminiPayload {
    return {
      systemInstruction:
        "You are Gemini Footprint Tracker, a polished Gemini-style demo focused on transparent AI usage and footprint awareness. Answer naturally and helpfully.",
      contents: [
        ...history.slice(-10).map((entry) => ({
          role:
            entry.role === "assistant" ? ("model" as const) : ("user" as const),
          parts: [{ text: entry.content }],
        })),
        {
          role: "user",
          parts: [{ text: userText }],
        },
      ],
    };
  }

  function stopVoiceInput() {
    recognitionRef.current?.stop();
  }

  function startVoiceInput() {
    const Recognition = getSpeechRecognitionCtor();

    if (!Recognition) {
      setWarning("Voice input is not supported in this browser.");
      return;
    }

    if (loading) return;

    if (recognitionRef.current || isListening) {
      stopVoiceInput();
      return;
    }

    const recognition = new Recognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang =
      typeof navigator !== "undefined" && navigator.language
        ? navigator.language
        : "de-DE";
    recognition.maxAlternatives = 1;

    voiceBaseValueRef.current = composerValue.trim()
      ? `${composerValue.trim()} `
      : "";

    recognition.onstart = () => {
      setWarning("");
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      let transcript = "";

      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        transcript += result?.[0]?.transcript ?? "";
      }

      setComposerValue(`${voiceBaseValueRef.current}${transcript}`.trimStart());
    };

    recognition.onerror = (event) => {
      if (event.error === "not-allowed") {
        setWarning("Microphone permission was denied.");
      } else if (event.error === "no-speech") {
        setWarning("No speech was detected.");
      } else if (event.error === "audio-capture") {
        setWarning("No microphone was found.");
      } else {
        setWarning("Voice input failed. Please try again.");
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;
    recognition.start();
  }

  async function runPrompt(text: string, appendUserMessage: boolean) {
    const cleanText = text.trim();
    if (!cleanText || loading) return;

    if (isListening) {
      stopVoiceInput();
    }

    if (!apiKey.trim()) {
      setWarning("Add your Gemini API key first.");
      setDrawerOpen(true);
      setMenuOpen(true);
      return;
    }

    setWarning("");
    setLoading(true);
    setShowNotice(false);

    if (appendUserMessage) {
      setComposerValue("");
    }

    const userItem: ChatItem = {
      id: uid(),
      role: "user",
      content: cleanText,
    };

    const loadingItem: ChatItem = {
      id: uid(),
      role: "assistant",
      content: "Generating response…",
      isLoading: true,
    };

    if (appendUserMessage) {
      setHistory((prev) => [...prev, userItem, loadingItem]);
    } else {
      setHistory((prev) => [...prev, loadingItem]);
    }

    try {
      const payload = buildPayload(cleanText);

      const data = await generateContent(apiKey, model, payload, "normal");

      const reply =
        (data?.candidates?.[0]?.content?.parts || [])
          .map((p: { text?: string }) => p.text || "")
          .join("")
          .trim() || "No response.";

      const promptTokens = Number(data?.usageMetadata?.promptTokenCount ?? 0);
      const responseTokens = Number(
        data?.usageMetadata?.candidatesTokenCount ?? 0
      );

      const impact = calculateFootprint({
        model: model as
          | "gemini-2.5-flash-lite"
          | "gemini-2.5-flash"
          | "gemini-2.5-pro",
        promptTokens,
        responseTokens,
      });

      await trackFootprintEvent({
        waterMl: impact.water,
        co2G: impact.co2,
      });

      setSessionEntries((prev) => [
        {
          id: uid(),
          water: impact.water,
          co2: impact.co2,
          prompt: cleanText,
        },
        ...prev,
      ]);

      setHistory((prev) =>
        prev.map((item) =>
          item.id === loadingItem.id
            ? { ...item, content: reply, isLoading: false }
            : item
        )
      );

      setTotalWater((prev) => prev + impact.water);
      setTotalCO2((prev) => prev + impact.co2);
      setRequests((prev) => prev + 1);

      setLastUsage({
        model: model.replace("gemini-", ""),
        prompt: promptTokens,
        response: responseTokens,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown request error";

      setHistory((prev) =>
        prev.map((item) =>
          item.id === loadingItem.id
            ? { ...item, content: `Error: ${message}`, isLoading: false }
            : item
        )
      );
    } finally {
      setLoading(false);
    }
  }

  async function sendMessage(overrideValue?: string) {
    const text = overrideValue ?? composerValue;
    await runPrompt(text, true);
  }

  async function redoLastPrompt() {
    const lastUser = [...history]
      .reverse()
      .find((entry) => entry.role === "user");
    if (!lastUser) return;

    await runPrompt(lastUser.content, false);
  }

  function dismissNotice() {
    setShowNotice(false);
  }

  function clearChat() {
    recognitionRef.current?.abort();
    recognitionRef.current = null;
    setIsListening(false);

    setHistory([]);
    setSessionEntries([]);
    setTotalWater(0);
    setTotalCO2(0);
    setRequests(0);
    setLastUsage({
      model: "—",
      prompt: 0,
      response: 0,
    });
    setComposerValue("");
  }

  const sidebarWidthClass = menuOpen ? "lg:pl-[270px]" : "lg:pl-[64px]";
  const bottomLeftClass = menuOpen ? "lg:left-[270px]" : "lg:left-[64px]";

  const composerHint = !micSupported
    ? "Voice input works best in supported Chromium-based browsers."
    : isListening
    ? "Listening… speak now."
    : warning && !drawerOpen
    ? warning
    : "";
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    function handleTimeUpdate() {
      if (!video) return;
      if (video.duration && video.currentTime >= video.duration - 0.7) {
        video.currentTime = 0;
      }
    }

    video.addEventListener("timeupdate", handleTimeUpdate);
    return () => video.removeEventListener("timeupdate", handleTimeUpdate);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      <video
        ref={videoRef}
        className="pointer-events-none fixed inset-0 h-full w-full object-cover"
        autoPlay
        muted
        playsInline
        preload="auto"
      >
        <source src="/earth.mp4" type="video/mp4" />
      </video>

      <div className="pointer-events-none fixed inset-0 bg-[#040507]/55" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(138,180,255,0.16),transparent_22%),linear-gradient(180deg,rgba(6,8,12,0.45),rgba(4,5,7,0.74))]" />

      <Sidebar
        menuOpen={menuOpen}
        sessionEntries={sessionEntries}
        onToggleMenu={() => {
          if (menuPinned) setMenuPinned(false);
          setMenuOpen((prev) => !prev);
        }}
        onNewChat={clearChat}
        onOpenSettings={() => {
          setDrawerOpen(true);
          setMenuOpen(true);
        }}
      />

      <div
        className={`relative z-10 min-h-screen transition-[padding] duration-200 ${sidebarWidthClass}`}
      >
        <div className="min-w-0 min-h-screen flex flex-col pt-16">
          <Topbar
            uniqueUsers={stats.uniqueUsers}
            communityWater={stats.totalWaterMl}
            communityCo2={stats.totalCo2G}
            menuOpen={menuOpen}
          />

          {hasChat && (
            <MetricsBar
              water={totalWater}
              co2={totalCO2}
              communityWater={stats.totalWaterMl}
              communityCo2={stats.totalCo2G}
            />
          )}

          <LayoutGroup id="composer-layout">
            <main className="relative flex-1">
              <AnimatePresence mode="wait">
                {!hasChat ? (
                  <motion.div
                    key="hero-state"
                    className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center px-6 pb-28 pt-8"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    <div className="w-full max-w-[900px]">
                      <HeroScreen visible />

                      <div className="mt-6">
                        <SharedComposer
                          value={composerValue}
                          onChange={setComposerValue}
                          onSend={sendMessage}
                          onToggleVoice={startVoiceInput}
                          loading={loading}
                          docked={false}
                          showChips
                          isListening={isListening}
                          micSupported={micSupported}
                          helperText={composerHint}
                          communityWater={stats.totalWaterMl}
                          communityCo2={stats.totalCo2G}
                          uniqueUsers={stats.uniqueUsers}
                        />
                      </div>

                      {showNotice && (
                        <div className="mt-6 w-full max-w-[620px] rounded-[24px] border border-white/12 bg-white/[0.08] px-4 py-4 text-[15px] leading-7 text-[#e7edf8] shadow-[0_20px_80px_rgba(0,0,0,0.28)] backdrop-blur-[24px]">
                          <div>
                            Gemini Footprint Tracker makes AI resource use more
                            visible using Gemini usage metadata and transparent
                            estimation logic, while keeping your API key local
                            and only using it for direct Gemini requests, with
                            CO₂ and water tracking data anonymized and
                            aggregated via Supabase.{" "}
                            <a
                              href="https://github.com/southy404/gemini-footprint-tracker"
                              target="_blank"
                              rel="noreferrer"
                              className="underline underline-offset-4 text-[#9fc0ff] hover:text-white transition"
                            >
                              See code
                            </a>
                          </div>

                          <div className="mt-4 flex gap-4 text-sm">
                            <Link
                              to="/learn"
                              className="text-[#9fc0ff] hover:text-white transition"
                            >
                              Learn more
                            </Link>

                            <button
                              onClick={dismissNotice}
                              className="text-[#9fc0ff] hover:text-white transition"
                            >
                              Dismiss
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="chat-state"
                    className="flex-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    <ChatScreen
                      history={history}
                      onRedoLastAssistant={redoLastPrompt}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {hasChat && (
                <>
                  <div
                    className={`pointer-events-none fixed bottom-0 right-0 ${bottomLeftClass} z-20 h-[220px] bg-gradient-to-t from-[#050608] via-[#050608]/92 via-35% to-transparent transition-[left] duration-200`}
                  />

                  <div
                    className={`pointer-events-none fixed bottom-0 right-0 ${bottomLeftClass} z-20 h-[110px] bg-[linear-gradient(180deg,rgba(5,6,8,0)_0%,rgba(5,6,8,0.14)_30%,rgba(5,6,8,0.38)_55%,rgba(5,6,8,0.82)_100%)] transition-[left] duration-200`}
                  />
                </>
              )}

              <AnimatePresence>
                {hasChat && (
                  <motion.div
                    key="bottom-composer"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.16 }}
                    className={`fixed bottom-0 right-0 ${bottomLeftClass} z-30 px-3 md:px-6 pb-4 pt-10 transition-[left] duration-200`}
                  >
                    <div className="mx-auto w-full max-w-[900px] px-4 md:px-6">
                      <SharedComposer
                        value={composerValue}
                        onChange={setComposerValue}
                        onSend={sendMessage}
                        onToggleVoice={startVoiceInput}
                        loading={loading}
                        docked
                        isListening={isListening}
                        micSupported={micSupported}
                        helperText={composerHint}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </main>
          </LayoutGroup>

          {!hasChat && (
            <footer className="pointer-events-none fixed bottom-2 left-1/2 z-20 -translate-x-1/2 px-4 text-center text-[11px] text-white/55">
              <div>
                An awareness project exploring the environmental impact of AI,
                built for the DEV Earth Day Challenge 2026.
              </div>
            </footer>
          )}
        </div>

        <SettingsDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          apiKey={apiKey}
          setApiKey={setApiKey}
          model={model}
          setModel={setModel}
          menuPinned={menuPinned}
          setMenuPinned={(value: boolean) => {
            setMenuPinned(value);
            if (value) setMenuOpen(true);
          }}
          warning={warning}
        />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppShell />} />
        <Route path="/learn" element={<LearnMorePage />} />
      </Routes>
    </BrowserRouter>
  );
}
