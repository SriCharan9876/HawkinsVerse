import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";

const BACKGROUND_IMAGE = "https://res.cloudinary.com/di75recky/image/upload/v1766651473/ChatGPT_Image_Dec_25_2025_02_00_14_PM_iobhpc.png";

export default function Characters() {
  const [chars, setChars] = useState([]);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    api.get("/characters")
      .then(res => setChars(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div
      className="min-h-screen bg-[#0b0b0f] px-8 pb-8 md:pt-72 pt-44 bg-cover bg-top bg-no-repeat bg-fixed relative"
      style={{ backgroundImage: `url(${BACKGROUND_IMAGE})` }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40 pointer-events-none" />

      <div className="relative z-10">
        <h1 className="text-4xl font-stranger font-bold text-white mb-12 text-center drop-shadow-lg">
          Select a Character
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="relative bg-[#18181b] rounded-md overflow-hidden animate-pulse border-0"
              >
                {/* Image Placeholder */}
                <div className="h-[320px] w-full bg-gray-800/50" />

                {/* Text Placeholder */}
                <div className="p-4 absolute bottom-0 left-0 right-0">
                  <div className="h-6 bg-gray-700/50 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-700/50 rounded w-1/2" />
                </div>
              </div>
            ))
          ) : (
            chars.map(c => (
              <div
                key={c._id}
                onClick={() => nav(`/chat/${c._id}`)}
                className="group relative bg-[#18181b] rounded-md cursor-pointer
                         transition-all duration-500 hover:scale-105 hover:z-10 hover:shadow-2xl hover:shadow-black/60
                         border-0 overflow-hidden"
              >
                {/* IMAGE CONTAINER - 16:9 Aspect Ratio for wide images */}
                <div className="relative h-[320px] w-full overflow-hidden">
                  <img
                    src={c.image}
                    alt={c.name}
                    className="h-full w-full object-cover object-center"
                    loading="lazy"
                  />
                  {/* Gradient Overlay - Always present but stronger at bottom */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-300" />
                </div>

                {/* TEXT */}
                <div className="p-4 absolute bottom-0 left-0 right-0 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <h2 className="text-xl font-bold text-white drop-shadow-md mb-1">
                    {c.name}
                  </h2>

                  {/* Description - Hidden by default, shown on hover */}
                  <div className="max-h-0 opacity-0 group-hover:max-h-[100px] group-hover:opacity-100 transition-all duration-500 overflow-hidden">
                    <p className="text-gray-300 text-xs mt-1 line-clamp-2 leading-relaxed mb-3">
                      {c.description}
                    </p>

                    <div className="flex items-center gap-2 text-xs font-bold text-white bg-netflix-red px-3 py-1.5 rounded w-fit hover:bg-red-700 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <title>play</title>
                        <path d="M8,5.14V19.14L19,12.14L8,5.14Z" />
                      </svg>
                      Start Conversation
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
