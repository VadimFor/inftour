import Link from "next/link";

export default function HomeSeoIntro() {
  return (
    <section className="sr-only">
      <div className="max-w-4xl mx-auto bg-white border border-gray-100 shadow-sm rounded-xl p-6 md:p-8">
        <h1 className="text-3xl md:text-5xl font-serif text-gray-900 leading-tight">
          Apartamentos premium en Calpe con reserva directa
        </h1>
        <p className="mt-4 text-gray-600 leading-relaxed">
          INFTOUR ofrece apartamentos seleccionados en Calpe con servicio tipo hotel, soporte local y
          reserva directa. Disfruta vistas al Peñón de Ifach, ubicaciones clave y una estancia cuidada.
        </p>
        <p className="mt-3 text-gray-600 leading-relaxed">
          Antes de reservar, explora experiencias, servicios y la revista con guías útiles para planificar
          tu viaje.
        </p>
        <p className="mt-3 text-gray-600 leading-relaxed">
          Si buscas reservar apartamento en Calpe sin intermediarios, consulta disponibilidad en el motor
          oficial y accede a tarifas directas, condiciones claras y asistencia local antes y durante la
          estancia.
        </p>
        <nav aria-label="Accesos rápidos" className="mt-6 flex flex-wrap gap-3 text-sm">
          <Link href="/reserva-directa-v2" className="px-4 py-2 border border-gray-300 rounded-full hover:border-brand-gold hover:text-brand-gold transition">
            Reserva directa
          </Link>
          <Link href="/experiencias" className="px-4 py-2 border border-gray-300 rounded-full hover:border-brand-gold hover:text-brand-gold transition">
            Experiencias
          </Link>
          <Link href="/services" className="px-4 py-2 border border-gray-300 rounded-full hover:border-brand-gold hover:text-brand-gold transition">
            Servicios
          </Link>
          <Link href="/revista" className="px-4 py-2 border border-gray-300 rounded-full hover:border-brand-gold hover:text-brand-gold transition">
            Revista
          </Link>
          <Link href="/lobby" className="px-4 py-2 border border-gray-300 rounded-full hover:border-brand-gold hover:text-brand-gold transition">
            Lobby
          </Link>
        </nav>
      </div>
    </section>
  );
}
