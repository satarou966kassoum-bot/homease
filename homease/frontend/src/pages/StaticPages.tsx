import { FormEvent, useState } from "react";

export function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-14">
      <h1 className="font-display text-2xl font-medium">À propos de HomeEase</h1>
      <p className="mt-4 text-sm leading-relaxed text-ink-400">
        HomeEase est une plateforme immobilière conçue pour le marché béninois. Notre
        mission est de simplifier la recherche, la publication et la réservation de
        biens immobiliers à Cotonou, Abomey-Calavi, Porto-Novo et dans les villes
        voisines, en s'appuyant sur des annonces vérifiées et une expérience pensée
        d'abord pour le mobile.
      </p>
    </div>
  );
}

export function ContactPage() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div className="mx-auto max-w-md px-6 py-14">
      <h1 className="font-display text-2xl font-medium">Nous contacter</h1>
      {sent ? (
        <p className="mt-6 rounded border border-lagoon-500/30 bg-lagoon-50 px-4 py-3 text-sm text-lagoon-600">
          Merci, votre message a été noté. Nous vous répondrons rapidement.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input required placeholder="Votre nom" className="input-field" />
          <input required type="email" placeholder="Votre email" className="input-field" />
          <textarea required rows={5} placeholder="Votre message" className="input-field" />
          <button type="submit" className="btn-primary w-full">Envoyer</button>
        </form>
      )}
    </div>
  );
}

export function TermsPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-14 text-sm leading-relaxed text-ink-400">
      <h1 className="font-display text-2xl font-medium text-ink-500">
        Conditions d'utilisation
      </h1>
      <p className="mt-4">
        En utilisant HomeEase, vous acceptez de fournir des informations exactes sur
        vos annonces, de respecter les autres utilisateurs et de ne publier aucun
        contenu illégal, trompeur ou frauduleux. HomeEase se réserve le droit de
        modérer, suspendre ou supprimer toute annonce ou tout compte ne respectant
        pas ces règles.
      </p>
    </div>
  );
}

export function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-14 text-sm leading-relaxed text-ink-400">
      <h1 className="font-display text-2xl font-medium text-ink-500">Confidentialité</h1>
      <p className="mt-4">
        HomeEase collecte uniquement les informations nécessaires au fonctionnement de
        la plateforme (compte, annonces, messages, réservations) et ne partage pas vos
        données personnelles avec des tiers sans votre consentement, en dehors des cas
        prévus par la loi.
      </p>
    </div>
  );
}

export function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <h1 className="font-display text-2xl font-medium">Mot de passe oublié</h1>
      <p className="mt-2 text-sm text-ink-300">
        La réinitialisation par email arrivera avec les notifications (Phase 3).
        En attendant, contactez un administrateur.
      </p>
      {sent ? (
        <p className="mt-6 rounded border border-lagoon-500/30 bg-lagoon-50 px-4 py-3 text-sm text-lagoon-600">
          Si un compte existe avec cet email, des instructions seront envoyées.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input required type="email" placeholder="Votre email" className="input-field" />
          <button type="submit" className="btn-primary w-full">Envoyer</button>
        </form>
      )}
    </div>
  );
}
