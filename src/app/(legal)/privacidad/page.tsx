import Link from "next/link";

export default function PrivacidadPage() {
  return (
    <article className="prose prose-gray max-w-none">
      <h1 className="text-2xl font-bold text-gray-900">
        Politica de Tratamiento de Datos Personales
      </h1>
      <p className="text-sm text-gray-500">
        Ultima actualizacion: 3 de abril de 2026
      </p>

      <p>
        La presente Politica de Tratamiento de Datos Personales se establece en
        cumplimiento de la Ley 1581 de 2012, el Decreto Reglamentario 1377 de
        2013 y demas normas concordantes vigentes en la Republica de Colombia.
      </p>

      <h2 className="mt-8 text-xl font-semibold text-gray-900">
        1. Responsable y Encargado del Tratamiento
      </h2>
      <p>
        <strong>Responsable del tratamiento:</strong> La copropiedad
        (conjunto residencial) que contrata los servicios de la plataforma
        Folks para la gestion de su comunidad. Cada copropiedad actua como
        responsable del tratamiento de los datos personales de sus residentes,
        propietarios y visitantes.
      </p>
      <p>
        <strong>Encargado del tratamiento:</strong> Dimensions S.A.S., sociedad
        comercial colombiana, operadora de la plataforma tecnologica Folks.
      </p>
      <ul className="list-disc pl-6">
        <li>Correo electronico: info@cohabit.com.co</li>
        <li>Domicilio: Bucaramanga, Santander, Colombia</li>
      </ul>

      <h2 className="mt-8 text-xl font-semibold text-gray-900">
        2. Finalidad del Tratamiento
      </h2>
      <p>
        Los datos personales recolectados a traves de la plataforma Folks seran
        utilizados para las siguientes finalidades:
      </p>
      <ul className="list-disc pl-6">
        <li>
          Gestionar la informacion de residentes, propietarios y unidades
          inmobiliarias del conjunto residencial.
        </li>
        <li>
          Facilitar la comunicacion entre la administracion y los residentes
          mediante notificaciones, circulares y anuncios.
        </li>
        <li>
          Registrar y gestionar solicitudes de tipo PQRS (peticiones, quejas,
          reclamos y sugerencias).
        </li>
        <li>
          Administrar el control de acceso de visitantes, vehiculos y
          encomiendas.
        </li>
        <li>
          Generar reportes de gestion para la administracion del conjunto
          residencial.
        </li>
        <li>
          Proveer funcionalidades de asistencia mediante inteligencia artificial
          (Folky), las cuales procesan informacion contextual para responder
          consultas de los residentes.
        </li>
        <li>
          Cumplir con obligaciones legales y regulatorias aplicables a la
          propiedad horizontal en Colombia.
        </li>
      </ul>

      <h2 className="mt-8 text-xl font-semibold text-gray-900">
        3. Tipos de Datos Recolectados
      </h2>
      <p>La plataforma recolecta las siguientes categorias de datos personales:</p>
      <ul className="list-disc pl-6">
        <li>
          <strong>Datos de identificacion:</strong> nombre completo, tipo y
          numero de documento de identidad.
        </li>
        <li>
          <strong>Datos de contacto:</strong> correo electronico, numero de
          telefono.
        </li>
        <li>
          <strong>Datos de residencia:</strong> torre, numero de apartamento o
          unidad, condicion de propietario o arrendatario.
        </li>
        <li>
          <strong>Datos de vehiculos:</strong> placa, marca, color y tipo de
          vehiculo registrado en la copropiedad.
        </li>
        <li>
          <strong>Datos de mascotas:</strong> nombre, raza y tipo de mascota
          registrada.
        </li>
        <li>
          <strong>Datos de autenticacion:</strong> correo electronico y
          credenciales de acceso encriptadas.
        </li>
      </ul>

      <h2 className="mt-8 text-xl font-semibold text-gray-900">
        4. Derechos de los Titulares
      </h2>
      <p>
        De conformidad con el articulo 8 de la Ley 1581 de 2012, los titulares
        de los datos personales tienen los siguientes derechos:
      </p>
      <ul className="list-disc pl-6">
        <li>
          <strong>Conocer:</strong> acceder de forma gratuita a los datos
          personales que hayan sido objeto de tratamiento.
        </li>
        <li>
          <strong>Actualizar:</strong> solicitar la actualizacion de sus datos
          personales cuando estos sean inexactos o se encuentren incompletos.
        </li>
        <li>
          <strong>Rectificar:</strong> corregir la informacion que resulte
          inexacta o erronea.
        </li>
        <li>
          <strong>Solicitar supresion:</strong> pedir la eliminacion de sus datos
          cuando considere que no estan siendo tratados conforme a los principios
          y deberes constitucionales y legales.
        </li>
        <li>
          <strong>Revocar la autorizacion:</strong> solicitar la revocatoria de
          la autorizacion otorgada para el tratamiento de datos personales.
        </li>
        <li>
          <strong>Presentar quejas:</strong> ante la Superintendencia de
          Industria y Comercio (SIC) por infracciones a la ley de proteccion de
          datos.
        </li>
      </ul>

      <h2 className="mt-8 text-xl font-semibold text-gray-900">
        5. Mecanismos para Ejercer sus Derechos
      </h2>
      <p>
        Los titulares podran ejercer sus derechos mediante los siguientes
        canales:
      </p>
      <ul className="list-disc pl-6">
        <li>
          Correo electronico dirigido a{" "}
          <a href="mailto:info@cohabit.com.co" className="text-amber-600 hover:underline">
            info@cohabit.com.co
          </a>{" "}
          indicando su nombre completo, numero de documento, descripcion de la
          solicitud y datos de contacto.
        </li>
        <li>
          A traves de la seccion de perfil dentro de la aplicacion Folks, donde
          podra consultar y solicitar modificacion de sus datos.
        </li>
        <li>
          Mediante comunicacion escrita dirigida a la administracion de la
          copropiedad correspondiente.
        </li>
      </ul>
      <p>
        Las solicitudes seran atendidas en un plazo maximo de diez (10) dias
        habiles contados a partir de la fecha de recepcion. Cuando no fuere
        posible atender la solicitud dentro de dicho termino, se informara al
        titular los motivos y la fecha en que se atendera, la cual en ningun caso
        podra superar los cinco (5) dias habiles siguientes al vencimiento del
        primer plazo.
      </p>

      <h2 className="mt-8 text-xl font-semibold text-gray-900">
        6. Seguridad de la Informacion
      </h2>
      <p>
        Dimensions S.A.S., como encargado del tratamiento, implementa las
        siguientes medidas de seguridad para proteger los datos personales:
      </p>
      <ul className="list-disc pl-6">
        <li>
          <strong>Encriptacion:</strong> las credenciales de acceso y datos
          sensibles se almacenan con encriptacion de extremo a extremo.
        </li>
        <li>
          <strong>Row Level Security (RLS):</strong> cada copropiedad opera en un
          esquema de datos aislado, garantizando que los datos de una copropiedad
          no sean accesibles desde otra.
        </li>
        <li>
          <strong>Protocolos HTTPS:</strong> toda la comunicacion entre la
          aplicacion y los servidores se realiza mediante conexiones seguras.
        </li>
        <li>
          <strong>Control de acceso basado en roles:</strong> cada usuario solo
          accede a la informacion correspondiente a su rol (administrador,
          propietario, residente, vigilante).
        </li>
        <li>
          <strong>Infraestructura certificada:</strong> los datos se almacenan en
          servidores de Supabase (infraestructura AWS) con certificaciones de
          seguridad internacionales.
        </li>
      </ul>

      <h2 className="mt-8 text-xl font-semibold text-gray-900">
        7. Transferencia y Transmision de Datos
      </h2>
      <p>
        Los datos personales podran ser transmitidos a los siguientes terceros
        exclusivamente para el cumplimiento de las finalidades descritas:
      </p>
      <ul className="list-disc pl-6">
        <li>
          <strong>Supabase Inc.:</strong> proveedor de infraestructura de base de
          datos y autenticacion.
        </li>
        <li>
          <strong>OpenAI / proveedores de IA:</strong> para el funcionamiento del
          asistente Folky. Los datos enviados a estos servicios son anonimizados
          o limitados al contexto estrictamente necesario.
        </li>
        <li>
          <strong>Vercel Inc.:</strong> proveedor de alojamiento y despliegue de
          la aplicacion web.
        </li>
      </ul>
      <p>
        No se realizaran transferencias internacionales de datos a paises que no
        cuenten con niveles adecuados de proteccion, salvo las necesarias para el
        funcionamiento de la infraestructura tecnologica, las cuales cuentan con
        clausulas contractuales de proteccion de datos.
      </p>

      <h2 className="mt-8 text-xl font-semibold text-gray-900">
        8. Vigencia de la Base de Datos
      </h2>
      <p>
        Los datos personales seran conservados durante el tiempo que sea
        necesario para cumplir con las finalidades del tratamiento. Una vez
        finalizada la relacion entre el residente y la copropiedad, los datos
        seran conservados por un periodo maximo de cinco (5) anos para efectos
        legales y contables, salvo que una disposicion legal exija un periodo
        diferente.
      </p>
      <p>
        Transcurrido dicho periodo, los datos seran eliminados de forma segura de
        las bases de datos de la plataforma.
      </p>

      <h2 className="mt-8 text-xl font-semibold text-gray-900">
        9. Modificaciones a esta Politica
      </h2>
      <p>
        Dimensions S.A.S. se reserva el derecho de modificar la presente
        Politica de Tratamiento de Datos Personales en cualquier momento. Las
        modificaciones seran publicadas en la plataforma y notificadas a los
        usuarios a traves de los medios disponibles. El uso continuado de la
        plataforma despues de la publicacion de las modificaciones constituye la
        aceptacion de las mismas.
      </p>

      <h2 className="mt-8 text-xl font-semibold text-gray-900">
        10. Legislacion Aplicable
      </h2>
      <p>
        La presente politica se rige por la legislacion colombiana, en particular
        por la Ley 1581 de 2012, el Decreto 1377 de 2013, y demas normas que las
        modifiquen, complementen o sustituyan.
      </p>

      <div className="mt-10 border-t pt-6 text-sm text-gray-500">
        <p>
          Para cualquier consulta o solicitud relacionada con esta politica,
          comuniquese con nosotros a traves de{" "}
          <a href="mailto:info@cohabit.com.co" className="text-amber-600 hover:underline">
            info@cohabit.com.co
          </a>
        </p>
        <p className="mt-4">
          <Link href="/terminos" className="text-amber-600 hover:underline">
            Ver Terminos y Condiciones
          </Link>
        </p>
      </div>
    </article>
  );
}
