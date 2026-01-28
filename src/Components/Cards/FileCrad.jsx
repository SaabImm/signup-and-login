import { useState, useContext, useRef } from "react";
import { UserContext } from '../../Context/dataCont';



export default function FileCard({ file, handleDelete, handleReplace }) {
  const isImage = file.type?.startsWith("jpg");
   const inputRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL;
   const { authData, setAuthData } = useContext(UserContext);
   const [message, setMessage] = useState("");
    function FileIcon({ type }) {
    if (type?.includes("pdf")) return <span className="text-4xl">📄</span>;
    if (type?.includes("zip")) return <span className="text-4xl">📦</span>;
    if (type?.includes("video")) return <span className="text-4xl">🎥</span>;
    return <span className="text-4xl">📁</span>;
    }
    const handlePreview = () => {
  window.open(file.url, "_blank");
};

  const handleClick = () => {
    inputRef.current.click();
  };

  const handleChange = (e) => {
    const newFile = e.target.files[0];
    if (newFile){ handleReplace(file, newFile)};
  };

 

  return (
    <div className="group relative w-full aspect-square rounded-xl overflow-hidden 
                    bg-gray-900/60 border border-yellow-400/20 shadow-lg">

      {/* PREVIEW */}
      {isImage ? (
        <img
          src={file.url}
          alt={file.fileName}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-gray-300">
          <FileIcon type={file.type} />
          <p className="mt-2 text-sm text-center px-2 truncate">
            {file.fileName}
          </p>
        </div>
      )}

      {/* OVERLAY ACTIONS */}
<div className="absolute inset-0 bg-black/60 opacity-0 
                group-hover:opacity-100 transition 
                flex flex-col items-center justify-center gap-3">

  <button
    className="px-3 py-1 text-sm bg-gray-200 text-gray-900 rounded-md"
    onClick={handlePreview}
  >
    Aperçu
  </button>
<div>
  <button
    onClick={handleClick}
    className="px-3 py-1 text-sm bg-yellow-300 text-gray-900 rounded-md"
  >
    Replace
  </button>
        <input
            ref={inputRef}
            type="file"
            hidden
        onChange={handleChange}
      />
      </div>
  <button
    className="px-3 py-1 text-sm bg-red-500 text-white rounded-md"
    onClick={()=>{handleDelete(file)}}
  >
    Delete
  </button>

</div>

    </div>
  );
}
