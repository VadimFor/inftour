"use client";

import { createPortal } from "react-dom";
import { useLangStore } from "../../lib/langStore";

type CyclingModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const introParagraphs = [
  "Calpe no se limita a recibir ciclistas; Calpe dicta la moda de todo el ciclismo mundial. De noviembre a mayo, esta ciudad se transforma en un epicentro global, el cuartel general de invierno para equipos del nivel del Visma-Lease a Bike, INEOS Grenadiers y Soudal Quick-Step. Mientras el resto de Europa se hunde en la nieve, por el asfalto impecable de la Costa Blanca vuelan pelotones cuyo valor total se cuenta por decenas de millones de euros.",
  "Ser ciclista en Calpe significa pertenecer a un club mundial de élite. Aquí se encuentra un clima ideal (más de 300 días de sol al año), un asfalto de referencia, un relieve de máxima exigencia y un respeto hacia la persona sobre la bicicleta elevado a la categoría de culto. No es solo deporte; es un estilo de vida premium, impregnado de la estética de los cuadros de carbono, la aerodinámica y la superación de los propios límites.",
];

const quotes = [
  "\"Para mí, la Costa Blanca se ha convertido en mi segunda casa. Paso aquí todo el invierno, sentando las bases de la temporada. El relieve de Calpe y sus alrededores no perdona debilidades, pero son precisamente estas carreteras las que te hacen campeón\", — Remco Evenepoel (Soudal Quick-Step), campeón del mundo, doble campeón olímpico y ganador de La Vuelta a España.",
  "\"La capital de invierno indiscutible del ciclismo europeo. Ningún otro lugar del mundo ofrece semejante concentración de la élite del pelotón mundial por kilómetro cuadrado\", — Cycling Weekly.",
  "\"Calpe es un laboratorio al aire libre. El lugar donde se prueban las tecnologías y donde, en enero, se gana el Tour de Francia de julio\", — Rouleur Magazine.",
];

const routes = [
  "1. Coll de Rates: El punto de referencia mundial. No es solo una montaña, es el principal laboratorio de pruebas de Europa. Es aquí donde los profesionales miden sus vatios antes de la temporada. Una ascensión clásica de 6,5 km con una pendiente media del 5%. La carretera serpentea perfectamente a través de bosques de pinos, elevándose sobre el valle de Tárbena. En la cima le espera no solo una panorámica que quita el aliento, sino también un restaurante de culto donde, tomando un espresso, puede cruzarse con los actuales ganadores de las Grandes Vueltas.",
  "2. Cumbre del Sol: La arena de gladiadores de La Vuelta. Una ruta que hace sufrir incluso a la élite. Esta subida brutal y explosiva ha sido en múltiples ocasiones una etapa decisiva de la Vuelta a España. Las rampas aquí alcanzan un aterrador 22%. Es un desafío al límite de la resistencia muscular. Cada golpe de pedal se da luchando, pero las vistas del infinito mar Mediterráneo desde la cima valen cada gota de sudor derramada.",
  "3. Puerto de Tudons & Sierra de Aitana: La etapa reina de montaña. Para los que están listos para maratones épicos. Es una incursión en la alta montaña, donde los puertos superan la cota de los 1000 metros sobre el nivel del mar. Una ruta larga, agotadora, pero increíblemente pintoresca a través de auténticos pueblos de montaña. Aquí, el silencio solo se rompe por el sonido de los cambios de su transmisión electrónica y la respiración del viento.",
  "4. Vall de Pop (Valle de Jalón): El arte del Coffee Ride. El ciclismo es también la cultura del hedonismo estético. Para el recovery ride (salida de recuperación) son ideales las carreteras suaves del Vall de Pop, que discurren entre infinitos viñedos y almendros. El punto final son los cafés ciclistas de culto en Parcent o Alcalalí (como el famoso Musette Cafe). Dejar la bicicleta en el aparcamiento especial, sentarse en una terraza bañada por el sol rodeado de apasionados de todo el mundo y tomarse un cortado perfecto con un trozo de tarta de zanahoria artesanal; es un ritual por el que vale la pena vivir.",
  "5. El Castell de Guadalest: El corazón esmeralda de las montañas. Una ruta de una belleza cinematográfica increíble. Le espera una subida tendida, cómoda y técnica por una carretera serpenteante perfecta, que le llevará a uno de los embalses más hermosos de España, con aguas de un color turquesa penetrante. La ruta culmina en el castillo medieval de Guadalest, suspendido sobre un acantilado escarpado.",
  "6. Port de Bèrnia (Sierra de Bernia): El diamante oculto para los escaladores. Si busca aislamiento y rampas implacables, este es su lugar. Una carretera estrecha y sinuosa con tramos de hasta el 12-14% que se adentra en las montañas salvajes de Bernia. Aquí el tráfico de coches es prácticamente nulo; solo encontrará la belleza áspera de la roca desnuda y la sensación de fusión total con la naturaleza.",
  "7. Cap de la Nau (Cabo de la Nao): Brisa oceánica y faros. Una dinámica ruta costera de perfil ondulado (rolling hills) en dirección a Jávea. La carretera serpentea entre lujosas villas y pinos mediterráneos, acariciada por la brisa fresca, y termina en el borde de la tierra: en el faro inmaculado sobre acantilados escarpados con vistas a la isla de Ibiza.",
];

