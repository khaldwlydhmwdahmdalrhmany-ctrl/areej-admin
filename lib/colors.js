export const C = {
  navy: "#0C1C77",
  navyDeep: "#071233",
  teal: "#00C6C7",
  cyan: "#00B9D6",
  mint: "#A9E2BD",
  mintTint: "#EAF8F1",
  pearl: "#FFFFFF",
  offWhite: "#F6FAF9",
  ink: "#0B1220",
  slate: "#5C6B72",
  line: "#E1ECE8",
};

export const formatPrice = (n) => Number(n).toLocaleString("ar-SA");

export const WHATSAPP_NUMBER = "966532540595";
export const buildWhatsAppLink = (message) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
