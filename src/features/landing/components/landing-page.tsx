"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  CreditCard,
  CalendarCheck,
  Package,
  Bot,
  Users,
  BarChart3,
  Check,
  ArrowRight,
  ChevronRight,
  Shield,
  Zap,
  Building2,
} from "lucide-react";

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const features = [
  {
    icon: CreditCard,
    title: "Pagos",
    description: "Administracion y cobro digital con recordatorios automaticos y prediccion de morosidad.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: CalendarCheck,
    title: "Reservas",
    description: "Zonas comunes con disponibilidad en tiempo real y confirmacion instantanea.",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: Package,
    title: "Paqueteria",
    description: "Registro fotografico, notificacion inmediata y firma digital de entrega.",
    color: "bg-amber-50 text-amber-600",
  },
  {
    icon: Bot,
    title: "Asistente IA",
    description: "Folky resuelve dudas, genera reportes y analiza patrones de tu copropiedad.",
    color: "bg-purple-50 text-purple-600",
  },
  {
    icon: Users,
    title: "Asambleas",
    description: "Transcripcion con IA, generacion de actas y seguimiento de compromisos.",
    color: "bg-rose-50 text-rose-600",
  },
  {
    icon: BarChart3,
    title: "Transparencia",
    description: "Dashboard financiero en tiempo real. Cada peso visible para todos los residentes.",
    color: "bg-teal-50 text-teal-600",
  },
];

