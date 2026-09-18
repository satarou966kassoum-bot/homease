import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Camera, ShieldAlert } from "lucide-react";
import { api } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { uploadMedia } from "../services/upload";
import { formatFCFA } from "../utils/format";

interface Reservation {
  _id: string;
  listing: { _id: string; title: string; price: number; photos: string[] };
  client: string;
  owner: string;
  clientFullName: string;
  status:
    | "en_attente"
    | "rdv_propose"
    | "attente_nouveau_rdv"
    | "rdv_accepte"
    | "bien_remis"
    | "payee"
    | "annulee";
  appointmentDate?: string;
  appointmentTime?: string;
  appointmentLocation?: string;
  appointmentMapsUrl?: string;
  declineReason?: "ne_veut_plus" | "horaire_inadapte";
  clientAvailability?: string;
  proofPhotoUrl?: string;
  createdAt: string;
}

const statusLabel: Record<string, string> = {
  en_attente: "En attente de rendez-vous",
  rdv_propose: "Rendez-vous proposé",
  attente_nouveau_rdv: "Nouveau créneau à proposer",
  rdv_accepte: "Rendez-vous accepté",
  bien_remis: "Bien remis — paiement possible",
  payee: "Payée",
  annulee: "Annulée",
};

const statusColor: Record<string, string> = {
  en_attente: "bg-ochre-100 text-ochre-600",
  rdv_propose: "bg-ochre-100 text-ochre-600",
  attente_nouveau_rdv: "bg-ochre-100 text-ochre-600",
  rdv_accepte: "bg-lagoon-50 text-lagoon-600",
  bien_remis: "bg-lagoon-50 text-lagoon-600",
  payee: "bg-lagoon-50 text-lagoon-600",
  annulee: "bg-clay-500/10 text-clay-600",
};

