import { useParams, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { api } from "../services/api";

const BACKGROUND_IMAGE = "https://res.cloudinary.com/di75recky/image/upload/v1766651473/ChatGPT_Image_Dec_25_2025_02_00_14_PM_iobhpc.png";

export default function Chat() {
  const { characterId } = useParams();
  const nav = useNavigate();
  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState([]);
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);

    if (token) {
      // Fetch chat history
      api.get(`/chat/${characterId}`)
        .then(res => {
          // Backend returns [{role, content}, ...]
          // We can use that directly
          setChat(res.data);
        })
        .catch(err => console.error("Failed to load chat", err));
    }
  }, [characterId]);

  // Fetch character details
  useEffect(() => {
    api.get(`/characters/${characterId}`)
      .then(res => setCharacter(res.data))
      .catch(err => console.error("Failed to load character", err));
  }, [characterId]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chat]);

  const send = async () => {
    if (!msg.trim()) return;

    // Optimistic UI update
    const userMsg = msg;
    setMsg("");
    setChat(prev => [...prev, { role: "user", content: userMsg }, { role: "assistant", content: "..." }]);
    setLoading(true);

    try {
      const res = await api.post(`/chat/${characterId}`, {
        message: userMsg
      });

      setChat(prev => {
        const newChat = [...prev];
        newChat[newChat.length - 1] = { role: "assistant", content: res.data.message };
        return newChat;
      });
    } catch (err) {
      console.error("Chat error", err);
      setChat(prev => prev.slice(0, -2));

      if (err.response && err.response.status === 429) {
        alert("Usage limit exceeded. Please try again later.");
      } else {
        alert("Failed to send message. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div
      className="flex flex-col h-screen bg-[#0b0b0f] bg-cover bg-center bg-no-repeat bg-fixed relative "
      style={{ backgroundImage: `url(${BACKGROUND_IMAGE})` }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/70 pointer-events-none" />

      {/* HEADER */}
      <div className="py-2 px-6 md:px-48 bg-[#18181b]/80 backdrop-blur-md border-b border-white/5 flex items-center shadow-md z-30 sticky top-16">
        <button
          onClick={() => nav('/characters')}
          className="text-gray-400 hover:text-white mr-16 transition-colors"
        >
          &larr; Back
        </button>
        <div className="flex items-center gap-3">
          {character && character.image && (
            <img
              src={character.image}
              alt={character.name}
              className="w-10 h-10 rounded-full object-cover border border-white/10"
            />
          )}
          <h1 className="text-xl font-bold text-white tracking-wide">
            {character ? `Chat with ${character.name}` : "Conversation"}
          </h1>
        </div>
      </div>

      {/* CHAT AREA */}
      <div
        className="flex-1 overflow-y-auto p-4 pb-28 space-y-4 relative z-10"
        ref={scrollRef}
      >
        <div className="max-w-5xl mx-auto space-y-4">

          {chat.length === 0 && (
            <div className="h-full flex items-center justify-center text-gray-500 text-sm italic">
              {isAuthenticated ? "Start the conversation..." : "Login to view previous conversations and chat."}
            </div>
          )}

          {chat.map((c, i) => (
            <div key={i} className={`flex ${c.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`
                 px-4 py-3 rounded-2xl max-w-[80%] border shadow-sm
                 ${c.role === 'user'
                    ? 'bg-red-900/40 text-red-50 border-red-500/20 rounded-tr-none'
                    : 'bg-[#18181b] text-gray-300 border-white/5 rounded-tl-none'}
               `}
              >
                {c.content === "..." ? (
                  <span className="animate-pulse">Writing...</span>
                ) : (
                  c.content
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* INPUT AREA */}
      <div className="sticky bottom-0 z-20 p-4 bg-[#18181b]/80 backdrop-blur-md border-t border-white/5 ">
        <div className="max-w-4xl mx-auto flex gap-3">
          {isAuthenticated ? (
            <>
              <input
                value={msg}
                onChange={e => setMsg(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 bg-[#0b0b0f] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                disabled={loading}
              />
              <button
                onClick={send}
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-red-600/20"
              >
                Send
              </button>
            </>
          ) : (
            <div className="w-full text-center">
              <button
                onClick={() => nav('/?redirect=' + encodeURIComponent(window.location.pathname))}
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3 rounded-xl transition-all"
              >
                Login to Chat
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
