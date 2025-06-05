let lastScrollY = 0;

// Función que se ejecuta cuando un elemento observado entra o sale del viewport
const handleIntersect = (entries, observer) => {
    entries.forEach(entry => {
      const isScrollingDown = window.scrollY > lastScrollY;

      if (entry.isIntersecting) {
        // Si entra en la vista, siempre lo hacemos visible
        entry.target.classList.add('is-visible');
      } else {
        // Si sale de la vista
        const boundingClientRect = entry.boundingClientRect;
        const viewportHeight = window.innerHeight;

        // Si el elemento está completamente por encima del viewport (salió por arriba)
        // o completamente por debajo del viewport (salió por abajo)
        // Consideramos ocultarlo.
        // Una lógica más precisa para scroll arriba: si el borde inferior del elemento
        // está por encima del borde superior del viewport (salió hacia arriba)
        if (boundingClientRect.bottom < 0 && !isScrollingDown) {
           entry.target.classList.remove('is-visible');
        }
        // Ocultar también si sale completamente por abajo (aunque la animación al entrar
        // al scrollear hacia abajo ya maneja esto, es bueno tenerlo)
        if (boundingClientRect.top > viewportHeight && isScrollingDown) {
            entry.target.classList.remove('is-visible');
        }
         // Una simplificación: simplemente quitar la clase si no está intersecando.
         // Esto oculta al salir por arriba O por abajo. Puede ser suficiente visualmente.
         // entry.target.classList.remove('is-visible');
      }
    });
     lastScrollY = window.scrollY;
  };

  // Opciones para el observador (opcional, puedes ajustarlas)
// root: null - usa el viewport como contenedor
// rootMargin: '0px' - no añade margen alrededor del viewport
// threshold: 0.1 - el callback se ejecuta cuando al menos el 10% del elemento es visible
const observerOptions = {
    root: null,
    rootMargin: '0px',
    // Umbral 0 significa que el callback se dispara tan pronto como 1 pixel
    // del elemento entra o sale del viewport.
    threshold: 0,
  };
  
  // Crear una nueva instancia del IntersectionObserver
  const observer = new IntersectionObserver(handleIntersect, observerOptions);
  
  // Seleccionar todos los elementos con la clase 'faq-item'
  const faqItems = document.querySelectorAll('.faq-item');
  
  // Observar cada elemento seleccionado
  faqItems.forEach(item => {
    observer.observe(item);
  });

  // Opcional: resetear visibilidad al cargar la página para la primera vista
  document.addEventListener('DOMContentLoaded', () => {
      faqItems.forEach(item => {
          // Re-observar para asegurar que aparezcan si están en la vista inicial
          observer.unobserve(item); // Stop observing first to avoid issues
          observer.observe(item);
      });
  });

  // Opcional: Forzar una verificación inicial en caso de que algunos elementos
  // ya estén en la vista al cargar
  if (faqItems.length > 0) {
      // Pequeño timeout para dar tiempo al DOM a renderizar
      setTimeout(() => {
          faqItems.forEach(item => {
               // Trigger observer manually if element is already in view on load
               const boundingClientRect = item.getBoundingClientRect();
               if (boundingClientRect.top < window.innerHeight && boundingClientRect.bottom > 0) {
                   item.classList.add('is-visible');
               }
          });
      }, 100); // Ajusta el tiempo si es necesario
  }

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        // Prevenir el comportamiento de salto por defecto
        e.preventDefault();

        // Obtener el ID de la sección desde el atributo href
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        // Si el elemento existe, desplázate suavemente hacia él
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth' // Esto habilita la animación de scroll
            });
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
  const hamburger = document.querySelector('.hamburger-menu');
  const navButtons = document.querySelector('.nav-buttons');

  hamburger.addEventListener('click', function() {
    hamburger.classList.toggle('active');
    navButtons.classList.toggle('active');
  });

  // Cerrar el menú al hacer clic en un enlace
  const navLinks = document.querySelectorAll('.nav-buttons a');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      // Prevenir el comportamiento por defecto
      e.preventDefault();
      
      // Obtener el ID del elemento al que queremos hacer scroll
      const targetId = link.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      // Cerrar el menú
      hamburger.classList.remove('active');
      navButtons.classList.remove('active');
      
      // Hacer scroll suave hasta el elemento
      if (targetElement) {
        targetElement.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Cerrar el menú al hacer clic fuera
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navButtons.contains(e.target)) {
      hamburger.classList.remove('active');
      navButtons.classList.remove('active');
    }
  });
});

// Chat Bot Functionality
const chatButton = document.getElementById('chatButton');
const chatContainer = document.getElementById('chatContainer');
const closeChat = document.getElementById('closeChat');
const userInput = document.getElementById('userInput');
const sendMessage = document.getElementById('sendMessage');
const chatMessages = document.getElementById('chatMessages');