const benefits = [
  "Reduccion del 40% en morosidad con recordatorios inteligentes",
  "Atencion 24/7 con asistente de IA integrado",
  "Actas de asamblea generadas en minutos, no dias",
  "Cero papeleria: todo digital y auditable",
  "White-label: tu marca, tu identidad",
  "Cumplimiento total con Ley 675 y Ley 1581",
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/images/irawa-logo.jpg"
              alt="Folks"
              width={36}
              height={36}
              className="rounded-lg"
            />
            <span className="text-lg font-bold tracking-tight text-gray-900">
              Folks
            </span>
          </Link>
          <div className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm text-gray-500 transition hover:text-gray-900">
              Funciones
            </a>
            <a href="#pricing" className="text-sm text-gray-500 transition hover:text-gray-900">
              Precios
            </a>
            <Link href="/acerca" className="text-sm text-gray-500 transition hover:text-gray-900">
              Nosotros
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-gray-600 transition hover:text-gray-900"
            >
              Iniciar sesion
            </Link>
            <a
              href="https://wa.me/573001234567?text=Hola%2C%20quiero%20una%20demo%20de%20Folks"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-gray-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              Solicitar Demo
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-50/50 via-white to-white" />
        <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-20 md:pt-32">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="mx-auto max-w-3xl text-center"
          >
            <motion.div variants={fadeIn} transition={{ duration: 0.5 }}>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                <Zap className="h-3 w-3" />
                Plataforma de Gestion Residencial con IA
              </span>
            </motion.div>

            <motion.h1
              variants={fadeIn}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-6 text-4xl font-bold tracking-tight text-gray-900 md:text-6xl"
              style={{ letterSpacing: "-0.03em" }}
            >
              Gestion Residencial{" "}
              <span className="bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">
                Inteligente
              </span>
            </motion.h1>

            <motion.p
              variants={fadeIn}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-lg text-gray-500 md:text-xl"
              style={{ lineHeight: 1.6 }}
            >
              La plataforma que conecta tu copropiedad con inteligencia artificial.
              Pagos, reservas, paqueteria, asambleas y transparencia financiera
              en un solo lugar.
            </motion.p>

            <motion.div
              variants={fadeIn}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
            >
              <a
                href="https://wa.me/573001234567?text=Hola%2C%20quiero%20una%20demo%20de%20Folks"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 rounded-full bg-gray-900 px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-gray-800 hover:shadow-lg hover:shadow-gray-900/20"
              >
                Solicitar Demo
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
              <Link
                href="/login"
                className="group flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-8 py-3.5 text-sm font-semibold text-gray-700 transition-all hover:border-gray-300 hover:shadow-sm"
              >
                Ya tengo cuenta
                <ChevronRight className="h-4 w-4 text-gray-400 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="text-center"
          >
            <motion.p
              variants={fadeIn}
              transition={{ duration: 0.4 }}
              className="text-sm font-semibold uppercase tracking-wider text-amber-600"
            >
              Todo lo que necesitas
            </motion.p>
            <motion.h2
              variants={fadeIn}
              transition={{ duration: 0.4 }}
              className="mt-3 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl"
              style={{ letterSpacing: "-0.02em" }}
            >
              Funciones que transforman
              <br className="hidden md:block" /> la vida en comunidad
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={fadeIn}
                transition={{ duration: 0.4 }}
                className="group rounded-2xl border border-gray-100 bg-white p-6 transition-all hover:border-gray-200 hover:shadow-lg hover:shadow-gray-100/50"
              >
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${feature.color}`}
                >
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-gray-50 py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
            >
              <motion.p
                variants={fadeIn}
                transition={{ duration: 0.4 }}
                className="text-sm font-semibold uppercase tracking-wider text-amber-600"
              >
                Por que Folks
              </motion.p>
              <motion.h2
                variants={fadeIn}
                transition={{ duration: 0.4 }}
                className="mt-3 text-3xl font-bold tracking-tight text-gray-900"
                style={{ letterSpacing: "-0.02em" }}
              >
                La herramienta que tu
                <br /> administracion necesitaba
              </motion.h2>
              <motion.div variants={stagger} className="mt-8 space-y-4">
                {benefits.map((benefit) => (
                  <motion.div
                    key={benefit}
                    variants={fadeIn}
                    transition={{ duration: 0.3 }}
                    className="flex items-start gap-3"
                  >
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                      <Check className="h-3 w-3 text-emerald-600" />
                    </div>
                    <p className="text-sm text-gray-600">{benefit}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 shadow-xl shadow-gray-200/50">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50">
                    <Building2 className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Torres del Parque</p>
                    <p className="text-xs text-gray-400">120 unidades activas</p>
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="rounded-xl bg-emerald-50 p-4">
                    <p className="text-2xl font-bold text-emerald-700">94%</p>
                    <p className="text-xs text-emerald-600">Recaudo</p>
                  </div>
                  <div className="rounded-xl bg-blue-50 p-4">
                    <p className="text-2xl font-bold text-blue-700">87%</p>
                    <p className="text-xs text-blue-600">Adopcion App</p>
                  </div>
                  <div className="rounded-xl bg-amber-50 p-4">
                    <p className="text-2xl font-bold text-amber-700">4.8/5</p>
                    <p className="text-xs text-amber-600">Satisfaccion</p>
                  </div>
                  <div className="rounded-xl bg-purple-50 p-4">
                    <p className="text-2xl font-bold text-purple-700">2min</p>
                    <p className="text-xs text-purple-600">Respuesta IA</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center"
          >
            <motion.p
              variants={fadeIn}
              transition={{ duration: 0.4 }}
              className="text-sm font-semibold uppercase tracking-wider text-amber-600"
            >
              Precios simples
            </motion.p>
            <motion.h2
              variants={fadeIn}
              transition={{ duration: 0.4 }}
              className="mt-3 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl"
              style={{ letterSpacing: "-0.02em" }}
            >
              Un precio por unidad. Sin sorpresas.
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="mx-auto mt-16 grid max-w-4xl gap-6 md:grid-cols-2"
          >
            {/* Monthly */}
            <motion.div
              variants={fadeIn}
              transition={{ duration: 0.4 }}
              className="rounded-2xl border border-gray-200 bg-white p-8"
            >
              <p className="text-sm font-semibold text-gray-500">Mensual</p>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-gray-900">$900</span>
                <span className="text-sm text-gray-400">/unidad/mes</span>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Flexibilidad total. Cancela cuando quieras.
              </p>
              <ul className="mt-6 space-y-3">
                {["Todas las funciones", "Soporte prioritario", "IA incluida", "Sin permanencia"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="h-4 w-4 text-emerald-500" />
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href="https://wa.me/573001234567?text=Quiero%20el%20plan%20mensual%20de%20Folks"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 flex w-full items-center justify-center rounded-full border border-gray-200 py-3 text-sm font-semibold text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
              >
                Comenzar ahora
              </a>
            </motion.div>

            {/* Annual */}
            <motion.div
              variants={fadeIn}
              transition={{ duration: 0.4 }}
              className="relative rounded-2xl border-2 border-gray-900 bg-white p-8"
            >
              <div className="absolute -top-3 left-6 rounded-full bg-gray-900 px-3 py-0.5 text-xs font-semibold text-white">
                Ahorra 20%
              </div>
              <p className="text-sm font-semibold text-gray-500">Anual</p>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-gray-900">$720</span>
                <span className="text-sm text-gray-400">/unidad/mes</span>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                El mejor precio. Facturado anualmente.
              </p>
              <ul className="mt-6 space-y-3">
                {["Todas las funciones", "Soporte prioritario", "IA incluida", "Onboarding personalizado", "Capacitacion presencial"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="h-4 w-4 text-emerald-500" />
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href="https://wa.me/573001234567?text=Quiero%20el%20plan%20anual%20de%20Folks"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 flex w-full items-center justify-center rounded-full bg-gray-900 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
              >
                Comenzar ahora
              </a>
            </motion.div>
          </motion.div>

          <p className="mt-8 text-center text-xs text-gray-400">
            Precios en COP. IVA incluido. Ejemplo: conjunto de 100 unidades = $90.000/mes o $72.000/mes (anual).
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-900 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl px-6 text-center"
        >
          <h2 className="text-3xl font-bold text-white md:text-4xl" style={{ letterSpacing: "-0.02em" }}>
            Transforma la gestion de tu copropiedad
          </h2>
          <p className="mt-4 text-gray-400">
            Unete a las copropiedades que ya gestionan su comunidad de forma inteligente.
            Agenda una demo sin compromiso.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="https://wa.me/573001234567?text=Hola%2C%20quiero%20una%20demo%20de%20Folks"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-gray-900 transition hover:bg-gray-100"
            >
              Hablar por WhatsApp
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <Link
              href="/login"
              className="text-sm font-medium text-gray-400 transition hover:text-white"
            >
              Ya soy residente →
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white py-12">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2.5">
              <Image
                src="/images/irawa-logo.jpg"
                alt="Folks"
                width={28}
                height={28}
                className="rounded-lg"
              />
              <span className="text-sm font-semibold text-gray-900">Folks</span>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/privacidad" className="text-xs text-gray-400 transition hover:text-gray-600">
                Politica de Privacidad
              </Link>
              <Link href="/terminos" className="text-xs text-gray-400 transition hover:text-gray-600">
                Terminos y Condiciones
              </Link>
              <Link href="/acerca" className="text-xs text-gray-400 transition hover:text-gray-600">
                Acerca de
              </Link>
            </div>
          </div>
          <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-gray-50 pt-8 md:flex-row">
            <p className="text-xs text-gray-400">
              &copy; {new Date().getFullYear()} Dimensions S.A.S. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-1.5">
              <Shield className="h-3 w-3 text-gray-300" />
              <p className="text-[10px] font-medium tracking-wider text-gray-300">
                POTENCIADO POR TECNOLOGIA FOLKS
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
