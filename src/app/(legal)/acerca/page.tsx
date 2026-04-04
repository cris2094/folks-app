import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AcercaPage() {
  return (
    <article className="prose prose-gray max-w-none">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-gray-400 no-underline transition hover:text-gray-600"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Volver
      </Link>

      <h1 className="text-2xl font-bold text-gray-900">
        Acerca de Folks
      </h1>

      <h2 className="mt-8 text-xl font-semibold text-gray-900">
        Mision
      </h2>
      <p>
        Democratizar la gestion de copropiedades en Colombia a traves de
        tecnologia accesible e inteligente. Creemos que cada comunidad merece
        herramientas de primer nivel para administrar sus recursos, comunicarse
        eficientemente y vivir mejor.
      </p>

      <h2 className="mt-8 text-xl font-semibold text-gray-900">
        Vision
      </h2>
      <p>
        Ser la plataforma lider en gestion residencial inteligente en America
        Latina, impulsando comunidades transparentes, conectadas y sostenibles.
      </p>

      <h2 className="mt-8 text-xl font-semibold text-gray-900">
        Equipo
      </h2>
      <div className="not-prose mt-4 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-gray-100 bg-white p-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-amber-600 text-lg font-bold text-white">
            CD
          </div>
          <h3 className="mt-4 text-base font-semibold text-gray-900">
            Cristhian Duran
          </h3>
          <p className="text-sm text-gray-500">Co-fundador &amp; CTO</p>
          <p className="mt-2 text-sm text-gray-400">
            Desarrollador full-stack. Apasionado por construir productos que
            resuelvan problemas reales con tecnologia de punta.
          </p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-lg font-bold text-white">
            MR
          </div>
          <h3 className="mt-4 text-base font-semibold text-gray-900">
            Mauro Rodriguez
          </h3>
          <p className="text-sm text-gray-500">Co-fundador &amp; CEO</p>
          <p className="mt-2 text-sm text-gray-400">
            Estratega de negocios con experiencia en el sector inmobiliario y
            gestion de comunidades.
          </p>
        </div>
      </div>

      <h2 className="mt-8 text-xl font-semibold text-gray-900">
        Stack Tecnologico
      </h2>
      <div className="not-prose mt-4">
        <div className="flex flex-wrap gap-2">
          {[
            "Next.js 16",
            "React 19",
            "TypeScript",
            "Tailwind CSS 4",
            "Supabase",
            "PostgreSQL",
            "Gemini AI",
            "Vercel",
            "Framer Motion",
            "PWA",
          ].map((tech) => (
            <span
              key={tech}
              className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      <h2 className="mt-8 text-xl font-semibold text-gray-900">
        Hecho en Colombia
      </h2>
      <p>
        Folks es un producto de <strong>Dimensions S.A.S.</strong>, empresa
        colombiana con sede en Bogota. Construimos software con estandares
        globales para resolver problemas locales.
      </p>

      <div className="mt-8 rounded-2xl bg-gray-50 p-6 text-center">
        <p className="text-sm text-gray-500">
          Hecho con dedicacion desde Colombia 🇨🇴
        </p>
        <p className="mt-1 text-[10px] font-medium tracking-wider text-gray-300">
          POTENCIADO POR TECNOLOGIA FOLKS
        </p>
      </div>
    </article>
  );
}
