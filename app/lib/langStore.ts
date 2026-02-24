"use client";

import { create } from "zustand";

export type Lang = "eng" | "esp" | "ru";

const STORAGE_KEY = "inftour_lang";

type TranslationMap = Record<string, { eng: string; esp: string; ru: string }>;

const translations: TranslationMap = {
  // Nav & brand
  calpeCollection: {
    eng: "Calpe Collection",
    esp: "Calpe Collection",
    ru: "Коллекция Кальпе",
  },
  reservaDirecta: { eng: "Direct booking", esp: "Reserva directa", ru: "Прямое бронирование" },
  experiencias: { eng: "Experiences", esp: "Experiencias", ru: "Впечатления" },
  services: { eng: "Services", esp: "Servicios", ru: "Услуги" },
  revista: { eng: "Magazine", esp: "Revista", ru: "Журнал" },
  lobby: { eng: "Lobby", esp: "Lobby", ru: "Лобби" },
  aiAgent: { eng: "AI Agent", esp: "Agente IA", ru: "ИИ-агент" },
  openAIChat: { eng: "Open AI Agent chat", esp: "Abrir chat del agente IA", ru: "Открыть чат ИИ-агента" },

  // Footer
  footerTagline: {
    eng: "Exclusive apartment rentals in Calpe.",
    esp: "Alquiler exclusivo de apartamentos en Calpe.",
    ru: "Эксклюзивная аренда апартаментов в Кальпе.",
  },
  footerLicense: {
    eng: "Tour operator license: EGVT-XXX-A.",
    esp: "Licencia de agencia: EGVT-XXX-A.",
    ru: "Лицензия туристического оператора: EGVT-XXX-A.",
  },
  navigation: { eng: "Navigation", esp: "Navegación", ru: "Навигация" },
  contact: { eng: "Contact", esp: "Contacto", ru: "Связь" },
  allRightsReserved: {
    eng: "© 2026 INFTOUR. All rights reserved.",
    esp: "© 2026 INFTOUR. Todos los derechos reservados.",
    ru: "© 2026 INFTOUR. Все права защищены.",
  },
  privacyPolicy: { eng: "Privacy Policy", esp: "Política de privacidad", ru: "Политика конфиденциальности" },
  termsOfService: { eng: "Terms of Service", esp: "Términos de uso", ru: "Условия использования" },

  // TopBar
  sea: { eng: "Sea", esp: "Mar", ru: "Море" },
  seaTempTitle: { eng: "Sea temperature in Calpe", esp: "Temperatura del mar en Calpe", ru: "Температура моря в Кальпе" },
  calpeLiveWebcam: { eng: "Calpe Live Webcam", esp: "Webcam en vivo Calpe", ru: "Веб-камера Кальпе" },
  openInNewTab: { eng: "Open in new tab", esp: "Abrir en nueva pestaña", ru: "Открыть в новой вкладке" },
  close: { eng: "Close", esp: "Cerrar", ru: "Закрыть" },

  // Nav mobile menu
  openMenu: { eng: "Open menu", esp: "Abrir menú", ru: "Открыть меню" },
  closeMenu: { eng: "Close menu", esp: "Cerrar menú", ru: "Закрыть меню" },

  // AI Agent chat
  closeChat: { eng: "Close chat", esp: "Cerrar chat", ru: "Закрыть чат" },
  aiAgentWelcome: {
    eng: "Hello, I'm the INFTOUR assistant. How can I help you today? Ask me about bookings, experiences in Calpe or anything else.",
    esp: "Hola, soy el asistente de INFTOUR. ¿En qué puedo ayudarte hoy? Puedes preguntarme sobre reservas, experiencias en Calpe o cualquier otro tema.",
    ru: "Здравствуйте, я помощник INFTOUR. Чем могу помочь? Спрашивайте о бронировании, впечатлениях в Кальпе или о чём угодно.",
  },
  aiAgentReply: {
    eng: "Thank you for your message. An agent will reply shortly.",
    esp: "Gracias por tu mensaje. Un agente te responderá en breve.",
    ru: "Спасибо за сообщение. Агент ответит вам в ближайшее время.",
  },
  writeMessage: {
    eng: "Type your message...",
    esp: "Escribe tu mensaje...",
    ru: "Введите сообщение...",
  },
  send: { eng: "Send", esp: "Enviar", ru: "Отправить" },

  // Home
  loadingCalendar: {
    eng: "Loading calendar...",
    esp: "Cargando calendario...",
    ru: "Загрузка календаря...",
  },
  bookingCalendar: { eng: "Booking calendar", esp: "Calendario de reservas", ru: "Календарь бронирования" },

  // Pages – Experiencias (Ecosystem)
  experienciasTitle: { eng: "Experiences", esp: "Experiencias", ru: "Впечатления" },
  experienciasContent: {
    eng: "Experiences content.",
    esp: "Contenido de Experiencias.",
    ru: "Содержание раздела «Впечатления».",
  },
  expHeroTitle: {
    eng: "Ecosystem of rest",
    esp: "Ecosistema de descanso",
    ru: "Экосистема отдыха",
  },
  expHeroDesc: {
    eng: "We created a guide that will replace a tour bureau for you.",
    esp: "Hemos creado una guía que te sustituirá la oficina de excursions.",
    ru: "Мы создали гид, который заменит вам экскурсионное бюро.",
  },
  expAIGuide: { eng: "AI guide", esp: "Guía IA", ru: "АИ гид" },
  expAIGuideDesc: {
    eng: "Clear list of what our AI assistant can do: bookings, availability, recommendations for restaurants and activities, tips for Ifach and Salinas, events calendar, and more. Open the chat from the menu.",
    esp: "Lista clara de lo que hace nuestro asistente IA: reservas, disponibilidad, recomendaciones de restaurantes y actividades, consejos para el Ifach y Salinas, calendario de eventos y más. Abre el chat desde el menú.",
    ru: "Чёткий список возможностей ИИ-гида: бронирование, наличие мест, рекомендации ресторанов и активностей, советы по Ифачу и Салинас, календарь событий и другое. Откройте чат в меню.",
  },
  expGastronomy: { eng: "Tastes – Gastronomy", esp: "Sabores – Gastronomía", ru: "Вкусы – Гастрономия" },
  expGastronomyDesc: {
    eng: "Guide to restaurants, markets, fish market, and recommended local recipes.",
    esp: "Guía de restaurantes, mercados, lonja, y recetas locales recomendadas.",
    ru: "Гид по ресторанам, рынкам, рыбной бирже и рекомендуемым местным рецептам.",
  },
  expRestaurants: { eng: "Restaurants", esp: "Restaurantes", ru: "Рестораны" },
  expMarkets: { eng: "Markets, fish market, grocery stores", esp: "Mercados, lonja, tiendas de alimentación", ru: "Рынки, рыбные биржи, продуктовые магазины" },
  expRecipes: { eng: "Local recipes", esp: "Recetas locales", ru: "Местные рецепты блюд" },
  expNature: { eng: "Nature", esp: "Naturaleza", ru: "Природа" },
  expNatureDesc: {
    eng: "Trails in nature reserves: tips for climbing Ifach, routes along Salinas, seaside walks.",
    esp: "Rutas por reservas naturales: consejos para subir al Ifach, rutas por Salinas, paseos junto al mar.",
    ru: "Тропы по природным заповедникам: советы по восхождению на Ифач, маршруты вдоль Салинас, прогулки вдоль моря.",
  },
  expIfach: { eng: "Climbing Ifach", esp: "Subida al Ifach", ru: "Восхождение на Ифач" },
  expSalinas: { eng: "Hiking along Salinas", esp: "Rutas por Salinas", ru: "Пешие маршруты вдоль Салинас" },
  expSeaside: { eng: "Seaside walks", esp: "Paseos junto al mar", ru: "Прогулки вдоль моря" },
  expFamily: { eng: "Family", esp: "Familia", ru: "Семья" },
  expFamilyDesc: {
    eng: "Leisure with family and friends.",
    esp: "Ocio en familia y con amigos.",
    ru: "Досуг с семьей и друзьями.",
  },
  expBBQ: { eng: "BBQ, Virtual arena & playgrounds", esp: "Barbacoas, arena virtual y parques", ru: "BBQ, Virtualnaya arena и детские площадки" },
  expFeria: { eng: "Feria", esp: "Feria", ru: "Feria" },
  expCityGuide: { eng: "Electronic city guide", esp: "Guía electrónica de la ciudad", ru: "Электронный гид по городу" },
  expEventsCalendar: { eng: "Events calendar", esp: "Calendario de eventos", ru: "Календарь событий" },
  expRelax: { eng: "Relax", esp: "Relax", ru: "Релакс" },
  expRelaxDesc: {
    eng: "Beaches and SPA.",
    esp: "Playas y SPA.",
    ru: "Пляжи и СПА.",
  },
  expSport: { eng: "Lifestyle – Sport", esp: "Estilo de vida – Deporte", ru: "Образ жизни – Спорт" },
  expSportDesc: {
    eng: "Cycling, sports facilities, equipment rental, and events calendar.",
    esp: "Ciclismo, instalaciones deportivas, alquiler de material y calendario de eventos.",
    ru: "Вело прогулки, спортивные сооружения, прокат инвентаря и календарь мероприятий.",
  },
  expCycling: { eng: "Cycling", esp: "Ciclismo", ru: "Вело прогулки" },
  expSportsFacilities: { eng: "Sports facilities in Calpe", esp: "Instalaciones deportivas en Calpe", ru: "Спортивные сооружения Кальпе" },
  expEquipmentRental: { eng: "Sports equipment rental", esp: "Alquiler de material deportivo", ru: "Прокат спортивного инвентаря" },
  expSportsEvents: { eng: "Sports events & calendar", esp: "Eventos deportivos y calendario", ru: "Спортивные мероприятия, календарь" },

  // Revista (Magazine)
  revistaTitle: { eng: "Rental properties magazine", esp: "Revista de alquileres", ru: "Журнал об аренде" },
  revistaTagline: {
    eng: "Discover our selection of apartments and villas in Calpe.",
    esp: "Descubre nuestra selección de apartamentos y villas en Calpe.",
    ru: "Подборка апартаментов и вилл в Кальпе.",
  },
  revistaPlaceholderIntro: {
    eng: "Your next magazine issue will appear here. Upload a PDF to public/magazine/ and set MAGAZINE_PDF_PATH in app/config/magazine.ts to display it.",
    esp: "Tu próxima revista aparecerá aquí. Sube un PDF a public/magazine/ y configura MAGAZINE_PDF_PATH en app/config/magazine.ts.",
    ru: "Здесь будет отображаться журнал. Положите PDF в public/magazine/ и укажите MAGAZINE_PDF_PATH в app/config/magazine.ts.",
  },
  revistaDownload: { eng: "Download magazine", esp: "Descargar revista", ru: "Скачать журнал" },
  revistaSpread1Title: {
    eng: "Apartments with sea views",
    esp: "Apartamentos con vistas al mar",
    ru: "Апартаменты с видом на море",
  },
  revistaSpread1Text: {
    eng: "Hand-picked flats and penthouses in Calpe with direct views of the Mediterranean and the Peñón de Ifach. Modern amenities and easy access to the beach.",
    esp: "Pisos y áticos seleccionados en Calpe con vistas al Mediterráneo y al Peñón de Ifach. Todas las comodidades y cerca de la playa.",
    ru: "Подобранные апартаменты и пентхаусы в Кальпе с видом на Средиземное море и Пеньон-де-Ифач. Современные удобства и близко к пляжу.",
  },
  revistaSpread2Title: {
    eng: "Pools & outdoor living",
    esp: "Piscinas y vida al aire libre",
    ru: "Бассейны и отдых на открытом воздухе",
  },
  revistaSpread2Text: {
    eng: "Properties with private or communal pools, terraces and gardens. Enjoy the Costa Blanca lifestyle from your own space.",
    esp: "Propiedades con piscina privada o comunitaria, terrazas y jardines. Disfruta del estilo de vida de la Costa Blanca desde tu espacio.",
    ru: "Объекты с частным или общим бассейном, террасами и садами. Наслаждайтесь жизнью на Коста-Бланке у себя.",
  },
  revistaSpread3Title: {
    eng: "Villas for families & groups",
    esp: "Villas para familias y grupos",
    ru: "Виллы для семей и компаний",
  },
  revistaSpread3Text: {
    eng: "Spacious villas with multiple bedrooms, kitchens and outdoor areas. Ideal for longer stays and family holidays in Calpe.",
    esp: "Villas amplias con varios dormitorios, cocinas y zonas exteriores. Ideales para estancias largas y vacaciones en familia en Calpe.",
    ru: "Просторные виллы с несколькими спальнями, кухнями и зонами на улице. Идеально для длительного отдыха и семейного отпуска в Кальпе.",
  },

  // Services
  servicesTitle: { eng: "Services", esp: "Servicios", ru: "Услуги" },
  servicesIntro: {
    eng: "What we offer for your stay in Calpe.",
    esp: "Qué ofrecemos para tu estancia en Calpe.",
    ru: "Что мы предлагаем для вашего отдыха в Кальпе.",
  },
  service1Title: {
    eng: "Exclusive apartment rentals",
    esp: "Alquiler exclusivo de apartamentos",
    ru: "Эксклюзивная аренда апартаментов",
  },
  service1Desc: {
    eng: "Hand-picked apartments with sea views and hotel-level amenities. Each property is inspected and maintained to the highest standards, so you enjoy the privacy of a home with the comfort of a boutique stay.",
    esp: "Apartamentos seleccionados con vistas al mar y comodidades de nivel hotelero. Cada propiedad está inspeccionada y mantenida con los más altos estándares, para que disfrutes de la privacidad de un hogar con el confort de una estancia boutique.",
    ru: "Тщательно подобранные апартаменты с видом на море и уровнем комфорта отеля. Каждый объект проверен и содержится в идеальном состоянии — уединённость дома и комфорт бутик-отеля.",
  },
  service2Title: {
    eng: "Concierge & experiences",
    esp: "Concierge y experiencias",
    ru: "Консьерж и впечатления",
  },
  service2Desc: {
    eng: "From boat trips and wine tastings to guided hikes up the Peñón de Ifach—we organise activities tailored to you. Our team knows Calpe inside out and can suggest the best restaurants, beaches and hidden spots.",
    esp: "Desde paseos en barco y catas de vino hasta rutas guiadas por el Peñón de Ifach: organizamos actividades a tu medida. Nuestro equipo conoce Calpe al dedillo y puede recomendarte los mejores restaurantes, playas y rincones.",
    ru: "Морские прогулки, дегустации вин, экскурсии на Пеньон-де-Ифач — организуем активности под вас. Наша команда знает Кальпе как никто и подскажет лучшие рестораны, пляжи и укромные места.",
  },
  service3Title: {
    eng: "Support whenever you need it",
    esp: "Soporte cuando lo necesites",
    ru: "Поддержка в любое время",
  },
  service3Desc: {
    eng: "Clear check-in instructions, 24/7 contact for emergencies, and a dedicated point of contact for your stay. Book with confidence knowing we're here to make your trip smooth from arrival to departure.",
    esp: "Instrucciones claras de entrada, contacto 24/7 para emergencias y un interlocutor dedicado durante tu estancia. Reserva con confianza sabiendo que estamos aquí para que tu viaje sea perfecto de principio a fin.",
    ru: "Понятные инструкции по заезду, контакт 24/7 в случае срочных вопросов и персональный менеджер на время отдыха. Бронируйте с уверенностью — мы рядом от прилёта до отъезда.",
  },
  servicesPracticalTitle: {
    eng: "Practical information",
    esp: "Información práctica",
    ru: "Полезная информация",
  },
  servicesPracticalIntro: {
    eng: "Useful contacts and services in Calpe.",
    esp: "Contactos y servicios útiles en Calpe.",
    ru: "Полезные контакты и услуги в Кальпе.",
  },
  practicalPolice: { eng: "Police & emergency", esp: "Policía y emergencias", ru: "Полиция и экстренные службы" },
  practicalPoliceDetail: {
    eng: "Local police (Policía Local): 965 83 00 00. Guardia Civil: 965 83 02 00. Emergency (all): 112.",
    esp: "Policía Local: 965 83 00 00. Guardia Civil: 965 83 02 00. Emergencias: 112.",
    ru: "Полиция (Policía Local): 965 83 00 00. Гражданская гвардия: 965 83 02 00. Экстренная служба: 112.",
  },
  practicalMedical: { eng: "Medical & pharmacies", esp: "Médico y farmacias", ru: "Медицина и аптеки" },
  practicalMedicalDetail: {
    eng: "Health centre (Centro de Salud): 965 83 02 50. 24h pharmacy rotation; check farmaciasdeguardia.com. Emergency: 112.",
    esp: "Centro de Salud: 965 83 02 50. Farmacias de guardia 24h; consulta farmaciasdeguardia.com. Emergencias: 112.",
    ru: "Медцентр (Centro de Salud): 965 83 02 50. Дежурные аптеки 24ч: farmaciasdeguardia.com. Экстренная служба: 112.",
  },
  practicalTransfers: { eng: "Airport transfers", esp: "Traslados al aeropuerto", ru: "Трансфер в аэропорт" },
  practicalTransfersDetail: {
    eng: "Private and shared transfers to/from Alicante and Valencia airports. We can arrange pickup and drop-off for your stay.",
    esp: "Traslados privados y compartidos a/desde aeropuertos de Alicante y Valencia. Podemos gestionar recogida y regreso.",
    ru: "Индивидуальные и групповые трансферы в аэропорты Аликанте и Валенсии. Можем организовать встречу и проводы.",
  },
  practicalCarRental: { eng: "Car rental", esp: "Alquiler de coches", ru: "Аренда авто" },
  practicalCarRentalDetail: {
    eng: "Several agencies in Calpe and at Alicante airport. We recommend booking in advance in high season.",
    esp: "Varias agencias en Calpe y en el aeropuerto de Alicante. Recomendamos reservar con antelación en temporada alta.",
    ru: "Агентства в Кальпе и в аэропорту Аликанте. В высокий сезон лучше бронировать заранее.",
  },
  practicalSupermarket: { eng: "Supermarket delivery", esp: "Supermercado a domicilio", ru: "Доставка продуктов" },
  practicalSupermarketDetail: {
    eng: "Supermarkets that deliver to your door: Consum, Mercadona, Carrefour and others offer online orders with delivery to Calpe.",
    esp: "Supermercados con entrega a domicilio: Consum, Mercadona, Carrefour y otros ofrecen pedidos online con entrega en Calpe.",
    ru: "Доставка на дом: Consum, Mercadona, Carrefour и другие доставляют заказы в Кальпе.",
  },
  practicalBikeRental: { eng: "Bike rental", esp: "Alquiler de bicis", ru: "Аренда велосипедов" },
  practicalBikeRentalDetail: {
    eng: "Bike and e-bike rental in Calpe for exploring the coast and Peñón area. Ask us for recommended providers.",
    esp: "Alquiler de bicis y e-bikes en Calpe para explorar la costa y el Peñón. Pregúntanos por proveedores recomendados.",
    ru: "Аренда велосипедов и электросамокатов в Кальпе для поездок по побережью и к Пеньону. Подскажем проверенных прокатчиков.",
  },
  servicesActivitiesTitle: {
    eng: "Activities",
    esp: "Actividades",
    ru: "Активности",
  },
  servicesActivitiesIntro: {
    eng: "Ideas for your stay: hiking, sea, culture and more.",
    esp: "Ideas para tu estancia: senderismo, mar, cultura y más.",
    ru: "Идеи для отдыха: пешие походы, море, культура и не только.",
  },
  activityHiking: { eng: "Hiking", esp: "Senderismo", ru: "Пешие походы" },
  activityHikingDesc: {
    eng: "Peñón de Ifach natural park, coastal paths and marked routes. Stunning views and varied difficulty levels.",
    esp: "Parque natural del Peñón de Ifach, sendas costeras y rutas señalizadas. Vistas increíbles y distintos niveles de dificultad.",
    ru: "Природный парк Пеньон-де-Ифач, прибрежные тропы и маркированные маршруты. Красивейшие виды и разная сложность.",
  },
  activityBoating: { eng: "Boating & sea", esp: "Barca y mar", ru: "Морские прогулки" },
  activityBoatingDesc: {
    eng: "Boat trips, kayak, paddle and sailing. Explore the coast and coves from the water.",
    esp: "Paseos en barco, kayak, paddle y vela. Explora la costa y las calas desde el mar.",
    ru: "Прогулки на катере, каякинг, SUP и парус. Исследуйте побережье и бухты с воды.",
  },
  activityDiving: { eng: "Diving & snorkelling", esp: "Buceo y snorkel", ru: "Дайвинг и снорклинг" },
  activityDivingDesc: {
    eng: "Diving schools and snorkelling spots along the coast. Clear waters and marine life.",
    esp: "Escuelas de buceo y zonas de snorkel en la costa. Aguas transparentes y vida marina.",
    ru: "Дайв-школы и места для снорклинга. Прозрачная вода и подводный мир.",
  },
  activityCycling: { eng: "Cycling", esp: "Ciclismo", ru: "Велоспорт" },
  activityCyclingDesc: {
    eng: "Road and mountain biking. Calpe is a popular base for cyclists; routes for all levels.",
    esp: "Ciclismo en carretera y montaña. Calpe es base ideal para ciclistas; rutas para todos los niveles.",
    ru: "Шоссе и маунтинбайк. Кальпе — популярная база для велосипедистов; маршруты на любой уровень.",
  },
  activityWine: { eng: "Wine & gastronomy", esp: "Vino y gastronomía", ru: "Вина и гастрономия" },
  activityWineDesc: {
    eng: "Wine tastings, local bodegas and restaurants. Costa Blanca wines and Mediterranean cuisine.",
    esp: "Catas de vino, bodegas y restaurantes de la zona. Vinos de la Costa Blanca y cocina mediterránea.",
    ru: "Дегустации вин, местные бодеги и рестораны. Вина Коста-Бланки и средиземноморская кухня.",
  },
  activityBeach: { eng: "Beaches & family", esp: "Playas y familia", ru: "Пляжи и семья" },
  activityBeachDesc: {
    eng: "Sandy and rocky beaches, promenades and family-friendly activities. Calpe has something for everyone.",
    esp: "Playas de arena y roca, paseos marítimos y actividades familiares. Calpe tiene algo para todos.",
    ru: "Песчаные и скалистые пляжи, набережные и семейный отдых. В Кальпе есть всё для каждого.",
  },

  // Lobby
  lobbyTitle: { eng: "Lobby", esp: "Lobby", ru: "Лобби" },
  sectionRealEstate: {
    eng: "About us",
    esp: "Sobre nosotros",
    ru: "О компании",
  },
  sectionRealEstateContent: {
    eng: "INFTOUR is a licensed tour operator offering exclusive apartment rentals in Calpe. We provide a hotel-level service with the privacy of your own home, in one of the most iconic locations on the Costa Blanca—at the foot of the Peñón de Ifach.",
    esp: "INFTOUR es un tour operador con licencia que ofrece alquiler exclusivo de apartamentos en Calpe. Servicio de nivel hotelero con la privacidad de tu hogar, en uno de los enclaves más emblemáticos de la Costa Blanca, a los pies del Peñón de Ifach.",
    ru: "INFTOUR — лицензированный туроператор, эксклюзивная аренда апартаментов в Кальпе. Сервис уровня отеля и уединённость собственного дома у подножия Пеньон-де-Ифач на Коста-Бланке.",
  },
  sectionAIChat: {
    eng: "What the AI assistant can do",
    esp: "Qué puede hacer el asistente IA",
    ru: "Возможности ИИ-ассистента",
  },
  sectionAIChatContent: {
    eng: "Our AI assistant can help you with: booking enquiries and availability, information about experiences and activities in Calpe, recommendations for restaurants and sights, and general questions about your stay. Open the chat from the menu to get started.",
    esp: "Nuestro asistente IA puede ayudarte con: consultas de reserva y disponibilidad, información sobre experiencias y actividades en Calpe, recomendaciones de restaurantes y lugares de interés, y preguntas generales sobre tu estancia. Abre el chat desde el menú para empezar.",
    ru: "ИИ-ассистент подскажет: по бронированию и наличию, по впечатлениям и активностям в Кальпе, по ресторанам и достопримечательностям, по общим вопросам отдыха. Откройте чат в меню, чтобы начать.",
  },
  sectionContact: {
    eng: "Contact us",
    esp: "Contáctanos",
    ru: "Написать нам",
  },
  formEmailLabel: { eng: "Your email", esp: "Tu email", ru: "Ваш email" },
  formMessageLabel: { eng: "Message", esp: "Mensaje", ru: "Сообщение" },
  formSubmit: { eng: "Send", esp: "Enviar", ru: "Отправить" },
  formSuccess: {
    eng: "Thank you. We will reply soon.",
    esp: "Gracias. Te responderemos pronto.",
    ru: "Спасибо. Мы ответим в ближайшее время.",
  },
  formError: {
    eng: "Something went wrong. Please try again.",
    esp: "Algo salió mal. Inténtalo de nuevo.",
    ru: "Произошла ошибка. Попробуйте ещё раз.",
  },
  sectionPolicies: {
    eng: "Policies & legal",
    esp: "Políticas y legal",
    ru: "Политики и условия",
  },
  cancellationPolicy: {
    eng: "Cancellation policy",
    esp: "Política de cancelación",
    ru: "Политика отмены",
  },
  paymentPolicy: {
    eng: "Payment",
    esp: "Pago",
    ru: "Оплата",
  },
  termsPolicy: {
    eng: "Terms & conditions",
    esp: "Términos y condiciones",
    ru: "Условия",
  },
  sectionFaq: { eng: "FAQ", esp: "Preguntas frecuentes", ru: "Частые вопросы" },
  faq1Q: {
    eng: "What is the check-in time?",
    esp: "¿Cuál es la hora de entrada?",
    ru: "Во сколько заезд?",
  },
  faq1A: {
    eng: "Check-in is from 16:00. Check-out is by 11:00.",
    esp: "La entrada es desde las 16:00. La salida es hasta las 11:00.",
    ru: "Заезд с 16:00, выезд до 11:00.",
  },
  faq2Q: {
    eng: "Is there parking?",
    esp: "¿Hay parking?",
    ru: "Есть ли парковка?",
  },
  faq2A: {
    eng: "Parking options depend on the property. Details are in your booking confirmation.",
    esp: "Las opciones de parking dependen de la propiedad. Los detalles están en tu confirmación de reserva.",
    ru: "Зависит от объекта. Подробности указаны в подтверждении брони.",
  },
  faq3Q: {
    eng: "How can I modify or cancel my booking?",
    esp: "¿Cómo puedo modificar o cancelar mi reserva?",
    ru: "Как изменить или отменить бронирование?",
  },
  faq3A: {
    eng: "Contact us by email or through the AI chat. We will assist you according to our cancellation policy.",
    esp: "Contáctanos por email o por el chat IA. Te ayudaremos según nuestra política de cancelación.",
    ru: "Напишите нам на email или в ИИ-чат. Мы поможем согласно политике отмены.",
  },
};

type LangStore = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: keyof typeof translations, params?: Record<string, string | number>) => string;
};

function persistLang(lang: Lang) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, lang);
  } catch (e) {
    console.warn("Failed to persist language:", e);
  }
}

export const useLangStore = create<LangStore>((set, get) => ({
  lang: "eng",

  setLang: (lang) => {
    set({ lang });
    persistLang(lang);
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang === "eng" ? "en" : lang === "esp" ? "es" : "ru";
    }
  },

  t: (key: string, params?: Record<string, string | number>) => {
    const { lang } = get();
    const entry = translations[key as keyof typeof translations];
    if (!entry) return key;
    let text = entry[lang] ?? entry.eng;
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
      });
    }
    return text;
  },
}));

export function restoreLastLanguage(): Lang {
  if (typeof window === "undefined") return "eng";
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved && (saved === "eng" || saved === "esp" || saved === "ru")) {
      useLangStore.setState({ lang: saved as Lang });
      if (typeof document !== "undefined") {
        document.documentElement.lang = saved === "eng" ? "en" : saved === "esp" ? "es" : "ru";
      }
      return saved as Lang;
    }
  } catch (e) {
    console.warn("Failed to restore language:", e);
  }
  return "eng";
}
