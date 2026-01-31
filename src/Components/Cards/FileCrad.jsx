import { useState, useRef } from "react";

export default function FileCard({ file, handleDelete, handleReplace }) {
  const isImage = file.type?.startsWith("jpg");
  const inputRef = useRef(null);

  const [confirmDelete, setConfirmDelete] = useState(false);

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
    if (newFile) {
      handleReplace(file, newFile);
      e.target.value = null;
    }
  };

  const confirmAndDelete = () => {
    handleDelete(file);
    setConfirmDelete(false);
  };

  return (
    <div
      className="group relative w-full aspect-square rounded-xl overflow-hidden 
                 bg-gray-900/60 border border-yellow-400/20 shadow-lg"
    >
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

      {/* ACTIONS OVERLAY */}
      <div
        className="absolute inset-0 bg-black/60 opacity-0 
                   group-hover:opacity-100 transition
                   flex flex-col items-center justify-center gap-3"
      >
        <button
          onClick={handlePreview}
          className="w-28 h-9 text-sm rounded-md
                     bg-yellow-300/20 text-yellow-300
                     border border-yellow-400/40
                     hover:bg-yellow-300/30 transition
                     flex items-center justify-center"
        >
          Aperçu
        </button>

        <div>
          <button
            onClick={handleClick}
            className="w-28 h-9 text-sm rounded-md
                       bg-blue-300/10 text-blue-300
                       border border-blue-400/30
                       hover:bg-blue-300/20 transition
                       flex items-center justify-center"
          >
            Remplacer
          </button>

          <input
            ref={inputRef}
            type="file"
            hidden
            onChange={handleChange}
          />
        </div>

        <button
          onClick={() => setConfirmDelete(true)}
          className="w-28 h-9 text-sm rounded-md
                     bg-red-500/10 text-red-300
                     border border-red-400/30
                     hover:bg-red-500/20 transition
                     flex items-center justify-center"
        >
          Supprimer
        </button>
      </div>

      {/* DELETE CONFIRMATION */}
      {confirmDelete && (
        <div className="absolute inset-0 z-20 bg-black/80 
                        flex flex-col items-center justify-center gap-4 p-4">
          <p className="text-sm text-gray-200 text-center">
            Supprimer ce fichier ?
          </p>

          <div className="flex gap-3">
            <button
              onClick={() => setConfirmDelete(false)}
              className="w-24 h-9 text-sm rounded-md
                         bg-gray-700 text-gray-200
                         hover:bg-gray-600 transition
                         flex items-center justify-center"
            >
              Annuler
            </button>

            <button
              onClick={confirmAndDelete}
              className="w-24 h-9 text-sm rounded-md
                         bg-red-500 text-white
                         hover:bg-red-600 transition
                         flex items-center justify-center"
            >
              Supprimer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
