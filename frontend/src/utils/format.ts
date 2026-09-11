export function formatFCFA(amount: number): string {
  return new Intl.NumberFormat("fr-FR").format(amount) + " FCFA";
}

export const categoryLabels: Record<string, string> = {
  chambre: "Chambre",
  maison: "Maison",
  appartement: "Appartement",
  villa: "Villa",
  parcelle: "Parcelle",
  bureau: "Bureau",
  meuble: "Meublé",
};

export const transactionLabels: Record<string, string> = {
  location: "À louer",
  vente: "À vendre",
  reservation: "Réservable",
};
