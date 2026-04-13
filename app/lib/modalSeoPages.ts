export type ModalSeoPage = {
  slug: string;
  seoPath: string;
  title: string;
  description: string;
  parentPath: string;
  componentName: string;
  seoHeading: string;
  seoIntro: string;
  seoSections: {
    title: string;
    paragraphs?: string[];
    listItems?: string[];
  }[];
};

type ModalSeoPageBase = Omit<
  ModalSeoPage,
  "seoHeading" | "seoIntro" | "seoSections"
>;

const baseModalSeoPages: ModalSeoPageBase[] = [
  {
    slug: "footer-raicv",
    seoPath: "/legal/raicv",
    title: "RAICV information | INFTOUR",
    description: "Regulatory and RAICV details shown in the INFTOUR footer modal.",
    parentPath: "/",
    componentName: "FooterRaicvModal",
  },
  {
    slug: "reserva-gallery",
    seoPath: "/reserva-directa-v2/galeria",
    title: "Property gallery | INFTOUR",
    description: "Image gallery content displayed in the direct booking gallery modal.",
    parentPath: "/reserva-directa-v2",
    componentName: "GalleryModal",
  },
  {
    slug: "reserva-property-details",
    seoPath: "/reserva-directa-v2/detalles-propiedad",
    title: "Property details | INFTOUR",
    description: "Detailed property information shown in the direct booking property modal.",
    parentPath: "/reserva-directa-v2",
    componentName: "PropertyModal",
  },
  {
    slug: "experiencias-restaurants",
    seoPath: "/experiencias/restaurantes",
    title: "Experiencias: Restaurants | INFTOUR",
    description: "Restaurant recommendations content from the Experiencias restaurants modal.",
    parentPath: "/experiencias",
    componentName: "RestaurantsModal",
  },
  {
    slug: "experiencias-markets",
    seoPath: "/experiencias/mercados",
    title: "Experiencias: Markets | INFTOUR",
    description: "Local markets content from the Experiencias markets modal.",
    parentPath: "/experiencias",
    componentName: "MarketsModal",
  },
  {
    slug: "experiencias-recipes",
    seoPath: "/experiencias/recetas",
    title: "Experiencias: Recipes | INFTOUR",
    description: "Traditional recipes and gastronomy content from the Experiencias recipes modal.",
    parentPath: "/experiencias",
    componentName: "RecipesModal",
  },
  {
    slug: "experiencias-sport-renting",
    seoPath: "/experiencias/alquiler-deportivo",
    title: "Experiencias: Sport renting | INFTOUR",
    description: "Sport and renting activities from the Experiencias sport renting modal.",
    parentPath: "/experiencias",
    componentName: "SportRentingModal",
  },
  {
    slug: "experiencias-cycling",
    seoPath: "/experiencias/ciclismo",
    title: "Experiencias: Cycling | INFTOUR",
    description: "Cycling routes and recommendations from the Experiencias cycling modal.",
    parentPath: "/experiencias",
    componentName: "CyclingModal",
  },
  {
    slug: "experiencias-bbq-parks",
    seoPath: "/experiencias/parques-bbq",
    title: "Experiencias: BBQ parks | INFTOUR",
    description: "Family barbecue and park content from the Experiencias BBQ parks modal.",
    parentPath: "/experiencias",
    componentName: "BBQParksModal",
  },
  {
    slug: "experiencias-feria",
    seoPath: "/experiencias/feria",
    title: "Experiencias: Feria | INFTOUR",
    description: "Events and fair-related content from the Experiencias feria modal.",
    parentPath: "/experiencias",
    componentName: "FeriaModal",
  },
  {
    slug: "experiencias-calpe-grandeza",
    seoPath: "/experiencias/calpe-grandeza",
    title: "Experiencias: Calpe grandeza | INFTOUR",
    description: "Calpe heritage and family content from the Experiencias Calpe grandeza modal.",
    parentPath: "/experiencias",
    componentName: "CalpeGrandezaModal",
  },
  {
    slug: "experiencias-parques-atracciones",
    seoPath: "/experiencias/parques-atracciones",
    title: "Experiencias: Parques de atracciones | INFTOUR",
    description: "Theme parks and family attractions from the Experiencias attractions modal.",
    parentPath: "/experiencias",
    componentName: "ParquesAtraccionesModal",
  },
  {
    slug: "experiencias-ecosistema-deportivo",
    seoPath: "/experiencias/ecosistema-deportivo",
    title: "Experiencias: Ecosistema deportivo | INFTOUR",
    description: "Sports ecosystem content from the Experiencias sports ecosystem modal.",
    parentPath: "/experiencias",
    componentName: "EcosistemaDeportivoModal",
  },
  {
    slug: "experiencias-relax",
    seoPath: "/experiencias/relax",
    title: "Experiencias: Relax | INFTOUR",
    description: "Relaxation and wellness content from the Experiencias relax modal.",
    parentPath: "/experiencias",
    componentName: "RelaxModal",
  },
  {
    slug: "experiencias-ifach",
    seoPath: "/experiencias/ifach",
    title: "Experiencias: Ifach | INFTOUR",
    description: "Penon de Ifach nature content from the Experiencias Ifach modal.",
    parentPath: "/experiencias",
    componentName: "IfachModal",
  },
  {
    slug: "experiencias-horizontes-marinos",
    seoPath: "/experiencias/horizontes-marinos",
    title: "Experiencias: Horizontes marinos | INFTOUR",
    description: "Sea and coastal perspectives from the Experiencias Horizontes Marinos modal.",
    parentPath: "/experiencias",
    componentName: "HorizontesMarinosModal",
  },
  {
    slug: "experiencias-salinas",
    seoPath: "/experiencias/salinas",
    title: "Experiencias: Salinas | INFTOUR",
    description: "Salinas and natural landscape content from the Experiencias salinas modal.",
    parentPath: "/experiencias",
    componentName: "SalinasModal",
  },
  {
    slug: "services-reference-numbers",
    seoPath: "/services/reference-numbers",
    title: "Services: Reference numbers | INFTOUR",
    description: "Reference numbers and utility contacts shown in the services reference modal.",
    parentPath: "/services",
    componentName: "ReferenceNumbersModal",
  },
  {
    slug: "services-our-services",
    seoPath: "/services/our-services",
    title: "Services: Our services | INFTOUR",
    description: "Operational and guest support services content from the our services modal.",
    parentPath: "/services",
    componentName: "OurServicesModal",
  },
  {
    slug: "services-requests-comments",
    seoPath: "/services/requests-comments",
    title: "Services: Requests and comments | INFTOUR",
    description: "Requests and comments workflow content from the corresponding services modal.",
    parentPath: "/services",
    componentName: "RequestsCommentsModal",
  },
  {
    slug: "services-recipes-style",
    seoPath: "/services/recipes-style",
    title: "Services: Recipes style | INFTOUR",
    description: "Recipes-style service content from the service recipes style modal component.",
    parentPath: "/services",
    componentName: "ServiceRecipesStyleModal",
  },
  {
    slug: "lobby-about-us",
    seoPath: "/lobby/about-us",
    title: "Lobby: About us | INFTOUR",
    description: "About INFTOUR company history and profile shown in the lobby about us modal.",
    parentPath: "/lobby",
    componentName: "LobbyAboutModal",
  },
  {
    slug: "lobby-instructions",
    seoPath: "/lobby/instructions",
    title: "Lobby: Instructions | INFTOUR",
    description: "Guest instructions and what-to-do guidance shown in the lobby instructions modal.",
    parentPath: "/lobby",
    componentName: "LobbyInstructionsModal",
  },
  {
    slug: "lobby-privacy",
    seoPath: "/lobby/privacy-policy",
    title: "Lobby: Privacy policy | INFTOUR",
    description: "Privacy policy information shown in the lobby privacy modal.",
    parentPath: "/lobby",
    componentName: "PrivacyModal",
  },
  {
    slug: "lobby-arrival-stay",
    seoPath: "/lobby/arrival-and-stay",
    title: "Lobby: Arrival and stay | INFTOUR",
    description: "Arrival and stay instructions from the lobby arrival/stay modal.",
    parentPath: "/lobby",
    componentName: "ArrivalStayModal",
  },
  {
    slug: "lobby-faq",
    seoPath: "/lobby/faq",
    title: "Lobby: FAQ | INFTOUR",
    description: "Frequently asked questions content from the lobby FAQ modal.",
    parentPath: "/lobby",
    componentName: "FaqModal",
  },
  {
    slug: "lobby-reporting-channel",
    seoPath: "/lobby/reporting-channel",
    title: "Lobby: Reporting channel | INFTOUR",
    description: "Reporting channel policy and process from the lobby reporting modal.",
    parentPath: "/lobby",
    componentName: "ReportingChannelModal",
  },
  {
    slug: "revista-pdf-viewer",
    seoPath: "/revista/pdf-viewer",
    title: "Revista: PDF viewer | INFTOUR",
    description: "Magazine PDF viewing modal used in the INFTOUR revista section.",
    parentPath: "/revista",
    componentName: "PdfModal",
  },
];

export const modalSeoPages: ModalSeoPage[] = baseModalSeoPages.map(
  (modalPage) => ({
    ...modalPage,
    seoHeading: modalPage.title.replace(" | INFTOUR", ""),
    seoIntro: modalPage.description,
    seoSections: [
      {
        title: "What this modal covers",
        paragraphs: [modalPage.description],
      },
      {
        title: "Where this content appears",
        listItems: [
          `Parent section: ${modalPage.parentPath}`,
          `Component source: ${modalPage.componentName}`,
        ],
      },
    ],
  }),
);

export function getModalSeoPageBySlug(slug: string) {
  return modalSeoPages.find((modalPage) => modalPage.slug === slug);
}

export function getModalSeoPageByPath(seoPath: string) {
  return modalSeoPages.find((modalPage) => modalPage.seoPath === seoPath);
}

export function getModalSeoPagesByPrefix(prefix: string) {
  return modalSeoPages.filter((modalPage) => modalPage.seoPath.startsWith(prefix));
}
