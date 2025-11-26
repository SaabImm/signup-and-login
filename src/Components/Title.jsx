export default function SectionTitle({ title }) {
  return (
    <div className="text-4xl md:text-5xl mb-6 font-[Orbitron] text-gray-900 dark:text-yellow-300 relative inline-block">
      {/* Underline accent */}
      <span className="absolute left-0 -bottom-1 w-16 h-1 bg-yellow-300 rounded-full"></span>
      {title}
    </div>
  );
}
