import type { UserRole } from "@/types/database";
import type { LucideIcon } from "lucide-react";
import {
  Receipt,
  Package,
  MessageSquareWarning,
  CalendarCheck,
  Users,
  FileText,
  Home as HomeIcon,
  Activity,
  LayoutDashboard,
  UserCog,
  Megaphone,
  Wrench,
  Eye,
  Gavel,
  Wallet,
  ClipboardList,
  Vote,
  Headset,
  CalendarClock,
  BookOpen,
  Scale,
  Star,
  BarChart3,
  Droplets,
  FolderOpen,
} from "lucide-react";

// ============================================
// Module permissions per role
// ============================================

const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  super_admin: ["*"],
  admin: [
    "home",
    "finanzas",
    "zonas",
    "paquetes",
    "pqr",
    "comunicados",
    "visitantes",
    "propiedad",
    "folky",
    "salud",
    "puntos",
    "transparencia",
    "mantenimiento",
    "manuales",
    "actas",
    "vecinos",
    "votaciones",
    "soporte",
    "citas",
    "presupuesto",
    "wallet",
    "servicios",
    "documentos",
    "tools",
    "admin/finanzas",
    "admin/gastos",
    "admin/cartera",
    "admin/presupuesto",
    "admin/asambleas",
    "admin/analytics",
    "admin/tareas",
    "admin/personal",
    "admin/turnos",
    "admin/servicios",
  ],
  consejo: [
    "home",
    "finanzas",
    "zonas",
    "paquetes",
    "pqr",
    "comunicados",
    "visitantes",
    "propiedad",
    "folky",
    "salud",
    "puntos",
    "transparencia",
    "mantenimiento",
    "manuales",
    "actas",
    "vecinos",
    "votaciones",
    "soporte",
    "citas",
    "presupuesto",
    "wallet",
    "servicios",
    "documentos",
    "tools",
    "admin/finanzas",
    "admin/presupuesto",
    "admin/asambleas",
    "admin/analytics",
    "admin/servicios",
  ],
  residente: [
    "home",
    "finanzas",
    "zonas",
    "paquetes",
    "pqr",
    "comunicados",
    "visitantes",
    "propiedad",
    "folky",
    "salud",
    "puntos",
    "transparencia",
    "mantenimiento",
    "manuales",
    "actas",
    "vecinos",
    "votaciones",
    "soporte",
    "citas",
    "presupuesto",
    "wallet",
    "servicios",
    "documentos",
    "tools",
  ],
  personal: [
    "home",
    "pqr",
    "mantenimiento",
    "comunicados",
    "folky",
    "soporte",
    "citas",
    "tools",
    "scanner",
  ],
  portero: [
    "home",
    "paquetes",
    "visitantes",
    "comunicados",
    "folky",
    "soporte",
    "citas",
    "tools",
    "scanner",
  ],
};

export function hasPermission(role: UserRole, module: string): boolean {
  const perms = ROLE_PERMISSIONS[role];
  if (!perms) return false;
  if (perms.includes("*")) return true;
  return perms.includes(module);
}

// ============================================
// Quick actions per role (home page)
// ============================================

export interface QuickAction {
  href: string;
  label: string;
  icon: LucideIcon;
}