const calendarItems = [
  "Diciembre – Febrero: Campamentos de invierno (Training Camps). Los hoteles se llenan de camiones con los logotipos de Ineos y Visma. Las calles se convierten en una exhibición de tecnología ciclista de vanguardia.",
  "Finales de enero – principios de febrero: Vuelta a la Comunitat Valenciana. Una de las carreras por etapas más prestigiosas del circuito mundial. Puede quedarse en la cuneta y ver cómo el pelotón mundial pasa volando a su lado a 60 km/h.",
  "Finales de enero: Costa Blanca Bike Race. Un evento de culto para los amantes del mountain bike (MTB) que reúne a miles de participantes.",
  "Primavera (Marzo – Mayo): Temporada de Gran Fondo. Maratones amateurs y carreras locales como la Volta a la Marina, donde los aficionados pueden poner a prueba su fuerza en condiciones de competición real.",
  "Agosto – Septiembre: La Vuelta a España. La principal Gran Vuelta del país incluye regularmente las montañas más duras de la Costa Blanca en su recorrido, convirtiendo a la región en una fiesta del deporte mundial.",
];

const baseCampParagraphs = [
  "Cualquier rider serio conoce el mayor dolor de cabeza de unas vacaciones deportivas: volver exhausto después de un entrenamiento de 120 kilómetros, repiquetear con las calas sobre el resbaladizo mármol del hotel e intentar encajar una bicicleta sucia de 10.000 euros en un ascensor estrecho, soportando las miradas de desaprobación del personal.",
  "En INFTOUR comprendemos la filosofía de este deporte y hemos resuelto este problema. En la web www.inftour.com encontrará propiedades para cualquier presupuesto y necesidad de los grupos ciclistas: desde cómodos apartamentos para grupos de aficionados hasta lujosas villas aisladas donde pueden alojarse equipos profesionales con sus propios masajistas y mecánicos.",
  "Nuestra propuesta exclusiva para los deportistas son los apartamentos President 1, President 2 y President 3. Su exclusividad reside en su acceso directo a la calle. Sin portales compartidos, escaleras, vestíbulos ni ascensores. Simplemente llega hasta su puerta, desengancha las calas de los pedales y mete la bicicleta directamente en su apartamento. Máxima privacidad, absoluta seguridad para su equipamiento, un espacio cómodo para el mantenimiento de su bici y un confort inigualable después de un duro día de entrenamiento.",
];

const routeNames = [
  "Coll de Rates",
  "Cumbre del Sol",
  "Puerto de Tudons",
  "Sierra de Aitana",
  "Vall de Pop",
  "El Castell de Guadalest",
  "Port de Bernia",
  "Cap de la Nau",
  "Calpe",
];

const routeNamesRegex = new RegExp(
  `(${routeNames
    .sort((a, b) => b.length - a.length)
    .map((name) => name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|")})`,
  "g",
);

function renderTextWithBoldRoutes(text: string) {
  const parts = text.split(routeNamesRegex);
  return parts.map((part, idx) =>
    routeNames.includes(part) ? <strong key={`${part}-${idx}`}>{part}</strong> : part,
  );
}

