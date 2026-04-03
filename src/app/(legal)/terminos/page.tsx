import Link from "next/link";

export default function TerminosPage() {
  return (
    <article className="prose prose-gray max-w-none">
      <h1 className="text-2xl font-bold text-gray-900">
        Terminos y Condiciones de Uso
      </h1>
      <p className="text-sm text-gray-500">
        Ultima actualizacion: 3 de abril de 2026
      </p>

      <p>
        Los presentes Terminos y Condiciones regulan el acceso y uso de la
        plataforma Folks (en adelante, &quot;la Plataforma&quot;), operada por
        Dimensions S.A.S. (en adelante, &quot;el Proveedor&quot;), con domicilio
        en Bucaramanga, Santander, Colombia.
      </p>
      <p>
        Al acceder y utilizar la Plataforma, el usuario acepta integramente
        estos Terminos y Condiciones. Si no esta de acuerdo con alguno de ellos,
        debera abstenerse de utilizar la Plataforma.
      </p>

      <h2 className="mt-8 text-xl font-semibold text-gray-900">
        1. Objeto del Servicio
      </h2>
      <p>
        Folks es una plataforma digital disenada para facilitar la gestion
        integral de copropiedades y conjuntos residenciales sometidos al regimen
        de propiedad horizontal en Colombia (Ley 675 de 2001). La Plataforma
        permite a administradores, propietarios y residentes gestionar
        comunicaciones, solicitudes PQRS, control de acceso de visitantes,
        registro de vehiculos y mascotas, y demas funcionalidades propias de la
        vida en comunidad.
      </p>

      <h2 className="mt-8 text-xl font-semibold text-gray-900">
        2. Naturaleza del Servicio
      </h2>
      <p>
        La Plataforma opera bajo un modelo de Software como Servicio (SaaS) con
        arquitectura multi-tenant. Cada copropiedad constituye un tenant
        independiente con datos aislados. El Proveedor actua como encargado del
        tratamiento de datos personales, mientras que la copropiedad contratante
        actua como responsable del tratamiento.
      </p>
      <p>
        El acceso a la Plataforma se realiza mediante navegador web o aplicacion
        movil, previa creacion de una cuenta de usuario vinculada a una
        copropiedad especifica.
      </p>

      <h2 className="mt-8 text-xl font-semibold text-gray-900">
        3. Obligaciones del Usuario
      </h2>
      <p>Al utilizar la Plataforma, el usuario se compromete a:</p>
      <ul className="list-disc pl-6">
        <li>
          Proporcionar informacion veraz, completa y actualizada al momento del
          registro y durante el uso de la Plataforma.
        </li>
        <li>
          Mantener la confidencialidad de sus credenciales de acceso y no
          compartirlas con terceros.
        </li>
        <li>
          Utilizar la Plataforma exclusivamente para los fines previstos y de
          conformidad con la ley colombiana.
        </li>
        <li>
          No realizar actividades que puedan danar, deshabilitar, sobrecargar o
          deteriorar el funcionamiento de la Plataforma.
        </li>
        <li>
          No intentar acceder a datos de otras copropiedades o usuarios sin
          autorizacion.
        </li>
        <li>
          Respetar las normas de convivencia y el reglamento de propiedad
          horizontal al interactuar a traves de la Plataforma.
        </li>
        <li>
          Reportar al Proveedor cualquier vulnerabilidad de seguridad o uso
          indebido que detecte.
        </li>
      </ul>

      <h2 className="mt-8 text-xl font-semibold text-gray-900">
        4. Obligaciones del Proveedor
      </h2>
      <p>Dimensions S.A.S. se compromete a:</p>
      <ul className="list-disc pl-6">
        <li>
          Mantener la disponibilidad de la Plataforma con los mejores esfuerzos
          razonables, sin garantizar disponibilidad ininterrumpida.
        </li>
        <li>
          Implementar y mantener medidas de seguridad tecnicas y organizativas
          para proteger los datos personales de los usuarios.
        </li>
        <li>
          Tratar los datos personales unicamente conforme a las instrucciones del
          responsable del tratamiento (la copropiedad) y de acuerdo con la
          Politica de Tratamiento de Datos Personales.
        </li>
        <li>
          Notificar oportunamente a los usuarios sobre cambios sustanciales en la
          Plataforma o en estos Terminos y Condiciones.
        </li>
        <li>
          Brindar soporte tecnico a traves de los canales habilitados para tal
          fin.
        </li>
      </ul>

      <h2 className="mt-8 text-xl font-semibold text-gray-900">
        5. Propiedad Intelectual
      </h2>
      <p>
        Todos los derechos de propiedad intelectual sobre la Plataforma,
        incluyendo pero no limitado al codigo fuente, diseno, marcas, logotipos,
        textos, graficos e interfaces, son propiedad exclusiva de Dimensions
        S.A.S. o de sus licenciantes.
      </p>
      <p>
        El uso de la Plataforma no otorga al usuario ningun derecho de propiedad
        intelectual sobre la misma ni sobre sus contenidos. Queda prohibida la
        reproduccion, distribucion, modificacion o explotacion comercial de
        cualquier elemento de la Plataforma sin autorizacion previa y por escrito
        del Proveedor.
      </p>
      <p>
        Los datos e informacion ingresados por el usuario y la copropiedad
        permanecen como propiedad de estos. El Proveedor podra utilizar datos
        anonimizados y agregados con fines estadisticos y de mejora del servicio.
      </p>

      <h2 className="mt-8 text-xl font-semibold text-gray-900">
        6. Limitacion de Responsabilidad
      </h2>
      <p>
        El Proveedor no sera responsable por:
      </p>
      <ul className="list-disc pl-6">
        <li>
          Danos o perjuicios derivados de interrupciones del servicio causadas
          por factores ajenos a su control, incluyendo fallas en la
          infraestructura de terceros, desastres naturales o actos de fuerza
          mayor.
        </li>
        <li>
          La veracidad o exactitud de la informacion ingresada por los usuarios
          en la Plataforma.
        </li>
        <li>
          Decisiones tomadas por la administracion de la copropiedad con base en
          la informacion gestionada a traves de la Plataforma.
        </li>
        <li>
          Accesos no autorizados a cuentas de usuario derivados de negligencia
          del usuario en la custodia de sus credenciales.
        </li>
        <li>
          Danos indirectos, consecuenciales o lucro cesante, cualquiera que sea
          su causa.
        </li>
      </ul>
      <p>
        En cualquier caso, la responsabilidad total del Proveedor frente al
        usuario no excedera el valor pagado por la copropiedad por el uso de la
        Plataforma durante los ultimos doce (12) meses.
      </p>

      <h2 className="mt-8 text-xl font-semibold text-gray-900">
        7. Uso de Inteligencia Artificial
      </h2>
      <p>
        La Plataforma incorpora un asistente de inteligencia artificial
        denominado &quot;Folky&quot;, el cual tiene como proposito facilitar la
        interaccion de los residentes con la informacion de su conjunto
        residencial. Al respecto, el usuario reconoce y acepta que:
      </p>
      <ul className="list-disc pl-6">
        <li>
          Las respuestas generadas por Folky son orientativas y no constituyen
          asesoria legal, tecnica ni profesional de ninguna clase.
        </li>
        <li>
          El Proveedor no garantiza la exactitud, completitud ni idoneidad de las
          respuestas generadas por la inteligencia artificial.
        </li>
        <li>
          Folky procesa unicamente informacion contextual de la copropiedad
          necesaria para generar respuestas relevantes, en cumplimiento de la
          Politica de Tratamiento de Datos Personales.
        </li>
        <li>
          Los datos utilizados por Folky no se emplean para entrenar modelos de
          inteligencia artificial de terceros.
        </li>
        <li>
          El usuario puede optar por no utilizar las funcionalidades de
          inteligencia artificial sin que esto afecte el acceso a las demas
          funcionalidades de la Plataforma.
        </li>
      </ul>

      <h2 className="mt-8 text-xl font-semibold text-gray-900">
        8. Suspension y Terminacion
      </h2>
      <p>
        El Proveedor podra suspender o terminar el acceso de un usuario a la
        Plataforma en los siguientes casos:
      </p>
      <ul className="list-disc pl-6">
        <li>Incumplimiento de estos Terminos y Condiciones.</li>
        <li>
          Solicitud de la administracion de la copropiedad (por ejemplo, al
          dejar de ser residente).
        </li>
        <li>
          Uso de la Plataforma para actividades ilegales o que atenten contra los
          derechos de terceros.
        </li>
        <li>
          Terminacion del contrato de servicios entre el Proveedor y la
          copropiedad.
        </li>
      </ul>

      <h2 className="mt-8 text-xl font-semibold text-gray-900">
        9. Modificaciones
      </h2>
      <p>
        El Proveedor se reserva el derecho de modificar estos Terminos y
        Condiciones en cualquier momento. Las modificaciones entraran en
        vigencia a partir de su publicacion en la Plataforma. Se notificara a los
        usuarios de cambios sustanciales a traves de los medios disponibles. El
        uso continuado de la Plataforma despues de la publicacion de las
        modificaciones constituye la aceptacion de las mismas.
      </p>

      <h2 className="mt-8 text-xl font-semibold text-gray-900">
        10. Ley Aplicable y Jurisdiccion
      </h2>
      <p>
        Los presentes Terminos y Condiciones se rigen por las leyes de la
        Republica de Colombia. Para la resolucion de cualquier controversia
        derivada del uso de la Plataforma, las partes se someten a la
        jurisdiccion de los jueces y tribunales de la ciudad de Bucaramanga,
        departamento de Santander, Colombia.
      </p>

      <h2 className="mt-8 text-xl font-semibold text-gray-900">
        11. Contacto
      </h2>
      <p>
        Para cualquier consulta, solicitud o reclamacion relacionada con estos
        Terminos y Condiciones, el usuario podra comunicarse a traves de:
      </p>
      <ul className="list-disc pl-6">
        <li>
          Correo electronico:{" "}
          <a href="mailto:info@cohabit.com.co" className="text-amber-600 hover:underline">
            info@cohabit.com.co
          </a>
        </li>
        <li>Domicilio: Bucaramanga, Santander, Colombia</li>
      </ul>

      <div className="mt-10 border-t pt-6 text-sm text-gray-500">
        <p>
          <Link href="/privacidad" className="text-amber-600 hover:underline">
            Ver Politica de Privacidad
          </Link>
        </p>
      </div>
    </article>
  );
}