const ROLE_QUICK_ACTIONS: Record<UserRole, QuickAction[]> = {
  super_admin: [
    { href: "/finanzas", label: "Recibos", icon: Receipt },
    { href: "/admin", label: "Panel Admin", icon: LayoutDashboard },
    { href: "/pqr", label: "PQR", icon: MessageSquareWarning },
    { href: "/zonas", label: "Reservas", icon: CalendarCheck },
    { href: "/votaciones", label: "Votaciones", icon: Vote },
    { href: "/admin/personal", label: "Personal", icon: UserCog },
    { href: "/comunicados", label: "Comunicados", icon: Megaphone },
    { href: "/mantenimiento", label: "Mantenimiento", icon: Wrench },
  ],
  admin: [
    { href: "/finanzas", label: "Recibos", icon: Receipt },
    { href: "/admin", label: "Panel Admin", icon: LayoutDashboard },
    { href: "/pqr", label: "PQR", icon: MessageSquareWarning },
    { href: "/zonas", label: "Reservas", icon: CalendarCheck },
    { href: "/votaciones", label: "Votaciones", icon: Vote },
    { href: "/admin/personal", label: "Personal", icon: UserCog },
    { href: "/comunicados", label: "Comunicados", icon: Megaphone },
    { href: "/mantenimiento", label: "Mantenimiento", icon: Wrench },
  ],
  consejo: [
    { href: "/finanzas", label: "Recibos", icon: Receipt },
    { href: "/transparencia", label: "Transparencia", icon: Eye },
    { href: "/admin/asambleas", label: "Asambleas", icon: Gavel },
    { href: "/presupuesto", label: "Presupuesto", icon: Wallet },
    { href: "/pqr", label: "PQR", icon: MessageSquareWarning },
    { href: "/zonas", label: "Reservas", icon: CalendarCheck },
    { href: "/vecinos", label: "Vecinos", icon: Users },
    { href: "/salud", label: "Salud", icon: Activity },
  ],
  residente: [
    { href: "/finanzas", label: "Recibos", icon: Receipt },
    { href: "/wallet", label: "Wallet", icon: Wallet },
    { href: "/paquetes", label: "Paquetes", icon: Package },
    { href: "/pqr", label: "PQR", icon: MessageSquareWarning },
    { href: "/zonas", label: "Reservas", icon: CalendarCheck },
    { href: "/servicios", label: "Servicios", icon: Droplets },
    { href: "/documentos", label: "Documentos", icon: FolderOpen },
    { href: "/salud", label: "Salud", icon: Activity },
  ],
  personal: [
    { href: "/mantenimiento", label: "Tareas", icon: ClipboardList },
    { href: "/mantenimiento", label: "Mantenimiento", icon: Wrench },
    { href: "/pqr", label: "PQR", icon: MessageSquareWarning },
    { href: "/comunicados", label: "Comunicados", icon: Megaphone },
  ],
  portero: [
    { href: "/paquetes", label: "Paquetes", icon: Package },
    { href: "/visitantes", label: "Visitantes", icon: Users },
    { href: "/comunicados", label: "Comunicados", icon: Megaphone },
    { href: "/folky", label: "Folky", icon: Activity },
  ],
};

export function getHomeActions(role: UserRole): QuickAction[] {
  return ROLE_QUICK_ACTIONS[role] ?? ROLE_QUICK_ACTIONS.residente;
}

// ============================================
// All tools (launchpad / tools page)
// ============================================

const ALL_TOOLS: QuickAction[] = [
  { href: "/finanzas", label: "Recibos", icon: Receipt },
  { href: "/wallet", label: "Wallet", icon: Wallet },
  { href: "/paquetes", label: "Paquetes", icon: Package },
  { href: "/pqr", label: "PQR", icon: MessageSquareWarning },
  { href: "/propiedad", label: "Mi Propiedad", icon: HomeIcon },
  { href: "/vecinos", label: "Vecinos", icon: Users },
  { href: "/admin", label: "Admin", icon: LayoutDashboard },
  { href: "/manuales", label: "Manuales", icon: BookOpen },
  { href: "/zonas", label: "Reservas", icon: CalendarCheck },
  { href: "/comunicados", label: "Comunicados", icon: Megaphone },
  { href: "/mantenimiento", label: "Mantenimiento", icon: Wrench },
  { href: "/actas", label: "Actas", icon: FileText },
  { href: "/votaciones", label: "Votaciones", icon: Vote },
  { href: "/servicios", label: "Servicios", icon: Droplets },
  { href: "/documentos", label: "Documentos", icon: FolderOpen },
  { href: "/presupuesto", label: "Presupuesto", icon: Wallet },
  { href: "/salud", label: "Salud", icon: Activity },
  { href: "/puntos", label: "Puntos", icon: Star },
  { href: "/transparencia", label: "Transparencia", icon: Eye },
  { href: "/soporte", label: "Soporte", icon: Headset },
  { href: "/citas", label: "Agendar Cita", icon: CalendarClock },
];

