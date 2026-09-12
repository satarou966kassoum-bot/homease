import { PaymentProvider } from "../models/Payment";

export interface PaymentInitiationResult {
  providerReference: string;
  // URL ou instructions à afficher au client. Pour l'instant, aucun
  // prestataire réel n'est branché : on renvoie une instruction manuelle.
  instructions: string;
}

// Couche d'abstraction : chaque prestataire (Kkiapay, FedaPay...) implémente
// cette même interface. Pour activer un vrai paiement en ligne plus tard,
// il suffira de remplacer le corps de cette fonction par un appel à leur SDK/API
// — aucun autre fichier du projet n'a besoin de changer.
export async function initiateProviderPayment(
  provider: PaymentProvider,
  amount: number
): Promise<PaymentInitiationResult> {
  switch (provider) {
    case "kkiapay":
    case "fedapay":
      // TODO (intégration future) : appeler l'API du prestataire avec sa clé
      // API (variable d'environnement dédiée), puis retourner l'URL de paiement
      // réelle et la référence de transaction fournie par le prestataire.
      return {
        providerReference: `${provider}-non-configure`,
        instructions:
          "Le paiement en ligne sera bientôt disponible. En attendant, convenez du paiement directement avec le propriétaire.",
      };
    case "hors_plateforme":
    default:
      return {
        providerReference: "hors-plateforme",
        instructions: "Paiement à régler directement avec le propriétaire, hors plateforme.",
      };
  }
}
