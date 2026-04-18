import { ArrowLeft, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { BlockMath, InlineMath } from "react-katex";
import GeminiMark from "../components/GeminiMark";

function GitHubIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-4 w-4 fill-current"
    >
      <path d="M12 2C6.477 2 2 6.589 2 12.248c0 4.526 2.865 8.367 6.839 9.722.5.096.682-.222.682-.494 0-.244-.009-.89-.014-1.747-2.782.617-3.37-1.367-3.37-1.367-.455-1.177-1.11-1.491-1.11-1.491-.908-.636.069-.623.069-.623 1.004.072 1.532 1.054 1.532 1.054.892 1.56 2.341 1.11 2.91.849.091-.664.349-1.11.635-1.365-2.221-.259-4.555-1.137-4.555-5.063 0-1.119.389-2.034 1.029-2.751-.103-.26-.446-1.303.098-2.717 0 0 .84-.276 2.75 1.051A9.303 9.303 0 0 1 12 6.836a9.27 9.27 0 0 1 2.504.349c1.909-1.327 2.748-1.051 2.748-1.051.546 1.414.202 2.457.1 2.717.64.717 1.028 1.632 1.028 2.751 0 3.936-2.338 4.801-4.566 5.055.359.318.679.944.679 1.903 0 1.374-.012 2.482-.012 2.82 0 .274.18.594.688.493C19.138 20.611 22 16.772 22 12.248 22 6.589 17.523 2 12 2Z" />
    </svg>
  );
}

function SourceCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex items-start justify-between gap-3 rounded-[22px] border border-white/10 bg-[rgba(10,12,16,0.52)] p-4 backdrop-blur-[24px] supports-[backdrop-filter]:bg-[rgba(10,12,16,0.42)] transition hover:bg-[rgba(18,21,28,0.62)]"
    >
      <div className="min-w-0">
        <div className="text-sm font-medium text-white">{title}</div>
        <div className="mt-1 text-sm leading-6 text-[#aeb8c8]">
          {description}
        </div>
      </div>
      <ExternalLink size={16} className="mt-1 shrink-0 text-[#8ab4ff]" />
    </a>
  );
}

