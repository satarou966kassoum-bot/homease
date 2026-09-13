import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Send, Paperclip, Mic, Square, Phone } from "lucide-react";
import { api } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { uploadMedia } from "../services/upload";
import { VerifiedBadge } from "../components/ui/VerifiedBadge";

interface Participant {
  _id: string;
  name: string;
  avatarUrl?: string;
  phone?: string;
  kycStatus?: string;
}

interface Conversation {
  _id: string;
  participants: Participant[];
  listing?: { _id: string; title: string };
  lastMessageAt?: string;
}

interface Message {
  _id: string;
  sender: string;
  content: string;
  mediaUrl?: string;
  mediaType?: "image" | "video" | "audio";
  createdAt: string;
}

export function MessagesPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

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

  const activeConversation = conversations.find((c) => c._id === activeId);
  const other = activeConversation?.participants.find((p) => p._id !== user?.id);

  function otherParticipant(c: Conversation) {
    return c.participants.find((p) => p._id !== user!.id)?.name || "Utilisateur";
  }

  async function handleSendText() {
    if (!draft.trim() || !activeId) return;
    const content = draft;
    setDraft("");
    const { data } = await api.post(`/conversations/${activeId}/messages`, { content });
    setMessages((prev) => [...prev, data.data.message]);
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  }

  async function handleSendMedia(file: File) {
    if (!activeId) return;
    setIsUploading(true);
    try {
      const result = await uploadMedia(file);
      const { data } = await api.post(`/conversations/${activeId}/messages`, {
        mediaUrl: result.url,
        mediaType: result.type,
      });
      setMessages((prev) => [...prev, data.data.message]);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } finally {
      setIsUploading(false);
    }
  }

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];
      recorder.ondataavailable = (e) => audioChunksRef.current.push(e.data);
      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const file = new File([blob], `vocal-${Date.now()}.webm`, { type: "audio/webm" });
        await handleSendMedia(file);
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch {
      alert("Impossible d'accéder au microphone.");
    }
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  }

  if (!user) {
    return (
      <div className="page-container section text-center">
        <h1 className="text-xl font-medium">Messages</h1>
        <p className="mt-2 text-sm text-ink-300">
          <Link to="/login" className="text-lagoon-500">Connectez-vous</Link> pour accéder à votre messagerie.
        </p>
      </div>
    );
  }

  return (
    <div className="page-container section">
      <h1 className="font-display text-2xl font-medium">Messages</h1>

      {isLoading ? (
        <p className="mt-6 text-sm text-ink-300">Chargement...</p>
      ) : conversations.length === 0 ? (
        <p className="mt-6 rounded-lg border border-dashed border-sand-200 p-10 text-center text-sm text-ink-300">
          Vous n'avez pas encore de conversation. Contactez un propriétaire depuis une
          annonce pour démarrer une discussion.
        </p>
      ) : (
        <div className="mt-6 grid gap-4 overflow-hidden rounded-xl border border-sand-200 bg-white md:grid-cols-[220px_1fr]">
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

          <div className="flex h-[65vh] flex-col">
            {/* En-tête façon réseau social : profil cliquable + appel */}
            {other && (
              <div className="flex items-center justify-between border-b border-sand-100 p-3">
                <Link to={`/profil/${other._id}`} className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-lagoon-50 text-sm font-semibold text-lagoon-600">
                    {other.avatarUrl ? (
                      <img src={other.avatarUrl} alt={other.name} className="h-full w-full object-cover" />
                    ) : (
                      other.name.charAt(0).toUpperCase()
                    )}
                  </span>
                  <span className="flex items-center gap-1.5 text-sm font-medium">
                    {other.name}
                    {other.kycStatus === "verifie" && <VerifiedBadge compact />}
                  </span>
                </Link>
                {other.phone && (
                  <a
                    href={`tel:${other.phone}`}
                    aria-label="Appeler"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-lagoon-50 text-lagoon-600"
                  >
                    <Phone size={16} />
                  </a>
                )}
              </div>
            )}

            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.map((m) => {
                const isMine = m.sender === user.id;
                return (
                  <div
                    key={m._id}
                    className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${
                      isMine ? "ml-auto bg-lagoon-500 text-white" : "bg-sand-100 text-ink-500"
                    }`}
                  >
                    {m.mediaType === "image" && (
                      <img src={m.mediaUrl} alt="" className="mb-1 max-h-64 rounded-lg object-cover" />
                    )}
                    {m.mediaType === "video" && (
                      <video src={m.mediaUrl} controls className="mb-1 max-h-64 rounded-lg" />
                    )}
                    {m.mediaType === "audio" && (
                      <audio src={m.mediaUrl} controls className="mb-1 w-56" />
                    )}
                    {m.content && <p>{m.content}</p>}
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            <div className="flex items-center gap-2 border-t border-sand-100 p-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleSendMedia(e.target.files[0])}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading || isRecording}
                aria-label="Joindre une photo ou vidéo"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink-400 hover:bg-sand-100"
              >
                <Paperclip size={18} />
              </button>

              {isRecording ? (
                <button
                  onClick={stopRecording}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-clay-500 text-white"
                  aria-label="Arrêter l'enregistrement"
                >
                  <Square size={14} fill="currentColor" />
                </button>
              ) : (
                <button
                  onClick={startRecording}
                  disabled={isUploading}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink-400 hover:bg-sand-100"
                  aria-label="Message vocal"
                >
                  <Mic size={18} />
                </button>
              )}

              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendText()}
                placeholder={isRecording ? "Enregistrement en cours..." : "Écrire un message..."}
                disabled={isRecording}
                className="input-field flex-1"
              />
              <button onClick={handleSendText} disabled={isRecording} className="btn-primary shrink-0 px-4">
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
