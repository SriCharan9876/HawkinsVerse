import { useParams } from "react-router-dom";
import { useState } from "react";
import { api } from "../services/api";

export default function Chat() {
  const { characterId } = useParams();
  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState([]);

  const send = async () => {
    const res = await api.post(`/chat/${characterId}`, {
      userId: "demoUser",
      message: msg
    });

    setChat([...chat, { u: msg, a: res.data.reply }]);
    setMsg("");
  };

  return (
    <div className="p-6">
      {chat.map((c, i) => (
        <div key={i}>
          <p><b>You:</b> {c.u}</p>
          <p><b>AI:</b> {c.a}</p>
        </div>
      ))}

      <input
        value={msg}
        onChange={e => setMsg(e.target.value)}
        className="border p-2"
      />
      <button onClick={send}>Send</button>
    </div>
  );
}