// Base de conocimiento con palabras clave y respuestas
const knowledgeBase = {
  'precio': [
    'Los precios varían según el tipo de servicio. Para ligas, tenemos paquetes desde 1,400€/año. Para clubes, desde 1,350€/año. Para torneos, desde 9€/hora. ¿Te gustaría conocer más detalles sobre algún paquete específico?'
  ],
  'portable': [
    'El servicio es completamente portátil: todo el equipo cabe en un maletín, incluye batería y conexión 4G, y puede instalarse en menos de 10 minutos en cualquier pista.'
  ],
  'conexion': [
    'La retransmisión puede hacerse vía WIFI si la instalación dispone de red, y en caso contrario, el sistema incluye un router 4G con doble SIM para asegurar la conexión desde cualquier lugar.'
  ],
  'corriente': [
    'No, el sistema funciona con batería integrada en el maletín, con autonomía suficiente para grabar y retransmitir hasta dos partidos sin necesidad de toma de corriente.'
  ],
  'camara': [
    'La cámara debe colocarse a una distancia mínima de 6 a 7 metros desde la línea de banda y a una altura de al menos 3 metros para garantizar una visión óptima de toda la pista.'
  ],
  'caracteristicas': [
    'Spiideo ofrece: Cámaras inteligentes con IA, streaming en directo, grabaciones automáticas, herramientas de análisis y acceso a la nube. ¿Sobre cuál te gustaría saber más?', 'Las principales características son cámaras inteligentes, streaming en directo, grabaciones automáticas, herramientas de análisis y acceso a la nube.'
  ],
  'contacto': [
    'Puedes contactar con Spiideo a través de su página web: https://www.spiideo.com/es/contact/'
  ],
  'hola': [
    '¡Hola! Soy el asistente virtual FEB. ¿En qué puedo ayudarte?', '¡Hola! ¿Tienes alguna pregunta sobre Spiideo?'
  ],
  'gracias': [
    '¡De nada! ¿Hay algo más en lo que pueda ayudarte?', 'Para servirte. ¿Algo más?'
  ],
  'default': [
    'Lo siento, no entiendo tu pregunta. ¿Podrías reformularla? Puedo ayudarte con información sobre precios, características del servicio, instalación y más.', 'Parece que no tengo información sobre eso. Intenta preguntar de otra manera o sobre precios, características, conexión o portabilidad.'
  ]
};

// Asegurar que el DOM esté completamente cargado antes de añadir event listeners
document.addEventListener('DOMContentLoaded', () => {
    const chatButton = document.getElementById('chatButton');
    const chatContainer = document.getElementById('chatContainer');
    const closeChat = document.getElementById('closeChat');
    const userInput = document.getElementById('userInput');
    const sendMessage = document.getElementById('sendMessage');
    const chatMessages = document.getElementById('chatMessages');

    // Añadir event listeners para abrir y cerrar el chat
    if (chatButton && chatContainer && closeChat) {
        chatButton.addEventListener('click', () => {
            chatContainer.classList.toggle('active');
            // Asegurar que el mensaje inicial se muestre al abrir el chat si no hay mensajes
            if (chatMessages.children.length <= 1) { // Check if only the initial bot message is present
               const initialBotMessageDiv = chatMessages.querySelector('.message.bot');
               if (!initialBotMessageDiv) {
                   addMessage(knowledgeBase['hola'][0]);
               } else {
                   // If it exists, just ensure its content is correct (handles potential previous errors)
                   initialBotMessageDiv.textContent = knowledgeBase['hola'][0];
               }
            }
        });

        closeChat.addEventListener('click', () => {
            chatContainer.classList.remove('active');
        });
    }

    // Añadir event listeners para enviar mensajes
    if (sendMessage && userInput) {
        sendMessage.addEventListener('click', () => {
            const message = userInput.value.trim();
            if (message) {
                handleUserMessage(message);
                userInput.value = '';
            }
        });

        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const message = userInput.value.trim();
                if (message) {
                    handleUserMessage(message);
                    userInput.value = '';
                }
            }
        });
    }

    // Asegurar que el mensaje inicial del bot sea el saludo de la base de conocimiento al cargar la página
    const initialBotMessageDiv = chatMessages.querySelector('.message.bot');
    if (initialBotMessageDiv) {
      initialBotMessageDiv.textContent = knowledgeBase['hola'][0];
    } else {
        // If the initial message is not found, add it
        addMessage(knowledgeBase['hola'][0]);
    }
});

function addMessage(message, isUser = false) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
  messageDiv.textContent = message;
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function findResponse(message) {
  const lowerMessage = message.toLowerCase();

  // Buscar palabras clave en el mensaje
  for (const [keyword, responses] of Object.entries(knowledgeBase)) {
    if (keyword !== 'default' && lowerMessage.includes(keyword)) {
      // Seleccionar una respuesta aleatoria del array de respuestas para esa palabra clave
      return responses[Math.floor(Math.random() * responses.length)];
    }
  }

  // Si no se encuentra ninguna palabra clave, devolver una respuesta por defecto
  return knowledgeBase.default[0];
}

function handleUserMessage(message) {
  addMessage(message, true);

  // Simular un pequeño retraso para que parezca más natural
  setTimeout(() => {
    const response = findResponse(message);
    addMessage(response);
  }, 500);
}
  