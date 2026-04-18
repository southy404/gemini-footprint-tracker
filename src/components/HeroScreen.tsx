type Props = {
  visible: boolean;
};

export default function HeroScreen({ visible }: Props) {
  if (!visible) return null;

  return (
    <div className="w-full max-w-[800px]">
      <div className="mb-2 text-[17px] font-medium text-[#d8def2]">Hi User</div>

      <div className="mb-6 text-[clamp(34px,4.6vw,52px)] font-[500] leading-[0.98] tracking-[-0.045em] text-white">
        Where should we start?
      </div>
    </div>
  );
}
