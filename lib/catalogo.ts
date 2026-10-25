/**
 * Catálogo de servicios de RAMNCO.
 *
 * Una sola fuente de verdad para la página `/servicios`: datos puros, sin
 * JSX ni dependencias, para que se pueda importar desde cualquier componente
 * (servidor o cliente) sin arrastrar estilos ni lógica.
 */

export interface ServicioCatalogo {
  nombre: string;
  descripcion: string;
  resultado?: string;
}

export interface CategoriaCatalogo {
  id: string;
  nombre: string;
  resumen: string;
  icono: string;
  servicios: ServicioCatalogo[];
}

/** Total de servicios del catálogo (se calcula una vez, no en tiempo de render). */
export function contarServicios(categorias: CategoriaCatalogo[] = CATEGORIAS): number {
  return categorias.reduce((total, categoria) => total + categoria.servicios.length, 0);
}

export const CATEGORIAS: CategoriaCatalogo[] = [
  /* ------------------------------------------------------------------ 01 */
  {
    id: "aplicaciones",
    nombre: "Aplicaciones",
    resumen: "Sistemas con usuarios, paneles y datos propios.",
    icono: "apps",
    servicios: [
      {
        nombre: "Aplicaciones web completas",
        descripcion: "Sistemas con login, base de datos y paneles hechos a la medida de tu operación.",
        resultado: "Aplicación lista para usar",
      },
      {
        nombre: "Aplicaciones Android",
        descripcion: "Apps nativas para Android, pensadas para el uso diario de tus clientes.",
        resultado: "APK o Play Store",
      },
      {
        nombre: "Aplicaciones PWA",
        descripcion: "Web instalable en el teléfono, sin pasar por las tiendas de aplicaciones.",
        resultado: "App instalable",
      },
      {
        nombre: "Aplicaciones multiplataforma",
        descripcion: "Un solo desarrollo para Android y iOS, con la misma base y los mismos datos.",
        resultado: "iOS + Android",
      },
      {
        nombre: "Portales privados",
        descripcion: "Áreas cerradas con acceso propio para tu equipo, colaboradores o proveedores.",
        resultado: "Acceso con credenciales",
      },
      {
        nombre: "Portales de clientes",
        descripcion: "Cada cliente entra y revisa sus pedidos, documentos y estados sin pedirlos por correo.",
        resultado: "Autoservicio para clientes",
      },
      {
        nombre: "Aplicaciones de reservas",
        descripcion: "Agenda con horarios, cupos y confirmaciones automáticas según tu operación.",
        resultado: "Agenda en línea",
      },
      {
        nombre: "Seguimiento de solicitudes",
        descripcion: "Cada solicitud tiene estado, responsable y fecha, visible para quien la hizo.",
        resultado: "Estado en tiempo real",
      },
      {
        nombre: "Comunidades privadas",
        descripcion: "Espacios con perfiles y contenidos exclusivos para socios o suscriptores.",
        resultado: "Comunidad cerrada",
      },
      {
        nombre: "Aplicaciones gamificadas",
        descripcion: "Puntos, niveles y logros para que el uso del sistema enganche a los usuarios.",
        resultado: "Uso recurrente",
      },
      {
        nombre: "Modernización de sistemas",
        descripcion: "Rescatamos sistemas antiguos y los trasladamos a una base actual y mantenible.",
        resultado: "Sistema actualizado",
      },
    ],
  },

  /* ------------------------------------------------------------------ 02 */
  {
    id: "paginas-web",
    nombre: "Páginas web",
    resumen: "Presencia digital que se ve profesional y convierte.",
    icono: "web",
    servicios: [
      {
        nombre: "Sitios corporativos",
        descripcion: "La cara de tu empresa en internet: servicios, equipo y contacto ordenados.",
        resultado: "Sitio institucional",
      },
      {
        nombre: "Landing pages",
        descripcion: "Una página enfocada en una sola acción, para campañas de conversión.",
        resultado: "Página enfocada",
      },
      {
        nombre: "Sitios para campañas",
        descripcion: "Páginas rápidas para promociones con lanzamiento, fechas y vencimiento.",
        resultado: "Campaña publicada",
      },
      {
        nombre: "Portafolios profesionales",
        descripcion: "Muestra tu experiencia con proyectos, imágenes y antecedentes bien presentados.",
        resultado: "Portafolio online",
      },
      {
        nombre: "Sitios para artistas",
        descripcion: "Música, galería, biografía y fechas reunidas en un sitio con carácter propio.",
        resultado: "Sitio artístico",
      },
      {
        nombre: "Sitios para restaurantes",
        descripcion: "Carta digital, horarios, ubicación y pedidos o reservas a un toque.",
        resultado: "Carta y reservas",
      },
      {
        nombre: "Sitios inmobiliarios",
        descripcion: "Propiedades con ficha, filtros, fotos y formulario de contacto directo.",
        resultado: "Catálogo de propiedades",
      },
      {
        nombre: "Sitios para talleres",
        descripcion: "Servicios, precios referenciales y agenda de horas para talleres y oficios.",
        resultado: "Agenda de servicios",
      },
      {
        nombre: "Sitios para eventos",
        descripcion: "Programa, asistentes e inscripción en una página pensada para una fecha.",
        resultado: "Sitio de evento",
      },
      {
        nombre: "Blogs y portales",
        descripcion: "Publicación de artículos con categorías, buscador y diseño editorial.",
        resultado: "Blog administrable",
      },
      {
        nombre: "Directorios digitales",
        descripcion: "Fichas ordenadas que se pueden buscar por rubro, comuna o categoría.",
        resultado: "Directorio consultable",
      },
      {
        nombre: "Rediseño web",
        descripcion: "Renovamos un sitio existente sin perder contenidos, URLs ni posicionamiento.",
        resultado: "Sitio renovado",
      },
      {
        nombre: "Accesibilidad web",
        descripcion: "Contraste, teclado y lectores de pantalla revisados para llegar a más gente.",
        resultado: "Sitio accesible",
      },
      {
        nombre: "Optimización de velocidad",
        descripcion: "Medimos, corregimos y dejamos un sitio que carga rápido en móvil.",
        resultado: "Carga más rápida",
      },
    ],
  },

  /* ------------------------------------------------------------------ 03 */
  {
    id: "comercio-electronico",
    nombre: "Comercio electrónico",
    resumen: "Tiendas y catálogos listos para vender.",
    icono: "tienda",
    servicios: [
      {
        nombre: "Tiendas online",
        descripcion: "Catálogo, carrito y pago en una tienda propia con tu imagen de marca.",
        resultado: "Tienda operativa",
      },
      {
        nombre: "WooCommerce",
        descripcion: "Tienda sobre WordPress, fácil de administrar por tu propio equipo.",
        resultado: "WooCommerce configurado",
      },
      {
        nombre: "Catálogos de productos",
        descripcion: "Productos con ficha, variantes, stock y buscador pensados para consultar.",
        resultado: "Catálogo digital",
      },
      {
        nombre: "Galerías de productos",
        descripcion: "Fotografías grandes y bien ordenadas para mostrar el detalle de lo que vendes.",
        resultado: "Galería de productos",
      },
      {
        nombre: "Comercio B2B",
        descripcion: "Precios y condiciones distintas por empresa, con acceso con clave.",
        resultado: "Portal B2B",
      },
      {
        nombre: "Compra mínima",
        descripcion: "Montos o cantidades mínimas de compra aplicadas automáticamente en el carro.",
        resultado: "Reglas de compra",
      },
      {
        nombre: "Cotización en línea",
        descripcion: "El cliente arma su cotización y la recibe sin escribirte por WhatsApp.",
        resultado: "Cotizador digital",
      },
      {
        nombre: "Panel de ventas",
        descripcion: "Revisa pedidos, pagos y productos vendidos en un solo lugar.",
        resultado: "Control de ventas",
      },
      {
        nombre: "Integración de pagos",
        descripcion: "Tarjetas y medios locales con cobro seguro dentro de la tienda.",
        resultado: "Pagos en línea",
      },
      {
        nombre: "Transferencias y conciliación",
        descripcion: "Transferencias identificadas y cuadradas con cada pedido de la tienda.",
        resultado: "Pagos conciliados",
      },
      {
        nombre: "Recuperación de ventas",
        descripcion: "Retoma carros abandonados con avisos automáticos por correo o WhatsApp.",
        resultado: "Carros recuperados",
      },
      {
        nombre: "Alertas de stock",
        descripcion: "Avisos cuando un producto está por agotarse o vuelve a estar disponible.",
        resultado: "Avisos de inventario",
      },
    ],
  },

  /* ------------------------------------------------------------------ 04 */
  {
    id: "paneles-gestion",
    nombre: "Paneles y gestión",
    resumen: "Control de la operación en una sola vista.",
    icono: "panel",
    servicios: [
      {
        nombre: "Dashboards personalizados",
        descripcion: "Los indicadores que importan, actualizados y en una sola pantalla.",
        resultado: "Panel de control",
      },
      {
        nombre: "Usuarios y permisos",
        descripcion: "Cada persona ve y modifica únicamente lo que le corresponde según su rol.",
        resultado: "Roles definidos",
      },
      {
        nombre: "CRM personalizado",
        descripcion: "Clientes, conversaciones y seguimiento ordenados según tu proceso real de venta.",
        resultado: "CRM a medida",
      },
      {
        nombre: "Gestión de pedidos",
        descripcion: "Pedidos con estados, responsables y trazabilidad desde la solicitud a la entrega.",
        resultado: "Pedidos trazables",
      },
      {
        nombre: "Gestión de cotizaciones",
        descripcion: "Cotiza, versiona y envía con precios y formatos bajo control.",
        resultado: "Cotizaciones al día",
      },
      {
        nombre: "Inventario",
        descripcion: "Stock al día con entradas, salidas y movimientos registrados.",
        resultado: "Stock actualizado",
      },
      {
        nombre: "Gestión documental",
        descripcion: "Archivos ordenados, versionados y con acceso según el perfil de cada usuario.",
        resultado: "Documentos ordenados",
      },
      {
        nombre: "Reportes automáticos",
        descripcion: "Informes que se generan y envían solos, sin armar planillas a mano.",
        resultado: "Reportes programados",
      },
      {
        nombre: "Historial de cambios",
        descripcion: "Quién cambió qué y cuándo, para auditar la operación sin discusiones.",
        resultado: "Registro auditable",
      },
      {
        nombre: "Flujos de aprobación",
        descripcion: "Pasos de revisión y visto bueno antes de emitir documentos o ejecutar acciones.",
        resultado: "Aprobaciones formales",
      },
    ],
  },

  /* ------------------------------------------------------------------ 05 */
  {
    id: "automatizacion",
    nombre: "Automatización",
    resumen: "Menos trabajo manual, menos errores.",
    icono: "auto",
    servicios: [
      {
        nombre: "Automatización de formularios",
        descripcion: "Los datos que llegan quedan guardados, clasificados y sin digitación manual.",
        resultado: "Datos ordenados",
      },
      {
        nombre: "Enrutamiento de solicitudes",
        descripcion: "Cada solicitud se deriva sola al área o persona que debe atenderla.",
        resultado: "Derivación automática",
      },
      {
        nombre: "Recordatorios automáticos",
        descripcion: "Avisos por correo o WhatsApp antes de cada vencimiento, sin olvidos.",
        resultado: "Cero vencimientos olvidados",
      },
      {
        nombre: "Notificaciones internas",
        descripcion: "Tu equipo se entera de lo importante en el momento en que ocurre.",
        resultado: "Equipo informado",
      },
      {
        nombre: "Generación de documentos",
        descripcion: "Contratos, cotizaciones y certificados generados solos desde los datos.",
        resultado: "Documentos autogenerados",
      },
      {
        nombre: "Sincronización de sistemas",
        descripcion: "Dos programas que trabajaban separados ahora comparten la misma información.",
        resultado: "Datos sincronizados",
      },
      {
        nombre: "Procesamiento por lotes",
        descripcion: "Miles de registros procesados ordenadamente, sin cargas manuales de archivos.",
        resultado: "Procesos masivos",
      },
      {
        nombre: "Monitoreo y alertas",
        descripcion: "Avisos automáticos cuando algo falla, se detiene o sale del rango esperado.",
        resultado: "Alertas tempranas",
      },
      {
        nombre: "Aprobación antes de ejecutar",
        descripcion: "Nada se ejecuta sin el visto bueno de quien corresponde, con registro.",
        resultado: "Ejecución controlada",
      },
      {
        nombre: "Integración de hojas de cálculo",
        descripcion: "Tu equipo sigue usando la planilla, pero los datos viajan ordenados al sistema.",
        resultado: "Planillas conectadas",
      },
    ],
  },

  /* ------------------------------------------------------------------ 06 */
  {
    id: "kapso-whatsapp",
    nombre: "Kapso y WhatsApp",
    resumen: "La conversación se vuelve proceso comercial.",
    icono: "chat",
    servicios: [
      {
        nombre: "Atención automatizada",
        descripcion: "Respuestas inmediatas a preguntas frecuentes, con la información o los enlaces correctos.",
        resultado: "Atención 24/7",
      },
      {
        nombre: "Calificación de prospectos",
        descripcion: "El sistema pregunta lo necesario y ordena cada consulta según su intención de compra.",
        resultado: "Prospectos ordenados",
      },
      {
        nombre: "Cotización por WhatsApp",
        descripcion: "El cliente arma su cotización dentro de la conversación y la recibe al instante.",
        resultado: "Cotización instantánea",
      },
      {
        nombre: "Seguimiento de prospectos",
        descripcion: "Retoma conversaciones pendientes con recordatorios automáticos al equipo de venta.",
        resultado: "Seguimiento al día",
      },
      {
        nombre: "Atención fuera de horario",
        descripcion: "Responde de noche y fines de semana en vez de dejar los mensajes sin contestar.",
        resultado: "Mensajes respondidos",
      },
      {
        nombre: "Derivación a ejecutivo",
        descripcion: "Cuando la conversación se pone compleja, pasa sola a la persona indicada.",
        resultado: "Traspaso ordenado",
      },
      {
        nombre: "Confirmación de reservas",
        descripcion: "Confirma, recordar y reagenda horas sin llamados telefónicos.",
        resultado: "Reservas confirmadas",
      },
      {
        nombre: "Estados de pedidos",
        descripcion: "El cliente consulta el avance de su pedido por el mismo canal donde compró.",
        resultado: "Consultas automatizadas",
      },
      {
        nombre: "Encuestas de satisfacción",
        descripcion: "Preguntas breves después de la atención para medir la experiencia real.",
        resultado: "Medición de experiencia",
      },
      {
        nombre: "Reactivación de clientes",
        descripcion: "Mensajes programados para clientes inactivos, con oferta o recordatorio oportuno.",
        resultado: "Clientes reactivados",
      },
      {
        nombre: "Registro en CRM",
        descripcion: "Cada conversación queda asentada como oportunidad, sin copiar y pegar a mano.",
        resultado: "Conversaciones registradas",
      },
      {
        nombre: "Panel de conversaciones",
        descripcion: "Todo el equipo ve y toma las conversaciones abiertas desde un mismo lugar.",
        resultado: "Bandeja compartida",
      },
    ],
  },

  /* ------------------------------------------------------------------ 07 */
  {
    id: "publicidad-marketing",
    nombre: "Publicidad y marketing",
    resumen: "Estrategia, pauta y medición.",
    icono: "ads",
    servicios: [
      {
        nombre: "Estructura de campañas",
        descripcion: "Objetivos, audiencias y presupuestos ordenados antes de invertir el primer peso.",
        resultado: "Plan de campaña",
      },
      {
        nombre: "Variantes A/B",
        descripcion: "Compara anuncios con un criterio fijo y deja la versión que mejor rinde.",
        resultado: "Versión ganadora",
      },
      {
        nombre: "Campañas de Meta Ads",
        descripcion: "Facebook e Instagram gestionados con creativos, segmentación y control del gasto.",
        resultado: "Meta Ads activo",
      },
      {
        nombre: "Campañas de Google Ads",
        descripcion: "Aparece justo cuando alguien busca lo que vendes, sin pagar de más.",
        resultado: "Google Ads activo",
      },
      {
        nombre: "Campañas de TikTok Ads",
        descripcion: "Anuncios de video pensados para audiencias nuevas y contenido nativo de la red.",
        resultado: "TikTok Ads activo",
      },
      {
        nombre: "Panel multicanal",
        descripcion: "Meta, Google y TikTok comparados en una sola vista, con los mismos criterios.",
        resultado: "Vista unificada",
      },
      {
        nombre: "Reportes periódicos",
        descripcion: "Informes claros y a tiempo con resultados, inversión y próximos pasos.",
        resultado: "Reporte mensual",
      },
      {
        nombre: "Alertas de presupuesto",
        descripcion: "Avisos cuando el gasto se dispara o rinde menos de lo esperado.",
        resultado: "Control de inversión",
      },
      {
        nombre: "Captura de leads",
        descripcion: "Formularios y campañas conectados para que ningún contacto se pierda.",
        resultado: "Leads registrados",
      },
      {
        nombre: "Seguimiento de leads",
        descripcion: "Cada contacto tiene estado y responsable, hasta que se convierte en cliente.",
        resultado: "Leads con seguimiento",
      },
      {
        nombre: "Calendario de contenido",
        descripcion: "Publicaciones planificadas y organizadas para no improvisar cada semana.",
        resultado: "Calendario editorial",
      },
      {
        nombre: "Remarketing",
        descripcion: "Vuelve a mostrar tus anuncios a quienes ya visitaron el sitio sin comprar.",
        resultado: "Audiencias recuperadas",
      },
    ],
  },

  /* ------------------------------------------------------------------ 08 */
  {
    id: "extractores-datos",
    nombre: "Extractores y datos",
    resumen: "Información ordenada y utilizable.",
    icono: "datos",
    servicios: [
      {
        nombre: "Extracción web",
        descripcion: "Tomamos datos públicos de sitios y los entregamos en tablas ordenadas.",
        resultado: "Datos estructurados",
      },
      {
        nombre: "Extractores de catálogos",
        descripcion: "Precios, fichas y stock de catálogos completos, listos para analizar.",
        resultado: "Catálogo exportado",
      },
      {
        nombre: "Procesos reanudables",
        descripcion: "Si el proceso se corta, continúa donde quedó y no empieza todo de nuevo.",
        resultado: "Procesos sin pérdida",
      },
      {
        nombre: "Detección de duplicados",
        descripcion: "Detectamos registros repetidos y los limpiamos con reglas definidas contigo.",
        resultado: "Base sin duplicados",
      },
      {
        nombre: "Extracción desde PDF",
        descripcion: "Convierte informes y boletas en PDF a bases editables sin transcribir.",
        resultado: "PDF a tabla",
      },
      {
        nombre: "Transcripción de audio",
        descripcion: "Convierte reuniones y llamadas en texto ordenado y buscable.",
        resultado: "Audio transcrito",
      },
      {
        nombre: "Monitoreo de cambios web",
        descripcion: "Aviso automático cuando un sitio publica o modifica algo de tu interés.",
        resultado: "Cambios detectados",
      },
      {
        nombre: "Limpieza de bases",
        descripcion: "Normalizamos nombres, RUT, teléfonos y formatos para unificar toda la información.",
        resultado: "Base unificada",
      },
      {
        nombre: "Conversión de formatos",
        descripcion: "Excel, CSV, JSON y PDF convertidos entre sí sin perder estructura.",
        resultado: "Archivos compatibles",
      },
      {
        nombre: "Datasets personalizados",
        descripcion: "Construimos la base que necesita tu análisis, con los campos que definas.",
        resultado: "Dataset a medida",
      },
      {
        nombre: "Entrega auditada",
        descripcion: "Cada entrega queda con registro de origen, fecha y método de obtención.",
        resultado: "Trazabilidad completa",
      },
    ],
  },

  /* ------------------------------------------------------------------ 09 */
  {
    id: "apis-integraciones",
    nombre: "APIs e integraciones",
    resumen: "Sistemas que se hablan entre sí.",
    icono: "api",
    servicios: [
      {
        nombre: "APIs REST",
        descripcion: "Una interfaz estable para que otros sistemas consulten y envíen tus datos.",
        resultado: "API documentada",
      },
      {
        nombre: "Backend Node o Python",
        descripcion: "La lógica del sistema, construida con tecnología actual y mantenible.",
        resultado: "Servidor operativo",
      },
      {
        nombre: "PostgreSQL y Supabase",
        descripcion: "Base de datos confiable, con reglas de acceso y respaldos desde el día uno.",
        resultado: "Base de datos segura",
      },
      {
        nombre: "Firebase",
        descripcion: "Autenticación, notificaciones y datos en tiempo real para apps móviles.",
        resultado: "App conectada",
      },
      {
        nombre: "Autenticación",
        descripcion: "Ingreso seguro con correo, Google o el proveedor que ya uses en tu empresa.",
        resultado: "Login seguro",
      },
      {
        nombre: "Permisos por perfil",
        descripcion: "El acceso se define por rol y no por el criterio de quien configura.",
        resultado: "Accesos controlados",
      },
      {
        nombre: "Archivos privados",
        descripcion: "Documentos servidos solo a usuarios autorizados, nunca con URL pública abierta.",
        resultado: "Archivos protegidos",
      },
      {
        nombre: "Webhooks",
        descripcion: "Un sistema avisa al otro apenas ocurre un evento, sin esperas ni consultas repetidas.",
        resultado: "Avisos entre sistemas",
      },
      {
        nombre: "Migración de datos",
        descripcion: "Pasamos la información existente a la nueva plataforma con verificación en cada etapa.",
        resultado: "Datos migrados",
      },
      {
        nombre: "Sincronización",
        descripcion: "Mantén dos plataformas con la misma información, sin planillas intermedias.",
        resultado: "Sistemas alineados",
      },
      {
        nombre: "Seguridad de credenciales",
        descripcion: "Claves y tokens guardados fuera del código y gestionados de forma segura.",
        resultado: "Credenciales protegidas",
      },
    ],
  },

  /* ------------------------------------------------------------------ 10 */
  {
    id: "soluciones-especializadas",
    nombre: "Soluciones especializadas",
    resumen: "Proyectos con requisitos propios.",
    icono: "especial",
    servicios: [
      {
        nombre: "Plataformas musicales",
        descripcion: "Catálogos, reproductores y perfiles para artistas, sellos y colectivos.",
        resultado: "Plataforma musical",
      },
      {
        nombre: "Salas virtuales",
        descripcion: "Espacios de reunión con acceso controlado, agendas y contenidos compartidos.",
        resultado: "Sala operativa",
      },
      {
        nombre: "Configuradores de productos",
        descripcion: "El cliente arma su producto paso a paso y ve el precio actualizado al instante.",
        resultado: "Configurador en línea",
      },
      {
        nombre: "Simuladores automotrices",
        descripcion: "Cotiza cuotas, seguros y permisos de circulación con variables reales del mercado.",
        resultado: "Simulador de crédito",
      },
      {
        nombre: "Catálogos editoriales",
        descripcion: "Libros y publicaciones con fichas, búsqueda y lectura de muestra ordenada.",
        resultado: "Catálogo editorial",
      },
      {
        nombre: "Marketplaces",
        descripcion: "Varios vendedores en una sola plataforma, cada uno con sus productos y pagos.",
        resultado: "Marketplace operativo",
      },
      {
        nombre: "Bibliotecas digitales",
        descripcion: "Colecciones de documentos y archivos organizados, buscables y con acceso por perfil.",
        resultado: "Biblioteca digital",
      },
      {
        nombre: "Postulaciones",
        descripcion: "Formularios con antecedentes, documentos y revisión centralizada de postulantes.",
        resultado: "Proceso de postulación",
      },
      {
        nombre: "Colaboración de equipos",
        descripcion: "Tareas, archivos y comunicación del equipo en un mismo espacio de trabajo.",
        resultado: "Equipo sincronizado",
      },
      {
        nombre: "Experiencias tipo videojuego",
        descripcion: "Interfaces interactivas con puntaje, desafíos y recompensas para públicos específicos.",
        resultado: "Experiencia interactiva",
      },
    ],
  },

  /* ------------------------------------------------------------------ 11 */
  {
    id: "publicacion-soporte",
    nombre: "Publicación y soporte",
    resumen: "Del despliegue a la continuidad.",
    icono: "soporte",
    servicios: [
      {
        nombre: "Repositorios Git",
        descripcion: "El código queda versionado y respaldado, sin depender de una sola persona.",
        resultado: "Código versionado",
      },
      {
        nombre: "Pruebas y control de calidad",
        descripcion: "Cada flujo revisado antes de publicar para evitar errores en producción.",
        resultado: "Revisión previa",
      },
      {
        nombre: "Despliegue web",
        descripcion: "Publicamos el sitio en un servidor estable, con dominio y proceso reproducible.",
        resultado: "Sitio en línea",
      },
      {
        nombre: "Dominios y HTTPS",
        descripcion: "Dominio propio, certificado vigente y redirecciones correctas configuradas.",
        resultado: "Dominio y HTTPS",
      },
      {
        nombre: "Mantenimiento mensual",
        descripcion: "Actualizaciones, correcciones y mejoras menores con un ritmo acordado.",
        resultado: "Servicio continuo",
      },
      {
        nombre: "Copias de seguridad",
        descripcion: "Respaldos automáticos y una prueba de restauración para saber que funcionan.",
        resultado: "Respaldo verificado",
      },
      {
        nombre: "Monitoreo de errores",
        descripcion: "Detectamos y corregimos errores antes de que el usuario los reporte.",
        resultado: "Errores bajo control",
      },
      {
        nombre: "Actualizaciones de seguridad",
        descripcion: "Parches y dependencias al día para cerrar las fallas conocidas a tiempo.",
        resultado: "Sistema protegido",
      },
      {
        nombre: "Documentación",
        descripcion: "Un manual claro sobre cómo funciona el sistema y cómo se mantiene.",
        resultado: "Manual del sistema",
      },
      {
        nombre: "Capacitación",
        descripcion: "Formación práctica para que tu equipo use el sistema sin depender de nadie.",
        resultado: "Equipo capacitado",
      },
      {
        nombre: "Auditoría técnica",
        descripcion: "Revisamos código, infraestructura y seguridad antes de escalar el proyecto.",
        resultado: "Informe técnico",
      },
      {
        nombre: "Recuperación de proyectos",
        descripcion: "Tomamos un proyecto detenido y lo dejamos en condiciones de avanzar.",
        resultado: "Proyecto recuperado",
      },
    ],
  },
];