export function ReservationsPage() {
  const { user } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Formulaire de proposition/re-proposition de rendez-vous (par annonce)
  const [appointmentFormFor, setAppointmentFormFor] = useState<string | null>(null);
  const [apptDate, setApptDate] = useState("");
  const [apptTime, setApptTime] = useState("");
  const [apptLocation, setApptLocation] = useState("");
  const [apptMapsUrl, setApptMapsUrl] = useState("");

  // Formulaire de refus côté client
  const [declineFormFor, setDeclineFormFor] = useState<string | null>(null);
  const [availability, setAvailability] = useState("");

  const [uploadingProofFor, setUploadingProofFor] = useState<string | null>(null);
  const [payingId, setPayingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Record<string, string>>({});

  function load() {
    api
      .get("/reservations")
      .then((res) => setReservations(res.data.data.reservations))
      .finally(() => setIsLoading(false));
  }

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    load();
  }, [user]);

  function updateLocal(id: string, patch: Partial<Reservation>) {
    setReservations((prev) => prev.map((r) => (r._id === id ? { ...r, ...patch } : r)));
  }

  async function submitAppointment(reservationId: string) {
    if (!apptDate || !apptTime || !apptLocation || !apptMapsUrl) return;
    const { data } = await api.put(`/reservations/${reservationId}/appointment`, {
      appointmentDate: apptDate,
      appointmentTime: apptTime,
      appointmentLocation: apptLocation,
      appointmentMapsUrl: apptMapsUrl,
    });
    updateLocal(reservationId, data.data.reservation);
    setAppointmentFormFor(null);
    setApptDate("");
    setApptTime("");
    setApptLocation("");
    setApptMapsUrl("");
  }

  async function respondAccept(reservationId: string) {
    const { data } = await api.put(`/reservations/${reservationId}/respond`, { accept: true });
    updateLocal(reservationId, data.data.reservation);
  }

  async function respondDeclineNoLonger(reservationId: string) {
    const { data } = await api.put(`/reservations/${reservationId}/respond`, {
      accept: false,
      declineReason: "ne_veut_plus",
    });
    updateLocal(reservationId, data.data.reservation);
    setDeclineFormFor(null);
  }

  async function respondDeclineSchedule(reservationId: string) {
    if (!availability.trim()) return;
    const { data } = await api.put(`/reservations/${reservationId}/respond`, {
      accept: false,
      declineReason: "horaire_inadapte",
      clientAvailability: availability,
    });
    updateLocal(reservationId, data.data.reservation);
    setDeclineFormFor(null);
    setAvailability("");
  }

  async function handleProofUpload(reservationId: string, file: File) {
    setUploadingProofFor(reservationId);
    try {
      const result = await uploadMedia(file);
      const { data } = await api.put(`/reservations/${reservationId}/proof`, {
        proofPhotoUrl: result.url,
      });
      updateLocal(reservationId, data.data.reservation);
    } finally {
      setUploadingProofFor(null);
    }
  }

  async function handlePay(reservationId: string) {
    setPayingId(reservationId);
    try {
      const { data } = await api.post("/payments", {
        reservationId,
        provider: "hors_plateforme",
      });
      setFeedback((prev) => ({ ...prev, [reservationId]: data.message }));
      updateLocal(reservationId, { status: "payee" });
    } catch (err: any) {
      setFeedback((prev) => ({
        ...prev,
        [reservationId]: err.response?.data?.message || "Impossible de démarrer le paiement.",
      }));
    } finally {
      setPayingId(null);
    }
  }

  if (!user) {
    return (
      <div className="page-container section text-center">
        <h1 className="text-xl font-medium">Mes commandes</h1>
        <p className="mt-2 text-sm text-ink-300">
          <Link to="/login" className="text-lagoon-500">Connectez-vous</Link> pour voir vos commandes.
        </p>
      </div>
    );
  }

  return (
    <div className="page-container section">
      <h1 className="font-display text-2xl font-medium">Mes commandes</h1>

      {isLoading ? (
        <p className="mt-6 text-sm text-ink-300">Chargement...</p>
      ) : reservations.length === 0 ? (
        <p className="mt-6 rounded-lg border border-dashed border-sand-200 p-10 text-center text-sm text-ink-300">
          Aucune commande pour le moment.
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          {reservations.map((r) => {
            const isOwnerView = r.owner === user.id;
            return (
              <div key={r._id} className="card p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <Link to={`/listing/${r.listing._id}`} className="font-medium hover:text-lagoon-500">
                      {r.listing.title}
                    </Link>
                    <p className="text-sm text-ink-300">
                      {formatFCFA(r.listing.price)}
                      {isOwnerView && <> · Client : {r.clientFullName}</>}
                    </p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusColor[r.status]}`}>
                    {statusLabel[r.status]}
                  </span>
                </div>

                {/* en_attente — le propriétaire propose un rendez-vous */}
                {r.status === "en_attente" && isOwnerView && (
                  <div className="mt-3 border-t border-sand-100 pt-3">
                    {appointmentFormFor === r._id ? (
                      <AppointmentForm
                        date={apptDate}
                        time={apptTime}
                        location={apptLocation}
                        mapsUrl={apptMapsUrl}
                        onDate={setApptDate}
                        onTime={setApptTime}
                        onLocation={setApptLocation}
                        onMapsUrl={setApptMapsUrl}
                        onSubmit={() => submitAppointment(r._id)}
                        onCancel={() => setAppointmentFormFor(null)}
                      />
                    ) : (
                      <button onClick={() => setAppointmentFormFor(r._id)} className="btn-primary">
                        Proposer un rendez-vous
                      </button>
                    )}
                  </div>
                )}
                {r.status === "en_attente" && !isOwnerView && (
                  <p className="mt-3 border-t border-sand-100 pt-3 text-sm text-ink-300">
                    En attente que le propriétaire propose un rendez-vous de remise du bien.
                  </p>
                )}

                {/* rdv_propose — le client répond */}
                {r.status === "rdv_propose" && (
                  <div className="mt-3 border-t border-sand-100 pt-3">
                    <p className="text-sm text-ink-400">
                      Rendez-vous proposé le{" "}
                      <strong>{r.appointmentDate && new Date(r.appointmentDate).toLocaleDateString("fr-FR")}</strong>{" "}
                      à <strong>{r.appointmentTime}</strong>
                    </p>
                    <p className="mt-1 flex items-center gap-1 text-sm text-ink-400">
                      <MapPin size={14} /> {r.appointmentLocation}
                      {r.appointmentMapsUrl && (
                        <a href={r.appointmentMapsUrl} target="_blank" rel="noreferrer" className="text-lagoon-500 underline">
                          Voir sur Maps
                        </a>
                      )}
                    </p>

                    {!isOwnerView && (
                      <div className="mt-3">
                        {declineFormFor === r._id ? (
                          <div className="space-y-2">
                            <button onClick={() => respondDeclineNoLonger(r._id)} className="btn-ghost w-full">
                              Je ne veux plus du bien
                            </button>
                            <textarea
                              value={availability}
                              onChange={(e) => setAvailability(e.target.value)}
                              placeholder="Vos disponibilités (ex : samedi après-midi, ou tout autre jour après 17h)"
                              rows={2}
                              className="input-field"
                            />
                            <button onClick={() => respondDeclineSchedule(r._id)} className="btn-ghost w-full">
                              L'heure ne m'arrange pas — envoyer mes disponibilités
                            </button>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <button onClick={() => respondAccept(r._id)} className="btn-primary flex-1">
                              Accepter
                            </button>
                            <button onClick={() => setDeclineFormFor(r._id)} className="btn-ghost flex-1">
                              Refuser
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                    {isOwnerView && (
                      <p className="mt-3 text-sm text-ink-300">En attente de la réponse du client.</p>
                    )}
                  </div>
                )}

                {/* attente_nouveau_rdv — le propriétaire reçoit les disponibilités */}
                {r.status === "attente_nouveau_rdv" && (
                  <div className="mt-3 border-t border-sand-100 pt-3">
                    {r.clientAvailability && (
                      <p className="text-sm text-ink-400">
                        Disponibilités du client : <strong>{r.clientAvailability}</strong>
                      </p>
                    )}
                    {isOwnerView &&
                      (appointmentFormFor === r._id ? (
                        <div className="mt-2">
                          <AppointmentForm
                            date={apptDate}
                            time={apptTime}
                            location={apptLocation}
                            mapsUrl={apptMapsUrl}
                            onDate={setApptDate}
                            onTime={setApptTime}
                            onLocation={setApptLocation}
                            onMapsUrl={setApptMapsUrl}
                            onSubmit={() => submitAppointment(r._id)}
                            onCancel={() => setAppointmentFormFor(null)}
                          />
                        </div>
                      ) : (
                        <button onClick={() => setAppointmentFormFor(r._id)} className="btn-primary mt-2">
                          Proposer un nouveau rendez-vous
                        </button>
                      ))}
                    {!isOwnerView && (
                      <p className="mt-1 text-sm text-ink-300">En attente d'un nouveau rendez-vous.</p>
                    )}
                  </div>
                )}

                {/* rdv_accepte — avertissements sécurité + preuve de remise */}
                {r.status === "rdv_accepte" && (
                  <div className="mt-3 space-y-2 border-t border-sand-100 pt-3">
                    <p className="flex items-start gap-2 text-sm text-ink-400">
                      <ShieldAlert size={16} className="mt-0.5 shrink-0 text-ochre-600" />
                      {isOwnerView
                        ? "Pour la sécurité de tous, prenez une photo au moment de la remise du bien : elle déclenchera le paiement."
                        : "Pour votre sécurité, ne payez rien tant que vous n'avez pas physiquement le bien en main."}
                    </p>
                    {isOwnerView && (
                      <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-sand-200 p-4 text-sm text-ink-400 hover:border-lagoon-500">
                        <Camera size={16} />
                        {uploadingProofFor === r._id ? "Envoi..." : "Prendre/ajouter la photo de remise"}
                        <input
                          type="file"
                          accept="image/*"
                          capture="environment"
                          className="hidden"
                          disabled={uploadingProofFor === r._id}
                          onChange={(e) => e.target.files?.[0] && handleProofUpload(r._id, e.target.files[0])}
                        />
                      </label>
                    )}
                  </div>
                )}

                {/* bien_remis — paiement */}
                {r.status === "bien_remis" && (
                  <div className="mt-3 border-t border-sand-100 pt-3">
                    {r.proofPhotoUrl && (
                      <img src={r.proofPhotoUrl} alt="Preuve de remise" className="mb-2 h-24 rounded-lg object-cover" />
                    )}
                    {!isOwnerView ? (
                      <>
                        <p className="text-sm text-ink-400">
                          Montant total : <strong>{formatFCFA(r.listing.price)}</strong> (dont 5% de frais de
                          service Emobile)
                        </p>
                        <button
                          onClick={() => handlePay(r._id)}
                          disabled={payingId === r._id}
                          className="btn-accent mt-2 w-full"
                        >
                          {payingId === r._id ? "..." : "Payer maintenant"}
                        </button>
                      </>
                    ) : (
                      <p className="text-sm text-ink-300">En attente du paiement du client.</p>
                    )}
                    {feedback[r._id] && <p className="mt-2 text-xs text-ink-300">{feedback[r._id]}</p>}
                  </div>
                )}

                {r.status === "payee" && (
                  <p className="mt-3 border-t border-sand-100 pt-3 text-sm text-ink-300">
                    Transaction terminée et payée.
                  </p>
                )}
                {r.status === "annulee" && (
                  <p className="mt-3 border-t border-sand-100 pt-3 text-sm text-ink-300">
                    {r.declineReason === "ne_veut_plus" ? "Le client ne souhaite plus ce bien." : "Réservation annulée."}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function AppointmentForm({
  date,
  time,
  location,
  mapsUrl,
  onDate,
  onTime,
  onLocation,
  onMapsUrl,
  onSubmit,
  onCancel,
}: {
  date: string;
  time: string;
  location: string;
  mapsUrl: string;
  onDate: (v: string) => void;
  onTime: (v: string) => void;
  onLocation: (v: string) => void;
  onMapsUrl: (v: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <input type="date" value={date} onChange={(e) => onDate(e.target.value)} className="input-field" />
        <input type="time" value={time} onChange={(e) => onTime(e.target.value)} className="input-field" />
      </div>
      <input
        value={location}
        onChange={(e) => onLocation(e.target.value)}
        placeholder="Lieu du rendez-vous"
        className="input-field"
      />
      <input
        value={mapsUrl}
        onChange={(e) => onMapsUrl(e.target.value)}
        placeholder="Lien Google Maps (obligatoire)"
        className="input-field"
      />
      <div className="flex gap-2">
        <button onClick={onSubmit} className="btn-primary flex-1">Envoyer</button>
        <button onClick={onCancel} className="btn-ghost flex-1">Annuler</button>
      </div>
    </div>
  );
}
