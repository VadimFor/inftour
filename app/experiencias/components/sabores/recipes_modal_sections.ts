import type { Lang } from "../../../lib/langStore";

export type RecipesModalSection = {
  title: string;
  description: string;
  source: string[];
  ingredients: string[];
  notes: string[];
  steps: string[];
};

const SECTIONS_ENG: RecipesModalSection[] = [
  {
    title: "1. Paella Valenciana (The authentic Valencian paella)",
    description: "Forget the tourist paella with prawns and sausages. The true Valencian classic is a symphony of meat, tender vegetables, and rice infused with a golden broth. The main goal is the socarrat (the caramelized crust on the bottom).",
    source: [
      "Source: Official regulations of the DO Arroz de Valencia.",
    ],
    ingredients: [
      "The ritual (for 4 people): You will need: 400 g of Bomba round rice, 500 g of chopped chicken, 300 g of rabbit, 200 g of flat green beans (bajoqueta), 100 g of garrofón beans, 1 grated tomato, a pinch of saffron, a sprig of fresh rosemary",
    ],
    notes: [
    ],
    steps: [
      "The sofrito. In a wide paella pan, heat a generous layer of olive oil. Fry the pieces of meat over medium heat until they take on a deep golden and crispy color. This is the foundation of the flavor",
      "The vegetables. Move the meat to the edges and place the green beans and grated tomato in the center. Breathe in that sweet aroma of the sofrito; keep it on the heat for 3 to 4 minutes",
      "The magic of the broth. Pour in the water (it should come just up to the rivets of the paella pan handles). Add the sprig of rosemary and the saffron threads. Let this brew simmer for 20 minutes, filling the house with an intoxicating aroma. Add salt: the broth should be a little saltier than you are used to",
      "The rice and the silence. Remove the rosemary. Add the rice in the shape of a cross (caballón) and then carefully distribute it into an even layer with the skimmer. From this moment on, it is strictly forbidden to stir the dish!",
      "The birth of the socarrat. Cook for 18 minutes (first over high heat, then lower it). Listen carefully: when the water has almost evaporated, the rice will begin to crackle in a very distinctive and appetizing way; it is the crust that is toasting. Turn off the heat, cover the paella with a clean cloth, and let it “rest” for 5 minutes.",
    ],
  },
  {
    title: "2. Llauna de Calp",
    description: "The soul of our port. Imagine the most tender fillet of fresh fish, infused with the sweet juice of roasted tomatoes and a vibrant garlic oil.",
    source: [
      "Source: The work La cocina alicantina in the BIVALDI archive.",
    ],
    ingredients: [
      "The ritual: You will need: 600 g of firm-fleshed white fish (hake, monkfish, or sea bream in thick pieces), 3 potatoes, 2 ripe tomatoes, 3 garlic cloves, 1 teaspoon of sweet paprika, the best extra virgin olive oil",
    ],
    notes: [
    ],
    steps: [
      "The bed. Slice the potatoes and tomatoes into thin, elegant rounds. Arrange them overlapping in a baking dish: first the potato, then the tomatoes on top. Lightly salt",
      "The fish. On top of this bed of vegetables, place the juicy, thick pieces of fish",
      "The aromatic oil. Finely chop the garlic, mix it with the paprika, and sprinkle it generously over the fish. Now drizzle everything with a thick thread of olive oil so the ingredients shine in an appetizing way",
      "Baking. Place the dish in a preheated oven at 200°C for 25 minutes. The potato will become soft and buttery, and the fish will begin to fall apart into pearly flakes at the slightest touch of a fork.",
    ],
  },
  {
    title: "3. Arròs del Senyoret (The gentleman’s rice)",
    description: "The perfect choice if you wish to enjoy seafood without getting your fingers dirty. Here all the prawns and squid are already peeled: a pure and silky taste of the sea.",
    source: [
      "Source: Archives of the Biblioteca Virtual Miguel de Cervantes.",
    ],
    ingredients: [
      "The ritual: You will need: 300 g of Bomba rice, 300 g of peeled raw prawns, 200 g of squid rings, 1 liter of a powerful fish broth (you can buy a good ready-made broth at the supermarket), 1 tablespoon of tomato paste or homemade salmorreta",
    ],
    notes: [
    ],
    steps: [
      "Quick sofrito. Heat oil in the paella pan. Add the prawns for just 30 seconds, only so they take on some color, and remove them immediately to a plate (otherwise they will turn rubbery). Do the same with the squid",
      "The flavor. In that same aromatic oil, smelling of the sea, add the tomato paste. Fry it a little and add the rice. Stir with a wooden spoon so that each grain is coated and takes on a pearly shine",
      "Slow cooking. Pour in the hot, steaming fish broth. Add saffron. Cook gently for 15 to 18 minutes without stirring",
      "The grand finale. Two minutes before the end, when the broth has almost been absorbed, aesthetically arrange the reserved prawns and squid over the rice. Serve immediately, accompanying the table with a bowl of thick homemade alioli.",
    ],
  },
  {
    title: "4. Putxero de Polp (Octopus stew)",
    description: "The magic of slow cooking. The flesh of the octopus becomes so tender that it can be cut with a spoon, and the rich broth surrounds it with the sweetness of sweet potato.",
    source: [
      "Source: Archives of the Peix de Calp Fishermen’s Guild.",
    ],
    ingredients: [
      "The ritual: You will need: 1 medium octopus (buy it already frozen so it comes out more tender), 200 g of canned chickpeas (for speed), 2 sweet potatoes, 1 onion, a handful of toasted almonds",
    ],
    notes: [
    ],
    steps: [
      "The octopus. Without fully thawing it, immerse the octopus in boiling water. Add the whole onion and cook over low heat for 40–50 minutes, filling the house with a cozy aroma. Pierce a tentacle with a fork: it should be tender",
      "The consistency. Add the sweet potatoes in large, sweet pieces and the rinsed chickpeas to the broth. Boil for another 15 minutes",
      "The chef’s secret. Crush the almonds in a mortar (or blender) with a couple of spoonfuls of broth. Pour this paste into the pot 5 minutes before the end. The broth will instantly become creamy, velvety, and take on a subtle nutty profile.",
    ],
  },
  {
    title: "5. Fideuà de Gandia",
    description: "Here, the thin noodle is the protagonist. As it soaks up the hot broth, the pasta absorbs all the essence of the seafood and, at the end, curls upward in a playful way, creating a crispy crust.",
    source: [
      "Source: The canonical recipe of the Asociación Fideuà de Gandia.",
    ],
    ingredients: [
      "The ritual: You will need: 300 g of special fideuà noodles (No. 3 or No. 4), 4–6 whole langoustines or large king prawns, 200 g of white fish fillet, 1 liter of fish broth, saffron threads",
    ],
    notes: [
    ],
    steps: [
      "Flavoring the oil. In a paella pan or wide frying pan, fry the langoustines until they take on a bright orange color (they will leave all their flavor in the oil). Set them aside",
      "Toasting the noodles. In that same oil, add the pieces of fish and then the dry noodles. Stirring constantly, toast them for a couple of minutes until they take on a hazelnut-golden color. This will prevent them from overcooking",
      "The boil. Pour in the boiling saffron broth (it must sizzle!). Place the langoustines on top. Leave over high heat for 10 to 12 minutes. When the noodles have absorbed all the liquid and begin to rise shamelessly, the dish is ready. A few drops of lemon juice directly on the plate will lift the flavor to the absolute.",
    ],
  },
  {
    title: "6. Cruet de Peix (Historic fish stew)",
    description: "The secret lies in the raw technique: here nothing is fried first. The potato absorbs the juices of the fish, turning the broth into a golden nectar in which you will want to dip fresh bread to the very last drop.",
    source: [
      "Source: Original manuscript of the Llibre de Sent Soví (year 1324).",
    ],
    ingredients: [
      "The ritual: You will need: 800 g of any rock fish with bone (ask at the market to have it cut for soup), 4 potatoes, 1 onion, 3 garlic cloves, a pinch of saffron, half a glass of olive oil",
    ],
    notes: [
    ],
    steps: [
      "The assembly. Take a nice pot. Place at the bottom a compact “bed” of thick slices of potato and onion. On top, distribute the pieces of fish and add the unpeeled garlic cloves",
      "The emulsion. Pour in cold water just until it covers the fish (no more!). Add salt, saffron, and pour in the olive oil",
      "Over low heat. Bring to a boil and then lower the heat. Cook over low heat for 20–25 minutes. Never stir with a spoon! Simply rock the pot from time to time by the handles so that the oil and water mix into a thick and incredibly tasty sauce.",
    ],
  },
  {
    title: "7. Espencat (Mediterranean escalivada with cod)",
    description: "The smoky and sweet aroma of roasted vegetables contrasts phenomenally with the salty touch of the cod. And the olive oil binds it all together into a starter from which it is impossible to tear yourself away.",
    source: [
      "Source: Research from the Chair of Gastronomy of the University of Alicante.",
    ],
    ingredients: [
      "The ritual: You will need: 2 fleshy red peppers, 1 large eggplant, 150 g of salted cod flakes (available in supermarkets), 2 garlic cloves, plenty of extra virgin olive oil",
    ],
    notes: [
    ],
    steps: [
      "Roasting. Put the whole peppers and eggplant in the oven (200°C) for 40–50 minutes, until their skin blackens and wrinkles. Do not be alarmed, it has to be like that! Let them cool",
      "Handwork. Remove the “charred” skin (it will come off easily). Do not use a knife! Tear the juicy flesh of the vegetables with your hands into long strips directly into a salad bowl",
      "The cod. If the cod is too salty, rinse it with water. Shred it into strands and add it to the vegetables",
      "The culmination. Add the very finely chopped garlic and generously drizzle everything, without skimping, with a good splash of olive oil. Let it rest in the fridge for at least one hour.",
    ],
  },
  {
    title: "8. Arroz a Banda",
    description: "The apotheosis of sailors’ minimalism. The rice is cooked in a powerful broth, absorbing all the strength of the sea. Each grain becomes a brilliant bomb of umami.",
    source: [
      "Source: Works of the historian Antonio Beltrán.",
    ],
    ingredients: [
      "The ritual: You will need: 300 g of Bomba rice, 150 g of fresh cuttlefish cut into cubes, 1 liter of the most concentrated fish broth you can find, 2 garlic cloves, 1 teaspoon of sweet paprika",
    ],
    notes: [
    ],
    steps: [
      "The cuttlefish. In a paella pan or wide frying pan, heat oil. Fry the tender cubes of cuttlefish for a couple of minutes until they brown. Add the finely chopped garlic",
      "The paprika and the rice. Remove the pan from the heat, add the paprika, and stir quickly (if the paprika burns, the dish will turn bitter). Immediately add the rice and put it back on the heat. Sauté the rice for 1 minute",
      "The cooking. Pour in all the boiling fish broth. Cook for 18 minutes, watching how the rice eagerly absorbs the sea. Serve very hot, crowning the dish with a spoonful of alioli.",
    ],
  },
  {
    title: "9. All i Pebre (Garlic and pepper)",
    description: "A bold and temperamental dish. Its thick, deep red sauce wraps the tender pieces of white fish and potato. This sauce is so good that you will eat an entire loaf of bread dipping the crumb into the plate.",
    source: [
      "Source: Original treatise Llibre de Coch (year 1520).",
    ],
    ingredients: [
      "The ritual: You will need: 500 g of white fish fillet (fresh cod, sea bream), 3 potatoes, a whole head of garlic, 1 tablespoon of sweet paprika, a little hot chili to taste, olive oil",
    ],
    notes: [
    ],
    steps: [
      "The base. In a deep frying pan or casserole, heat the oil well. Add 5 or 6 peeled garlic cloves and the chili. Fry them until they release a spectacular aroma and take on a golden tone",
      "The sauce. Remove it from the heat! Add the paprika, stir, and immediately pour in 2 glasses of water to prevent the spice from burning. Put it back on the heat",
      "The potato. Cut the potato making a “clack” (make a small cut with the knife and break the rest of the piece; this way it will release the starch that will thicken the sauce). Add it to the boiling broth",
      "The fish. After 15 minutes, when the broth has thickened and the potato is tender, immerse the large pieces of fish in the sauce. Cook for 5 to 7 more minutes.",
    ],
  },
  {
    title: "10. Coca amb Tonyina (Alicante coca with tuna)",
    description: "A very ancient savory pie that will make you lose your head. Its thin and crispy dough hides sweet caramelized onion, tuna that melts in the mouth, and toasted pine nuts.",
    source: [
      "Source: Digital collections of the National Library of Spain.",
    ],
    ingredients: [
      "The ritual: You will need: For the dough: 250 g of flour, 100 ml of olive oil, 100 ml of white wine, a pinch of salt. For the filling: 2 cans of good canned tuna (drain the oil), 2 large onions, a handful of pine nuts, 1 teaspoon of sweet paprika",
    ],
    notes: [
    ],
    steps: [
      "The filling. In a frying pan, over low heat, poach the finely chopped onion for about 20 minutes, until it reaches an amber sweetness. Remove from the heat, add the tuna (flaked with a fork), the crunchy pine nuts, and the paprika. Mix well",
      "The dough. In a bowl, mix the wine, the oil, and the salt. Gradually add the flour, kneading until you obtain a smooth and incredibly pliable dough. Divide it into two parts",
      "The assembly. Roll out the first half of the dough into a thin rectangle on baking paper. Distribute the aromatic filling. Cover with the second layer of dough and seal the edges elegantly. Prick the top with a fork",
      "Baking. Put it in the oven (190°C) for 30–35 minutes. Take it out when the house fills with a festive aroma and the crust is golden and crispy. This coca can be enjoyed both hot and cold.",
    ],
  },
];