export default function CyclingModal({ isOpen, onClose }: CyclingModalProps) {
  const lang = useLangStore((s) => s.lang);
  const t = useLangStore((s) => s.t);

  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-9999 bg-black/70 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cycling-modal-title"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-4xl max-h-[92vh] rounded-sm shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative bg-brand-bg border-b border-gray-200 px-8 py-6">
          <div className="h-px w-12 bg-brand-gold mb-4" aria-hidden />
          <h3 id="cycling-modal-title" className="text-3xl font-serif text-gray-900 leading-tight">
            {lang === "esp" ? "El Vaticano del ciclismo: Rutas ciclistas legendarias de la Costa Blanca" : t("expCyclingModalTitle")}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-200 rounded-sm transition"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-8 py-6">
          <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
            {introParagraphs.map((p, idx) => (
              <p key={`intro-${idx}`} className={idx === 0 ? "border-l-2 border-brand-gold pl-4" : ""}>
                {renderTextWithBoldRoutes(p)}
              </p>
            ))}

            <div>
              <h4 className="text-brand-gold text-xs font-bold uppercase tracking-[0.2em] mb-3">
                Las voces de los campeones y la prensa mundial
              </h4>
              <p className="mb-3">Calpe no necesita publicidad. Hablan por ella quienes escriben la historia del deporte moderno:</p>
              <div className="grid grid-cols-1 gap-4">
                {quotes.map((q, idx) => (
                  <blockquote
                    key={`quote-${idx}`}
                    className="relative bg-brand-bg border border-gray-100 border-l-2 border-l-brand-gold rounded-sm px-5 py-4 text-gray-700 italic"
                  >
                    <span className="absolute -top-2 left-3 text-brand-gold text-xl leading-none">
                      &quot;
                    </span>
                    <p className="text-sm leading-relaxed">{renderTextWithBoldRoutes(q)}</p>
                  </blockquote>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-brand-gold text-xs font-bold uppercase tracking-[0.2em] mb-3">
                Arenas de gloria: Las rutas donde se forjan las victorias de las Grandes Vueltas
              </h4>
              <p className="mb-3">En Calpe no hay carreteras al azar. Cada puerto aquí es una leyenda, puesta a prueba por los mejores ciclistas del planeta.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {routes.map((route, idx) => (
                  <div
                    key={`route-${idx}`}
                    className="bg-brand-bg border border-gray-100 rounded-sm p-5 hover:border-brand-gold/40 transition-colors"
                  >
                    <p className="text-xs leading-relaxed">
                      {renderTextWithBoldRoutes(route)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-brand-gold text-xs font-bold uppercase tracking-[0.2em] mb-3">
                El calendario del ciclismo mundial en la Costa Blanca
              </h4>
              <p className="mb-3">Calpe respira ciclismo todo el año, pero esta región tiene el ritmo de su propio pulso:</p>
              <ul className="list-disc pl-5 space-y-2">
                {calendarItems.map((item, idx) => (
                  <li key={`cal-${idx}`}>{renderTextWithBoldRoutes(item)}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-brand-gold text-xs font-bold uppercase tracking-[0.2em] mb-3">
                El campo base ideal: Soluciones exclusivas de INFTOUR
              </h4>
              <div className="space-y-3">
                {baseCampParagraphs.map((p, idx) => (
                  <p key={`base-${idx}`}>{renderTextWithBoldRoutes(p)}</p>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 bg-brand-darkgray text-white rounded-sm px-6 py-5 flex gap-4 items-start">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5 shrink-0 text-brand-gold mt-0.5" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
            </svg>
            <p className="text-xs leading-relaxed text-gray-300">
              *Consejo de Inftour: Como suelen repetir los mecánicos de los equipos WorldTour y los campeones del mundo que preparan su temporada en Calpe: &quot;Deja tu ego ciclista en casa, en el llano&quot;. El principal error de los aficionados ambiciosos en la Costa Blanca es el orgullo al elegir el desarrollo. Las rampas locales en Cumbre del Sol o Sierra de Bernia (hasta el 22%) &quot;apagan&quot; las piernas incluso a los profesionales. El secreto para conquistar estas cimas es una cadencia alta. Monte obligatoriamente un casete trasero de al menos 30, o preferiblemente 32 dientes, incluso si en su país está acostumbrado a mover desarrollos pesados. Cuide sus rodillas. Nuestro asistente de IA simplemente le indicará las direcciones de los mejores mecánicos de Calpe si necesita ajustar su transmisión el mismo día de su llegada.
            </p>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
