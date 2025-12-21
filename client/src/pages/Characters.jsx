import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Characters() {
  const [chars, setChars] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    api.get("/characters").then(res => setChars(res.data));
  }, []);

  return (
    <div className="grid grid-cols-3 gap-6 p-8">
      {chars.map(c => (
        <div
          key={c._id}
          onClick={() => nav(`/chat/${c._id}`)}
          className="bg-black text-white p-4 rounded-lg cursor-pointer hover:scale-105"
        >
          <h2>{c.name}</h2>
          <p>{c.description}</p>
        </div>
      ))}
    </div>
  );
}