const SECTIONS_ESP: RecipesModalSection[] = [
  {
    title: "1. Paella Valenciana (La auténtica paella valenciana)",
    description: "Olvídese de la paella turística con gambas y salchichas. El verdadero clásico valenciano es una sinfonía de carne, verduras tiernas y arroz impregnado de un caldo dorado. El objetivo principal es el socarrat (la costra caramelizada del fondo).",
    source: [
      "Fuente: Reglamento oficial de la DO Arroz de Valencia.",
    ],
    ingredients: [
      "El ritual (para 4 personas): Necesitará: 400 g de arroz redondo Bomba, 500 g de pollo troceado, 300 g de conejo, 200 g de judía verde plana (bajoqueta), 100 g de garrofón, 1 tomate rallado, una pizca de azafrán, una ramita de romero fresco.",
    ],
    notes: [
    ],
    steps: [
      "El sofrito. En una paellera ancha, caliente una capa generosa de aceite de oliva. Sofreír los trozos de carne a fuego medio hasta que adquieran un color dorado profundo y crujiente. Esta es la base del sabor.",
      "Las verduras. Aparte la carne hacia los bordes y eche en el centro las judías verdes y el tomate rallado. Inspire ese dulce aroma del sofrito; manténgalo al fuego de 3 a 4 minutos.",
      "La magia del caldo. Vierta el agua (debe llegar justo hasta los remaches de las asas de la paellera). Añada la ramita de romero y las hebras de azafrán. Deje que este brebaje hierva a fuego lento durante 20 minutos, llenando la casa de un aroma embriagador. Añada sal: el caldo debe estar un poco más salado de lo que acostumbra.",
      "El arroz y el silencio. Retire el romero. Eche el arroz en forma de cruz (caballón) y luego distribúyalo cuidadosamente en una capa uniforme con la espumadera. ¡A partir de este momento está estrictamente prohibido remover el plato!",
      "El nacimiento del socarrat. Cocine durante 18 minutos (primero a fuego fuerte, luego bájelo). Escuche atentamente: cuando el agua casi se haya evaporado, el arroz empezará a crepitar de una forma muy característica y apetitosa; es la costra que se está tostando. Apague el fuego, cubra la paella con un paño limpio y déjela «reposar» 5 minutos.",
    ],
  },
  {
    title: "2. Llauna de Calp",
    description: "El alma de nuestro puerto. Imagine el filete más tierno de pescado fresco, impregnado con el jugo dulce de los tomates asados y un vibrante aceite de ajo.",
    source: [
      "Fuente: La obra «La cocina alicantina» en el archivo BIVALDI.",
    ],
    ingredients: [
      "El ritual: Necesitará: 600 g de pescado blanco de carne firme (merluza, rape o dorada en trozos gruesos), 3 patatas, 2 tomates maduros, 3 dientes de ajo, 1 cucharadita de pimentón dulce, el mejor aceite de oliva virgen extra.",
    ],
    notes: [
    ],
    steps: [
      "La cama. Corte las patatas y los tomates en rodajas finas y elegantes. Colóquelas superpuestas en una fuente de horno: primero la patata, encima los tomates. Sale ligeramente.",
      "El pescado. Sobre esta cama de verduras, coloque los jugosos y gruesos trozos de pescado.",
      "El aceite aromático. Pique el ajo muy fino, mézclelo con el pimentón y espolvoree generosamente sobre el pescado. Ahora, rocíe todo con un hilo grueso de aceite de oliva para que los ingredientes brillen de forma apetitosa.",
      "El horneado. Introduzca la fuente en el horno precalentado a 200°C durante 25 minutos. La patata quedará suave y mantecosa, y el pescado comenzará a deshacerse en hebras nacaradas con solo tocarlo con el tenedor.",
    ],
  },
  {
    title: "3. Arròs del Senyoret (El arroz del señorito)",
    description: "La elección perfecta si desea disfrutar del marisco sin mancharse los dedos. Aquí todas las gambas y calamares ya están pelados: un sabor a mar puro y sedoso.",
    source: [
      "Fuente: Archivos de la Biblioteca Virtual Miguel de Cervantes.",
    ],
    ingredients: [
      "El ritual: Necesitará: 300 g de arroz Bomba, 300 g de gambas crudas peladas, 200 g de anillas de calamar, 1 litro de un potente caldo de pescado (puede comprar un buen caldo preparado en el supermercado), 1 cucharada de pasta de tomate o salmorreta casera.",
    ],
    notes: [
    ],
    steps: [
      "Sofrito rápido. Caliente aceite en la paellera. Eche las gambas apenas 30 segundos, solo para que tomen color, y retírelas inmediatamente a un plato (de lo contrario quedarán gomosas). Haga lo mismo con los calamares.",
      "El sabor. En ese mismo aceite aromático, con olor a mar, añada la pasta de tomate. Sofría un poco y eche el arroz. Remueva con una cuchara de madera para que cada grano se impregne y adquiera un brillo nacarado.",
      "La cocción a fuego lento. Vierta el caldo de pescado caliente y humeante. Añada azafrán. Cocine a fuego lento entre 15 y 18 minutos sin remover.",
      "El gran final. A 2 minutos del final, cuando el caldo casi se haya absorbido, distribuya estéticamente sobre el arroz las gambas y los calamares reservados. Sirva inmediatamente, acompañando la mesa con un cuenco de espeso alioli casero.",
    ],
  },
  {
    title: "4. Putxero de Polp (Puchero de pulpo)",
    description: "La magia de la cocción lenta. La carne del pulpo se vuelve tan tierna que se puede cortar con cuchara, y el rico caldo le envuelve con el dulzor del boniato.",
    source: [
      "Fuente: Archivos de la Cofradía de Pescadores Peix de Calp.",
    ],
    ingredients: [
      "El ritual: Necesitará: 1 pulpo mediano (cómprelo ya congelado para que quede más tierno), 200 g de garbanzos en conserva (por rapidez), 2 boniatos, 1 cebolla, un puñado de almendras tostadas.",
    ],
    notes: [
    ],
    steps: [
      "El pulpo. Sin descongelar del todo, sumerja el pulpo en agua hirviendo. Añada la cebolla entera y cocine a fuego lento durante 40-50 minutos, llenando la casa de un aroma acogedor. Pinche un tentáculo con un tenedor: debe estar tierno.",
      "La consistencia. Añada al caldo los boniatos en trozos grandes y dulces, y los garbanzos lavados. Hierva otros 15 minutos.",
      "El secreto del chef. Maje las almendras en un mortero (o batidora) con un par de cucharadas de caldo. Vierta esta pasta en la olla 5 minutos antes del final. El caldo se volverá instantáneamente cremoso, aterciopelado y adquirirá un sutil perfil a frutos secos.",
    ],
  },
  {
    title: "5. Fideuà de Gandia",
    description: "Aquí, el fino fideo es el protagonista. Al empaparse del caldo caliente, la pasta absorbe toda la esencia del marisco y, al final, se curva hacia arriba de forma divertida, creando una costra crujiente.",
    source: [
      "Fuente: La receta canónica de la Asociación Fideuà de Gandia.",
    ],
    ingredients: [
      "El ritual: Necesitará: 300 g de fideo especial para fideuá (nº 3 o nº 4), 4-6 cigalas o gambones grandes enteros, 200 g de filete de pescado blanco, 1 litro de caldo de pescado, hebras de azafrán.",
    ],
    notes: [
    ],
    steps: [
      "Aromatizar el aceite. En una paellera o sartén ancha, sofría las cigalas hasta que adquieran un color naranja brillante (dejarán todo su sabor en el aceite). Apártelas.",
      "Tostar los fideos. En ese mismo aceite, eche los trozos de pescado y, a continuación, los fideos secos. Removiendo constantemente, tuéstelos un par de minutos hasta que adquieran un tono dorado avellanado. Esto evitará que se pasen de cocción.",
      "La ebullición. Vierta el caldo hirviendo con azafrán (¡debe chisporrotear!). Coloque encima las cigalas. Deje a fuego fuerte entre 10 y 12 minutos. Cuando los fideos hayan absorbido todo el líquido y empiecen a levantarse de forma descarada, el plato está listo. Unas gotas de zumo de limón directamente en el plato elevarán el sabor al absoluto.",
    ],
  },
  {
    title: "6. Cruet de Peix (Guiso histórico de pescado)",
    description: "El secreto está en la técnica en crudo: aquí no se sofríe nada. La patata se impregna con los jugos del pescado, convirtiendo el caldo en un néctar dorado en el que querrá mojar pan fresco hasta la última gota.",
    source: [
      "Fuente: Manuscrito original del Llibre de Sent Soví (año 1324).",
    ],
    ingredients: [
      "El ritual: Necesitará: 800 g de cualquier pescado de roca con espina (pida en el mercado que se lo corten para sopa), 4 patatas, 1 cebolla, 3 dientes de ajo, una pizca de azafrán, medio vaso de aceite de oliva.",
    ],
    notes: [
    ],
    steps: [
      "El montaje. Tome una olla bonita. Coloque en el fondo una «cama» compacta de rodajas gruesas de patata y cebolla. Encima, distribuya los trozos de pescado y eche los dientes de ajo sin pelar.",
      "La emulsión. Vierta agua fría justo hasta cubrir el pescado (¡no más!). Añada sal, el azafrán y vierta el aceite de oliva.",
      "A fuego lento. Lleve a ebullición y, a continuación, baje el fuego. Cocine a fuego lento durante 20-25 minutos. ¡Nunca remueva con una cuchara! Simplemente balancee de vez en cuando la olla por las asas para que el aceite y el agua se mezclen en una salsa espesa e increíblemente sabrosa.",
    ],
  },
  {
    title: "7. Espencat (Escalivada mediterránea con bacalao)",
    description: "El aroma ahumado y dulzón de las verduras asadas contrasta de forma fenomenal con el toque salado del bacalao. Y el aceite de oliva lo amalgama todo en un entrante del que es imposible apartarse.",
    source: [
      "Fuente: Investigaciones de la Cátedra de Gastronomía de la Universidad de Alicante.",
    ],
    ingredients: [
      "El ritual: Necesitará: 2 pimientos rojos carnosos, 1 berenjena grande, 150 g de migas de bacalao salado (disponibles en supermercados), 2 dientes de ajo, abundante aceite de oliva virgen extra.",
    ],
    notes: [
    ],
    steps: [
      "El asado. Meta los pimientos y la berenjena enteros en el horno (200°C) durante 40-50 minutos, hasta que su piel se ennegrezca y se arrugue. ¡No se asuste, tiene que ser así! Déjelos enfriar.",
      "Trabajo manual. Retire la piel «carbonizada» (saldrá con facilidad). ¡No utilice cuchillo! Desgarre la pulpa jugosa de las verduras con las manos en tiras largas directamente en una ensaladera.",
      "El bacalao. Si el bacalao está demasiado salado, enjuáguelo con agua. Desmenúcelo en hebras y añádalo a las verduras.",
      "La culminación. Añada el ajo picado muy fino y rocíe todo generosamente, sin escatimar, con un buen chorro de aceite de oliva. Déjelo reposar en la nevera durante al menos una hora.",
    ],
  },
  {
    title: "8. Arroz a Banda",
    description: "El apoteosis del minimalismo marinero. El arroz se cuece en un potente caldo, absorbiendo toda la fuerza del mar. Cada grano se convierte en una brillante bomba de umami.",
    source: [
      "Fuente: Obras del historiador Antonio Beltrán.",
    ],
    ingredients: [
      "El ritual: Necesitará: 300 g de arroz Bomba, 150 g de sepia fresca cortada en dados, 1 litro del caldo de pescado más concentrado que encuentre, 2 dientes de ajo, 1 cucharadita de pimentón dulce.",
    ],
    notes: [
    ],
    steps: [
      "La sepia. En una paellera o sartén ancha, caliente aceite. Sofreír los tiernos dados de sepia un par de minutos hasta que se doren. Añada el ajo finamente picado.",
      "El pimentón y el arroz. Aparte la sartén del fuego, eche el pimentón y remueva rápidamente (si el pimentón se quema, el plato amargará). Incorpore inmediatamente el arroz y vuelva a ponerlo en el fuego. Rehogue el arroz 1 minuto.",
      "La cocción. Vierta todo el caldo de pescado hirviendo. Cocine durante 18 minutos, observando cómo el arroz absorbe con avidez el mar. Sírvalo muy caliente, coronando el plato con una cucharada de alioli.",
    ],
  },
  {
    title: "9. All i Pebre (Ajo y pimienta)",
    description: "Un plato audaz y temperamental. Su salsa espesa, de color rojo intenso, envuelve los tiernos trozos de pescado blanco y la patata. Esta salsa es tan buena que se comerá una barra de pan entera mojando la miga en el plato.",
    source: [
      "Fuente: Tratado original Llibre de Coch (año 1520).",
    ],
    ingredients: [
      "El ritual: Necesitará: 500 g de filete de pescado blanco (bacalao fresco, dorada), 3 patatas, una cabeza de ajos, 1 cucharada de pimentón dulce, un poco de guindilla picante al gusto, aceite de oliva.",
    ],
    notes: [
    ],
    steps: [
      "La base. En una sartén profunda o cazuela, caliente bien el aceite. Eche 5 o 6 dientes de ajo pelados y la guindilla. Fríalos hasta que desprendan un aroma espectacular y adquieran un tono dorado.",
      "La salsa. ¡Retírelo del fuego! Eche el pimentón, remueva e inmediatamente vierta 2 vasos de agua para evitar que la especia se queme. Vuelva a ponerlo en el fuego.",
      "La patata. Corte la patata haciendo «clac» (haga un pequeño corte con el cuchillo y rompa el resto del trozo; de esta forma liberará el almidón que espesará la salsa). Échela en el caldo hirviendo.",
      "El pescado. Pasados 15 minutos, cuando el caldo haya espesado y la patata esté tierna, sumerja en la salsa los trozos grandes de pescado. Cocine entre 5 y 7 minutos más.",
    ],
  },
  {
    title: "10. Coca amb Tonyina (Coca alicantina con atún)",
    description: "Una empanada antiquísima que le hará perder la cabeza. Su masa fina y crujiente esconde cebolla dulce caramelizada, atún que se deshace en la boca y piñones tostados.",
    source: [
      "Fuente: Fondos digitales de la Biblioteca Nacional de España.",
    ],
    ingredients: [
      "El ritual: Necesitará: Para la masa: 250 g de harina, 100 ml de aceite de oliva, 100 ml de vino blanco, una pizca de sal. Para el relleno: 2 latas de un buen atún en conserva (escurrir el aceite), 2 cebollas grandes, un puñado de piñones, 1 cucharadita de pimentón dulce.",
    ],
    notes: [
    ],
    steps: [
      "El relleno. En una sartén, a fuego lento, poche la cebolla finamente picada durante unos 20 minutos, hasta alcanzar un dulzor ambarino. Retire del fuego, añada el atún (desmenuzado con un tenedor), los piñones crujientes y el pimentón. Mezcle bien.",
      "La masa. En un bol, mezcle el vino, el aceite y la sal. Incorpore la harina poco a poco, amasando hasta obtener una masa lisa e increíblemente maleable. Divídala en dos partes.",
      "El montaje. Estire la primera mitad de la masa en un rectángulo fino sobre papel de hornear. Distribuya el aromático relleno. Cubra con la segunda capa de masa y selle los bordes con elegancia. Pinche la parte superior con un tenedor.",
      "El horneado. Introduzca en el horno (190°C) durante 30-35 minutos. Sáquela cuando la casa se llene de aroma a fiesta y la corteza esté dorada y crujiente. Esta coca se puede disfrutar tanto caliente como fría.",
    ],
  },
];

