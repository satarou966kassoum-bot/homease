import { FormEvent, useState } from "react";

export function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-14">
      <h1 className="font-display text-2xl font-medium">À propos de Emobile</h1>
      <p className="mt-4 text-sm leading-relaxed text-ink-400">
        Emobile est une plateforme immobilière conçue pour le marché béninois. Notre
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
        En utilisant Emobile, vous acceptez de fournir des informations exactes sur
        vos annonces, de respecter les autres utilisateurs et de ne publier aucun
        contenu illégal, trompeur ou frauduleux. Emobile se réserve le droit de
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
        Emobile collecte uniquement les informations nécessaires au fonctionnement de
        la plateforme (compte, annonces, messages, réservations) et ne partage pas vos
        données personnelles avec des tiers sans votre consentement, en dehors des cas
        prévus par la loi.
      </p>
    </div>
  );
}

export function FAQPage() {
  const faqs = [
    {
      q: "Comment publier une annonce ?",
      a: "Créez un compte propriétaire, puis cliquez sur \"Publier une annonce\" et remplissez le formulaire. Elle sera visible après validation par un administrateur.",
    },
    {
      q: "Combien de temps prend la validation d'une annonce ?",
      a: "En général quelques heures. Vous recevez une notification dès qu'elle est approuvée ou rejetée.",
    },
    {
      q: "Comment obtenir le badge \"Annonceur vérifié\" ?",
      a: "Depuis votre profil, section vérification (KYC), téléversez une pièce d'identité. Un administrateur l'examine et active le badge.",
    },
    {
      q: "Comment contacter un propriétaire ?",
      a: "Depuis la page d'une annonce, utilisez le bouton \"Contacter\" pour lui envoyer un message directement sur Emobile.",
    },
    {
      q: "Le paiement en ligne est-il disponible ?",
      a: "Il arrive bientôt. En attendant, le paiement se convient directement avec le propriétaire.",
    },
  ];

  return (
    <div className="page-container section max-w-2xl">
      <h1 className="font-display text-2xl font-medium">Questions fréquentes</h1>
      <div className="mt-6 space-y-5">
        {faqs.map((f) => (
          <div key={f.q} className="card p-4">
            <p className="font-medium text-ink-500">{f.q}</p>
            <p className="mt-1 text-sm text-ink-300">{f.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SupportPage() {
  return (
    <div className="page-container section max-w-2xl">
      <h1 className="font-display text-2xl font-medium">Support</h1>
      <p className="mt-4 text-sm leading-relaxed text-ink-400">
        Besoin d'aide avec votre compte, une annonce ou une réservation ? Consultez d'abord
        notre <a href="/faq" className="text-lagoon-500 underline">FAQ</a>, ou écrivez-nous
        directement depuis la page <a href="/contact" className="text-lagoon-500 underline">Nous contacter</a>.
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
