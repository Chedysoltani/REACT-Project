"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, FileText, CreditCard, ClipboardList, LogOut, Home } from "lucide-react";

export default function SidebarPatient({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
}) {
  const pathname = usePathname();

  const links = [
    { name: "Dashboard", href: "/homepatient", icon: Home },
    { name: "Historique", href: "/historique", icon: ClipboardList },
    { name: "Prochains Rendez-vous", href: "/rendezvous", icon: CalendarDays },
    { name: "Réservation", href: "/reservation", icon: FileText },
    { name: "Paiement", href: "/paiement", icon: CreditCard },
    { name: "Ordonnances", href: "/ordonnances", icon: FileText },
  ];

  return (
    <aside
      className={`bg-blue-700 text-white transition-all duration-300 ${
        isOpen ? "w-64" : "w-20"
      } flex flex-col justify-between`}
    >
      <div>
        <div className="p-4 font-bold text-lg text-center">👨‍⚕️ Patient</div>
        <nav className="mt-4 flex flex-col gap-2">
          {links.map(({ name, href, icon: Icon }) => (
            <Link
              key={name}
              href={href}
              className={`flex items-center gap-3 p-3 mx-2 rounded-md transition-all ${
                pathname === href
                  ? "bg-blue-500"
                  : "hover:bg-blue-600"
              }`}
            >
              <Icon size={20} />
              {isOpen && <span>{name}</span>}
            </Link>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-blue-500">
        <button className="flex items-center gap-3 w-full p-3 rounded-md hover:bg-blue-600">
          <LogOut size={20} />
          {isOpen && <span>Déconnexion</span>}
        </button>
      </div>
    </aside>
  );
}