const SECTIONS_RU: RecipesModalSection[] = [
  {
    title: "1. Paella Valenciana (Подлинная валенсийская паэлья)",
    description: "Забудьте о туристической паэлье с креветками и колбасками. Настоящая валенсийская классика — это симфония мяса, нежных овощей и риса, пропитанного золотистым бульоном. Главная цель — socarrat (карамелизированная корочка на дне).",
    source: [
      "Источник: Официальный регламент DO Arroz de Valencia.",
    ],
    ingredients: [
      "Ритуал (на 4 человека): Вам понадобится: 400 г круглого риса Bomba, 500 г курицы кусочками, 300 г кролика, 200 г плоской зелёной фасоли (bajoqueta), 100 г гаррофона, 1 тёртый помидор, щепотка шафрана, веточка свежего розмарина",
    ],
    notes: [
    ],
    steps: [
      "Софрито. В широкой паэльере разогрейте щедрый слой оливкового масла. Обжаривайте куски мяса на среднем огне, пока они не приобретут насыщенный золотистый и хрустящий цвет. Это основа вкуса",
      "Овощи. Отодвиньте мясо к краям и положите в центр зелёную фасоль и тёртый помидор. Вдохните этот сладкий аромат софрито; держите на огне 3–4 минуты",
      "Магия бульона. Влейте воду (она должна доходить ровно до заклёпок ручек паэльеры). Добавьте веточку розмарина и нити шафрана. Дайте этой смеси тихо кипеть 20 минут, наполняя дом опьяняющим ароматом. Добавьте соль: бульон должен быть чуть солонее, чем вы привыкли",
      "Рис и тишина. Уберите розмарин. Насыпьте рис крестом (caballón), а затем аккуратно распределите его ровным слоем шумовкой. С этого момента строго запрещено перемешивать блюдо!",
      "Рождение socarrat. Готовьте 18 минут (сначала на сильном огне, потом уменьшите). Слушайте внимательно: когда вода почти испарится, рис начнёт потрескивать очень характерно и аппетитно; это поджаривается корочка. Выключите огонь, накройте паэлью чистым полотенцем и оставьте её «отдохнуть» на 5 минут.",
    ],
  },
  {
    title: "2. Llauna de Calp",
    description: "Душа нашего порта. Представьте нежнейшее филе свежей рыбы, пропитанное сладким соком запечённых томатов и ярким чесночным маслом.",
    source: [
      "Источник: Произведение La cocina alicantina в архиве BIVALDI.",
    ],
    ingredients: [
      "Ритуал: Вам понадобится: 600 г белой рыбы с плотной мякотью (хек, морской чёрт или дорада крупными кусками), 3 картофелины, 2 спелых помидора, 3 зубчика чеснока, 1 чайная ложка сладкой паприки, лучшее оливковое масло extra virgin",
    ],
    notes: [
    ],
    steps: [
      "Основа. Нарежьте картофель и помидоры тонкими элегантными кружочками. Уложите их внахлёст в форму для запекания: сначала картофель, сверху помидоры. Слегка посолите",
      "Рыба. На эту овощную «постель» выложите сочные и толстые куски рыбы",
      "Ароматное масло. Очень мелко нарежьте чеснок, смешайте его с паприкой и щедро посыпьте рыбу. Теперь полейте всё густой струйкой оливкового масла, чтобы ингредиенты аппетитно блестели",
      "Запекание. Поставьте форму в разогретую до 200°C духовку на 25 минут. Картофель станет мягким и сливочным, а рыба начнёт распадаться на перламутровые волокна от одного прикосновения вилки.",
    ],
  },
  {
    title: "3. Arròs del Senyoret (Рис для сеньорита/господина)",
    description: "Идеальный выбор, если вы хотите наслаждаться морепродуктами, не пачкая пальцы. Здесь все креветки и кальмары уже очищены: чистый и шелковистый вкус моря.",
    source: [
      "Источник: Архивы Biblioteca Virtual Miguel de Cervantes.",
    ],
    ingredients: [
      "Ритуал: Вам понадобится: 300 г риса Bomba, 300 г очищенных сырых креветок, 200 г колец кальмара, 1 литр насыщенного рыбного бульона (хороший готовый бульон можно купить в супермаркете), 1 столовая ложка томатной пасты или домашней salmorreta",
    ],
    notes: [
    ],
    steps: [
      "Быстрое софрито. Разогрейте масло в паэльере. Положите креветки всего на 30 секунд, только чтобы они слегка окрасились, и сразу же переложите их на тарелку (иначе они станут резиновыми). То же самое сделайте с кальмарами",
      "Вкус. В это же ароматное масло, пахнущее морем, добавьте томатную пасту. Немного обжарьте и всыпьте рис. Перемешайте деревянной ложкой, чтобы каждое зерно пропиталось и приобрело перламутровый блеск",
      "Медленное приготовление. Влейте горячий, дымящийся рыбный бульон. Добавьте шафран. Готовьте на слабом огне 15–18 минут, не перемешивая",
      "Большой финал. За 2 минуты до конца, когда бульон почти впитается, красиво распределите по рису отложенные креветки и кальмары. Подавайте сразу, поставив на стол миску густого домашнего айоли.",
    ],
  },
  {
    title: "4. Putxero de Polp (Пучеро из осьминога)",
    description: "Магия медленного приготовления. Мясо осьминога становится таким нежным, что его можно резать ложкой, а богатый бульон окутывает его сладостью батата.",
    source: [
      "Источник: Архивы рыбацкого братства Peix de Calp.",
    ],
    ingredients: [
      "Ритуал: Вам понадобится: 1 средний осьминог (покупайте уже замороженным, чтобы он получился нежнее), 200 г консервированного нута (для быстроты), 2 батата, 1 луковица, горсть жареного миндаля",
    ],
    notes: [
    ],
    steps: [
      "Осьминог. Не размораживая его полностью, опустите осьминога в кипящую воду. Добавьте целую луковицу и варите на слабом огне 40–50 минут, наполняя дом уютным ароматом. Проткните щупальце вилкой: оно должно быть мягким",
      "Консистенция. Добавьте в бульон батат крупными сладкими кусками и промытый нут. Кипятите ещё 15 минут",
      "Секрет шефа. Разотрите миндаль в ступке (или блендере) с парой ложек бульона. Влейте эту пасту в кастрюлю за 5 минут до конца. Бульон мгновенно станет кремовым, бархатистым и приобретёт тонкий ореховый оттенок.",
    ],
  },
  {
    title: "5. Fideuà de Gandia",
    description: "Здесь главным героем является тонкая вермишель. Пропитываясь горячим бульоном, паста впитывает всю сущность морепродуктов и в конце забавно изгибается вверх, создавая хрустящую корочку.",
    source: [
      "Источник: Канонический рецепт Asociación Fideuà de Gandia.",
    ],
    ingredients: [
      "Ритуал: Вам понадобится: 300 г специальной вермишели для fideuà (№ 3 или № 4), 4–6 цельных лангустинов или крупных креветок, 200 г филе белой рыбы, 1 литр рыбного бульона, нити шафрана",
    ],
    notes: [
    ],
    steps: [
      "Ароматизация масла. В паэльере или широкой сковороде обжарьте лангустинов, пока они не станут ярко-оранжевыми (они отдадут весь свой вкус маслу). Отложите их",
      "Поджаривание вермишели. В том же масле положите кусочки рыбы, а затем сухую вермишель. Постоянно помешивая, поджаривайте её пару минут, пока она не приобретёт орехово-золотистый оттенок. Это не даст ей перевариться",
      "Кипение. Влейте кипящий бульон с шафраном (он должен зашипеть!). Сверху уложите лангустинов. Готовьте на сильном огне 10–12 минут. Когда вермишель впитает всю жидкость и начнёт дерзко подниматься, блюдо готово. Несколько капель лимонного сока прямо в тарелку поднимут вкус до абсолютного уровня.",
    ],
  },
  {
    title: "6. Cruet de Peix (Историческое рыбное рагу)",
    description: "Секрет в сырой технике: здесь ничего не обжаривается. Картофель пропитывается соками рыбы, превращая бульон в золотой нектар, в который захочется макать свежий хлеб до последней капли.",
    source: [
      "Источник: Оригинальная рукопись Llibre de Sent Soví (1324 год).",
    ],
    ingredients: [
      "Ритуал: Вам понадобится: 800 г любой скальной рыбы с костью (попросите на рынке нарезать её для супа), 4 картофелины, 1 луковица, 3 зубчика чеснока, щепотка шафрана, полстакана оливкового масла",
    ],
    notes: [
    ],
    steps: [
      "Сборка. Возьмите красивую кастрюлю. Уложите на дно плотную «постель» из толстых кружков картофеля и лука. Сверху распределите куски рыбы и добавьте неочищенные зубчики чеснока",
      "Эмульсия. Влейте холодную воду ровно настолько, чтобы покрыть рыбу (не больше!). Добавьте соль, шафран и влейте оливковое масло",
      "На слабом огне. Доведите до кипения, а затем уменьшите огонь. Готовьте на слабом огне 20–25 минут. Никогда не мешайте ложкой! Просто время от времени покачивайте кастрюлю за ручки, чтобы масло и вода соединились в густой и невероятно вкусный соус.",
    ],
  },
  {
    title: "7. Espencat (Средиземноморская эскаливада с треской)",
    description: "Копчёно-сладковатый аромат запечённых овощей феноменально контрастирует с солоноватой ноткой трески. А оливковое масло соединяет всё это в закуску, от которой невозможно оторваться.",
    source: [
      "Источник: Исследования кафедры гастрономии Университета Аликанте.",
    ],
    ingredients: [
      "Ритуал: Вам понадобится: 2 мясистых красных перца, 1 большой баклажан, 150 г крошки солёной трески (продаётся в супермаркетах), 2 зубчика чеснока, много оливкового масла extra virgin",
    ],
    notes: [
    ],
    steps: [
      "Запекание. Поместите целые перцы и баклажан в духовку (200°C) на 40–50 минут, пока их кожица не почернеет и не сморщится. Не пугайтесь — так и должно быть! Дайте им остыть",
      "Ручная работа. Снимите «обугленную» кожицу (она легко отойдёт). Не используйте нож! Разрывайте сочную мякоть овощей руками на длинные полоски прямо в салатницу",
      "Треска. Если треска слишком солёная, промойте её водой. Разберите её на волокна и добавьте к овощам",
      "Завершение. Добавьте очень мелко нарезанный чеснок и щедро, не скупясь, полейте всё хорошей струёй оливкового масла. Оставьте в холодильнике минимум на один час.",
    ],
  },
  {
    title: "8. Arroz a Banda",
    description: "Апофеоз морского минимализма. Рис варится в мощном бульоне, впитывая всю силу моря. Каждое зерно превращается в сияющую бомбу умами.",
    source: [
      "Источник: Труды историка Антонио Бельтрана.",
    ],
    ingredients: [
      "Ритуал: Вам понадобится: 300 г риса Bomba, 150 г свежей каракатицы, нарезанной кубиками, 1 литр самого концентрированного рыбного бульона, который вы найдёте, 2 зубчика чеснока, 1 чайная ложка сладкой паприки",
    ],
    notes: [
    ],
    steps: [
      "Каракатица. В паэльере или широкой сковороде разогрейте масло. Обжаривайте нежные кубики каракатицы пару минут, пока они не подрумянятся. Добавьте мелко нарезанный чеснок",
      "Паприка и рис. Снимите сковороду с огня, всыпьте паприку и быстро перемешайте (если паприка подгорит, блюдо будет горчить). Сразу же добавьте рис и верните на огонь. Обжарьте рис 1 минуту",
      "Приготовление. Влейте весь кипящий рыбный бульон. Готовьте 18 минут, наблюдая, как рис жадно впитывает море. Подавайте очень горячим, увенчав блюдо ложкой айоли.",
    ],
  },
  {
    title: "9. All i Pebre (Чеснок и перец)",
    description: "Смелое и темпераментное блюдо. Его густой соус глубокого красного цвета обволакивает нежные куски белой рыбы и картофеля. Этот соус настолько хорош, что вы съедите целый батон хлеба, макая мякиш в тарелку.",
    source: [
      "Источник: Оригинальный трактат Llibre de Coch (1520 год).",
    ],
    ingredients: [
      "Ритуал: Вам понадобится: 500 г филе белой рыбы (свежая треска, дорада), 3 картофелины, целая головка чеснока, 1 столовая ложка сладкой паприки, немного острого чили по вкусу, оливковое масло",
    ],
    notes: [
    ],
    steps: [
      "Основа. В глубокой сковороде или кастрюле хорошо разогрейте масло. Положите 5 или 6 очищенных зубчиков чеснока и чили. Обжаривайте, пока они не начнут источать великолепный аромат и не приобретут золотистый оттенок",
      "Соус. Снимите с огня! Всыпьте паприку, перемешайте и сразу же влейте 2 стакана воды, чтобы специя не сгорела. Снова поставьте на огонь",
      "Картофель. Нарежьте картофель с «хрустом» (сделайте небольшой надрез ножом и отломите остальную часть; так выделится крахмал, который загустит соус). Положите его в кипящий бульон",
      "Рыба. Через 15 минут, когда бульон загустеет, а картофель станет мягким, погрузите в соус крупные куски рыбы. Готовьте ещё 5–7 минут.",
    ],
  },
  {
    title: "10. Coca amb Tonyina (Аликантийская кока с тунцом)",
    description: "Очень древний пирог, от которого можно потерять голову. Его тонкое и хрустящее тесто скрывает сладкий карамелизированный лук, тающий во рту тунец и поджаренные кедровые орешки.",
    source: [
      "Источник: Цифровые фонды Национальной библиотеки Испании.",
    ],
    ingredients: [
      "Ритуал: Вам понадобится: Для теста: 250 г муки, 100 мл оливкового масла, 100 мл белого вина, щепотка соли. Для начинки: 2 банки хорошего консервированного тунца (слить масло), 2 большие луковицы, горсть кедровых орешков, 1 чайная ложка сладкой паприки",
    ],
    notes: [
    ],
    steps: [
      "Начинка. На сковороде, на слабом огне, томите мелко нарезанный лук около 20 минут, пока он не приобретёт янтарную сладость. Снимите с огня, добавьте тунец (размятый вилкой), хрустящие кедровые орешки и паприку. Хорошо перемешайте",
      "Тесто. В миске смешайте вино, масло и соль. Постепенно добавляйте муку, вымешивая, пока не получите гладкое и невероятно податливое тесто. Разделите его на две части",
      "Сборка. Раскатайте первую половину теста в тонкий прямоугольник на бумаге для выпечки. Распределите ароматную начинку. Накройте вторым слоем теста и аккуратно защипните края. Наколите верх вилкой",
      "Выпечка. Поставьте в духовку (190°C) на 30–35 минут. Достаньте, когда дом наполнится праздничным ароматом, а корочка станет золотистой и хрустящей. Эту коку можно есть как горячей, так и холодной.",
    ],
  },
];

