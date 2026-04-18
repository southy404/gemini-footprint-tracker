import { motion } from "framer-motion";
import { Cloud, Droplets } from "lucide-react";

type Props = {
  water: number;
  co2: number;
  communityWater: number;
  communityCo2: number;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function formatWater(value: number) {
  const v = Number(value) || 0;
  if (v < 1000) return `${v.toFixed(1)} mL`;
  if (v < 10000) return `${(v / 1000).toFixed(2)} L`;
  return `${(v / 1000).toFixed(1)} L`;
}

function formatCo2(value: number) {
  const v = Number(value) || 0;
  if (v < 1000) return `${v.toFixed(2)} g`;
  return `${(v / 1000).toFixed(2)} kg`;
}

/* ---------------- WATER CIRCLE ---------------- */

function WaterCircle({ value }: { value: number }) {
  const safe = Number(value) || 0;
  const fill = clamp((safe % 1000) / 1000, 0, 1);

  return (
    <div className="relative h-24 w-24 overflow-hidden rounded-full border border-white/20 bg-white/[0.06] backdrop-blur-[10px]">
      <motion.div
        className="absolute inset-x-0 bottom-0"
        animate={{ height: `${fill * 100}%` }}
        transition={{ type: "spring", stiffness: 120, damping: 18 }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-300/95 to-cyan-500/95" />

        <motion.div
          className="absolute -top-2 left-[-30%] h-5 w-[160%] rounded-full bg-cyan-100/80"
          animate={{ x: [0, 20, -10, 0] }}
          transition={{ duration: 2.6, repeat: Infinity }}
        />

        <motion.div
          className="absolute -top-3 left-[-40%] h-6 w-[180%] rounded-full bg-cyan-200/40"
          animate={{ x: [0, -15, 10, 0] }}
          transition={{ duration: 3.4, repeat: Infinity }}
        />
      </motion.div>
    </div>
  );
}

/* ---------------- CO2 CIRCLE ---------------- */

function Co2Circle({ value }: { value: number }) {
  const safe = Number(value) || 0;
  const fill = clamp((safe % 100) / 100, 0, 1);

  return (
    <div className="relative h-24 w-24 overflow-hidden rounded-full border border-white/20 bg-white/[0.06] backdrop-blur-[10px]">
      <div
        className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-blue-400 via-sky-400 to-cyan-300"
        style={{ height: `${fill * 100}%` }}
      />
    </div>
  );
}

/* ---------------- WATER CARD ---------------- */

function WaterCard({
  water,
  communityWater,
}: {
  water: number;
  communityWater: number;
}) {
  const safeCommunity = Number(communityWater) || 0;

  const compare =
    water < 250
      ? "less than one glass"
      : water < 1000
      ? `${(water / 250).toFixed(1)} glasses`
      : `${(water / 1000).toFixed(2)} L`;

  return (
    <div className="rounded-[28px] border border-white/10 bg-[rgba(10,12,16,0.52)] p-4 backdrop-blur-[26px] md:p-5">
      <div className="flex items-center justify-between gap-6">
        {/* YOUR DATA */}
        <div>
          <div className="mb-3 flex items-center gap-2 text-[#c9d7ea]">
            <Droplets size={16} className="text-cyan-300" />
            <span className="text-xs uppercase tracking-[0.18em]">
              Water impact
            </span>
          </div>

          <div className="text-[34px] font-[550] text-white">
            {water.toFixed(1)}
            <span className="ml-1 text-base text-[#c4d3e8]">ml</span>
          </div>

          <div className="mt-1 text-sm text-[#b3dceb]">{compare}</div>
        </div>

        {/* COMMUNITY */}
        <div className="flex flex-col items-center gap-1">
          <WaterCircle value={safeCommunity} />

          <div className="text-xs font-medium text-white/80">
            {formatWater(safeCommunity)} / 1L
          </div>
          <div className="text-[10px] text-white/50 uppercase">all users</div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- CO2 CARD ---------------- */

function Co2Card({ co2, communityCo2 }: { co2: number; communityCo2: number }) {
  const safeCommunity = Number(communityCo2) || 0;

  const compare =
    co2 < 0.1
      ? "tiny trace"
      : co2 < 0.5
      ? "around a breath"
      : co2 < 1.5
      ? "several breaths"
      : "noticeably higher session impact";

  return (
    <div className="rounded-[28px] border border-white/10 bg-[rgba(10,12,16,0.52)] p-4 backdrop-blur-[26px] md:p-5">
      <div className="flex items-center justify-between gap-6">
        {/* YOUR DATA */}
        <div>
          <div className="mb-3 flex items-center gap-2 text-[#c9d7ea]">
            <Cloud size={16} className="text-sky-300" />
            <span className="text-xs uppercase tracking-[0.18em]">
              CO₂ impact
            </span>
          </div>

          <div className="text-[34px] font-[550] text-white">
            {co2.toFixed(2)}
            <span className="ml-1 text-base text-[#c4d3e8]">g</span>
          </div>

          <div className="mt-1 text-sm text-[#c5d4ff]">{compare}</div>
        </div>

        {/* COMMUNITY */}
        <div className="flex flex-col items-center gap-1">
          <Co2Circle value={safeCommunity} />

          <div className="text-xs font-medium text-white/80">
            {formatCo2(safeCommunity)} / 100g
          </div>

          <div className="text-[10px] text-white/50 uppercase">all users</div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- BAR ---------------- */

export default function MetricsBar({
  water,
  co2,
  communityWater,
  communityCo2,
}: Props) {
  return (
    <div className="sticky top-16 z-20 px-3 pt-3 md:px-6">
      <div className="mx-auto grid w-full max-w-[820px] grid-cols-1 gap-2 lg:grid-cols-2">
        <WaterCard water={water} communityWater={communityWater} />
        <Co2Card co2={co2} communityCo2={communityCo2} />
      </div>
    </div>
  );
}
