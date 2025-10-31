document.addEventListener('DOMContentLoaded', () => {
    // 1. Elementos del DOM
    const chatBody = document.getElementById('chat-body');
    const chatInput = document.getElementById('chat-input');
    const sendButton = document.getElementById('button-send');

    // 2. Variables Mínimas Globales (La memoria del chat)
    let nombreUsuario = "";         
    let puntuacionTotal = 0;        
    let indicePregunta = -2;        

    // 3. DATOS DEL TEST (21 preguntas)
    const preguntas = [
        "Te ha costado mucho descargar la tensión.",
        "Te diste cuenta que tenías la boca seca.",
        "No podías sentir ningún sentimiento positivo.",
        "Se te hizo difícil respirar.",
        "Se te hizo difícil tomar la iniciativa para hacer cosas.",
        "Reaccionaste exageradamente en ciertas situaciones.",
        "Sentiste que tus manos temblaban.",
        "Has sentido que estabas gastando una gran cantidad de energía.",
        "Estabas preocupado por situaciones en las cuales podías tener pánico o en las que podrías hacer el ridículo.",
        "Has sentido que no había nada que te ilusionara.",
        "Te has sentido inquieto.",
        "Se te hizo difícil relajarte.",
        "Te sentiste triste y deprimido.",
        "No toleraste nada que no te permitiera continuar con lo que estabas haciendo.",
        "Sentiste que estabas al punto de pánico.",
        "No te pudiste entusiasmar por nada.",
        "Sentiste que valías muy poco como persona.",
        "Has tendido a sentirte enfadado con facilidad.",
        "Sentiste los latidos de tu corazón a pesar de no haber hecho ningún esfuerzo físico.",
        "Tuviste miedo sin razón.",
        "Sentiste que la vida no tenía ningún sentido.",
    ];
    
    // 4. Funciones de Interfaz (Añade los mensajes al chat)
    function addMessage(text, isUser = false) {
        const justify = isUser ? 'justify-content-end' : 'justify-content-start';
        const type = isUser ? 'user-msg' : 'bot-msg';
        
        const messageContainer = document.createElement('div');
        messageContainer.classList.add('d-flex', 'mb-3', justify);

        const messageBubble = document.createElement('div');
        messageBubble.classList.add('msg-bubble', type);
        messageBubble.innerHTML = text;

        messageContainer.appendChild(messageBubble);
        chatBody.appendChild(messageContainer);
        
        chatBody.scrollTop = chatBody.scrollHeight;
    }
    
    function showBotMessage(message) {
        addMessage(message, false);
    }
    // -------------------------------------------------------------

    // 5. Lógica Central (Se dispara al enviar el mensaje)
    function manejarRespuesta(respuesta) {
        // Muestra la respuesta del usuario y limpia el input
        addMessage(respuesta, true);
        chatInput.value = '';

        const inputLimpio = respuesta.trim().toLowerCase();
        let mensajeBot = "";
        
        // --- ESTADO -2: INICIO (Esperando 'Si' inicial) ---
        if (indicePregunta === -2) {
            if (inputLimpio === 'si') {
                mensajeBot = "¿Cuál es tu nombre?";
                indicePregunta = -1; // Pasa a ESPERANDO NOMBRE
            } else {
                mensajeBot = 'Escribe "Si" para empezar.';
            }
        
        // --- ESTADO -1: ESPERANDO NOMBRE ---
        } else if (indicePregunta === -1) {
            if (inputLimpio.length > 0) {
                nombreUsuario = respuesta.trim(); // GUARDAR NOMBRE 
                
                // INSTRUCCIONES DEL TEST
                mensajeBot = 
                    `INSTRUCCIONES:<br>` +
                    `Contesta solo con 0, 1, 2, o 3.<br>` +
                    `0: No me ha ocurrido.<br>` +
                    `1: Me ha ocurrido un poco, o durante parte del tiempo.<br>` +
                    `2: Me ha ocurrido bastante, o durante una buena parte del tiempo.<br>` +
                    `3: Me ha ocurrido mucho, o la mayor parte del tiempo.<br>` +
                    `Escribe "Si" para comenzar con la medición.`;

                indicePregunta = 0; // Pasa a ESPERANDO 'Si' Instrucciones
            } else {
                mensajeBot = "Por favor, ingresa tu nombre.";
            }

        // --- ESTADO 0: ESPERANDO 'Si' de Instrucciones ---
        } else if (indicePregunta === 0) {
            if (inputLimpio === 'si') {
                indicePregunta = 1; // Pasa a la Pregunta 1
                mensajeBot = `${preguntas[indicePregunta - 1]}`;
            } else {
                mensajeBot = 'Escribe "Si" para comenzar con la medición.';
            }
        
        // --- ESTADOS 1+: HACIENDO EL TEST ---
        } else if (indicePregunta >= 1 && indicePregunta <= preguntas.length) {
            
            const puntuacion = parseInt(respuesta.trim());

            // Validación: Solo 0, 1, 2 o 3.
            if (isNaN(puntuacion) || puntuacion < 0 || puntuacion > 3) {
                // Mensaje de error, no avanza el índice.
                mensajeBot = `Respuesta Inválida. Por favor, contesta solo con 0, 1, 2 o 3. Intenta de nuevo: ${preguntas[indicePregunta - 1]}`;
            } else {
                // Lógica de Éxito y Avance
                puntuacionTotal += puntuacion; // ACUMULAR PUNTUACIÓN 
                indicePregunta++;              // AVANZA A LA SIGUIENTE PREGUNTA
                
                if (indicePregunta <= preguntas.length) {
                    // Hay más preguntas: Muestra la siguiente.
                    mensajeBot = `${preguntas[indicePregunta - 1]}`;
                } else {
                    // No hay más preguntas: Finaliza el test
                    mensajeBot = `¡Prueba finalizada, ${nombreUsuario}! La puntuación obtenida es:${puntuacionTotal}`;
                    indicePregunta = 99; // ESTADO FINAL
                }
            }
        
        // --- ESTADO 99: FINALIZADO ---
        } else {
            mensajeBot = "Si deseas comenzar de nuevo refresca la página.";
        }

        showBotMessage(mensajeBot);
    }
    
    // 6. Conexión de Eventos y Lógica de Inicio
    
    const enviarRespuesta = () => {
        const respuesta = chatInput.value;
        if (respuesta.trim() !== "") {
            manejarRespuesta(respuesta);
        }
    };

    sendButton.addEventListener('click', enviarRespuesta);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            enviarRespuesta();
        }
    });

    // Limpia los mensajes de ejemplo que están en el HTML
    chatBody.innerHTML = ''; 
    // Muestra el mensaje inicial y establece el estado -2
    showBotMessage('¡Hola! Soy StressBot, tu asistente para medir tu nivel de estrés. Si estás listo para comenzar escribe "Si".');

});