const SECTIONS_FR: RecipesModalSection[] = [
  {
    title: "1. Paella Valenciana (L’authentique paella valencienne)",
    description: "Oubliez la paella touristique aux crevettes et aux saucisses. Le véritable classique valencien est une symphonie de viande, de légumes tendres et de riz imprégné d’un bouillon doré. L’objectif principal est le socarrat (la croûte caramélisée du fond).",
    source: [
    ],
    ingredients: [
      "Source : Règlement officiel de la DO Arroz de Valencia.",
      "Le rituel (pour 4 personnes) : Vous aurez besoin de : 400 g de riz rond Bomba, 500 g de poulet coupé en morceaux, 300 g de lapin, 200 g de haricot vert plat (bajoqueta), 100 g de garrofón, 1 tomate râpée, une pincée de safran, une branche de romarin frais",
    ],
    notes: [
    ],
    steps: [
      "Étape 1 : Le sofrito. Dans une large paellera, faites chauffer une généreuse couche d’huile d’olive. Faites revenir les morceaux de viande à feu moyen jusqu’à ce qu’ils prennent une couleur dorée profonde et croustillante. C’est la base de la saveur",
      "Étape 2 : Les légumes. Écartez la viande vers les bords et mettez au centre les haricots verts et la tomate râpée. Respirez ce doux parfum du sofrito ; maintenez-le sur le feu 3 à 4 minutes",
      "Étape 3 : La magie du bouillon. Versez l’eau (elle doit arriver juste au niveau des rivets des poignées de la paellera). Ajoutez la branche de romarin et les filaments de safran. Laissez cette préparation mijoter pendant 20 minutes, en remplissant la maison d’un parfum enivrant. Ajoutez du sel : le bouillon doit être un peu plus salé que d’habitude",
      "Étape 4 : Le riz et le silence. Retirez le romarin. Versez le riz en forme de croix (caballón), puis répartissez-le soigneusement en une couche uniforme avec l’écumoire. À partir de ce moment, il est strictement interdit de remuer le plat !",
      "Étape 5 : La naissance du socarrat. Faites cuire pendant 18 minutes (d’abord à feu vif, puis baissez-le). Écoutez attentivement : lorsque l’eau s’est presque évaporée, le riz commence à crépiter d’une façon très caractéristique et appétissante ; c’est la croûte qui est en train de griller. Éteignez le feu, couvrez la paella d’un linge propre et laissez-la « reposer » 5 minutes.",
    ],
  },
  {
    title: "2. Llauna de Calp",
    description: "L’âme de notre port. Imaginez le filet le plus tendre de poisson frais, imprégné du jus sucré des tomates rôties et d’une huile à l’ail vibrante.",
    source: [
    ],
    ingredients: [
      "Source : L’ouvrage La cocina alicantina dans les archives BIVALDI.",
      "Le rituel : Vous aurez besoin de : 600 g de poisson blanc à chair ferme (merlu, lotte ou dorade en gros morceaux), 3 pommes de terre, 2 tomates mûres, 3 gousses d’ail, 1 cuillère à café de paprika doux, la meilleure huile d’olive vierge extra",
    ],
    notes: [
    ],
    steps: [
      "Étape 1 : Le lit. Coupez les pommes de terre et les tomates en fines rondelles élégantes. Disposez-les en les superposant dans un plat allant au four : d’abord la pomme de terre, puis les tomates par-dessus. Salez légèrement",
      "Étape 2 : Le poisson. Sur ce lit de légumes, placez les morceaux de poisson, épais et juteux",
      "Étape 3 : L’huile aromatique. Hachez l’ail très finement, mélangez-le avec le paprika et saupoudrez généreusement sur le poisson. Maintenant, arrosez le tout d’un filet épais d’huile d’olive afin que les ingrédients brillent de manière appétissante",
      "Étape 4 : La cuisson au four. Introduisez le plat dans le four préchauffé à 200°C pendant 25 minutes. La pomme de terre deviendra douce et beurrée, et le poisson commencera à se défaire en fibres nacrées au simple contact de la fourchette.",
    ],
  },
  {
    title: "3. Arròs del Senyoret (Le riz du petit seigneur)",
    description: "Le choix parfait si vous souhaitez savourer les fruits de mer sans vous salir les doigts. Ici, toutes les crevettes et tous les calamars sont déjà décortiqués : une saveur marine pure et soyeuse.",
    source: [
    ],
    ingredients: [
      "Source : Archives de la Biblioteca Virtual Miguel de Cervantes.",
      "Le rituel : Vous aurez besoin de : 300 g de riz Bomba, 300 g de crevettes crues décortiquées, 200 g d’anneaux de calamar, 1 litre d’un puissant bouillon de poisson (vous pouvez acheter un bon bouillon préparé au supermarché), 1 cuillère à soupe de pâte de tomate ou de salmorreta maison",
    ],
    notes: [
    ],
    steps: [
      "Étape 1 : Sofrito rapide. Faites chauffer l’huile dans la paellera. Mettez les crevettes à peine 30 secondes, juste pour qu’elles prennent couleur, et retirez-les immédiatement dans une assiette (sinon elles deviendront caoutchouteuses). Faites de même avec les calamars",
      "Étape 2 : La saveur. Dans cette même huile aromatique, aux senteurs de mer, ajoutez la pâte de tomate. Faites revenir un peu et ajoutez le riz. Remuez avec une cuillère en bois afin que chaque grain s’imprègne et acquière un éclat nacré",
      "Étape 3 : La cuisson à feu doux. Versez le bouillon de poisson chaud et fumant. Ajoutez le safran. Faites cuire à feu doux entre 15 et 18 minutes sans remuer",
      "Étape 4 : Le grand final. À 2 minutes de la fin, lorsque le bouillon est presque absorbé, répartissez esthétiquement sur le riz les crevettes et les calamars réservés. Servez immédiatement, en accompagnant la table d’un bol d’aïoli maison épais.",
    ],
  },
  {
    title: "4. Putxero de Polp (Pot-au-feu de poulpe)",
    description: "La magie de la cuisson lente. La chair du poulpe devient si tendre qu’elle peut se couper à la cuillère, et le riche bouillon l’enveloppe de la douceur de la patate douce.",
    source: [
    ],
    ingredients: [
      "Source : Archives de la Confrérie des pêcheurs Peix de Calp.",
      "Le rituel : Vous aurez besoin de : 1 poulpe moyen (achetez-le déjà congelé pour qu’il soit plus tendre), 200 g de pois chiches en conserve (pour aller plus vite), 2 patates douces, 1 oignon, une poignée d’amandes grillées",
    ],
    notes: [
    ],
    steps: [
      "Étape 1 : Le poulpe. Sans le décongeler totalement, plongez le poulpe dans de l’eau bouillante. Ajoutez l’oignon entier et faites cuire à feu doux pendant 40 à 50 minutes, en remplissant la maison d’un parfum réconfortant. Piquez un tentacule avec une fourchette : il doit être tendre",
      "Étape 2 : La consistance. Ajoutez au bouillon les patates douces en gros morceaux bien sucrés, ainsi que les pois chiches rincés. Faites bouillir encore 15 minutes",
      "Étape 3 : Le secret du chef. Écrasez les amandes dans un mortier (ou au mixeur) avec quelques cuillerées de bouillon. Versez cette pâte dans la marmite 5 minutes avant la fin. Le bouillon deviendra instantanément crémeux, velouté et prendra un subtil profil de fruits secs.",
    ],
  },
  {
    title: "5. Fideuà de Gandia",
    description: "Ici, le fin vermicelle est le protagoniste. En s’imprégnant du bouillon chaud, les pâtes absorbent toute l’essence des fruits de mer et, à la fin, se courbent vers le haut avec fantaisie, créant une croûte croustillante.",
    source: [
    ],
    ingredients: [
      "Source : La recette canonique de l’Asociación Fideuà de Gandia.",
      "Le rituel : Vous aurez besoin de : 300 g de vermicelles spéciaux pour fideuà (nº 3 ou nº 4), 4 à 6 langoustines ou gros gambas entiers, 200 g de filet de poisson blanc, 1 litre de bouillon de poisson, filaments de safran",
    ],
    notes: [
    ],
    steps: [
      "Étape 1 : Parfumer l’huile. Dans une paellera ou une grande poêle, faites revenir les langoustines jusqu’à ce qu’elles prennent une couleur orange brillante (elles laisseront toute leur saveur dans l’huile). Réservez-les",
      "Étape 2 : Toaster les vermicelles. Dans cette même huile, mettez les morceaux de poisson puis les vermicelles secs. En remuant constamment, faites-les griller pendant quelques minutes jusqu’à ce qu’ils prennent une teinte dorée noisette. Cela évitera qu’ils ne soient trop cuits",
      "Étape 3 : L’ébullition. Versez le bouillon bouillant avec le safran (il doit grésiller !). Placez les langoustines dessus. Laissez à feu vif entre 10 et 12 minutes. Quand les vermicelles auront absorbé tout le liquide et commenceront à se redresser avec insolence, le plat sera prêt. Quelques gouttes de jus de citron directement dans l’assiette porteront la saveur à l’absolu.",
    ],
  },
  {
    title: "6. Cruet de Peix (Ragoût historique de poisson)",
    description: "Le secret réside dans la technique à cru : ici, rien n’est revenu. La pomme de terre s’imprègne des sucs du poisson, transformant le bouillon en un nectar doré dans lequel vous voudrez tremper du pain frais jusqu’à la dernière goutte.",
    source: [
    ],
    ingredients: [
      "Source : Manuscrit original du Llibre de Sent Soví (année 1324).",
      "Le rituel : Vous aurez besoin de : 800 g de n’importe quel poisson de roche avec arêtes (demandez au marché qu’on vous le coupe pour la soupe), 4 pommes de terre, 1 oignon, 3 gousses d’ail, une pincée de safran, un demi-verre d’huile d’olive",
    ],
    notes: [
    ],
    steps: [
      "Étape 1 : Le montage. Prenez une belle marmite. Placez au fond un « lit » compact de rondelles épaisses de pomme de terre et d’oignon. Au-dessus, répartissez les morceaux de poisson et ajoutez les gousses d’ail non épluchées",
      "Étape 2 : L’émulsion. Versez de l’eau froide juste jusqu’à couvrir le poisson (pas plus !). Ajoutez du sel, le safran et versez l’huile d’olive",
      "Étape 3 : À feu doux. Portez à ébullition puis baissez le feu. Faites cuire à feu doux pendant 20 à 25 minutes. Ne remuez jamais avec une cuillère ! Balancez simplement la marmite de temps à autre par les poignées pour que l’huile et l’eau se mêlent en une sauce épaisse et incroyablement savoureuse.",
    ],
  },
  {
    title: "7. Espencat (Escalivada méditerranéenne à la morue)",
    description: "L’arôme fumé et doucement sucré des légumes rôtis contraste de façon phénoménale avec la touche salée de la morue. Et l’huile d’olive amalgame le tout en une entrée dont il est impossible de se détourner.",
    source: [
    ],
    ingredients: [
      "Source : Recherches de la Chaire de Gastronomie de l’Université d’Alicante.",
      "Le rituel : Vous aurez besoin de : 2 poivrons rouges charnus, 1 grande aubergine, 150 g de miettes de morue salée (disponibles dans les supermarchés), 2 gousses d’ail, une abondante huile d’olive vierge extra",
    ],
    notes: [
    ],
    steps: [
      "Étape 1 : La cuisson au four. Mettez les poivrons et l’aubergine entiers au four (200°C) pendant 40 à 50 minutes, jusqu’à ce que leur peau noircisse et se ride. Ne vous inquiétez pas, cela doit être ainsi ! Laissez-les refroidir",
      "Étape 2 : Travail manuel. Retirez la peau « carbonisée » (elle s’enlèvera facilement). N’utilisez pas de couteau ! Déchirez la chair juteuse des légumes avec les mains en longues bandes directement dans un saladier",
      "Étape 3 : La morue. Si la morue est trop salée, rincez-la à l’eau. Effilochez-la en fibres et ajoutez-la aux légumes",
      "Étape 4 : L’aboutissement. Ajoutez l’ail très finement haché et arrosez généreusement le tout, sans lésiner, d’un bon filet d’huile d’olive. Laissez reposer au réfrigérateur pendant au moins une heure.",
    ],
  },
  {
    title: "8. Arroz a Banda",
    description: "L’apothéose du minimalisme marin. Le riz cuit dans un bouillon puissant, absorbant toute la force de la mer. Chaque grain devient une brillante bombe d’umami.",
    source: [
    ],
    ingredients: [
      "Source : Œuvres de l’historien Antonio Beltrán.",
      "Le rituel : Vous aurez besoin de : 300 g de riz Bomba, 150 g de seiche fraîche coupée en dés, 1 litre du bouillon de poisson le plus concentré que vous puissiez trouver, 2 gousses d’ail, 1 cuillère à café de paprika doux",
    ],
    notes: [
    ],
    steps: [
      "Étape 1 : La seiche. Dans une paellera ou une grande poêle, chauffez l’huile. Faites revenir les tendres dés de seiche pendant quelques minutes jusqu’à ce qu’ils dorent. Ajoutez l’ail finement haché",
      "Étape 2 : Le paprika et le riz. Retirez la poêle du feu, ajoutez le paprika et remuez rapidement (si le paprika brûle, le plat deviendra amer). Incorporez immédiatement le riz et remettez sur le feu. Faites revenir le riz 1 minute",
      "Étape 3 : La cuisson. Versez tout le bouillon de poisson bouillant. Faites cuire pendant 18 minutes, en observant comment le riz absorbe avec avidité la mer. Servez très chaud, en couronnant l’assiette d’une cuillerée d’aïoli.",
    ],
  },
  {
    title: "9. All i Pebre (Ail et piment)",
    description: "Un plat audacieux et de caractère. Sa sauce épaisse, d’une couleur rouge intense, enveloppe les tendres morceaux de poisson blanc et de pomme de terre. Cette sauce est si bonne que vous mangerez une baguette entière en y trempant la mie.",
    source: [
    ],
    ingredients: [
      "Source : Traité original Llibre de Coch (année 1520).",
      "Le rituel : Vous aurez besoin de : 500 g de filet de poisson blanc (morue fraîche, dorade), 3 pommes de terre, une tête d’ail, 1 cuillère à soupe de paprika doux, un peu de piment fort selon le goût, huile d’olive",
    ],
    notes: [
    ],
    steps: [
      "Étape 1 : La base. Dans une poêle profonde ou une cocotte, faites bien chauffer l’huile. Ajoutez 5 ou 6 gousses d’ail épluchées et le piment. Faites-les frire jusqu’à ce qu’ils dégagent un arôme spectaculaire et prennent une teinte dorée",
      "Étape 2 : La sauce. Retirez du feu ! Ajoutez le paprika, remuez, et versez immédiatement 2 verres d’eau pour éviter que l’épice ne brûle. Remettez sur le feu",
      "Étape 3 : La pomme de terre. Coupez la pomme de terre en faisant « clac » (faites une petite entaille avec le couteau et cassez le reste du morceau ; ainsi elle libérera l’amidon qui épaissira la sauce). Ajoutez-la au bouillon bouillant",
      "Étape 4 : Le poisson. Après 15 minutes, quand le bouillon aura épaissi et que la pomme de terre sera tendre, plongez dans la sauce les gros morceaux de poisson. Faites cuire encore 5 à 7 minutes.",
    ],
  },
  {
    title: "10. Coca amb Tonyina (Coca alicantine au thon)",
    description: "Une tourte très ancienne qui vous fera perdre la tête. Sa pâte fine et croustillante cache de l’oignon doux caramélisé, du thon qui fond en bouche et des pignons grillés.",
    source: [
    ],
    ingredients: [
      "Source : Fonds numériques de la Bibliothèque nationale d’Espagne.",
      "Le rituel : Vous aurez besoin de : Pour la pâte : 250 g de farine, 100 ml d’huile d’olive, 100 ml de vin blanc, une pincée de sel. Pour la garniture : 2 boîtes d’un bon thon en conserve (égoutter l’huile), 2 gros oignons, une poignée de pignons, 1 cuillère à café de paprika doux",
    ],
    notes: [
    ],
    steps: [
      "Étape 1 : La garniture. Dans une poêle, à feu doux, faites compoter l’oignon finement haché pendant environ 20 minutes, jusqu’à atteindre une douceur ambrée. Retirez du feu, ajoutez le thon (émietté à la fourchette), les pignons croquants et le paprika. Mélangez bien",
      "Étape 2 : La pâte. Dans un bol, mélangez le vin, l’huile et le sel. Incorporez la farine petit à petit, en pétrissant jusqu’à obtenir une pâte lisse et incroyablement malléable. Divisez-la en deux parties",
      "Étape 3 : Le montage. Étalez la première moitié de la pâte en un fin rectangle sur du papier cuisson. Répartissez la garniture aromatique. Couvrez avec la seconde couche de pâte et soudez les bords avec élégance. Piquez le dessus avec une fourchette",
      "Étape 4 : La cuisson au four. Introduisez au four (190°C) pendant 30 à 35 minutes. Sortez-la lorsque la maison se remplit d’un parfum de fête et que la croûte est dorée et croustillante. Cette coca peut se déguster aussi bien chaude que froide.",
    ],
  },
];