export function getAllToolsActions(role: UserRole): QuickAction[] {
  const perms = ROLE_PERMISSIONS[role];
  if (!perms) return [];
  if (perms.includes("*")) return ALL_TOOLS;
  // Filter tools to only those the role has access to
  return ALL_TOOLS.filter((tool) => {
    const module = tool.href.replace(/^\//, "");
    return perms.includes(module);
  });
}

// ============================================
// Role labels and colors
// ============================================

export function getRoleLabel(role: UserRole): string {
  const labels: Record<UserRole, string> = {
    super_admin: "Desarrollador",
    admin: "Administrador",
    consejo: "Consejo",
    residente: "Residente",
    personal: "Personal",
    portero: "Portero",
  };
  return labels[role] || role;
}

export function getRoleColor(role: UserRole): string {
  const colors: Record<UserRole, string> = {
    super_admin: "bg-purple-100 text-purple-700",
    admin: "bg-amber-100 text-amber-700",
    consejo: "bg-blue-100 text-blue-700",
    residente: "bg-green-100 text-green-700",
    personal: "bg-cyan-100 text-cyan-700",
    portero: "bg-gray-100 text-gray-700",
  };
  return colors[role] || "bg-gray-100 text-gray-700";
}

// ============================================
// Admin sub-nav filtering for consejo
// ============================================

const CONSEJO_ADMIN_PATHS = [
  "/admin/finanzas",
  "/admin/presupuesto",
  "/admin/servicios",
  "/admin/asambleas",
  "/admin/analytics",
];

export function getAdminAllowedPaths(role: UserRole): string[] | null {
  if (role === "super_admin" || role === "admin") return null; // null = all allowed
  if (role === "consejo") return CONSEJO_ADMIN_PATHS;
  return []; // no access
}

// ============================================
// Bottom nav per role
// ============================================

import {
  Sparkles,
  LayoutGrid,
  User,
  Wallet as WalletNav,
  ShieldCheck,
} from "lucide-react";

export interface BottomNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  isFab?: boolean;
}

const ROLE_BOTTOM_NAV: Record<UserRole, BottomNavItem[]> = {
  super_admin: [
    { href: "/home", label: "Inicio", icon: HomeIcon },
    { href: "/finanzas", label: "Pagos", icon: WalletNav },
    { href: "/folky", label: "Folky", icon: Sparkles, isFab: true },
    { href: "/tools", label: "Tools", icon: LayoutGrid },
    { href: "/perfil", label: "Perfil", icon: User },
  ],
  admin: [
    { href: "/home", label: "Inicio", icon: HomeIcon },
    { href: "/finanzas", label: "Pagos", icon: WalletNav },
    { href: "/folky", label: "Folky", icon: Sparkles, isFab: true },
    { href: "/tools", label: "Tools", icon: LayoutGrid },
    { href: "/perfil", label: "Perfil", icon: User },
  ],
  consejo: [
    { href: "/home", label: "Inicio", icon: HomeIcon },
    { href: "/finanzas", label: "Pagos", icon: WalletNav },
    { href: "/folky", label: "Folky", icon: Sparkles, isFab: true },
    { href: "/tools", label: "Tools", icon: LayoutGrid },
    { href: "/perfil", label: "Perfil", icon: User },
  ],
  residente: [
    { href: "/home", label: "Inicio", icon: HomeIcon },
    { href: "/finanzas", label: "Pagos", icon: WalletNav },
    { href: "/folky", label: "Folky", icon: Sparkles, isFab: true },
    { href: "/tools", label: "Tools", icon: LayoutGrid },
    { href: "/perfil", label: "Perfil", icon: User },
  ],
  personal: [
    { href: "/home", label: "Inicio", icon: HomeIcon },
    { href: "/mantenimiento", label: "Tareas", icon: ClipboardList },
    { href: "/folky", label: "Folky", icon: Sparkles, isFab: true },
    { href: "/tools", label: "Tools", icon: LayoutGrid },
    { href: "/perfil", label: "Perfil", icon: User },
  ],
  portero: [
    { href: "/home", label: "Inicio", icon: HomeIcon },
    { href: "/paquetes", label: "Paquetes", icon: Package },
    { href: "/folky", label: "Folky", icon: Sparkles, isFab: true },
    { href: "/tools", label: "Tools", icon: LayoutGrid },
    { href: "/perfil", label: "Perfil", icon: User },
  ],
};

export function getBottomNavItems(role: UserRole): BottomNavItem[] {
  return ROLE_BOTTOM_NAV[role] ?? ROLE_BOTTOM_NAV.residente;
}
