import { motion } from "framer-motion";
import { Cloud, Droplets } from "lucide-react";

type Props = {
  model: string;
  prompt: number;
  response: number;
  water: number;
  co2: number;
  requests: number;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function WaterGlass({ fill }: { fill: number }) {
  const safeFill = clamp(fill, 0, 1);

  return (
    <div className="relative h-24 w-14 overflow-hidden rounded-b-[16px] rounded-t-[10px] border border-white/20 bg-white/[0.06] shadow-inner backdrop-blur-[10px]">
      <motion.div
        className="absolute inset-x-0 bottom-0"
        initial={false}
        animate={{ height: `${safeFill * 100}%` }}
        transition={{ type: "spring", stiffness: 120, damping: 18 }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-300/95 to-cyan-500/95" />

        <motion.div
          className="absolute -top-1 left-[-30%] h-4 w-[160%] rounded-[999px] bg-cyan-100/80 blur-[1px]"
          animate={{ x: [0, 18, 0, -12, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          className="absolute -top-2 left-[-40%] h-5 w-[180%] rounded-[999px] bg-cyan-200/40"
          animate={{ x: [0, -16, 10, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      <div className="pointer-events-none absolute inset-x-2 top-2 h-5 rounded-full bg-white/10 blur-[2px]" />
    </div>
  );
}

function WaterCard({ water }: { water: number }) {
  const fills = Array.from({ length: 4 }, (_, i) =>
    clamp(water / 250 - i, 0, 1)
  );

  const compare =
    water < 250
      ? "less than one glass"
      : water < 1000
      ? `${(water / 250).toFixed(1)} glasses`
      : `${(water / 1000).toFixed(2)} bottles`;

  return (
    <div className="rounded-[28px] border border-white/12 bg-white/[0.08] p-4 md:p-5 backdrop-blur-[28px] shadow-[0_20px_80px_rgba(0,0,0,0.22)]">
      <div className="mb-3 flex items-center gap-2 text-[#c9d7ea]">
        <Droplets size={16} className="text-cyan-300" />
        <span className="text-xs uppercase tracking-[0.18em]">
          Water impact
        </span>
      </div>

      <div className="text-[34px] font-[550] leading-none tracking-[-0.04em] text-white">
        {water.toFixed(1)}
        <span className="ml-1 text-base font-medium text-[#c4d3e8]">ml</span>
      </div>

      <div className="mt-1 text-sm text-[#b3dceb]">{compare}</div>

      <div className="mt-5 flex items-end gap-3">
        {fills.map((fill, index) => (
          <WaterGlass key={index} fill={fill} />
        ))}
      </div>
    </div>
  );
}

function Co2Card({ co2 }: { co2: number }) {
  const percent = clamp((co2 / 2) * 100, 4, 100);

  const compare =
    co2 < 0.1
      ? "tiny trace"
      : co2 < 0.5
      ? "around a breath"
      : co2 < 1.5
      ? "several breaths"
      : "noticeably higher session impact";

  return (
    <div className="rounded-[28px] border border-white/12 bg-white/[0.08] p-4 md:p-5 backdrop-blur-[28px] shadow-[0_20px_80px_rgba(0,0,0,0.22)]">
      <div className="mb-3 flex items-center gap-2 text-[#c9d7ea]">
        <Cloud size={16} className="text-sky-300" />
        <span className="text-xs uppercase tracking-[0.18em]">CO₂ impact</span>
      </div>

      <div className="text-[34px] font-[550] leading-none tracking-[-0.04em] text-white">
        {co2.toFixed(2)}
        <span className="ml-1 text-base font-medium text-[#c4d3e8]">g</span>
      </div>

      <div className="mt-1 text-sm text-[#c5d4ff]">{compare}</div>

      <div className="mt-5">
        <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-blue-400 via-sky-400 to-cyan-300"
            initial={false}
            animate={{ width: `${percent}%` }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
          />
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-[#b2c1db]">
          <span>low</span>
          <span>relative comparison</span>
          <span>high</span>
        </div>
      </div>
    </div>
  );
}

export default function MetricsBar({ water, co2 }: Props) {
  return (
    <div className="sticky top-16 z-20 px-3 md:px-6 pt-3">
      <div className="mx-auto grid w-full max-w-[1080px] grid-cols-1 gap-3 lg:grid-cols-2">
        <WaterCard water={water} />
        <Co2Card co2={co2} />
      </div>
    </div>
  );
}