const SECTIONS_IT: RecipesModalSection[] = [
  {
    title: "1. Paella Valenciana (L’autentica paella valenciana)",
    description: "Dimentica la paella turistica con gamberi e salsicce. Il vero classico valenciano è una sinfonia di carne, verdure tenere e riso impregnato di un brodo dorato. L’obiettivo principale è il socarrat (la crosta caramellata sul fondo).",
    source: [
      "Fonte: Regolamento ufficiale della DO Arroz de Valencia.",
    ],
    ingredients: [
      "Il rituale (per 4 persone): Ti serviranno: 400 g di riso tondo Bomba, 500 g di pollo a pezzi, 300 g di coniglio, 200 g di fagiolino piatto (bajoqueta), 100 g di garrofón, 1 pomodoro grattugiato, un pizzico di zafferano, un rametto di rosmarino fresco",
    ],
    notes: [
    ],
    steps: [
      "Il sofritto. In una paellera larga, scalda uno strato generoso di olio d’oliva. Rosola i pezzi di carne a fuoco medio finché prendono un colore dorato intenso e croccante. Questa è la base del sapore",
      "Le verdure. Sposta la carne verso i bordi e metti al centro i fagiolini e il pomodoro grattugiato. Respira quel dolce aroma del soffritto; lascialo sul fuoco per 3–4 minuti",
      "La magia del brodo. Versa l’acqua (deve arrivare appena ai rivetti dei manici della paellera). Aggiungi il rametto di rosmarino e i fili di zafferano. Lascia sobbollire questo intruglio per 20 minuti, riempiendo la casa di un aroma inebriante. Aggiungi sale: il brodo deve essere un po’ più salato di quanto sei abituato",
      "Il riso e il silenzio. Togli il rosmarino. Versa il riso a forma di croce (caballón) e poi distribuiscilo con cura in uno strato uniforme con la schiumarola. Da questo momento è severamente vietato mescolare il piatto!",
      "La nascita del socarrat. Cuoci per 18 minuti (prima a fuoco forte, poi abbassalo). Ascolta attentamente: quando l’acqua sarà quasi evaporata, il riso inizierà a crepitare in modo molto caratteristico e appetitoso; è la crosta che si sta tostando. Spegni il fuoco, copri la paella con un panno pulito e lasciala “riposare” per 5 minuti.",
    ],
  },
  {
    title: "2. Llauna de Calp",
    description: "L’anima del nostro porto. Immagina il filetto più tenero di pesce fresco, impregnato del succo dolce dei pomodori arrostiti e di un vivace olio all’aglio.",
    source: [
      "Fonte: L’opera La cocina alicantina nell’archivio BIVALDI.",
    ],
    ingredients: [
      "Il rituale: Ti serviranno: 600 g di pesce bianco dalla carne compatta (nasello, rana pescatrice o orata in pezzi grossi), 3 patate, 2 pomodori maturi, 3 spicchi d’aglio, 1 cucchiaino di paprika dolce, il miglior olio extravergine d’oliva",
    ],
    notes: [
    ],
    steps: [
      "Il letto. Taglia le patate e i pomodori a fette sottili ed eleganti. Disponili sovrapposti in una pirofila: prima la patata, sopra i pomodori. Sala leggermente",
      "Il pesce. Su questo letto di verdure disponi i succosi e spessi pezzi di pesce",
      "L’olio aromatico. Trita molto finemente l’aglio, mescolalo con la paprika e spargilo generosamente sul pesce. Ora irrora tutto con un filo abbondante di olio d’oliva affinché gli ingredienti brillino in modo appetitoso",
      "La cottura al forno. Metti la pirofila nel forno preriscaldato a 200°C per 25 minuti. La patata diventerà morbida e burrosa, e il pesce inizierà a disfarsi in fili madreperlacei al solo tocco della forchetta.",
    ],
  },
  {
    title: "3. Arròs del Senyoret (Il riso del signorino)",
    description: "La scelta perfetta se desideri gustare i frutti di mare senza sporcarti le dita. Qui tutti i gamberi e i calamari sono già puliti: un sapore di mare puro e setoso.",
    source: [
      "Fonte: Archivi della Biblioteca Virtual Miguel de Cervantes.",
    ],
    ingredients: [
      "Il rituale: Ti serviranno: 300 g di riso Bomba, 300 g di gamberi crudi sgusciati, 200 g di anelli di calamaro, 1 litro di un intenso brodo di pesce (puoi comprare un buon brodo pronto al supermercato), 1 cucchiaio di concentrato di pomodoro o salmorreta fatta in casa",
    ],
    notes: [
    ],
    steps: [
      "Sofritto rapido. Scalda l’olio nella paellera. Metti i gamberi appena per 30 secondi, solo per farli colorire, e toglili immediatamente su un piatto (altrimenti diventeranno gommosi). Fai lo stesso con i calamari",
      "Il sapore. In quello stesso olio aromatico, con profumo di mare, aggiungi il concentrato di pomodoro. Rosolalo leggermente e versa il riso. Mescola con un cucchiaio di legno affinché ogni chicco si impregni e acquisti una lucentezza madreperlacea",
      "La cottura lenta. Versa il brodo di pesce caldo e fumante. Aggiungi lo zafferano. Cuoci a fuoco lento per 15–18 minuti senza mescolare",
      "Il gran finale. A 2 minuti dalla fine, quando il brodo sarà quasi assorbito, distribuisci esteticamente sul riso i gamberi e i calamari tenuti da parte. Servi subito, accompagnando la tavola con una ciotola di denso alioli fatto in casa.",
    ],
  },
  {
    title: "4. Putxero de Polp (Puchero di polpo)",
    description: "La magia della cottura lenta. La carne del polpo diventa così tenera che si può tagliare con il cucchiaio, e il ricco brodo lo avvolge con la dolcezza della patata dolce.",
    source: [
      "Fonte: Archivi della Confraternita dei pescatori Peix de Calp.",
    ],
    ingredients: [
      "Il rituale: Ti serviranno: 1 polpo medio (compralo già congelato così risulterà più tenero), 200 g di ceci in scatola (per rapidità), 2 patate dolci, 1 cipolla, una manciata di mandorle tostate",
    ],
    notes: [
    ],
    steps: [
      "Il polpo. Senza scongelarlo del tutto, immergi il polpo in acqua bollente. Aggiungi la cipolla intera e cuoci a fuoco lento per 40–50 minuti, riempiendo la casa di un aroma accogliente. Pungi un tentacolo con una forchetta: deve essere tenero",
      "La consistenza. Aggiungi al brodo le patate dolci in pezzi grandi e dolci e i ceci lavati. Fai bollire altri 15 minuti",
      "Il segreto dello chef. Pesta le mandorle in un mortaio (o frullatore) con un paio di cucchiai di brodo. Versa questa pasta nella pentola 5 minuti prima della fine. Il brodo diventerà immediatamente cremoso, vellutato e assumerà un sottile profilo di frutta secca.",
    ],
  },
  {
    title: "5. Fideuà de Gandia",
    description: "Qui il sottile spaghettino è il protagonista. Imbevendosi del brodo caldo, la pasta assorbe tutta l’essenza dei frutti di mare e, alla fine, si incurva verso l’alto in modo giocoso, creando una crosta croccante.",
    source: [
      "Fonte: La ricetta canonica dell’Asociación Fideuà de Gandia.",
    ],
    ingredients: [
      "Il rituale: Ti serviranno: 300 g di pasta speciale per fideuà (nº 3 o nº 4), 4–6 scampi o grandi gamberoni interi, 200 g di filetto di pesce bianco, 1 litro di brodo di pesce, fili di zafferano",
    ],
    notes: [
    ],
    steps: [
      "Aromatizzare l’olio. In una paellera o padella larga, rosola gli scampi finché prendono un colore arancione brillante (lasceranno tutto il loro sapore nell’olio). Mettili da parte",
      "Tostare la pasta. In quello stesso olio, aggiungi i pezzi di pesce e, subito dopo, la pasta secca. Mescolando costantemente, tostala per un paio di minuti finché assume un tono dorato color nocciola. Questo impedirà che scuocia",
      "L’ebollizione. Versa il brodo bollente con lo zafferano (deve sfrigolare!). Disponi sopra gli scampi. Lascia a fuoco alto per 10–12 minuti. Quando la pasta avrà assorbito tutto il liquido e inizierà a sollevarsi con sfacciataggine, il piatto sarà pronto. Alcune gocce di succo di limone direttamente nel piatto eleveranno il sapore all’assoluto.",
    ],
  },
  {
    title: "6. Cruet de Peix (Stufato storico di pesce)",
    description: "Il segreto sta nella tecnica a crudo: qui non si soffrigge nulla. La patata si impregna dei succhi del pesce, trasformando il brodo in un nettare dorato in cui vorrai intingere pane fresco fino all’ultima goccia.",
    source: [
      "Fonte: Manoscritto originale del Llibre de Sent Soví (anno 1324).",
    ],
    ingredients: [
      "Il rituale: Ti serviranno: 800 g di qualsiasi pesce di scoglio con lisca (chiedi al mercato di fartelo tagliare per la zuppa), 4 patate, 1 cipolla, 3 spicchi d’aglio, un pizzico di zafferano, mezzo bicchiere d’olio d’oliva",
    ],
    notes: [
    ],
    steps: [
      "Il montaggio. Prendi una bella pentola. Disponi sul fondo un “letto” compatto di fette spesse di patata e cipolla. Sopra distribuisci i pezzi di pesce e aggiungi gli spicchi d’aglio non sbucciati",
      "L’emulsione. Versa acqua fredda appena fino a coprire il pesce (non di più!). Aggiungi sale, lo zafferano e versa l’olio d’oliva",
      "A fuoco lento. Porta a ebollizione e poi abbassa il fuoco. Cuoci a fuoco lento per 20–25 minuti. Non mescolare mai con un cucchiaio! Semplicemente fai oscillare di tanto in tanto la pentola dai manici affinché l’olio e l’acqua si amalgamino in una salsa densa e incredibilmente saporita.",
    ],
  },
  {
    title: "7. Espencat (Escalivada mediterranea con baccalà)",
    description: "L’aroma affumicato e dolciastro delle verdure arrosto contrasta in modo fenomenale con il tocco salato del baccalà. E l’olio d’oliva amalgama il tutto in un antipasto da cui è impossibile staccarsi.",
    source: [
      "Fonte: Ricerche della Cattedra di Gastronomia dell’Università di Alicante.",
    ],
    ingredients: [
      "Il rituale: Ti serviranno: 2 peperoni rossi carnosi, 1 melanzana grande, 150 g di briciole di baccalà salato (disponibili nei supermercati), 2 spicchi d’aglio, abbondante olio extravergine d’oliva",
    ],
    notes: [
    ],
    steps: [
      "L’arrosto. Metti i peperoni e la melanzana interi in forno (200°C) per 40–50 minuti, finché la loro pelle si annerisce e si raggrinzisce. Non spaventarti, deve essere così! Lasciali raffreddare",
      "Lavoro manuale. Togli la pelle “carbonizzata” (verrà via facilmente). Non usare il coltello! Strappa la polpa succosa delle verdure con le mani in lunghe strisce direttamente in un’insalatiera",
      "Il baccalà. Se il baccalà è troppo salato, sciacqualo con acqua. Sfilaccialo e aggiungilo alle verdure",
      "Il culmine. Aggiungi l’aglio tritato finissimo e irrora tutto generosamente, senza risparmiare, con un buon getto d’olio d’oliva. Lascialo riposare in frigorifero per almeno un’ora.",
    ],
  },
  {
    title: "8. Arroz a Banda",
    description: "L’apoteosi del minimalismo marinaresco. Il riso si cuoce in un brodo potente, assorbendo tutta la forza del mare. Ogni chicco diventa una brillante bomba di umami.",
    source: [
      "Fonte: Opere dello storico Antonio Beltrán.",
    ],
    ingredients: [
      "Il rituale: Ti serviranno: 300 g di riso Bomba, 150 g di seppia fresca tagliata a dadini, 1 litro del brodo di pesce più concentrato che tu possa trovare, 2 spicchi d’aglio, 1 cucchiaino di paprika dolce",
    ],
    notes: [
    ],
    steps: [
      "La seppia. In una paellera o padella larga, scalda l’olio. Rosola i teneri dadini di seppia per un paio di minuti finché si dorano. Aggiungi l’aglio tritato finemente",
      "La paprika e il riso. Togli la padella dal fuoco, versa la paprika e mescola rapidamente (se la paprika si brucia, il piatto diventerà amaro). Aggiungi immediatamente il riso e rimetti sul fuoco. Fai tostare il riso per 1 minuto",
      "La cottura. Versa tutto il brodo di pesce bollente. Cuoci per 18 minuti, osservando come il riso assorbe avidamente il mare. Servilo bollente, coronando il piatto con un cucchiaio di alioli.",
    ],
  },
  {
    title: "9. All i Pebre (Aglio e peperoncino)",
    description: "Un piatto audace e temperamentale. La sua salsa densa, di colore rosso intenso, avvolge i teneri pezzi di pesce bianco e la patata. Questa salsa è così buona che mangerai un’intera pagnotta intingendo la mollica nel piatto.",
    source: [
      "Fonte: Trattato originale Llibre de Coch (anno 1520).",
    ],
    ingredients: [
      "Il rituale: Ti serviranno: 500 g di filetto di pesce bianco (baccalà fresco, orata), 3 patate, una testa d’aglio, 1 cucchiaio di paprika dolce, un po’ di peperoncino piccante a piacere, olio d’oliva",
    ],
    notes: [
    ],
    steps: [
      "La base. In una padella profonda o casseruola, scalda bene l’olio. Aggiungi 5 o 6 spicchi d’aglio sbucciati e il peperoncino. Friggili finché sprigionano un aroma spettacolare e prendono una tonalità dorata",
      "La salsa. Toglilo dal fuoco! Versa la paprika, mescola e immediatamente versa 2 bicchieri d’acqua per evitare che la spezia si bruci. Rimetti sul fuoco",
      "La patata. Taglia la patata facendo “clac” (fai un piccolo taglio con il coltello e rompi il resto del pezzo; in questo modo rilascerà l’amido che addenserà la salsa). Mettila nel brodo bollente",
      "Il pesce. Trascorsi 15 minuti, quando il brodo si sarà addensato e la patata sarà tenera, immergi nella salsa i grossi pezzi di pesce. Cuoci per altri 5–7 minuti.",
    ],
  },
  {
    title: "10. Coca amb Tonyina (Coca alicantina con tonno)",
    description: "Una torta salata antichissima che ti farà perdere la testa. La sua pasta sottile e croccante nasconde cipolla dolce caramellata, tonno che si scioglie in bocca e pinoli tostati.",
    source: [
      "Fonte: Fondi digitali della Biblioteca Nazionale di Spagna.",
    ],
    ingredients: [
      "Il rituale: Ti serviranno: Per l’impasto: 250 g di farina, 100 ml di olio d’oliva, 100 ml di vino bianco, un pizzico di sale. Per il ripieno: 2 scatole di buon tonno in conserva (scolare l’olio), 2 cipolle grandi, una manciata di pinoli, 1 cucchiaino di paprika dolce",
    ],
    notes: [
    ],
    steps: [
      "Il ripieno. In una padella, a fuoco lento, fai appassire la cipolla tritata finemente per circa 20 minuti, finché raggiunge una dolcezza ambrata. Togli dal fuoco, aggiungi il tonno (sbriciolato con una forchetta), i pinoli croccanti e la paprika. Mescola bene",
      "L’impasto. In una ciotola, mescola il vino, l’olio e il sale. Incorpora la farina poco a poco, impastando fino a ottenere un impasto liscio e incredibilmente malleabile. Dividilo in due parti",
      "Il montaggio. Stendi la prima metà dell’impasto in un rettangolo sottile su carta da forno. Distribuisci il ripieno aromatico. Copri con il secondo strato d’impasto e sigilla i bordi con eleganza. Bucherella la parte superiore con una forchetta",
      "La cottura al forno. Mettila in forno (190°C) per 30–35 minuti. Tirala fuori quando la casa si riempie di aroma di festa e la crosta è dorata e croccante. Questa coca si può gustare sia calda sia fredda.",
    ],
  },
];

