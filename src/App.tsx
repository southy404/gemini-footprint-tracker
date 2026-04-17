import { useEffect, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import MetricsBar from "./components/MetricsBar";
import HeroScreen from "./components/HeroScreen";
import ChatScreen from "./components/ChatScreen";
import SharedComposer from "./components/SharedComposer";
import SettingsDrawer from "./components/SettingsDrawer";

import { countTokens, generateContent, type GeminiPayload } from "./lib/gemini";
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

  const hasChat = history.length > 0;

  useEffect(() => {
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
  }, []);

  useEffect(() => {
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
  }, [
    apiKey,
    model,
    menuPinned,
    history,
    sessionEntries,
    totalWater,
    totalCO2,
    requests,
    lastUsage,
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

  async function sendMessage() {
    const text = composerValue.trim();
    if (!text || loading) return;

    if (!apiKey.trim()) {
      setWarning("Add your Gemini API key first.");
      setDrawerOpen(true);
      setMenuOpen(true);
      return;
    }

    setWarning("");
    setLoading(true);
    setComposerValue("");

    const userItem: ChatItem = {
      id: uid(),
      role: "user",
      content: text,
    };

    const loadingItem: ChatItem = {
      id: uid(),
      role: "assistant",
      content: "Generating response…",
      isLoading: true,
    };

    setHistory((prev) => [...prev, userItem, loadingItem]);

    try {
      const payload = buildPayload(text);
      const countedPrompt = await countTokens(apiKey, model, payload);
      const data = await generateContent(apiKey, model, payload, "normal");

      const reply =
        (data?.candidates?.[0]?.content?.parts || [])
          .map((p: { text?: string }) => p.text || "")
          .join("")
          .trim() || "No response.";

      const promptTokens = Number(
        data?.usageMetadata?.promptTokenCount || countedPrompt || 0
      );
      const responseTokens = Number(
        data?.usageMetadata?.candidatesTokenCount || 0
      );

      const impact = calculateFootprint({
        model: model as
          | "gemini-2.5-flash-lite"
          | "gemini-2.5-flash"
          | "gemini-2.5-pro",
        promptTokens,
        responseTokens,
      });

      setSessionEntries((prev) => [
        {
          id: uid(),
          water: impact.water,
          co2: impact.co2,
          prompt: text,
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

  function clearChat() {
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
    setShowNotice(true);
  }

  const bottomLeftClass = menuOpen ? "lg:left-[270px]" : "lg:left-[64px]";

  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      <video
        className="pointer-events-none fixed inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/earth.mp4" type="video/mp4" />
      </video>

      <div className="pointer-events-none fixed inset-0 bg-[#040507]/55" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(138,180,255,0.16),transparent_22%),linear-gradient(180deg,rgba(6,8,12,0.45),rgba(4,5,7,0.74))]" />

      <div
        className={`relative z-10 min-h-screen ${
          menuOpen
            ? "lg:grid-cols-[270px_minmax(0,1fr)]"
            : "lg:grid-cols-[64px_minmax(0,1fr)]"
        } grid grid-cols-1 transition-all duration-200`}
      >
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

        <div className="min-w-0 min-h-screen flex flex-col">
          <Topbar />

          {hasChat && (
            <MetricsBar
              model={lastUsage.model}
              prompt={lastUsage.prompt}
              response={lastUsage.response}
              water={totalWater}
              co2={totalCO2}
              requests={requests}
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
                    <div className="w-full max-w-[680px]">
                      <HeroScreen visible />

                      <div className="mt-6">
                        <SharedComposer
                          value={composerValue}
                          onChange={setComposerValue}
                          onSend={sendMessage}
                          loading={loading}
                          docked={false}
                          showChips
                        />
                      </div>

                      {showNotice && (
                        <div className="mt-6 w-full max-w-[620px] rounded-[24px] border border-white/12 bg-white/[0.08] px-4 py-4 text-[15px] leading-7 text-[#e7edf8] shadow-[0_20px_80px_rgba(0,0,0,0.28)] backdrop-blur-[24px]">
                          <div>
                            Gemini Footprint Tracker uses Gemini usage metadata
                            and transparent estimation logic to make AI resource
                            use more visible.
                          </div>

                          <div className="mt-4 flex gap-4 text-sm">
                            <Link
                              to="/learn"
                              className="text-[#9fc0ff] hover:text-white transition"
                            >
                              Learn more
                            </Link>

                            <button
                              onClick={() => setShowNotice(false)}
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
                    <ChatScreen history={history} />
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {hasChat && (
                  <motion.div
                    key="bottom-composer"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.12 }}
                    className={`fixed bottom-0 right-0 ${bottomLeftClass} z-30 bg-gradient-to-b from-transparent via-[#050608]/35 to-[#050608]/75 px-3 md:px-6 pb-4 pt-5 transition-[left] duration-200`}
                  >
                    <div className="mx-auto w-full max-w-[680px]">
                      <SharedComposer
                        value={composerValue}
                        onChange={setComposerValue}
                        onSend={sendMessage}
                        loading={loading}
                        docked
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </main>
          </LayoutGroup>
        </div>

        <SettingsDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          apiKey={apiKey}
          setApiKey={setApiKey}
          model={model}
          setModel={setModel}
          menuPinned={menuPinned}
          setMenuPinned={(value) => {
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
