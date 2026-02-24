import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Lang = 'en' | 'es' | 'ru';

type TranslationMap = Record<string, { en: string; es: string; ru: string }>;

const translations: TranslationMap = {
  // Settings
  language: { en: 'Language', es: 'Idioma', ru: 'Язык' },
  settings: { en: 'Settings', es: 'Configuración', ru: 'Настройки' },
  data: { en: 'Data', es: 'Datos', ru: 'Данные' },
  wipeAllData: { en: 'Wipe all data', es: 'Borrar todos los datos', ru: 'Удалить все данные' },
  wipeAllDataDesc: {
    en: 'Delete all decks, cards, and groups',
    es: 'Eliminar todas las listas, tarjetas y grupos',
    ru: 'Стереть колоды, карточки и группы',
  },
  wipeAllDataTitle: {
    en: 'Wipe All Data',
    es: 'Borrar Todos los Datos',
    ru: 'Удалить все данные',
  },
  wipeAllDataConfirm: {
    en: 'This will permanently delete all decks, cards, and groups. This cannot be undone. Continue?',
    es: 'Esto eliminará permanentemente todas las listas, tarjetas y grupos. No se puede deshacer. ¿Continuar?',
    ru: 'Колоды, карточки и группы будут удалены навсегда. Не отменить. Продолжить?',
  },
  wipeAll: { en: 'Wipe All', es: 'Borrar Todo', ru: 'Удалить всё' },
  failedToWipeData: {
    en: 'Failed to wipe data. Please try again.',
    es: 'Error al borrar los datos. Por favor, inténtalo de nuevo.',
    ru: 'Ошибка. Попробуйте снова.',
  },
  english: { en: 'English', es: 'Inglés', ru: 'Английский' },
  spanish: { en: 'Spanish', es: 'Español', ru: 'Испанский' },
  russian: { en: 'Russian', es: 'Ruso', ru: 'Русский' },
  german: { en: 'German', es: 'Alemán', ru: 'Немецкий' },
  french: { en: 'French', es: 'Francés', ru: 'Французский' },
  italian: { en: 'Italian', es: 'Italiano', ru: 'Итальянский' },
  portuguese: { en: 'Portuguese', es: 'Portugués', ru: 'Португальский' },
  japanese: { en: 'Japanese', es: 'Japonés', ru: 'Японский' },
  chinese: { en: 'Chinese', es: 'Chino', ru: 'Китайский' },
  korean: { en: 'Korean', es: 'Coreano', ru: 'Корейский' },
  ukrainian: { en: 'Ukrainian', es: 'Ucraniano', ru: 'Украинский' },

  // Common
  info: { en: 'Info', es: 'Información', ru: 'Инфо' },
  cancel: { en: 'Cancel', es: 'Cancelar', ru: 'Отмена' },
  delete: { en: 'Delete', es: 'Eliminar', ru: 'Удалить' },
  error: { en: 'Error', es: 'Error', ru: 'Ошибка' },
  done: { en: 'Done', es: 'Listo', ru: 'Готово' },
  save: { en: 'Save', es: 'Guardar', ru: 'Сохранить' },
  add: { en: 'Add', es: 'Añadir', ru: 'Доб.' },
  remove: { en: 'Remove', es: 'Quitar', ru: 'Удалить' },
  loading: { en: 'Loading...', es: 'Cargando...', ru: 'Загрузка...' },

  // Decks (index)
  flashcards: { en: 'Flashcards', es: 'Tarjetas', ru: 'Карточки' },
  importTab: { en: 'Import', es: 'Importar', ru: 'Импорт' },
  import: { en: 'Import', es: 'Importar', ru: 'Импорт' },
  importSuccess: {
    en: 'Imported {count} decks into "{name}".',
    es: 'Se importaron {count} listas en "{name}".',
    ru: 'Импортировано {count} колод в "{name}".',
  },
  importFailed: {
    en: 'Failed to import. Please try again.',
    es: 'Error al importar. Por favor, inténtalo de nuevo.',
    ru: 'Ошибка импорта. Попробуйте снова.',
  },
  noLanguageDecks: {
    en: 'No language decks available.',
    es: 'No hay listas de idiomas disponibles.',
    ru: 'Нет доступных колод по языкам.',
  },
  frontLanguage: {
    en: 'Card fronts',
    es: 'Frente de tarjetas',
    ru: 'Язык перед',
  },
  viewCards: { en: 'View cards', es: 'Ver tarjetas', ru: 'Карточки' },
  addGroup: { en: 'Add group', es: 'Añadir grupo', ru: 'Доб. группу' },
  addList: { en: 'Add list', es: 'Añadir lista', ru: 'Доб. список' },
  loadingDecks: { en: 'Loading decks...', es: 'Cargando listas...', ru: 'Загрузка колод...' },
  noDecksYet: {
    en: "No decks created yet.\nTap Add to create your first deck or use Chat to generate one.",
    es: "No hay listas aún.\nToca Añadir para crear tu primera lista o usa el Chat para generar una.",
    ru: "Колод ещё нет.\nНажмите Доб. или используйте Чат.",
  },
  emptyDeck: { en: 'Empty Deck', es: 'Lista Vacía', ru: 'Пустая колода' },
  emptyDeckMessage: {
    en: 'This deck has no cards. Please add cards before starting.',
    es: 'Esta lista no tiene tarjetas. Añade tarjetas antes de empezar.',
    ru: 'В этой колоде нет карточек. Добавьте карточки перед началом.',
  },
  deleteDeck: { en: 'Delete Deck', es: 'Eliminar Lista', ru: 'Удалить колоду' },
  deleteDeckConfirm: {
    en: 'Are you sure you want to delete "{title}"?',
    es: '¿Estás seguro de que quieres eliminar "{title}"?',
    ru: 'Вы уверены, что хотите удалить "{title}"?',
  },
  addNewList: { en: 'Add New List', es: 'Añadir Nueva Lista', ru: 'Новая колода' },
  deckTitle: { en: 'Deck Title', es: 'Título de la lista', ru: 'Название колоды' },
  descriptionOptional: { en: 'Description (optional)', es: 'Descripción (opcional)', ru: 'Описание' },
  group: { en: 'Group', es: 'Grupo', ru: 'Группа' },
  addCards: { en: 'Add Cards', es: 'Añadir Tarjetas', ru: 'Доб. карточки' },
  addFlashcard: { en: 'Add Flashcard', es: 'Añadir tarjeta', ru: 'Доб. карточку' },
  front: { en: 'Front', es: 'Frente', ru: 'Перед' },
  back: { en: 'Back', es: 'Reverso', ru: 'Оборот' },
  frontLanguageOptional: { en: 'Front language (for voice)', es: 'Idioma del frente (voz)', ru: 'Язык перед' },
  backLanguageOptional: { en: 'Back language (for voice)', es: 'Idioma del reverso (voz)', ru: 'Язык оборот' },
  languageAuto: { en: 'Auto', es: 'Auto', ru: 'Авто' },
  noDescription: { en: 'No description', es: 'Sin descripción', ru: 'Без описания' },
  editDeck: { en: 'Edit Deck', es: 'Editar Lista', ru: 'Eдит колоду' },
  editCards: { en: 'Edit Cards', es: 'Editar Tarjetas', ru: 'Eдит карточки' },
  addedCards: { en: 'Added Cards', es: 'Tarjetas añadidas', ru: 'Доб. карточки' },
  cards: { en: 'cards', es: 'tarjetas', ru: 'карточек' },
  deck: { en: 'deck', es: 'lista', ru: 'колода' },
  decks: { en: 'decks', es: 'listas', ru: 'колоды' },
  addListWithCards: { en: 'Add list', es: 'Añadir lista', ru: 'Доб. колоду' },
  addGroupModal: { en: 'Add Group', es: 'Añadir Grupo', ru: 'Доб. группу' },
  editGroup: { en: 'Edit Group', es: 'Editar Grupo', ru: 'Eдит группу' },
  groupName: { en: 'Group name', es: 'Nombre del grupo', ru: 'Название группы' },
  color: { en: 'Color', es: 'Color', ru: 'Цвет' },
  deleteGroup: { en: 'Delete Group', es: 'Eliminar Grupo', ru: 'Удалить группу' },
  deleteGroupConfirm: {
    en: 'Delete "{name}"? This will also delete {count} deck(s) in this group.',
    es: '¿Eliminar "{name}"? Esto también eliminará {count} lista(s) de este grupo.',
    ru: 'Удалить "{name}"? Это также удалит {count} колод(ы) в этой группе.',
  },
  deleteGroupConfirmEmpty: { en: 'Delete "{name}"?', es: '¿Eliminar "{name}"?', ru: 'Удалить "{name}"?' },
  thisGroupHasNoDecks: {
    en: 'This group has no decks',
    es: 'Este grupo no tiene listas',
    ru: 'В этой группе нет колод',
  },
  pleaseEnterGroupName: { en: 'Please enter a group name', es: 'Por favor, ingresa un nombre de grupo', ru: 'Введите название группы' },
  pleaseEnterDeckTitle: { en: 'Please enter a deck title', es: 'Por favor, ingresa un título', ru: 'Введите название колоды' },
  pleaseEnterBothSides: { en: 'Please enter both front and back text', es: 'Ingresa el texto del frente y del reverso', ru: 'Введите текст с обеих сторон' },
  permissionNeeded: { en: 'Permission needed', es: 'Permiso necesario', ru: 'Требуется разрешение' },
  allowPhotos: { en: 'Allow access to photos to add images.', es: 'Permite el acceso a fotos para añadir imágenes.', ru: 'Разрешите доступ к фото для добавления изображений.' },
  allowCamera: { en: 'Allow camera access to take photos.', es: 'Permite el acceso a la cámara para tomar fotos.', ru: 'Разрешите доступ к камере для съёмки.' },
  takePhoto: { en: 'Take photo', es: 'Tomar foto', ru: 'Фото' },
  chooseFromGallery: { en: 'Choose from gallery', es: 'Elegir de galería', ru: 'Из галереи' },
  useCamera: { en: 'Use camera', es: 'Usar la cámara', ru: 'Камера' },
  useGallery: { en: 'Choose from gallery', es: 'Elegir de la galería', ru: 'Из галереи' },
  addImageOrPhoto: { en: 'Add image', es: 'Añadir imagen', ru: 'Доб. фото' },
  frontImage: { en: 'Front image', es: 'Imagen frontal', ru: 'Фото перед' },
  backImage: { en: 'Back image', es: 'Imagen reverso', ru: 'Фото оборот' },
  addImage: { en: 'Add image', es: 'Añadir imagen', ru: 'Доб. фото' },
  updateDeck: { en: 'Update Deck', es: 'Actualizar Lista', ru: 'Обновить' },
  createNewDeck: { en: 'Create new deck', es: 'Crear nueva lista', ru: 'Новая колода' },
  addToExisting: { en: 'Add to existing', es: 'Añadir a existente', ru: 'К существующей' },
  selectDeck: { en: 'Select deck', es: 'Seleccionar lista', ru: 'Выбор колоды' },
  noDecksYetShort: { en: 'No decks yet. Create a new deck first.', es: 'No hay listas. Crea una nueva primero.', ru: 'Нет колод. Создайте новую.' },
  addToApp: { en: 'Add to App', es: 'Añadir a la app', ru: 'В приложение' },
  addingCards: { en: 'Adding cards…', es: 'Añadiendo tarjetas…', ru: 'Добавляем…' },
  addToDeck: { en: 'Add to deck', es: 'Añadir a lista', ru: 'В колоду' },
  addCountToDeck: { en: 'Add {count} to deck', es: 'Añadir {count} a lista', ru: 'Доб. {count}' },
  flashcardsFound: { en: 'Flashcards Found', es: 'Tarjetas Encontradas', ru: 'Карточек найдено' },
  addFlashcardsToApp: { en: 'Add', es: 'Añadir', ru: 'Доб.' },
  nameYourDeck: { en: 'Name your deck', es: 'Nombre de tu lista', ru: 'Назовите колоду' },
  enterDeckTitle: { en: 'Enter deck title', es: 'Ingresa el título', ru: 'Введите название' },
  enterDeckDescription: { en: 'Enter deck description (optional)', es: 'Ingresa descripción (opcional)', ru: 'Описание' },
  success: { en: 'Success', es: 'Éxito', ru: 'Успешно' },
  addedCardsToDeck: { en: 'Added', es: 'Añadidas', ru: 'Добавлено' },
  deckNotFound: { en: 'Deck not found. It may have been deleted.', es: 'Lista no encontrada. Puede haber sido eliminada.', ru: 'Колода не найдена. Возможно, она была удалена.' },
  addedCardsSuccess: { en: 'Added {count} cards to "{title}"!', es: '¡Añadidas {count} tarjetas a "{title}"!', ru: 'Добавлено {count} карточек в "{title}"!' },

  // Chat
  chat: { en: 'Chat', es: 'Chat', ru: 'Чат' },
  clear: { en: 'Clear', es: 'Borrar', ru: 'Очистить' },
  clearChat: { en: 'Clear Chat', es: 'Borrar Chat', ru: 'Очистить чат' },
  clearChatConfirm: { en: 'Clear all messages and start over?', es: '¿Borrar todos los mensajes y empezar de nuevo?', ru: 'Очистить все сообщения и начать заново?' },
  askToCreateFlashcards: { en: 'Ask me to create flashcards...', es: 'Pídeme crear tarjetas...', ru: 'Создай карточки...' },
  deleteFlashcard: { en: 'Delete Flashcard', es: 'Eliminar Tarjeta', ru: 'Удалить карт.' },
  deleteFlashcardConfirm: { en: 'Are you sure you want to delete this flashcard?', es: '¿Estás seguro de que quieres eliminar esta tarjeta?', ru: 'Вы уверены, что хотите удалить эту карточку?' },
  apiKeyRequired: { en: 'API Key Required', es: 'API Key Requerida', ru: 'Требуется API ключ' },
  setGeminiKey: { en: 'Please set your Google Gemini API key.', es: 'Por favor, configura tu API key de Google Gemini.', ru: 'Пожалуйста, настройте API ключ Google Gemini.' },
  retry: { en: 'Retry', es: 'Reintentar', ru: 'Повторить' },
  chatNoApiKey: {
    en: 'Set your Gemini API key to send messages.',
    es: 'Configura tu API key de Gemini para enviar mensajes.',
    ru: 'Укажите API ключ Gemini, чтобы отправлять сообщения.',
  },
  chatOffline: {
    en: 'You\'re offline. Connect to the internet to send messages.',
    es: 'No hay conexión. Conéctate a internet para enviar mensajes.',
    ru: 'Нет подключения. Подключитесь к интернету.',
  },
  failedToPickImage: { en: 'Failed to pick image.', es: 'Error al seleccionar imagen.', ru: 'Не удалось выбрать изображение.' },
  imageNotSupported: { en: 'Image not supported', es: 'Imagen no soportada', ru: 'Изображение не поддерживается' },
  couldNotReadImage: { en: 'Could not read image data. Try another image.', es: 'No se pudo leer la imagen. Prueba con otra.', ru: 'Не удалось прочитать изображение. Попробуйте другое.' },
  addFlashcardsToDeck: { en: 'Add', es: 'Añadir', ru: 'Доб.' },
  thinking: { en: 'Thinking...', es: 'Pensando...', ru: 'Думаю...' },
  chatWelcome: {
    en: 'Hello! I\'m your flashcard assistant. Tell me what you\'d like to learn and I\'ll create cards. Examples: "Spanish to English words", "Biology terms", "World capitals". Add them to your app!',
    es: '¡Hola! Soy tu asistente de tarjetas. Dime qué quieres aprender y crearé las tarjetas. Ejemplos: "español a inglés", "términos de biología". ¡Añádelas a la app!',
    ru: 'Привет! Создаю карточки на любую тему. Напишите, что изучить. Примеры: «испанский-английский», «биология», «столицы». Добавляйте в приложение!',
  },
  hereAreFlashcardsRequested: {
    en: 'Here are the flashcards you requested:',
    es: 'Aquí están las tarjetas que pediste:',
    ru: 'Вот запрошенные карточки:',
  },
  noCardsInResponse: {
    en: 'No cards in this response. Please try again with a clear topic or number.',
    es: 'No hay tarjetas en esta respuesta. Intenta de nuevo con un tema o número claro.',
    ru: 'В ответе нет карточек. Попробуйте снова с темой или числом.',
  },
  foundFlashcardsInResponse: {
    en: 'I found these flashcards in the response:',
    es: 'Encontré estas tarjetas en la respuesta:',
    ru: 'Нашёл эти карточки в ответе:',
  },
  noFlashcardsGenerated: {
    en: 'No flashcards generated. Please try again or rephrase your request.',
    es: 'No se generaron tarjetas. Intenta de nuevo o reformula tu solicitud.',
    ru: 'Карточки не созданы. Попробуйте снова или перефразируйте запрос.',
  },
  bot: { en: 'Bot', es: 'Bot', ru: 'Бот' },
  you: { en: 'You', es: 'Tú', ru: 'Вы' },
  addFlashcardsToAppButton: { en: 'Add {count} Flashcards to App', es: 'Añadir {count} tarjetas a la app', ru: 'Доб. {count} карточек' },
  send: { en: 'Send', es: 'Enviar', ru: 'Отправить' },
  editMessage: { en: 'Edit', es: 'Editar', ru: 'Ред.' },
  saveEdit: { en: 'Save & resend', es: 'Guardar y reenviar', ru: 'Сохранить' },
  copy: { en: 'Copy', es: 'Copiar', ru: 'Копировать' },
  close: { en: 'Close', es: 'Cerrar', ru: 'Закрыть' },
  loadingDeck: { en: 'Loading deck...', es: 'Cargando lista...', ru: 'Загрузка колоды...' },
  deckNotFoundShort: { en: 'Deck not found', es: 'Lista no encontrada', ru: 'Колода не найдена' },
  goBack: { en: 'Go Back', es: 'Volver', ru: 'Назад' },

  // Flashcard game
  tapToReveal: { en: 'Tap or swipe to reveal', es: 'Toca o desliza para revelar', ru: 'Нажмите, чтобы открыть' },
  didYouRemember: { en: 'Did you remember?', es: '¿Lo recordaste?', ru: 'Запомнили?' },
  tapToHear: { en: 'Tap to hear', es: 'Toca para escuchar', ru: 'Нажмите, чтобы прослушать' },
  streak: { en: 'Streak', es: 'Racha', ru: 'Серия' },
  streakCalendar: { en: 'Streak calendar', es: 'Calendario de racha', ru: 'Календарь серии' },
  streakDone: { en: 'Done', es: 'Hecho', ru: 'Сделано' },
  streakMissed: { en: 'Missed', es: 'Perdido', ru: 'Пропущено' },
  streakToday: { en: 'Today', es: 'Hoy', ru: 'Сегодня' },
  streakUpcoming: { en: 'Upcoming', es: 'Próximo', ru: 'Предстоит' },
  days: { en: 'days', es: 'días', ru: 'дней' },
  playing: { en: 'Playing', es: 'Reproduciendo', ru: 'Воспроизведение' },
  congratulations: { en: 'Congratulations!', es: '¡Felicitaciones!', ru: 'Поздравляем!' },
  completedAllFlashcards: {
    en: "You've completed all {count} flashcards!",
    es: '¡Completaste las {count} tarjetas!',
    ru: 'Вы прошли все {count} карточек!',
  },
  completedOf: { en: '{completed} of {total} completed', es: '{completed} de {total} completadas', ru: '{completed} из {total} пройдено' },
  remaining: { en: '{count} remaining', es: '{count} restantes', ru: '{count} осталось' },
  playAgain: { en: 'Play Again', es: 'Jugar de nuevo', ru: 'Играть снова' },
  backToDecks: { en: 'Back to Decks', es: 'Volver a listas', ru: 'К колодам' },

  // Intro
  introWelcomeTitle: { en: 'Welcome to Flashcards!', es: '¡Bienvenido a Flashcards!', ru: 'Добро пожаловать в Flashcards!' },
  introWelcomeMessage: {
    en: 'Learn vocabulary the smart way. Swipe through cards, track your streak, and build your language skills.',
    es: 'Aprende vocabulario de forma inteligente. Desliza las tarjetas, sigue tu racha y mejora tus habilidades.',
    ru: 'Учите слова умно. Листайте карточки, отслеживайте серию и развивайте языковые навыки.',
  },
  introContinue: { en: 'Continue', es: 'Continuar', ru: 'Продолжить' },
  introUseCase: {
    en: 'How will you use the app?',
    es: '¿Cómo usarás la aplicación?',
    ru: 'Как вы будете использовать приложение?',
  },
  introCustomUse: {
    en: 'Custom use',
    es: 'Uso personalizado',
    ru: 'Свой вариант',
  },
  introCustomUseDesc: {
    en: 'Create your own decks and cards',
    es: 'Crea tus propias listas y tarjetas',
    ru: 'Создавайте свои колоды и карточки',
  },
  introLanguagesUse: {
    en: 'Learn a language',
    es: 'Aprender un idioma',
    ru: 'Изучать язык',
  },
  introLanguagesUseDesc: {
    en: 'Import ready-made vocabulary decks',
    es: 'Importa listas de vocabulario listas',
    ru: 'Импортируйте готовые колоды слов',
  },
  introFromLanguage: {
    en: 'From which language will you learn?',
    es: '¿Desde qué idioma aprenderás?',
    ru: 'С какого языка вы будете учить?',
  },
  introLearnLanguage: {
    en: 'Which language do you want to learn?',
    es: '¿Qué idioma quieres aprender?',
    ru: 'Какой язык вы хотите изучить?',
  },
  introImporting: { en: 'Importing…', es: 'Importando…', ru: 'Импортируем…' },

  // Dev
  dev: { en: 'Dev', es: 'Dev', ru: 'Dev' },
  devShowIntroEveryTime: {
    en: 'Show intro every time',
    es: 'Mostrar intro cada vez',
    ru: 'Показывать интро каждый раз',
  },

  // Subscription
  subscriptionTitle: {
    en: 'Unlock AI Chat',
    es: 'Desbloquea el Chat IA',
    ru: 'Разблокировать AI чат',
  },
  subscriptionSubtitle: {
    en: 'Subscribe to create unlimited flashcards with AI',
    es: 'Suscríbete para crear tarjetas ilimitadas con IA',
    ru: 'Подпишитесь, чтобы создавать карточки без ограничений с помощью ИИ',
  },
  monthly: { en: 'Monthly', es: 'Mensual', ru: 'Месячно' },
  yearly: { en: 'Yearly', es: 'Anual', ru: 'Ежегодно' },
  perMonth: { en: '/month', es: '/mes', ru: '/мес' },
  savePercent: { en: 'Save {percent}%', es: 'Ahorra {percent}%', ru: 'Экономия {percent}%' },
  bestValue: { en: 'Best value', es: 'Mejor precio', ru: 'Выгодно' },
  restorePurchases: {
    en: 'Restore purchases',
    es: 'Restaurar compras',
    ru: 'Восстановить покупки',
  },
  purchasing: { en: 'Processing...', es: 'Procesando...', ru: 'Обработка...' },
  purchaseFailed: {
    en: 'Purchase failed. Please try again.',
    es: 'Error en la compra. Inténtalo de nuevo.',
    ru: 'Ошибка покупки. Попробуйте снова.',
  },
  restoreFailed: {
    en: 'No purchases to restore.',
    es: 'No hay compras para restaurar.',
    ru: 'Нет покупок для восстановления.',
  },
  noOffersAvailable: {
    en: 'No subscription options available. Please try again later.',
    es: 'No hay opciones de suscripción. Inténtalo más tarde.',
    ru: 'Нет вариантов подписки. Попробуйте позже.',
  },
  user: { en: 'User', es: 'Usuario', ru: 'Пользователь' },
  upgrade: { en: 'Upgrade', es: 'Mejorar', ru: 'Улучшить' },
  manageSubscription: {
    en: 'Manage',
    es: 'Administrar',
    ru: 'Управление',
  },
  freeTrialDaysLeft: {
    en: 'Free trial: {days} days left',
    es: 'Prueba: {days} días',
    ru: 'Пробный: {days} дней',
  },
};

type LangStore = {
  lang: Lang;
  setLang: (lang: Lang) => Promise<void>;
  t: (key: keyof typeof translations, params?: Record<string, string | number>) => string;
};

export const useLangStore = create<LangStore>((set, get) => ({
  lang: 'en',

  setLang: async (lang) => {
    set({ lang });
    try {
      await AsyncStorage.setItem('flashcards_lang', lang);
    } catch (err) {
      console.warn('Failed to persist language:', err);
    }
  },

  t: (key: string, params?: Record<string, string | number>) => {
    const { lang } = get();
    const entry = translations[key as keyof typeof translations];
    if (!entry) return key;
    let text = entry[lang] || entry.en;
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
      });
    }
    return text;
  },
}));

export async function restoreLastLanguage() {
  try {
    const saved = await AsyncStorage.getItem('flashcards_lang');
    if (saved && ['en', 'es', 'ru'].includes(saved)) {
      useLangStore.setState({ lang: saved as Lang });
    }
  } catch (err) {
    console.warn('Failed to restore language:', err);
  }
}