const SECTIONS_DE: RecipesModalSection[] = [
  {
    title: "1. Paella Valenciana (Die authentische valencianische Paella)",
    description: "Vergessen Sie die touristische Paella mit Garnelen und Würstchen. Der wahre valencianische Klassiker ist eine Symphonie aus Fleisch, zartem Gemüse und Reis, durchzogen von einer goldenen Brühe. Das Hauptziel ist der Socarrat (die karamellisierte Kruste am Boden).",
    source: [
      "Quelle: Offizielle Verordnung der DO Arroz de Valencia.",
    ],
    ingredients: [
      "Das Ritual (für 4 Personen): Sie benötigen: 400 g runden Bomba-Reis, 500 g Hähnchen in Stücken, 300 g Kaninchen, 200 g flache grüne Bohnen (bajoqueta), 100 g Garrofón, 1 geriebene Tomate, eine Prise Safran, einen Zweig frischen Rosmarin",
    ],
    notes: [
    ],
    steps: [
      "Das Sofrito. In einer breiten Paellapfanne eine großzügige Schicht Olivenöl erhitzen. Die Fleischstücke bei mittlerer Hitze anbraten, bis sie eine tiefe goldene und knusprige Farbe annehmen. Das ist die Grundlage des Geschmacks",
      "Das Gemüse. Schieben Sie das Fleisch an die Ränder und geben Sie in die Mitte die grünen Bohnen und die geriebene Tomate. Atmen Sie dieses süße Aroma des Sofrito ein; lassen Sie es 3 bis 4 Minuten auf dem Feuer",
      "Die Magie der Brühe. Gießen Sie das Wasser hinein (es muss genau bis zu den Nieten der Griffe der Paellapfanne reichen). Fügen Sie den Rosmarinzweig und die Safranfäden hinzu. Lassen Sie dieses Gebräu 20 Minuten bei schwacher Hitze köcheln und das Haus mit einem berauschenden Duft füllen. Geben Sie Salz hinzu: Die Brühe sollte etwas salziger sein, als Sie es gewohnt sind",
      "Der Reis und die Stille. Entfernen Sie den Rosmarin. Geben Sie den Reis kreuzförmig (caballón) hinein und verteilen Sie ihn dann sorgfältig mit der Schaumkelle in einer gleichmäßigen Schicht. Ab diesem Moment ist es strengstens verboten, das Gericht umzurühren!",
      "Die Geburt des Socarrat. 18 Minuten kochen (zuerst bei starker Hitze, dann reduzieren). Hören Sie aufmerksam hin: Wenn das Wasser fast verdampft ist, beginnt der Reis auf sehr charakteristische und appetitliche Weise zu knistern; das ist die Kruste, die sich röstet. Schalten Sie die Hitze aus, decken Sie die Paella mit einem sauberen Tuch ab und lassen Sie sie 5 Minuten „ruhen“.",
    ],
  },
  {
    title: "2. Llauna de Calp",
    description: "Die Seele unseres Hafens. Stellen Sie sich das zarteste Filet von frischem Fisch vor, durchzogen vom süßen Saft gerösteter Tomaten und einem lebendigen Knoblauchöl.",
    source: [
      "Quelle: Das Werk La cocina alicantina im BIVALDI-Archiv.",
    ],
    ingredients: [
      "Das Ritual: Sie benötigen: 600 g weißen Fisch mit festem Fleisch (Seehecht, Seeteufel oder Dorade in dicken Stücken), 3 Kartoffeln, 2 reife Tomaten, 3 Knoblauchzehen, 1 Teelöffel edelsüßes Paprikapulver, bestes natives Olivenöl extra",
    ],
    notes: [
    ],
    steps: [
      "Das Bett. Schneiden Sie Kartoffeln und Tomaten in feine, elegante Scheiben. Legen Sie sie überlappend in eine Auflaufform: zuerst die Kartoffel, darauf die Tomaten. Leicht salzen",
      "Der Fisch. Auf dieses Bett aus Gemüse legen Sie die saftigen und dicken Fischstücke",
      "Das aromatische Öl. Hacken Sie den Knoblauch sehr fein, mischen Sie ihn mit dem Paprika und streuen Sie ihn großzügig über den Fisch. Nun beträufeln Sie alles mit einem kräftigen Faden Olivenöl, damit die Zutaten appetitlich glänzen",
      "Das Backen. Stellen Sie die Form für 25 Minuten in den auf 200°C vorgeheizten Ofen. Die Kartoffel wird weich und buttrig, und der Fisch beginnt, sich schon bei der Berührung mit der Gabel in perlmuttartige Fasern aufzulösen.",
    ],
  },
  {
    title: "3. Arròs del Senyoret (Der Reis des Herrchens)",
    description: "Die perfekte Wahl, wenn Sie Meeresfrüchte genießen möchten, ohne sich die Finger schmutzig zu machen. Hier sind alle Garnelen und Tintenfische bereits geschält: ein reiner und seidiger Meeresgeschmack.",
    source: [
      "Quelle: Archive der Biblioteca Virtual Miguel de Cervantes.",
    ],
    ingredients: [
      "Das Ritual: Sie benötigen: 300 g Bomba-Reis, 300 g geschälte rohe Garnelen, 200 g Tintenfischringe, 1 Liter kräftige Fischbrühe (Sie können eine gute fertige Brühe im Supermarkt kaufen), 1 Esslöffel Tomatenpaste oder hausgemachte Salmorreta",
    ],
    notes: [
    ],
    steps: [
      "Schnelles Sofrito. Öl in der Paellapfanne erhitzen. Geben Sie die Garnelen nur 30 Sekunden hinein, nur damit sie Farbe annehmen, und nehmen Sie sie sofort auf einen Teller heraus (sonst werden sie gummiartig). Machen Sie dasselbe mit den Tintenfischen",
      "Der Geschmack. Geben Sie in dieses aromatische, nach Meer duftende Öl die Tomatenpaste. Kurz anbraten und dann den Reis hinzufügen. Mit einem Holzlöffel umrühren, damit jedes Korn durchzogen wird und einen perlmuttartigen Glanz erhält",
      "Das langsame Garen. Gießen Sie die heiße, dampfende Fischbrühe hinein. Fügen Sie Safran hinzu. 15 bis 18 Minuten bei schwacher Hitze kochen, ohne umzurühren",
      "Das große Finale. 2 Minuten vor Schluss, wenn die Brühe fast aufgesogen ist, verteilen Sie die zurückgelegten Garnelen und Tintenfische ästhetisch über dem Reis. Sofort servieren und dazu eine Schüssel dicken hausgemachten Alioli auf den Tisch stellen.",
    ],
  },
  {
    title: "4. Putxero de Polp (Oktopus-Eintopf)",
    description: "Die Magie des langsamen Kochens. Das Fleisch des Oktopus wird so zart, dass man es mit dem Löffel schneiden kann, und die reichhaltige Brühe umhüllt es mit der Süße der Süßkartoffel.",
    source: [
      "Quelle: Archive der Fischerzunft Peix de Calp.",
    ],
    ingredients: [
      "Das Ritual: Sie benötigen: 1 mittelgroßen Oktopus (am besten bereits gefroren kaufen, damit er zarter wird), 200 g Kichererbsen aus der Dose (der Schnelligkeit halber), 2 Süßkartoffeln, 1 Zwiebel, eine Handvoll geröstete Mandeln",
    ],
    notes: [
    ],
    steps: [
      "Der Oktopus. Ohne ihn vollständig aufzutauen, den Oktopus in kochendes Wasser geben. Die ganze Zwiebel hinzufügen und 40–50 Minuten bei schwacher Hitze kochen, wobei ein behaglicher Duft das Haus erfüllt. Stechen Sie mit einer Gabel in einen Tentakel: Er muss zart sein",
      "Die Konsistenz. Geben Sie die Süßkartoffeln in großen, süßen Stücken und die abgespülten Kichererbsen zur Brühe. Weitere 15 Minuten kochen",
      "Das Geheimnis des Küchenchefs. Zerstoßen Sie die Mandeln in einem Mörser (oder Mixer) mit ein paar Löffeln Brühe. Geben Sie diese Paste 5 Minuten vor Schluss in den Topf. Die Brühe wird augenblicklich cremig, samtig und bekommt ein feines nussiges Profil.",
    ],
  },
  {
    title: "5. Fideuà de Gandia",
    description: "Hier ist die feine Nudel der Protagonist. Während sie sich mit der heißen Brühe vollsaugt, nimmt die Pasta das ganze Wesen der Meeresfrüchte auf und krümmt sich am Ende spielerisch nach oben, wodurch eine knusprige Kruste entsteht.",
    source: [
      "Quelle: Das kanonische Rezept der Asociación Fideuà de Gandia.",
    ],
    ingredients: [
      "Das Ritual: Sie benötigen: 300 g spezielle Fideuà-Nudeln (Nr. 3 oder Nr. 4), 4–6 ganze Langostinos oder große Garnelen, 200 g Weißfischfilet, 1 Liter Fischbrühe, Safranfäden",
    ],
    notes: [
    ],
    steps: [
      "Das Öl aromatisieren. In einer Paellapfanne oder breiten Pfanne die Langostinos anbraten, bis sie eine leuchtend orange Farbe annehmen (sie geben ihren ganzen Geschmack an das Öl ab). Beiseitestellen",
      "Die Nudeln rösten. In dasselbe Öl die Fischstücke und dann die trockenen Nudeln geben. Unter ständigem Rühren einige Minuten rösten, bis sie einen goldenen Haselnusston annehmen. Das verhindert, dass sie übergaren",
      "Das Aufkochen. Die kochende Brühe mit Safran hineingießen (sie muss zischen!). Die Langostinos obenauf legen. 10 bis 12 Minuten bei starker Hitze lassen. Wenn die Nudeln die gesamte Flüssigkeit aufgenommen haben und sich frech aufzurichten beginnen, ist das Gericht fertig. Ein paar Tropfen Zitronensaft direkt auf dem Teller heben den Geschmack ins Absolute.",
    ],
  },
  {
    title: "6. Cruet de Peix (Historischer Fischeintopf)",
    description: "Das Geheimnis liegt in der Rohtechnik: Hier wird nichts angebraten. Die Kartoffel nimmt die Säfte des Fisches auf und verwandelt die Brühe in einen goldenen Nektar, in den man bis zum letzten Tropfen frisches Brot tunken möchte.",
    source: [
      "Quelle: Originalhandschrift des Llibre de Sent Soví (Jahr 1324).",
    ],
    ingredients: [
      "Das Ritual: Sie benötigen: 800 g beliebigen Felsenfisch mit Gräten (bitten Sie auf dem Markt, ihn für Suppe zu zerschneiden), 4 Kartoffeln, 1 Zwiebel, 3 Knoblauchzehen, eine Prise Safran, ein halbes Glas Olivenöl",
    ],
    notes: [
    ],
    steps: [
      "Das Zusammensetzen. Nehmen Sie einen schönen Topf. Legen Sie auf den Boden ein kompaktes „Bett“ aus dicken Kartoffel- und Zwiebelscheiben. Darüber verteilen Sie die Fischstücke und geben die ungeschälten Knoblauchzehen hinzu",
      "Die Emulsion. Gießen Sie kaltes Wasser nur so weit ein, dass der Fisch bedeckt ist (nicht mehr!). Geben Sie Salz, Safran hinzu und gießen Sie das Olivenöl ein",
      "Bei schwacher Hitze. Zum Kochen bringen und dann die Hitze reduzieren. 20–25 Minuten sanft köcheln lassen. Niemals mit einem Löffel umrühren! Schwenken Sie den Topf nur von Zeit zu Zeit an den Griffen, damit sich Öl und Wasser zu einer dicken und unglaublich schmackhaften Sauce verbinden.",
    ],
  },
  {
    title: "7. Espencat (Mediterrane Escalivada mit Kabeljau)",
    description: "Das rauchige und süßliche Aroma der gerösteten Gemüse kontrastiert auf phänomenale Weise mit der salzigen Note des Kabeljaus. Und das Olivenöl verbindet alles zu einer Vorspeise, von der man sich nicht losreißen kann.",
    source: [
      "Quelle: Forschungen des Lehrstuhls für Gastronomie der Universität Alicante.",
    ],
    ingredients: [
      "Das Ritual: Sie benötigen: 2 fleischige rote Paprika, 1 große Aubergine, 150 g gesalzene Kabeljaukrümel (in Supermärkten erhältlich), 2 Knoblauchzehen, reichlich natives Olivenöl extra",
    ],
    notes: [
    ],
    steps: [
      "Das Rösten. Geben Sie die ganzen Paprika und die Aubergine für 40–50 Minuten in den Ofen (200°C), bis ihre Haut schwarz wird und sich runzelt. Erschrecken Sie nicht, das muss so sein! Lassen Sie sie abkühlen",
      "Handarbeit. Entfernen Sie die „verkohlte“ Haut (sie geht leicht ab). Verwenden Sie kein Messer! Reißen Sie das saftige Fruchtfleisch des Gemüses mit den Händen in lange Streifen direkt in eine Salatschüssel",
      "Der Kabeljau. Wenn der Kabeljau zu salzig ist, spülen Sie ihn mit Wasser ab. Zerpflücken Sie ihn in Fasern und geben Sie ihn zum Gemüse",
      "Die Vollendung. Fügen Sie den sehr fein gehackten Knoblauch hinzu und beträufeln Sie alles großzügig, ohne zu sparen, mit einem guten Schuss Olivenöl. Lassen Sie es mindestens eine Stunde im Kühlschrank ruhen.",
    ],
  },
  {
    title: "8. Arroz a Banda",
    description: "Die Apotheose des maritimen Minimalismus. Der Reis wird in einer kräftigen Brühe gekocht und nimmt die ganze Kraft des Meeres auf. Jedes Korn wird zu einer leuchtenden Umami-Bombe.",
    source: [
      "Quelle: Werke des Historikers Antonio Beltrán.",
    ],
    ingredients: [
      "Das Ritual: Sie benötigen: 300 g Bomba-Reis, 150 g frischen Sepia in Würfeln, 1 Liter der konzentriertesten Fischbrühe, die Sie finden, 2 Knoblauchzehen, 1 Teelöffel edelsüßes Paprikapulver",
    ],
    notes: [
    ],
    steps: [
      "Die Sepia. In einer Paellapfanne oder breiten Pfanne Öl erhitzen. Die zarten Sepiawürfel einige Minuten anbraten, bis sie goldbraun sind. Den fein gehackten Knoblauch hinzufügen",
      "Das Paprika und der Reis. Nehmen Sie die Pfanne vom Herd, geben Sie das Paprika hinein und rühren Sie schnell um (wenn das Paprika verbrennt, wird das Gericht bitter). Sofort den Reis hinzufügen und die Pfanne wieder auf den Herd stellen. Den Reis 1 Minute anschwitzen",
      "Das Garen. Die gesamte kochende Fischbrühe hineingießen. 18 Minuten kochen und beobachten, wie der Reis gierig das Meer aufnimmt. Sehr heiß servieren und das Gericht mit einem Löffel Alioli krönen.",
    ],
  },
  {
    title: "9. All i Pebre (Knoblauch und Pfeffer)",
    description: "Ein kühnes und temperamentvolles Gericht. Seine dicke, tiefrote Sauce umhüllt die zarten Stücke von Weißfisch und Kartoffel. Diese Sauce ist so gut, dass Sie ein ganzes Brot essen werden, indem Sie die Krume in den Teller tunken.",
    source: [
      "Quelle: Originaltraktat Llibre de Coch (Jahr 1520).",
    ],
    ingredients: [
      "Das Ritual: Sie benötigen: 500 g Weißfischfilet (frischer Kabeljau, Dorade), 3 Kartoffeln, einen ganzen Knoblauchkopf, 1 Esslöffel edelsüßes Paprikapulver, etwas scharfe Chilischote nach Geschmack, Olivenöl",
    ],
    notes: [
    ],
    steps: [
      "Die Basis. In einer tiefen Pfanne oder Kasserolle das Öl gut erhitzen. 5 oder 6 geschälte Knoblauchzehen und die Chilischote hineingeben. Braten, bis sie ein spektakuläres Aroma verströmen und einen goldenen Ton annehmen",
      "Die Sauce. Vom Herd nehmen! Das Paprika hineingeben, umrühren und sofort 2 Gläser Wasser hineingießen, damit das Gewürz nicht verbrennt. Wieder auf den Herd stellen",
      "Die Kartoffel. Schneiden Sie die Kartoffel mit einem „Klack“ (einen kleinen Schnitt mit dem Messer machen und den Rest des Stücks abbrechen; so gibt sie die Stärke frei, die die Sauce eindickt). In die kochende Brühe geben",
      "Der Fisch. Nach 15 Minuten, wenn die Brühe eingedickt ist und die Kartoffel weich ist, die großen Fischstücke in die Sauce tauchen. Weitere 5 bis 7 Minuten kochen.",
    ],
  },
  {
    title: "10. Coca amb Tonyina (Alicante-Coca mit Thunfisch)",
    description: "Eine uralte herzhafte Teigtasche, die Sie den Kopf verlieren lässt. Ihr dünner und knuspriger Teig verbirgt karamellisierte süße Zwiebel, auf der Zunge zergehenden Thunfisch und geröstete Pinienkerne.",
    source: [
      "Quelle: Digitale Bestände der Nationalbibliothek Spaniens.",
    ],
    ingredients: [
      "Das Ritual: Sie benötigen: Für den Teig: 250 g Mehl, 100 ml Olivenöl, 100 ml Weißwein, eine Prise Salz. Für die Füllung: 2 Dosen guten Thunfischs in Öl (das Öl abgießen), 2 große Zwiebeln, eine Handvoll Pinienkerne, 1 Teelöffel edelsüßes Paprikapulver",
    ],
    notes: [
    ],
    steps: [
      "Die Füllung. In einer Pfanne die fein gehackte Zwiebel bei schwacher Hitze etwa 20 Minuten dünsten, bis sie eine bernsteinfarbene Süße erreicht. Vom Herd nehmen, den Thunfisch (mit einer Gabel zerpflückt), die knusprigen Pinienkerne und das Paprika hinzufügen. Gut mischen",
      "Der Teig. In einer Schüssel Wein, Öl und Salz mischen. Das Mehl nach und nach hinzufügen und kneten, bis ein glatter und unglaublich formbarer Teig entsteht. In zwei Teile teilen",
      "Das Zusammensetzen. Die erste Hälfte des Teigs auf Backpapier zu einem dünnen Rechteck ausrollen. Die aromatische Füllung verteilen. Mit der zweiten Teigschicht bedecken und die Ränder elegant verschließen. Die Oberseite mit einer Gabel einstechen",
      "Das Backen. Im Ofen (190°C) 30–35 Minuten backen. Herausnehmen, wenn sich das Haus mit Festduft füllt und die Kruste goldbraun und knusprig ist. Diese Coca kann sowohl warm als auch kalt genossen werden.",
    ],
  },
];

