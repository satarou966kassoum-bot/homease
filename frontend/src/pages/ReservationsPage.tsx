import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { formatFCFA } from "../utils/format";

interface Reservation {
  _id: string;
  listing: { _id: string; title: string; price: number; photos: string[] };
  client: string;
  owner: string;
  startDate: string;
  endDate?: string;
  message?: string;
  status: "en_attente" | "confirmee" | "refusee" | "annulee" | "terminee";
  createdAt: string;
}

const statusLabel: Record<string, string> = {
  en_attente: "En attente",
  confirmee: "Confirmée",
  refusee: "Refusée",
  annulee: "Annulée",
  terminee: "Terminée",
};

const statusColor: Record<string, string> = {
  en_attente: "bg-ochre-100 text-ochre-600",
  confirmee: "bg-lagoon-50 text-lagoon-600",
  refusee: "bg-clay-500/10 text-clay-600",
  annulee: "bg-sand-100 text-ink-300",
  terminee: "bg-sand-100 text-ink-400",
};

export function ReservationsPage() {
  const { user } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [payingId, setPayingId] = useState<string | null>(null);
  const [paymentMessage, setPaymentMessage] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    api
      .get("/reservations")
      .then((res) => setReservations(res.data.data.reservations))
      .finally(() => setIsLoading(false));
  }, [user]);

  async function updateStatus(id: string, status: string) {
    await api.put(`/reservations/${id}`, { status });
    setReservations((prev) =>
      prev.map((r) => (r._id === id ? { ...r, status: status as Reservation["status"] } : r))
    );
  }

  async function handlePay(reservationId: string) {
    setPayingId(reservationId);
    try {
      const { data } = await api.post("/payments", {
        reservationId,
        provider: "hors_plateforme",
      });
      setPaymentMessage((prev) => ({ ...prev, [reservationId]: data.message }));
    } catch {
      setPaymentMessage((prev) => ({
        ...prev,
        [reservationId]: "Impossible de démarrer le paiement pour l'instant.",
      }));
    } finally {
      setPayingId(null);
    }
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-6 py-16 text-center">
        <h1 className="text-xl font-medium">Mes réservations</h1>
        <p className="mt-2 text-sm text-ink-300">
          <Link to="/login" className="text-lagoon-500">Connectez-vous</Link> pour voir vos réservations.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="font-display text-2xl font-medium">Mes réservations</h1>

      {isLoading ? (
        <p className="mt-6 text-sm text-ink-300">Chargement...</p>
      ) : reservations.length === 0 ? (
        <p className="mt-6 rounded-lg border border-dashed border-sand-200 p-10 text-center text-sm text-ink-300">
          Aucune réservation pour le moment.
        </p>
      ) : (
        <div className="mt-6 divide-y divide-sand-200 rounded-lg border border-sand-200 bg-white">
          {reservations.map((r) => {
            const isOwnerView = r.owner === user.id;
            return (
              <div key={r._id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                <div>
                  <Link to={`/listing/${r.listing._id}`} className="font-medium hover:text-lagoon-500">
                    {r.listing.title}
                  </Link>
                  <p className="text-sm text-ink-300">
                    {formatFCFA(r.listing.price)} · Début : {new Date(r.startDate).toLocaleDateString("fr-FR")}
                  </p>
                  {r.message && <p className="mt-1 text-sm text-ink-400">"{r.message}"</p>}
                </div>

                <div className="flex items-center gap-2">
                  <span className={`rounded px-2 py-1 text-xs font-medium ${statusColor[r.status]}`}>
                    {statusLabel[r.status]}
                  </span>

                  {isOwnerView && r.status === "en_attente" && (
                    <>
                      <button
                        onClick={() => updateStatus(r._id, "confirmee")}
                        className="rounded bg-lagoon-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-lagoon-600"
                      >
                        Accepter
                      </button>
                      <button
                        onClick={() => updateStatus(r._id, "refusee")}
                        className="rounded bg-clay-500/10 px-3 py-1.5 text-xs font-medium text-clay-600"
                      >
                        Refuser
                      </button>
                    </>
                  )}

                  {!isOwnerView && r.status === "en_attente" && (
                    <button
                      onClick={() => updateStatus(r._id, "annulee")}
                      className="rounded bg-sand-100 px-3 py-1.5 text-xs font-medium text-ink-400"
                    >
                      Annuler
                    </button>
                  )}

                  {!isOwnerView && r.status === "confirmee" && (
                    <button
                      onClick={() => handlePay(r._id)}
                      disabled={payingId === r._id}
                      className="btn-accent px-3 py-1.5 text-xs"
                    >
                      {payingId === r._id ? "..." : "Payer"}
                    </button>
                  )}
                </div>
                {paymentMessage[r._id] && (
                  <p className="w-full text-xs text-ink-300">{paymentMessage[r._id]}</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
