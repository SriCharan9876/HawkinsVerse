import { useParams, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { api } from "../services/api";

export default function Chat() {
  const { characterId } = useParams();
  const nav = useNavigate();
  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState([]);
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
      alert("Failed to send message. Please try again.");
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
    <div className="flex flex-col h-screen bg-[#0b0b0f]">
      {/* HEADER */}
      <div className="p-4 bg-[#18181b] border-b border-white/5 flex items-center shadow-md z-10">
        <button
          onClick={() => nav('/characters')}
          className="text-gray-400 hover:text-white mr-4 transition-colors"
        >
          &larr; Back
        </button>
        <h1 className="text-xl font-bold text-white tracking-wide">
          Conversation
        </h1>
      </div>

      {/* CHAT AREA */}
      <div
        className="flex-1 overflow-y-auto p-4 pb-28 space-y-4"
        ref={scrollRef}
      >
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

      {/* INPUT AREA */}
      <div className="sticky bottom-0 z-20 p-4 bg-[#18181b] border-t border-white/5 ">
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