function InfoCard({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[28px] border border-white/10 bg-[rgba(10,12,16,0.52)] p-5 backdrop-blur-[26px] supports-[backdrop-filter]:bg-[rgba(10,12,16,0.42)] md:p-7">
      {eyebrow && (
        <div className="text-xs uppercase tracking-[0.18em] text-[#8ea0bf]">
          {eyebrow}
        </div>
      )}
      <h2 className="mt-2 text-[20px] font-[550] tracking-[-0.03em] text-white md:text-[22px]">
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

/**
 * MathBlock
 *
 * - `math`    → full formula shown on md+ screens
 * - `breakAt` → compact/broken version shown on mobile only (optional)
 *
 * Font size scales down via clamp() so mid-size viewports (sm) also benefit
 * without needing a scrollbar.
 */
function MathBlock({ math, breakAt }: { math: string; breakAt?: string }) {
  const scaledStyle = {
    fontSize: "clamp(0.68rem, 2.6vw, 1rem)",
  } as React.CSSProperties;

  return (
    <>
      {/* Mobile version — compact / line-broken formula */}
      {breakAt && (
        <div className="overflow-x-auto py-0.5 md:hidden" style={scaledStyle}>
          <BlockMath math={breakAt} />
        </div>
      )}
      {/* Desktop version — full formula (hidden on mobile when breakAt supplied) */}
      <div
        className={`overflow-x-auto py-0.5 ${breakAt ? "hidden md:block" : ""}`}
        style={scaledStyle}
      >
        <BlockMath math={math} />
      </div>
    </>
  );
}

export default function LearnMorePage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#050608] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[#040507]/55" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(138,180,255,0.16),transparent_22%),linear-gradient(180deg,rgba(6,8,12,0.45),rgba(4,5,7,0.74))]" />

      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-4 py-6 md:px-6 md:py-10">
        {/* Nav */}
        <div className="mb-6 flex items-center justify-between gap-3 md:mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-[#cfd6e4] backdrop-blur-[18px] transition hover:bg-white/[0.08] hover:text-white md:px-4"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Back to tracker</span>
            <span className="sm:hidden">Back</span>
          </Link>
          <a
            href="https://github.com/southy404"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-[#cfd6e4] backdrop-blur-[18px] transition hover:bg-white/[0.08] hover:text-white md:px-4"
          >
            <GitHubIcon />
            southy404
          </a>
        </div>

        {/* Hero + disclaimer */}
        <div className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
          <section className="rounded-[28px] border border-white/10 bg-[rgba(10,12,16,0.52)] p-5 backdrop-blur-[28px] supports-[backdrop-filter]:bg-[rgba(10,12,16,0.42)] md:rounded-[34px] md:p-8 xl:p-10">
            <div className="mb-3 flex items-center gap-2 text-[#9fc0ff]">
              <GeminiMark className="scale-[0.7]" />
              <span className="text-xs uppercase tracking-[0.22em] text-[#8ea0bf]">
                Methodology
              </span>
            </div>
            <h1 className="text-[clamp(26px,5vw,60px)] font-[550] leading-[1.0] tracking-[-0.04em] text-white md:leading-[0.96] md:tracking-[-0.05em]">
              How Gemini Footprint Tracker estimates water and CO₂
            </h1>
            <p className="mt-4 text-[15px] leading-7 text-[#cfd6e4] md:mt-5 md:text-[17px] md:leading-8">
              This page explains the logic behind the tracker as clearly as
              possible. It is designed for transparency, not false precision,
              and turns Gemini usage metadata into a documented estimation model
              that users can inspect, question, and improve on.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3 md:mt-8 md:gap-4">
              {[
                {
                  label: "water per median Gemini Apps text prompt",
                  value: "0.26 mL",
                },
                {
                  label: "emissions per median Gemini Apps text prompt",
                  value: "0.03 gCO₂e",
                },
                {
                  label: "energy per median Gemini Apps text prompt",
                  value: "0.24 Wh",
                },
              ].map((stat) => (
                <div
                  key={stat.value}
                  className="rounded-[20px] border border-white/10 bg-white/[0.04] p-4 backdrop-blur-[18px] md:rounded-[24px] md:p-5"
                >
                  <div className="text-[10px] uppercase tracking-[0.18em] text-[#8ea0bf]">
                    Official baseline
                  </div>
                  <div className="mt-2 text-[clamp(22px,4vw,30px)] font-[550] tracking-[-0.04em] text-white">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-sm leading-6 text-[#aeb8c8]">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="space-y-5">
            <InfoCard
              eyebrow="Disclaimer"
              title="What this project is — and is not"
            >
              <div className="space-y-3 text-[15px] leading-7 text-[#cfd6e4]">
                <p>
                  Gemini Footprint Tracker is <strong>not</strong> an official
                  Google product, dashboard, or publication.
                </p>
                <p>
                  It is an independent learning and awareness project built for
                  a DEV challenge, using public Gemini-related baseline numbers,
                  transparent assumptions, and user-facing estimation logic.
                </p>
                <p>
                  The goal is to make AI resource usage easier to understand,
                  not to imply official per-model environmental reporting from
                  Google where none is publicly provided.
                </p>
              </div>
            </InfoCard>
            <InfoCard eyebrow="Principle" title="Design principle">
              <p className="text-[15px] leading-7 text-[#cfd6e4]">
                The goal is to make AI usage more visible, not to overclaim
                impossible precision. This tracker is intentionally transparent
                about what is official, what is estimated, and where the numbers
                come from.
              </p>
            </InfoCard>
          </div>
        </div>

        {/* Main content */}
        <div className="mt-5 grid gap-5 md:mt-6 xl:grid-cols-[1.15fr_0.85fr]">
          <section className="rounded-[26px] border border-white/10 bg-[rgba(10,12,16,0.52)] p-5 backdrop-blur-[26px] supports-[backdrop-filter]:bg-[rgba(10,12,16,0.42)] md:rounded-[30px] md:p-8">
            <h2 className="text-[22px] font-[550] tracking-[-0.03em] text-white md:text-[26px]">
              What is official
            </h2>
            <p className="mt-4 text-[15px] leading-7 text-[#cfd6e4]">
              Google publicly states that a{" "}
              <strong>median Gemini Apps text prompt</strong> uses{" "}
              <strong>0.24 Wh</strong> of energy, emits{" "}
              <strong>0.03 gCO₂e</strong>, and consumes <strong>0.26 mL</strong>{" "}
              of water.
            </p>

            <div className="mt-5 overflow-hidden rounded-[20px] border border-white/10 bg-[#13151c]/90 p-4 md:rounded-[24px] md:p-5">
              <div className="text-xs uppercase tracking-[0.16em] text-[#8ea0bf]">
                Official baseline
              </div>
              <div className="mt-3 space-y-1 text-[#eef3ff]">
                <MathBlock
                  math={String.raw`\text{BaseWater} = 0.26\,\text{mL}`}
                />
                <MathBlock
                  math={String.raw`\text{BaseCO}_2 = 0.03\,\text{gCO}_2\text{e}`}
                />
                <MathBlock
                  math={String.raw`\text{BaseEnergy} = 0.24\,\text{Wh}`}
                />
              </div>
            </div>

            <h2 className="mt-8 text-[22px] font-[550] tracking-[-0.03em] text-white md:mt-10 md:text-[26px]">
              What this app estimates
            </h2>
            <p className="mt-4 text-[15px] leading-7 text-[#cfd6e4]">
              Public materials describe a Gemini median baseline, but they do
              not provide a simple public table of exact environmental values
              for each Gemini API model name. This app therefore combines the
              official baseline with token-based scaling and transparent model
              profiles.
            </p>

            <div className="mt-5 overflow-hidden rounded-[20px] border border-white/10 bg-[#13151c]/90 p-4 md:rounded-[24px] md:p-5">
              <div className="text-xs uppercase tracking-[0.16em] text-[#8ea0bf]">
                Estimation model
              </div>
              <div className="mt-3 space-y-2 text-[#eef3ff]">
                {/* WeightedTokens — longest formula, fully broken on mobile */}
                <MathBlock
                  math={String.raw`\text{WeightedTokens} = \text{PromptTokens} + \text{ResponseTokens} \times 3.5`}
                  breakAt={String.raw`\begin{aligned}\text{Weighted}&\text{Tokens}\\&= \text{Prompt} + \text{Response} \times 3.5\end{aligned}`}
                />

                {/* ReferenceWeighted */}
                <MathBlock
                  math={String.raw`\text{ReferenceWeighted} = 250 + 150 \times 3.5 = 775`}
                  breakAt={String.raw`\begin{aligned}\text{Reference} &= 250\\&+ 150 \times 3.5 = 775\end{aligned}`}
                />

                {/* TokenScale — fraction is fine on mobile, just needs smaller font */}
                <MathBlock
                  math={String.raw`\text{TokenScale} = \max\!\left(0.2,\frac{\text{WeightedTokens}}{775}\right)`}
                />

                {/* WaterEstimate */}
                <MathBlock
                  math={String.raw`\text{WaterEstimate} = 0.26 \times \text{TokenScale} \times \text{ModelMultiplier}`}
                  breakAt={String.raw`\begin{aligned}\text{Water} &= 0.26\\&\times \text{Scale} \times \text{Mult.}\end{aligned}`}
                />

                {/* CO2Estimate */}
                <MathBlock
                  math={String.raw`\text{CO}_2\text{Est.} = 0.03 \times \text{TokenScale} \times \text{ModelMultiplier}`}
                  breakAt={String.raw`\begin{aligned}\text{CO}_2 &= 0.03\\&\times \text{Scale} \times \text{Mult.}\end{aligned}`}
                />
              </div>

              <div className="mt-5 grid gap-3 text-[14px] leading-7 text-[#cfd6e4]">
                <p>
                  <InlineMath math={String.raw`\text{PromptTokens}`} /> are
                  counted at normal weight, while{" "}
                  <InlineMath math={String.raw`\text{ResponseTokens}`} /> are
                  weighted more heavily because generating output is typically
                  more computationally expensive than processing input.
                </p>
                <p>
                  The tracker uses an{" "}
                  <InlineMath math={String.raw`\text{OutputWeight} = 3.5`} />,
                  which is a conservative estimate anchored to a reference
                  Gemini prompt with <strong>250 input tokens</strong> and{" "}
                  <strong>150 output tokens</strong>.
                </p>
                <p>
                  The <strong>250 / 150 token split</strong> is not an official
                  Google value — it is a transparent project assumption used to
                  represent a plausible typical Gemini prompt.
                </p>
                <p>
                  A minimum floor of{" "}
                  <InlineMath math={String.raw`\text{TokenScale} = 0.2`} /> is
                  applied so very short prompts do not collapse toward zero.
                </p>
              </div>
            </div>

            <h2 className="mt-8 text-[22px] font-[550] tracking-[-0.03em] text-white md:mt-10 md:text-[26px]">
              Why this is not exact
            </h2>
            <p className="mt-4 text-[15px] leading-7 text-[#cfd6e4]">
              The reported baseline values refer to a median Gemini Apps prompt
              under a specific methodology, but real-world impact can vary
              significantly depending on factors such as infrastructure, cooling
              systems, utilization rates, energy mix, hardware, and the chosen
              accounting boundaries. Notably, only on-site cooling water is
              included, while indirect water consumption from electricity
              generation is excluded, which diverges from standard life cycle
              assessment practices. In addition, the definition of the "median
              prompt" remains unclear, as neither token length nor complexity is
              disclosed, making independent verification and cross-provider
              comparisons difficult. The methodology also applies exclusively to
              text generation, even though image and video prompts typically
              require substantially more resources and are not accounted for
              here.
            </p>
            <p className="mt-4 text-[15px] leading-7 text-[#cfd6e4]">
              Furthermore, these figures are subject to rapid change. Google has
              reported a 33× reduction in energy per prompt within a single
              year, suggesting that current estimates may already be outdated,
              especially in the absence of independent verification. Finally,
              the model-specific multipliers used in this tracker are not based
              on official disclosures but on documented internal approximations,
              meaning they should be interpreted as indicative rather than
              definitive values.
            </p>
          </section>

          <aside className="space-y-5">
            <InfoCard title="Current model multipliers">
              <div className="space-y-3 text-[15px] leading-7 text-[#cfd6e4]">
                <p>
                  The tracker uses a transparent internal{" "}
                  <strong>ModelMultiplier</strong> to distinguish lighter and
                  heavier Gemini model classes when exact public per-model
                  environmental values are not available.
                </p>
                <p>
                  This is not an official Google publication — it is an
                  independent awareness project using public baseline values and
                  app-side estimation logic.
                </p>
              </div>
              <div className="mt-4 overflow-hidden rounded-[20px] border border-white/10 bg-[#13151c]/90 p-4 md:rounded-[24px] md:p-5">
                <div className="text-xs uppercase tracking-[0.16em] text-[#8ea0bf]">
                  Current model profile
                </div>
                <div className="mt-3 space-y-1 text-[#eef3ff]">
                  {/* Short labels — no breakAt needed */}
                  <MathBlock
                    math={String.raw`\text{Flash-Lite} \rightarrow 0.85\times`}
                  />
                  <MathBlock
                    math={String.raw`\text{Flash} \rightarrow 1.00\times`}
                  />
                  <MathBlock
                    math={String.raw`\text{Pro} \rightarrow 1.35\times`}
                  />
                </div>
              </div>
            </InfoCard>

            <InfoCard title="In plain language">
              <div className="space-y-3 text-[15px] leading-7 text-[#cfd6e4]">
                <p>
                  The <strong>baseline</strong> comes from Google.
                </p>
                <p>
                  The <strong>request-size scaling</strong> comes from Gemini
                  usage metadata.
                </p>
                <p>
                  The <strong>model profile</strong> is a documented
                  approximation inside this app.
                </p>
              </div>
            </InfoCard>

            <InfoCard title="Primary sources">
              <div className="space-y-3">
                <SourceCard
                  title="Google Cloud official blog"
                  description="Official public summary of Gemini prompt energy, carbon, and water impact."
                  href="https://cloud.google.com/blog/products/infrastructure/measuring-the-environmental-impact-of-ai-inference/"
                />
                <SourceCard
                  title="Google technical paper (arXiv)"
                  description="Paper describing the methodology behind the published Gemini prompt values."
                  href="https://arxiv.org/abs/2508.15734"
                />
              </div>
            </InfoCard>

            <InfoCard title="Background video credit">
              <div className="space-y-3 text-[15px] leading-7 text-[#cfd6e4]">
                <p>
                  The Earth background video is based on the Pixabay clip{" "}
                  <a
                    href="https://pixabay.com/videos/world-earth-nasa-planet-globe-2/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#9fc0ff] underline underline-offset-4 transition hover:text-white"
                  >
                    "World, Earth, Nasa"
                  </a>{" "}
                  by <strong>NASA-Imagery</strong>.
                </p>
                <p>
                  Included here with credit as part of the project presentation.
                </p>
              </div>
            </InfoCard>

            <InfoCard title="Why this page exists">
              <p className="text-[15px] leading-7 text-[#cfd6e4]">
                This page is here so the tracker does not hide behind vague
                sustainability language. It tries to separate official numbers,
                transparent assumptions, and user-facing simplifications as
                clearly as possible.
              </p>
            </InfoCard>
          </aside>
        </div>
      </div>
    </div>
  );
}
