import { useRef } from "react";

export default function AddFileCard({ onUpload }) {
  const inputRef = useRef(null);

  const handleClick = () => {
    inputRef.current.click();
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file){ onUpload(file)};
  };

  return (
    <>
      <div
        onClick={handleClick}
        className="group relative w-full aspect-square rounded-xl 
                   bg-gray-900/40 border border-dashed border-yellow-400/40
                   shadow-lg cursor-pointer
                   flex items-center justify-center
                   hover:bg-gray-900/60 transition"
      >
        <span className="text-6xl text-yellow-300 group-hover:scale-110 transition">
          +
        </span>
      </div>

      <input
        ref={inputRef}
        type="file"
        hidden
        onChange={handleChange}
      />
    </>
  );
}