const SECTIONS_UK: RecipesModalSection[] = [
  {
    title: "1. Paella Valenciana (Справжня валенсійська паелья)",
    description: "Забудьте про туристичну паелью з креветками та ковбасками. Справжня валенсійська класика — це симфонія м’яса, ніжних овочів і рису, просоченого золотистим бульйоном. Головна мета — socarrat (карамелізована скоринка на дні).",
    source: [
      "Джерело: Офіційний регламент DO Arroz de Valencia.",
    ],
    ingredients: [
      "Ритуал (на 4 особи): Вам знадобиться: 400 г круглого рису Bomba, 500 г курки шматочками, 300 г кролика, 200 г плоскої зеленої квасолі (bajoqueta), 100 г гаррофону, 1 тертий помідор, дрібка шафрану, гілочка свіжого розмарину",
    ],
    notes: [
    ],
    steps: [
      "Софріто. У широкій паельєрі розігрійте щедрий шар оливкової олії. Обсмажуйте шматки м’яса на середньому вогні, поки вони не набудуть насиченого золотистого й хрусткого кольору. Це основа смаку",
      "Овочі. Відсуньте м’ясо до країв і покладіть у центр зелену квасолю та тертий помідор. Вдихніть цей солодкий аромат софріто; тримайте на вогні 3–4 хвилини",
      "Магія бульйону. Влийте воду (вона має доходити точно до заклепок ручок паельєри). Додайте гілочку розмарину та нитки шафрану. Дайте цій суміші повільно кипіти 20 хвилин, наповнюючи дім п’янким ароматом. Додайте сіль: бульйон має бути трохи солонішим, ніж ви звикли",
      "Рис і тиша. Заберіть розмарин. Насипте рис хрестом (caballón), а потім обережно розподіліть його рівним шаром шумівкою. Від цього моменту суворо заборонено перемішувати страву!",
      "Народження socarrat. Готуйте 18 хвилин (спочатку на сильному вогні, потім зменште його). Слухайте уважно: коли вода майже випарується, рис почне потріскувати дуже характерно й апетитно; це підсмажується скоринка. Вимкніть вогонь, накрийте паелью чистим рушником і дайте їй «відпочити» 5 хвилин.",
    ],
  },
  {
    title: "2. Llauna de Calp",
    description: "Душа нашого порту. Уявіть найніжніше філе свіжої риби, просочене солодким соком запечених томатів і яскравою часниковою олією.",
    source: [
      "Джерело: Праця La cocina alicantina в архіві BIVALDI.",
    ],
    ingredients: [
      "Ритуал: Вам знадобиться: 600 г білої риби зі щільним м’ясом (хек, морський чорт або дорада великими шматками), 3 картоплини, 2 стиглі помідори, 3 зубчики часнику, 1 чайна ложка солодкої паприки, найкраща оливкова олія extra virgin",
    ],
    notes: [
    ],
    steps: [
      "Ложе. Наріжте картоплю та помідори тонкими, елегантними кружечками. Викладіть їх унахлист у форму для запікання: спочатку картоплю, зверху помідори. Злегка посоліть",
      "Риба. На це овочеве «ложе» покладіть соковиті, товсті шматки риби",
      "Ароматна олія. Дуже дрібно поріжте часник, змішайте його з паприкою й щедро посипте рибу. Тепер полийте все густою цівкою оливкової олії, щоб інгредієнти апетитно блищали",
      "Запікання. Поставте форму в розігріту до 200°C духовку на 25 хвилин. Картопля стане м’якою і маслянистою, а риба почне розпадатися на перламутрові волокна від одного лише дотику виделки.",
    ],
  },
  {
    title: "3. Arròs del Senyoret (Рис для сеньйора)",
    description: "Ідеальний вибір, якщо ви хочете насолоджуватися морепродуктами, не забруднивши пальців. Тут усі креветки й кальмари вже очищені: чистий і шовковистий смак моря.",
    source: [
      "Джерело: Архіви Biblioteca Virtual Miguel de Cervantes.",
    ],
    ingredients: [
      "Ритуал: Вам знадобиться: 300 г рису Bomba, 300 г очищених сирих креветок, 200 г кілець кальмара, 1 літр насиченого рибного бульйону (хороший готовий бульйон можна купити в супермаркеті), 1 столова ложка томатної пасти або домашньої salmorreta",
    ],
    notes: [
    ],
    steps: [
      "Швидке софріто. Розігрійте олію в паельєрі. Покладіть креветки лише на 30 секунд, тільки щоб вони набули кольору, і негайно перекладіть їх на тарілку (інакше вони стануть гумовими). Те саме зробіть із кальмарами",
      "Смак. У цю саму ароматну олію, що пахне морем, додайте томатну пасту. Трохи обсмажте її та всипте рис. Перемішайте дерев’яною ложкою, щоб кожне зернятко просочилося і набуло перламутрового блиску",
      "Повільне приготування. Влийте гарячий, паруючий рибний бульйон. Додайте шафран. Готуйте на слабкому вогні 15–18 хвилин, не перемішуючи",
      "Великий фінал. За 2 хвилини до кінця, коли бульйон майже вбереться, красиво розподіліть по рису відкладені креветки й кальмари. Подавайте відразу, поставивши на стіл миску густого домашнього айолі.",
    ],
  },
  {
    title: "4. Putxero de Polp (Пучеро з восьминога)",
    description: "Магія повільного приготування. М’ясо восьминога стає таким ніжним, що його можна різати ложкою, а багатий бульйон огортає його солодкістю батату.",
    source: [
      "Джерело: Архіви рибальського братства Peix de Calp.",
    ],
    ingredients: [
      "Ритуал: Вам знадобиться: 1 середній восьминіг (купуйте вже замороженим, щоб він був ніжнішим), 200 г консервованого нуту (для швидкості), 2 батати, 1 цибулина, жменя підсмаженого мигдалю",
    ],
    notes: [
    ],
    steps: [
      "Восьминіг. Не розморожуючи його повністю, занурте восьминога в окріп. Додайте цілу цибулину й варіть на слабкому вогні 40–50 хвилин, наповнюючи дім затишним ароматом. Проткніть щупальце виделкою: воно має бути м’яким",
      "Консистенція. Додайте в бульйон батат великими солодкими шматками та промитий нут. Кип’ятіть ще 15 хвилин",
      "Секрет шефа. Розітріть мигдаль у ступці (або блендері) з кількома ложками бульйону. Влийте цю пасту в каструлю за 5 хвилин до кінця. Бульйон миттєво стане кремовим, оксамитовим і набуде тонкого горіхового відтінку.",
    ],
  },
  {
    title: "5. Fideuà de Gandia",
    description: "Тут головним героєм є тонка вермішель. Просочуючись гарячим бульйоном, паста вбирає всю сутність морепродуктів і наприкінці кумедно загинається догори, створюючи хрустку скоринку.",
    source: [
      "Джерело: Канонічний рецепт Asociación Fideuà de Gandia.",
    ],
    ingredients: [
      "Ритуал: Вам знадобиться: 300 г спеціальної вермішелі для fideuà (№ 3 або № 4), 4–6 цілих лангустинів або великих креветок, 200 г філе білої риби, 1 літр рибного бульйону, нитки шафрану",
    ],
    notes: [
    ],
    steps: [
      "Ароматизація олії. У паельєрі або широкій сковороді обсмажте лангустинів, поки вони не набудуть яскраво-помаранчевого кольору (вони віддадуть увесь свій смак олії). Відкладіть їх",
      "Підсмажування вермішелі. У тій самій олії покладіть шматочки риби, а потім суху вермішель. Постійно помішуючи, підсмажуйте її кілька хвилин, поки вона не набуде золотисто-горіхового відтінку. Це не дасть їй переваритися",
      "Кипіння. Влийте киплячий бульйон із шафраном (він має зашипіти!). Викладіть зверху лангустинів. Готуйте на сильному вогні 10–12 хвилин. Коли вермішель увбере всю рідину і почне зухвало підніматися, страва готова. Кілька крапель лимонного соку просто на тарілці піднімуть смак до абсолюту.",
    ],
  },
  {
    title: "6. Cruet de Peix (Історичне рибне рагу)",
    description: "Секрет у сирій техніці: тут нічого не обсмажується. Картопля просочується соками риби, перетворюючи бульйон на золотий нектар, у який захочеться вмочати свіжий хліб до останньої краплі.",
    source: [
      "Джерело: Оригінальний рукопис Llibre de Sent Soví (1324 рік).",
    ],
    ingredients: [
      "Ритуал: Вам знадобиться: 800 г будь-якої скельної риби з кісткою (попросіть на ринку порізати її для супу), 4 картоплини, 1 цибулина, 3 зубчики часнику, дрібка шафрану, пів склянки оливкової олії",
    ],
    notes: [
    ],
    steps: [
      "Збирання. Візьміть гарну каструлю. Викладіть на дно щільне «ложе» з товстих кружалець картоплі та цибулі. Зверху розподіліть шматки риби й додайте неочищені зубчики часнику",
      "Емульсія. Влийте холодну воду рівно стільки, щоб покрити рибу (не більше!). Додайте сіль, шафран і влийте оливкову олію",
      "На слабкому вогні. Доведіть до кипіння, а потім зменште вогонь. Готуйте на слабкому вогні 20–25 хвилин. Ніколи не перемішуйте ложкою! Просто час від часу похитуйте каструлю за ручки, щоб олія й вода змішалися в густий і неймовірно смачний соус.",
    ],
  },
  {
    title: "7. Espencat (Середземноморська ескалівада з тріскою)",
    description: "Копчено-солодкуватий аромат печених овочів феноменально контрастує із солоною ноткою тріски. А оливкова олія поєднує все це в закуску, від якої неможливо відірватися.",
    source: [
      "Джерело: Дослідження кафедри гастрономії Університету Аліканте.",
    ],
    ingredients: [
      "Ритуал: Вам знадобиться: 2 м’ясисті червоні перці, 1 великий баклажан, 150 г крихт солоної тріски (доступні в супермаркетах), 2 зубчики часнику, багато оливкової олії extra virgin",
    ],
    notes: [
    ],
    steps: [
      "Запікання. Покладіть цілі перці та баклажан у духовку (200°C) на 40–50 хвилин, поки їхня шкірка не почорніє й не зморщиться. Не лякайтеся, так і має бути! Дайте їм охолонути",
      "Ручна робота. Зніміть «обвуглену» шкірку (вона легко зійде). Не використовуйте ніж! Розривайте соковитий м’якуш овочів руками на довгі смужки прямо в салатницю",
      "Тріска. Якщо тріска занадто солона, промийте її водою. Розберіть її на волокна й додайте до овочів",
      "Завершення. Додайте дуже дрібно нарізаний часник і щедро, не шкодуючи, полийте все доброю цівкою оливкової олії. Залиште в холодильнику щонайменше на одну годину.",
    ],
  },
  {
    title: "8. Arroz a Banda",
    description: "Апофеоз морського мінімалізму. Рис вариться в потужному бульйоні, вбираючи всю силу моря. Кожне зернятко стає блискучою бомбою умамі.",
    source: [
      "Джерело: Праці історика Антоніо Бельтрана.",
    ],
    ingredients: [
      "Ритуал: Вам знадобиться: 300 г рису Bomba, 150 г свіжої каракатиці, нарізаної кубиками, 1 літр найбільш концентрованого рибного бульйону, який ви знайдете, 2 зубчики часнику, 1 чайна ложка солодкої паприки",
    ],
    notes: [
    ],
    steps: [
      "Каракатиця. У паельєрі або широкій сковороді розігрійте олію. Обсмажуйте ніжні кубики каракатиці кілька хвилин, поки вони не підрум’яняться. Додайте дрібно нарізаний часник",
      "Паприка і рис. Зніміть сковороду з вогню, всипте паприку й швидко перемішайте (якщо паприка підгорить, страва стане гіркою). Відразу додайте рис і знову поставте на вогонь. Обсмажте рис 1 хвилину",
      "Приготування. Влийте весь киплячий рибний бульйон. Готуйте 18 хвилин, спостерігаючи, як рис жадібно вбирає море. Подавайте дуже гарячим, увінчавши страву ложкою айолі.",
    ],
  },
  {
    title: "9. All i Pebre (Часник і перець)",
    description: "Смілива й темпераментна страва. Її густий соус насичено-червоного кольору огортає ніжні шматки білої риби й картоплі. Цей соус настільки смачний, що ви з’їсте цілу хлібину, вмочаючи м’якуш у тарілку.",
    source: [
      "Джерело: Оригінальний трактат Llibre de Coch (1520 рік).",
    ],
    ingredients: [
      "Ритуал: Вам знадобиться: 500 г філе білої риби (свіжа тріска, дорада), 3 картоплини, ціла головка часнику, 1 столова ложка солодкої паприки, трохи гострого чилі за смаком, оливкова олія",
    ],
    notes: [
    ],
    steps: [
      "Основа. У глибокій сковороді або каструлі добре розігрійте олію. Покладіть 5 або 6 очищених зубчиків часнику та чилі. Смажте, поки вони не почнуть виділяти чудовий аромат і не набудуть золотистого відтінку",
      "Соус. Зніміть із вогню! Додайте паприку, перемішайте і відразу влийте 2 склянки води, щоб спеція не підгоріла. Знову поставте на вогонь",
      "Картопля. Наріжте картоплю, роблячи «клац» (зробіть маленький надріз ножем і відламайте решту шматка; так вона виділить крохмаль, який загустить соус). Додайте її в киплячий бульйон",
      "Риба. Через 15 хвилин, коли бульйон загусне, а картопля стане м’якою, занурте у соус великі шматки риби. Готуйте ще 5–7 хвилин.",
    ],
  },
  {
    title: "10. Coca amb Tonyina (Алікантська кока з тунцем)",
    description: "Дуже давній пиріг, від якого можна втратити голову. Його тонке й хрустке тісто приховує солодку карамелізовану цибулю, тунця, що тане в роті, і підсмажені кедрові горішки.",
    source: [
      "Джерело: Цифрові фонди Національної бібліотеки Іспанії.",
    ],
    ingredients: [
      "Ритуал: Вам знадобиться: Для тіста: 250 г борошна, 100 мл оливкової олії, 100 мл білого вина, дрібка солі. Для начинки: 2 банки доброго консервованого тунця (злити олію), 2 великі цибулини, жменя кедрових горішків, 1 чайна ложка солодкої паприки",
    ],
    notes: [
    ],
    steps: [
      "Начинка. На сковороді, на слабкому вогні, тушкуйте дрібно нарізану цибулю близько 20 хвилин, поки вона не набуде бурштинової солодкості. Зніміть із вогню, додайте тунця (розім’ятого виделкою), хрусткі кедрові горішки та паприку. Добре перемішайте",
      "Тісто. У мисці змішайте вино, олію та сіль. Поступово додавайте борошно, вимішуючи, поки не отримаєте гладке й неймовірно податливе тісто. Розділіть його на дві частини",
      "Збирання. Розкачайте першу половину тіста в тонкий прямокутник на папері для випікання. Розподіліть ароматну начинку. Накрийте другим шаром тіста й елегантно защипніть краї. Наколіть верх виделкою",
      "Випікання. Поставте в духовку (190°C) на 30–35 хвилин. Дістаньте, коли дім наповниться святковим ароматом, а скоринка стане золотою та хрусткою. Цю коку можна їсти як гарячою, так і холодною.",
    ],
  },
];

