import { MessageCircle } from "lucide-react";

export default function WhatsAppFloatingButton() {
  return (
    <a
      href="https://api.whatsapp.com/send?phone=920000000000&text=Hi%2C%20I%20have%20a%20question%20about%20a%20Framezy%20order"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="glass fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full text-cream shadow-lift transition hover:scale-110"
    >
      <span className="absolute inset-0 animate-ping rounded-full bg-moss/40" />
      <MessageCircle size={24} className="relative text-moss" fill="currentColor" strokeWidth={0} />
    </a>
  );
}
