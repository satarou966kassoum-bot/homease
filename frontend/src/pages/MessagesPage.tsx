import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Send } from "lucide-react";
import { api } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

interface Conversation {
  _id: string;
  participants: { _id: string; name: string }[];
  listing?: { _id: string; title: string };
  lastMessageAt?: string;
}

interface Message {
  _id: string;
  sender: string;
  content: string;
  createdAt: string;
}

export function MessagesPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    api
      .get("/conversations")
      .then((res) => {
        setConversations(res.data.data.conversations);
        if (res.data.data.conversations.length > 0) {
          setActiveId(res.data.data.conversations[0]._id);
        }
      })
      .finally(() => setIsLoading(false));
  }, [user]);

  useEffect(() => {
    if (!activeId) return;
    api.get(`/conversations/${activeId}/messages`).then((res) => {
      setMessages(res.data.data.messages);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    });
  }, [activeId]);

  async function handleSend() {
    if (!draft.trim() || !activeId) return;
    const content = draft;
    setDraft("");
    const { data } = await api.post(`/conversations/${activeId}/messages`, { content });
    setMessages((prev) => [...prev, data.data.message]);
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-6 py-16 text-center">
        <h1 className="text-xl font-medium">Messages</h1>
        <p className="mt-2 text-sm text-ink-300">
          <Link to="/login" className="text-lagoon-500">Connectez-vous</Link> pour accéder à votre messagerie.
        </p>
      </div>
    );
  }

  function otherParticipant(c: Conversation) {
    return c.participants.find((p) => p._id !== user!.id)?.name || "Utilisateur";
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <h1 className="font-display text-2xl font-medium">Messages</h1>

      {isLoading ? (
        <p className="mt-6 text-sm text-ink-300">Chargement...</p>
      ) : conversations.length === 0 ? (
        <p className="mt-6 rounded-lg border border-dashed border-sand-200 p-10 text-center text-sm text-ink-300">
          Vous n'avez pas encore de conversation. Contactez un propriétaire depuis une
          annonce pour démarrer une discussion.
        </p>
      ) : (
        <div className="mt-6 grid gap-4 rounded-lg border border-sand-200 bg-white md:grid-cols-[220px_1fr]">
          <div className="divide-y divide-sand-200 border-b border-sand-200 md:border-b-0 md:border-r">
            {conversations.map((c) => (
              <button
                key={c._id}
                onClick={() => setActiveId(c._id)}
                className={`block w-full p-3 text-left text-sm ${
                  activeId === c._id ? "bg-lagoon-50" : "hover:bg-sand-50"
                }`}
              >
                <p className="font-medium">{otherParticipant(c)}</p>
                {c.listing && <p className="truncate text-xs text-ink-300">{c.listing.title}</p>}
              </button>
            ))}
          </div>

          <div className="flex h-[60vh] flex-col p-4">
            <div className="flex-1 space-y-3 overflow-y-auto">
              {messages.map((m) => (
                <div
                  key={m._id}
                  className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${
                    m.sender === user.id
                      ? "ml-auto bg-lagoon-500 text-white"
                      : "bg-sand-100 text-ink-500"
                  }`}
                >
                  {m.content}
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            <div className="mt-3 flex gap-2">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Écrire un message..."
                className="input-field"
              />
              <button onClick={handleSend} className="btn-primary px-4">
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