const SECTIONS_PL: RecipesModalSection[] = [
  {
    title: "1. Paella Valenciana (Autentyczna paella walencka)",
    description: "Zapomnij o turystycznej paelli z krewetkami i kiełbasami. Prawdziwy walencki klasyk to symfonia mięsa, delikatnych warzyw i ryżu nasiąkniętego złotym bulionem. Głównym celem jest socarrat (skarmelizowana warstwa na dnie).",
    source: [
      "Źródło: Oficjalny regulamin DO Arroz de Valencia.",
    ],
    ingredients: [
      "Rytuał (dla 4 osób): Będziesz potrzebować: 400 g okrągłego ryżu Bomba, 500 g pokrojonego kurczaka, 300 g królika, 200 g płaskiej zielonej fasolki (bajoqueta), 100 g fasoli garrofón, 1 startego pomidora, szczypty szafranu, gałązki świeżego rozmarynu",
    ],
    notes: [
    ],
    steps: [
      "Sofrito. Na szerokiej patelni do paelli rozgrzej obfitą warstwę oliwy z oliwek. Smaż kawałki mięsa na średnim ogniu, aż nabiorą głębokiego złotego i chrupiącego koloru. To podstawa smaku",
      "Warzywa. Odsuń mięso na brzegi i wrzuć na środek fasolkę oraz starty pomidor. Wdychaj ten słodki aromat sofrito; trzymaj na ogniu 3–4 minuty",
      "Magia bulionu. Wlej wodę (powinna sięgać dokładnie do nitów przy uchwytach patelni do paelli). Dodaj gałązkę rozmarynu i nitki szafranu. Niech ta mikstura gotuje się powoli przez 20 minut, napełniając dom odurzającym aromatem. Dodaj sól: bulion powinien być trochę bardziej słony niż zwykle",
      "Ryż i cisza. Wyjmij rozmaryn. Wsyp ryż na krzyż (caballón), a następnie ostrożnie rozprowadź go w równą warstwę łyżką cedzakową. Od tego momentu mieszanie potrawy jest surowo zabronione!",
      "Narodziny socarratu. Gotuj przez 18 minut (najpierw na mocnym ogniu, potem go zmniejsz). Słuchaj uważnie: kiedy woda prawie odparuje, ryż zacznie charakterystycznie i apetycznie trzaskać; to skórka, która się przypieka. Wyłącz ogień, przykryj paellę czystą ściereczką i pozostaw ją na 5 minut, aby „odpoczęła”.",
    ],
  },
  {
    title: "2. Llauna de Calp",
    description: "Dusza naszego portu. Wyobraź sobie najdelikatniejszy filet świeżej ryby, nasiąknięty słodkim sokiem pieczonych pomidorów i wyrazistą oliwą czosnkową.",
    source: [
      "Źródło: Dzieło La cocina alicantina w archiwum BIVALDI.",
    ],
    ingredients: [
      "Rytuał: Będziesz potrzebować: 600 g białej ryby o zwartym mięsie (morszczuk, żabnica lub dorada w grubych kawałkach), 3 ziemniaki, 2 dojrzałe pomidory, 3 ząbki czosnku, 1 łyżeczkę słodkiej papryki, najlepszą oliwę extra virgin",
    ],
    notes: [
    ],
    steps: [
      "Łóżko. Pokrój ziemniaki i pomidory w cienkie, eleganckie plasterki. Ułóż je zachodząco w naczyniu do pieczenia: najpierw ziemniaki, na nich pomidory. Lekko posól",
      "Ryba. Na tym warzywnym „łóżku” ułóż soczyste, grube kawałki ryby",
      "Aromatyczna oliwa. Posiekaj czosnek bardzo drobno, wymieszaj go z papryką i obficie posyp nim rybę. Następnie skrop całość grubą strużką oliwy z oliwek, aby składniki apetycznie lśniły",
      "Pieczenie. Wstaw naczynie do piekarnika nagrzanego do 200°C na 25 minut. Ziemniaki staną się miękkie i maślane, a ryba zacznie rozpadać się na perłowe włókna przy samym dotknięciu widelca.",
    ],
  },
  {
    title: "3. Arròs del Senyoret (Ryż dla panicza)",
    description: "Idealny wybór, jeśli chcesz cieszyć się owocami morza bez brudzenia palców. Tutaj wszystkie krewetki i kalmary są już obrane: czysty i jedwabisty smak morza.",
    source: [
      "Źródło: Archiwa Biblioteca Virtual Miguel de Cervantes.",
    ],
    ingredients: [
      "Rytuał: Będziesz potrzebować: 300 g ryżu Bomba, 300 g obranych surowych krewetek, 200 g krążków kalmara, 1 litr mocnego bulionu rybnego (dobry gotowy bulion można kupić w supermarkecie), 1 łyżkę koncentratu pomidorowego lub domowej salmorrety",
    ],
    notes: [
    ],
    steps: [
      "Szybkie sofrito. Rozgrzej oliwę w patelni do paelli. Wrzuć krewetki zaledwie na 30 sekund, tylko aby nabrały koloru, i natychmiast przełóż je na talerz (w przeciwnym razie będą gumowate). To samo zrób z kalmarami",
      "Smak. Do tej samej aromatycznej oliwy, pachnącej morzem, dodaj koncentrat pomidorowy. Lekko go podsmaż i wsyp ryż. Mieszaj drewnianą łyżką, aby każde ziarenko się nim pokryło i nabrało perłowego połysku",
      "Wolne gotowanie. Wlej gorący, parujący bulion rybny. Dodaj szafran. Gotuj na małym ogniu przez 15–18 minut, nie mieszając",
      "Wielki finał. Na 2 minuty przed końcem, kiedy bulion prawie się wchłonie, estetycznie rozłóż na ryżu odłożone krewetki i kalmary. Podawaj od razu, stawiając na stole miseczkę gęstego domowego alioli.",
    ],
  },
  {
    title: "4. Putxero de Polp (Gulasz z ośmiornicy)",
    description: "Magia powolnego gotowania. Mięso ośmiornicy staje się tak delikatne, że można je kroić łyżką, a bogaty bulion otula je słodyczą batata.",
    source: [
      "Źródło: Archiwa Bractwa Rybaków Peix de Calp.",
    ],
    ingredients: [
      "Rytuał: Będziesz potrzebować: 1 średnią ośmiornicę (kup już zamrożoną, aby była bardziej delikatna), 200 g ciecierzycy z puszki (dla szybkości), 2 bataty, 1 cebulę, garść prażonych migdałów",
    ],
    notes: [
    ],
    steps: [
      "Ośmiornica. Nie rozmrażając jej całkowicie, zanurz ośmiornicę we wrzątku. Dodaj całą cebulę i gotuj na małym ogniu przez 40–50 minut, wypełniając dom przytulnym aromatem. Nakłuj mackę widelcem: powinna być miękka",
      "Konsystencja. Dodaj do bulionu bataty pokrojone w duże, słodkie kawałki oraz opłukaną ciecierzycę. Gotuj jeszcze 15 minut",
      "Sekret szefa kuchni. Utrzyj migdały w moździerzu (lub blenderze) z kilkoma łyżkami bulionu. Wlej tę pastę do garnka 5 minut przed końcem. Bulion natychmiast stanie się kremowy, aksamitny i nabierze subtelnego orzechowego profilu.",
    ],
  },
  {
    title: "5. Fideuà de Gandia",
    description: "Tutaj główną rolę gra cienki makaron. Nasiąkając gorącym bulionem, pasta wchłania całą esencję owoców morza i na końcu zabawnie wygina się ku górze, tworząc chrupiącą skorupkę.",
    source: [
      "Źródło: Kanoniczny przepis Asociación Fideuà de Gandia.",
    ],
    ingredients: [
      "Rytuał: Będziesz potrzebować: 300 g specjalnego makaronu do fideuà (nr 3 lub nr 4), 4–6 całych langustynek lub dużych krewetek królewskich, 200 g filetu z białej ryby, 1 litr bulionu rybnego, nitki szafranu",
    ],
    notes: [
    ],
    steps: [
      "Aromatyzowanie oliwy. Na patelni do paelli lub szerokiej patelni podsmaż langustynki, aż nabiorą intensywnie pomarańczowego koloru (oddadzą cały swój smak oliwie). Odłóż je na bok",
      "Prażenie makaronu. Na tej samej oliwie dodaj kawałki ryby, a następnie suchy makaron. Cały czas mieszając, praż go przez kilka minut, aż nabierze złotobrązowego, orzechowego odcienia. To zapobiegnie jego rozgotowaniu",
      "Wrzenie. Wlej wrzący bulion z szafranem (musi skwierczeć!). Ułóż na wierzchu langustynki. Gotuj na dużym ogniu przez 10–12 minut. Kiedy makaron wchłonie cały płyn i zacznie bezczelnie się unosić, danie jest gotowe. Kilka kropel soku z cytryny bezpośrednio na talerzu wyniesie smak na absolutny poziom.",
    ],
  },
  {
    title: "6. Cruet de Peix (Historyczny gulasz rybny)",
    description: "Sekret tkwi w surowej technice: tutaj niczego się wcześniej nie smaży. Ziemniak nasiąka sokami ryby, zamieniając bulion w złoty nektar, w którym będzie się chciało maczać świeży chleb aż do ostatniej kropli.",
    source: [
      "Źródło: Oryginalny manuskrypt Llibre de Sent Soví (rok 1324).",
    ],
    ingredients: [
      "Rytuał: Będziesz potrzebować: 800 g dowolnej ryby skalnej z ośćmi (poproś na targu, aby pokroili ją na zupę), 4 ziemniaki, 1 cebulę, 3 ząbki czosnku, szczyptę szafranu, pół szklanki oliwy z oliwek",
    ],
    notes: [
    ],
    steps: [
      "Montaż. Weź ładny garnek. Na dnie ułóż zwarte „łóżko” z grubych plastrów ziemniaka i cebuli. Na wierzchu rozłóż kawałki ryby i dodaj nieobrane ząbki czosnku",
      "Emulsja. Wlej zimną wodę tylko tyle, aby przykryła rybę (nie więcej!). Dodaj sól, szafran i wlej oliwę z oliwek",
      "Na małym ogniu. Doprowadź do wrzenia, a następnie zmniejsz ogień. Gotuj na małym ogniu przez 20–25 minut. Nigdy nie mieszaj łyżką! Po prostu co jakiś czas kołysz garnkiem za uchwyty, aby oliwa i woda połączyły się w gęsty i niezwykle smaczny sos.",
    ],
  },
  {
    title: "7. Espencat (Śródziemnomorska escalivada z dorszem)",
    description: "Dymny i słodkawy aromat pieczonych warzyw fenomenalnie kontrastuje ze słoną nutą dorsza. A oliwa z oliwek spaja wszystko w przystawkę, od której nie sposób się oderwać.",
    source: [
      "Źródło: Badania Katedry Gastronomii Uniwersytetu w Alicante.",
    ],
    ingredients: [
      "Rytuał: Będziesz potrzebować: 2 mięsiste czerwone papryki, 1 dużego bakłażana, 150 g płatków solonego dorsza (dostępnych w supermarketach), 2 ząbki czosnku, dużo oliwy extra virgin",
    ],
    notes: [
    ],
    steps: [
      "Pieczenie. Włóż całe papryki i bakłażana do piekarnika (200°C) na 40–50 minut, aż ich skórka sczernieje i się pomarszczy. Nie przestrasz się, tak właśnie ma być! Pozostaw do ostygnięcia",
      "Praca ręczna. Zdejmij „zwęgloną” skórkę (zejdzie łatwo). Nie używaj noża! Rozdzieraj soczysty miąższ warzyw rękami na długie paski bezpośrednio do salaterki",
      "Dorsz. Jeśli dorsz jest zbyt słony, opłucz go wodą. Rozdziel go na włókna i dodaj do warzyw",
      "Zwieńczenie. Dodaj bardzo drobno posiekany czosnek i hojnie, nie szczędząc, polej wszystko porządnym strumieniem oliwy z oliwek. Odstaw do lodówki na co najmniej godzinę.",
    ],
  },
  {
    title: "8. Arroz a Banda",
    description: "Apoteoza marynarskiego minimalizmu. Ryż gotuje się w mocnym bulionie, wchłaniając całą siłę morza. Każde ziarenko staje się błyszczącą bombą umami.",
    source: [
      "Źródło: Dzieła historyka Antonio Beltrána.",
    ],
    ingredients: [
      "Rytuał: Będziesz potrzebować: 300 g ryżu Bomba, 150 g świeżej mątwy pokrojonej w kostkę, 1 litr najbardziej skoncentrowanego bulionu rybnego, jaki znajdziesz, 2 ząbki czosnku, 1 łyżeczkę słodkiej papryki",
    ],
    notes: [
    ],
    steps: [
      "Mątwa. Na patelni do paelli lub szerokiej patelni rozgrzej oliwę. Smaż delikatne kostki mątwy przez kilka minut, aż się zarumienią. Dodaj drobno posiekany czosnek",
      "Papryka i ryż. Zdejmij patelnię z ognia, wsyp paprykę i szybko zamieszaj (jeśli papryka się przypali, danie będzie gorzkie). Natychmiast wsyp ryż i ponownie postaw na ogniu. Podsmażaj ryż przez 1 minutę",
      "Gotowanie. Wlej cały wrzący bulion rybny. Gotuj przez 18 minut, obserwując, jak ryż łapczywie chłonie morze. Podawaj bardzo gorące, wieńcząc danie łyżką alioli.",
    ],
  },
  {
    title: "9. All i Pebre (Czosnek i pieprz)",
    description: "Odważne i temperamentne danie. Jego gęsty, intensywnie czerwony sos otula delikatne kawałki białej ryby i ziemniaka. Ten sos jest tak dobry, że zjesz całą bagietkę, maczając miękisz w talerzu.",
    source: [
      "Źródło: Oryginalny traktat Llibre de Coch (rok 1520).",
    ],
    ingredients: [
      "Rytuał: Będziesz potrzebować: 500 g filetu z białej ryby (świeży dorsz, dorada), 3 ziemniaki, całą główkę czosnku, 1 łyżkę słodkiej papryki, trochę ostrej chili do smaku, oliwę z oliwek",
    ],
    notes: [
    ],
    steps: [
      "Baza. Na głębokiej patelni lub w rondlu dobrze rozgrzej oliwę. Wrzuć 5 lub 6 obranych ząbków czosnku i chili. Smaż je, aż zaczną wydzielać spektakularny aromat i nabiorą złotego odcienia",
      "Sos. Zdejmij z ognia! Wsyp paprykę, zamieszaj i natychmiast wlej 2 szklanki wody, aby przyprawa się nie przypaliła. Ponownie postaw na ogniu",
      "Ziemniak. Pokrój ziemniaka robiąc „klap” (zrób małe nacięcie nożem, a resztę kawałka odłam; w ten sposób uwolni skrobię, która zagęści sos). Wrzuć go do wrzącego bulionu",
      "Ryba. Po 15 minutach, gdy bulion zgęstnieje, a ziemniak będzie miękki, zanurz w sosie duże kawałki ryby. Gotuj jeszcze 5–7 minut.",
    ],
  },
  {
    title: "10. Coca amb Tonyina (Alicanteńska coca z tuńczykiem)",
    description: "Prastara wytrawna empanada, od której można stracić głowę. Jej cienkie i chrupiące ciasto skrywa słodką karmelizowaną cebulę, tuńczyka rozpływającego się w ustach i prażone orzeszki piniowe.",
    source: [
      "Źródło: Cyfrowe zbiory Biblioteki Narodowej Hiszpanii.",
    ],
    ingredients: [
      "Rytuał: Będziesz potrzebować: Na ciasto: 250 g mąki, 100 ml oliwy z oliwek, 100 ml białego wina, szczyptę soli. Na nadzienie: 2 puszki dobrego tuńczyka w oleju (odsączyć olej), 2 duże cebule, garść orzeszków piniowych, 1 łyżeczkę słodkiej papryki",
    ],
    notes: [
    ],
    steps: [
      "Nadzienie. Na patelni, na małym ogniu, duś drobno posiekaną cebulę przez około 20 minut, aż osiągnie bursztynową słodycz. Zdejmij z ognia, dodaj tuńczyka (rozdrobnionego widelcem), chrupiące orzeszki piniowe i paprykę. Dobrze wymieszaj",
      "Ciasto. W misce wymieszaj wino, oliwę i sól. Stopniowo dodawaj mąkę, zagniatając, aż uzyskasz gładkie i niezwykle plastyczne ciasto. Podziel je na dwie części",
      "Montaż. Rozwałkuj pierwszą połowę ciasta na cienki prostokąt na papierze do pieczenia. Rozłóż aromatyczne nadzienie. Przykryj drugą warstwą ciasta i elegancko zlep brzegi. Nakłuj wierzch widelcem",
      "Pieczenie. Wstaw do piekarnika (190°C) na 30–35 minut. Wyjmij, gdy dom wypełni się świątecznym aromatem, a skórka będzie złota i chrupiąca. Tę cocę można jeść zarówno na ciepło, jak i na zimno.",
    ],
  },
];

export const recipesModalSectionsByLang: Record<Lang, RecipesModalSection[]> = {
  eng: SECTIONS_ENG,
  esp: SECTIONS_ESP,
  ru: SECTIONS_RU,
  fr: SECTIONS_FR,
  it: SECTIONS_IT,
  de: SECTIONS_DE,
  uk: SECTIONS_UK,
  pl: SECTIONS_PL,
};
