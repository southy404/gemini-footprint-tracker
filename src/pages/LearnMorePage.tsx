import { ArrowLeft, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { BlockMath, InlineMath } from "react-katex";

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
      className="flex items-start justify-between gap-3 rounded-2xl border border-white/8 bg-white/[0.025] p-4 hover:bg-white/[0.04] transition"
    >
      <div>
        <div className="text-sm font-medium text-white">{title}</div>
        <div className="mt-1 text-sm leading-6 text-[#aeb8c8]">
          {description}
        </div>
      </div>
      <ExternalLink size={16} className="mt-1 shrink-0 text-[#8ab4ff]" />
    </a>
  );
}

export default function LearnMorePage() {
  return (
    <div className="min-h-screen bg-[#0b0c0f] text-white">
      <div className="mx-auto w-full max-w-[960px] px-6 py-12 md:py-16">
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-[#cfd6e4] hover:bg-white/[0.05] hover:text-white transition"
          >
            <ArrowLeft size={16} />
            Back to tracker
          </Link>
        </div>

        <div className="max-w-[780px]">
          <div className="mb-3 text-sm uppercase tracking-[0.22em] text-[#8ea0bf]">
            Methodology
          </div>

          <h1 className="text-[clamp(34px,5vw,54px)] font-[550] leading-[0.98] tracking-[-0.05em] text-white">
            How Gemini Footprint Tracker estimates water and CO₂
          </h1>

          <p className="mt-5 text-[17px] leading-8 text-[#cfd6e4]">
            This project is designed for transparency, not false precision. It
            combines Gemini usage metadata with a documented estimation model so
            users can see AI resource use in a way that is understandable,
            inspectable, and open to critique.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <div className="rounded-[24px] border border-white/10 bg-white/[0.035] p-5">
            <div className="text-xs uppercase tracking-[0.18em] text-[#8ea0bf]">
              Official baseline
            </div>
            <div className="mt-3 text-[28px] font-[550] tracking-[-0.04em]">
              0.26 mL
            </div>
            <div className="mt-1 text-sm leading-6 text-[#aeb8c8]">
              water per median Gemini Apps text prompt
            </div>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-white/[0.035] p-5">
            <div className="text-xs uppercase tracking-[0.18em] text-[#8ea0bf]">
              Official baseline
            </div>
            <div className="mt-3 text-[28px] font-[550] tracking-[-0.04em]">
              0.03 gCO₂e
            </div>
            <div className="mt-1 text-sm leading-6 text-[#aeb8c8]">
              emissions per median Gemini Apps text prompt
            </div>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-white/[0.035] p-5">
            <div className="text-xs uppercase tracking-[0.18em] text-[#8ea0bf]">
              Official baseline
            </div>
            <div className="mt-3 text-[28px] font-[550] tracking-[-0.04em]">
              0.24 Wh
            </div>
            <div className="mt-1 text-sm leading-6 text-[#aeb8c8]">
              energy per median Gemini Apps text prompt
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6 md:p-7">
            <h2 className="text-[24px] font-[550] tracking-[-0.03em]">
              What is official
            </h2>

            <p className="mt-4 text-[15px] leading-7 text-[#cfd6e4]">
              Google publicly states that a{" "}
              <strong>median Gemini Apps text prompt</strong> uses{" "}
              <strong>0.24 Wh</strong> of energy, emits{" "}
              <strong>0.03 gCO₂e</strong>, and consumes <strong>0.26 mL</strong>{" "}
              of water.
            </p>

            <div className="mt-6 rounded-[22px] border border-white/10 bg-[#13151c]/90 p-5">
              <div className="text-xs uppercase tracking-[0.16em] text-[#8ea0bf]">
                Official baseline
              </div>
              <div className="mt-4 space-y-2 text-[#eef3ff]">
                <BlockMath
                  math={String.raw`\text{BaseWater} = 0.26\,\text{mL}`}
                />
                <BlockMath
                  math={String.raw`\text{BaseCO}_2 = 0.03\,\text{gCO}_2\text{e}`}
                />
                <BlockMath
                  math={String.raw`\text{BaseEnergy} = 0.24\,\text{Wh}`}
                />
              </div>
            </div>

            <h2 className="mt-10 text-[24px] font-[550] tracking-[-0.03em]">
              What this app estimates
            </h2>

            <p className="mt-4 text-[15px] leading-7 text-[#cfd6e4]">
              Google’s public materials describe a Gemini median baseline, but
              they do not provide a simple public table of exact environmental
              values for each Gemini API model name. This app therefore combines
              the official baseline with token-based scaling and transparent
              model profiles.
            </p>

            <div className="mt-6 rounded-[22px] border border-white/10 bg-[#13151c]/90 p-5">
              <div className="text-xs uppercase tracking-[0.16em] text-[#8ea0bf]">
                Estimation model
              </div>

              <div className="mt-4 space-y-4 text-[#eef3ff]">
                <BlockMath
                  math={String.raw`\text{WaterEstimate} = \text{BaseWater} \times \text{TokenScale} \times \text{ModelMultiplier}`}
                />
                <BlockMath
                  math={String.raw`\text{CO2Estimate} = \text{BaseCO}_2 \times \text{TokenScale} \times \text{ModelMultiplier}`}
                />
              </div>

              <div className="mt-6 grid gap-4 text-[14px] leading-7 text-[#cfd6e4]">
                <p>
                  <InlineMath math={String.raw`\text{TokenScale}`} /> is derived
                  from returned usage metadata, specifically prompt and response
                  token counts.
                </p>
                <p>
                  <InlineMath math={String.raw`\text{ModelMultiplier}`} /> is a
                  transparent project-side profile used to distinguish lighter
                  and heavier Gemini model classes.
                </p>
              </div>
            </div>

            <h2 className="mt-10 text-[24px] font-[550] tracking-[-0.03em]">
              Why this is not exact
            </h2>

            <p className="mt-4 text-[15px] leading-7 text-[#cfd6e4]">
              Google’s reported values are for a median Gemini Apps prompt under
              a specific methodology. Real impact varies with infrastructure,
              cooling, utilization, energy mix, and accounting boundaries.
            </p>
          </section>

          <aside className="space-y-6">
            <section className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
              <h2 className="text-[20px] font-[550] tracking-[-0.03em]">
                In plain language
              </h2>

              <div className="mt-4 space-y-3 text-[14px] leading-7 text-[#cfd6e4]">
                <p>
                  The <strong>baseline</strong> comes from Google.
                </p>
                <p>
                  The <strong>request size scaling</strong> comes from Gemini
                  usage metadata.
                </p>
                <p>
                  The <strong>model profile</strong> is a documented
                  approximation inside this app.
                </p>
              </div>
            </section>

            <section className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
              <h2 className="text-[20px] font-[550] tracking-[-0.03em]">
                Primary sources
              </h2>

              <div className="mt-4 space-y-3">
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
            </section>

            <section className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
              <h2 className="text-[20px] font-[550] tracking-[-0.03em]">
                Design principle
              </h2>

              <p className="mt-4 text-[14px] leading-7 text-[#cfd6e4]">
                The goal is to make AI usage more visible, not to overclaim
                impossible precision. This tracker is intentionally transparent
                about where the numbers come from, what is official, and what is
                estimated.
              </p>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
