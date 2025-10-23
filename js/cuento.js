import { iniciarPagina } from "./utils.js";

let juego = iniciarPagina();
let targetFound = false;
let choiceEvaluated = false; // Bandera para prevenir múltiples evaluaciones
let cardClicked = false; // Bandera para prevenir múltiples clics en cartas

// Funcionalidad para ocultar el div de introducción cuando se hace clic en el botón
document.addEventListener('DOMContentLoaded', function() {
    const btnIntroContinuar = document.getElementById('btnIntroContinuar');
    const introDiv = document.getElementById('intro');
    const escenaAR = document.getElementById('escenaAR');
    const scanningMessage = document.getElementById('scanningMessage');
    
    if (btnIntroContinuar && introDiv && escenaAR) {
        btnIntroContinuar.addEventListener('click', function() {
            introDiv.style.display = 'none';
            escenaAR.style.marginTop = '0';
            escenaAR.style.height = '100vh';
            
            // Mostrar mensaje de escaneo cuando inicia AR
            scanningMessage.style.display = 'flex';
            
            // Inicializar detección de objetivo
            initializeTargetDetection();
            
            // Inicializar listeners de clic en cartas después de mostrar la escena AR
            initializeCardInteraction();
        });
    }
});

// Función para inicializar la detección de objetivo
function initializeTargetDetection() {
    const arScene = document.querySelector('a-scene');
    const targetEntity = document.querySelector('[mindar-image-target]');
    const scanningMessage = document.getElementById('scanningMessage');
    const instructionMessage = document.getElementById('instructionMessage');
    
    if (arScene && targetEntity) {
        // Escuchar evento de objetivo encontrado en la entidad objetivo
        targetEntity.addEventListener('targetFound', function(event) {
            if (!targetFound) {
                targetFound = true;
                console.log('Target found! Hiding scanning message and showing instructions.');
                
                // Ocultar mensaje de escaneo
                scanningMessage.style.display = 'none';
                
                // Mostrar mensaje de instrucciones
                instructionMessage.style.display = 'block';
                
                // Ocultar mensaje de instrucciones después de 5 segundos
                setTimeout(() => {
                    instructionMessage.style.display = 'none';
                }, 5000);
            }
        });
        
        // Escuchar evento de objetivo perdido en la entidad objetivo
        targetEntity.addEventListener('targetLost', function(event) {
            if (targetFound) {
                targetFound = false;
                console.log('Target lost! Showing scanning message again.');
                
                // Mostrar mensaje de escaneo nuevamente
                scanningMessage.style.display = 'flex';
                
                // Ocultar mensaje de instrucciones
                instructionMessage.style.display = 'none';
            }
        });
        
        console.log('Target detection initialized');
    } else {
        console.error('Could not find AR scene or target entity');
    }
}

// Función para inicializar la interacción con cartas
function initializeCardInteraction() {
    // Esperar un poco para que la escena AR se cargue completamente
    setTimeout(() => {
        const cards = document.querySelectorAll('.clickable');
        
        cards.forEach(card => {
            // Usar el sistema de eventos de clic de A-Frame
            card.addEventListener('click', function(event) {
                // Prevenir múltiples clics
                if (cardClicked) {
                    console.log('Card interaction already processed, ignoring click');
                    return;
                }
                
                const cardNumber = this.getAttribute('data-card');
                console.log(`Card ${cardNumber} was clicked!`);
                
                // Establecer bandera para prevenir más clics
                cardClicked = true;
                
                // Deshabilitar todas las cartas inmediatamente
                disableAllCards();
                
                // Agregar retroalimentación visual mejorada
                addVisualFeedback(this);
                
                // Manejar la lógica de selección de carta 
                handleCardSelection(cardNumber);
            });
            
            // Agregar mouseenter y mouseleave para efectos hover
            card.addEventListener('mouseenter', function() {
                if (!cardClicked && !this.classList.contains('card-selected')) {
                    this.setAttribute('animation', 'property: scale; to: 1.05 1.05 1.05; dur: 150');
                }
            });
            
            card.addEventListener('mouseleave', function() {
                if (!cardClicked && !this.classList.contains('card-selected')) {
                    this.setAttribute('animation', 'property: scale; to: 1 1 1; dur: 150');
                }
            });
        });
        
        console.log('Card interaction initialized for', cards.length, 'cards');
    }, 1000);
}

// Función para deshabilitar todas las cartas después de la selección
function disableAllCards() {
    const allCards = document.querySelectorAll('.clickable');
    allCards.forEach(card => {
        card.classList.remove('clickable');
        card.style.pointerEvents = 'none';
        card.style.cursor = 'default';
    });
}

// Función para agregar retroalimentación visual mejorada
function addVisualFeedback(cardElement) {
    // Remover clases de selección previas de todas las cartas
    const allCards = document.querySelectorAll('.clickable');
    allCards.forEach(card => {
        card.classList.remove('card-selected');
    });
    
    // Agregar clase de selección a la carta clickeada
    cardElement.classList.add('card-selected');
    
    // Obtener el elemento de texto asociado
    const cardId = cardElement.id;
    let textElement;
    
    // Encontrar el elemento de texto que corresponde a esta carta
    if (cardId === 'card1-plane') {
        textElement = document.querySelector('a-text[value="Seguir a la figura"]');
    } else if (cardId === 'card2-plane') {
        textElement = document.querySelector('a-text[value="Salir silenciosamente de la casa"]');
    } else if (cardId === 'card3-plane') {
        textElement = document.querySelector('a-text[value="Hablar con la figura"]');
    }
    
    // Animación mejorada de A-Frame con efecto blanco brillante para la carta
    cardElement.setAttribute('animation__scale', 'property: scale; to: 1.2 1.2 1.2; dur: 300; easing: easeOutBack');
    cardElement.setAttribute('animation__glow', 'property: material.color; to: #ffffff; dur: 300');
    cardElement.setAttribute('animation__brightness', 'property: material.emissive; to: #666666; dur: 300');
    
    // Animar texto para crecer si se encuentra
    if (textElement) {
        textElement.setAttribute('animation__textScale', 'property: scale; to: 1.5 1.5 1.5; dur: 300; easing: easeOutBack');
        textElement.setAttribute('animation__textGlow', 'property: color; to: #ffffff; dur: 300');
    }
    
    // Volver a la normalidad después de la animación
    setTimeout(() => {
        cardElement.setAttribute('animation__scale', 'property: scale; to: 1 1 1; dur: 300; easing: easeInBack');
        cardElement.setAttribute('animation__glow', 'property: material.color; to: #ffffff; dur: 300');
        cardElement.setAttribute('animation__brightness', 'property: material.emissive; to: #000000; dur: 300');
        
        // Volver texto a la normalidad si se encuentra
        if (textElement) {
            textElement.setAttribute('animation__textScale', 'property: scale; to: 1 1 1; dur: 300; easing: easeInBack');
            textElement.setAttribute('animation__textGlow', 'property: color; to: #ffffff; dur: 300');
        }
        
        // Mantener el estado seleccionado por un poco más de tiempo
        setTimeout(() => {
            cardElement.classList.remove('card-selected');
        }, 1000);
    }, 300);
}

// Función para manejar la selección de carta
function handleCardSelection(cardNumber) {
    // Prevenir múltiples selecciones (verificación de seguridad adicional)
    if (choiceEvaluated) {
        console.log('Choice already evaluated, ignoring additional processing');
        return;
    }
    
    // Obtener el texto de opción basado en el número de carta
    let optionText = '';
    switch(cardNumber) {
        case '1':
            optionText = 'Seguir a la figura';
            break;
        case '2':
            optionText = 'Salir silenciosamente de la casa';
            break;
        case '3':
            optionText = 'Hablar con la figura';
            break;
        default:
            optionText = 'Opción desconocida';
    }
    
    console.log(`Player chose: ${optionText}`);
    
    // Ocultar todas las cartas y sus textos excepto la seleccionada
    hideUnselectedOptions(cardNumber);
    
    // Mover carta seleccionada al centro y agregar texto de confirmación
    moveSelectedToCenter(cardNumber, optionText);
}

// Función para ocultar opciones no seleccionadas
function hideUnselectedOptions(selectedCard) {
    // Ocultar todas las cartas excepto la seleccionada
    const allCards = document.querySelectorAll('#card1-plane, #card2-plane, #card3-plane');
    const allTexts = document.querySelectorAll('a-text[value*="Seguir"], a-text[value*="Salir"], a-text[value*="Hablar"]');
    const allTextBgs = document.querySelectorAll('#text1-bg, #text2-bg, #text3-bg');
    
    allCards.forEach(card => {
        const cardNum = card.getAttribute('data-card');
        if (cardNum !== selectedCard) {
            // Animar carta desapareciendo
            card.setAttribute('animation__fadeOut', 'property: opacity; to: 0; dur: 500');
            card.setAttribute('animation__shrink', 'property: scale; to: 0 0 0; dur: 500');
            
            // Remover de la escena después de la animación
            setTimeout(() => {
                if (card.parentNode) {
                    card.parentNode.removeChild(card);
                }
            }, 500);
        }
    });
    
    // Ocultar texto no seleccionado y sus fondos
    allTexts.forEach((text, index) => {
        const textValue = text.getAttribute('value');
        let isSelectedText = false;
        
        if (selectedCard === '1' && textValue.includes('Seguir')) isSelectedText = true;
        if (selectedCard === '2' && textValue.includes('Salir')) isSelectedText = true;
        if (selectedCard === '3' && textValue.includes('Hablar')) isSelectedText = true;
        
        if (!isSelectedText) {
            // Animar texto desapareciendo
            text.setAttribute('animation__fadeOut', 'property: opacity; to: 0; dur: 500');
            
            // Remover de la escena después de la animación
            setTimeout(() => {
                if (text.parentNode) {
                    text.parentNode.removeChild(text);
                }
            }, 500);
        }
    });
    
    // Ocultar fondos de texto no seleccionados
    allTextBgs.forEach((bg, index) => {
        let isSelectedBg = false;
        
        if (selectedCard === '1' && bg.id === 'text1-bg') isSelectedBg = true;
        if (selectedCard === '2' && bg.id === 'text2-bg') isSelectedBg = true;
        if (selectedCard === '3' && bg.id === 'text3-bg') isSelectedBg = true;
        
        if (!isSelectedBg) {
            // Animar fondo desapareciendo
            bg.setAttribute('animation__fadeOut', 'property: opacity; to: 0; dur: 500');
            
            // Remover de la escena después de la animación
            setTimeout(() => {
                if (bg.parentNode) {
                    bg.parentNode.removeChild(bg);
                }
            }, 500);
        }
    });
}

// Función para mover carta seleccionada al centro y agregar texto de confirmación
function moveSelectedToCenter(cardNumber, optionText) {
    const selectedCard = document.querySelector(`[data-card="${cardNumber}"]`);
    const selectedText = getSelectedText(cardNumber);
    const selectedTextBg = getSelectedTextBackground(cardNumber);
    
    if (selectedCard) {
        // Animar carta moviéndose al centro
        selectedCard.setAttribute('animation__moveToCenter', 'property: position; to: 0 0.1 0.1; dur: 1000; easing: easeInOutQuad');
        
        // Escalar un poco la carta seleccionada
        selectedCard.setAttribute('animation__scaleUp', 'property: scale; to: 1.3 1.3 1.3; dur: 1000; easing: easeInOutQuad');
    }
    
    if (selectedText) {
        // Cambiar el texto para mostrar la selección
        selectedText.setAttribute('value', `Elegiste la opcion: ${optionText}`);
        
        // Mover el texto debajo de la carta en el centro
        selectedText.setAttribute('animation__moveText', 'property: position; to: 0 -0.15 0.11; dur: 1000; easing: easeInOutQuad');
        
        // Mantener texto en tamaño normal
        selectedText.setAttribute('animation__scaleText', 'property: scale; to: 1 1 1; dur: 1000; easing: easeInOutQuad');
        
        console.log('Text changed to:', `Elegiste la opcion: ${optionText}`);
    }
    
    if (selectedTextBg) {
        // Mover el fondo para coincidir con la posición del texto - mantener mismo tamaño
        selectedTextBg.setAttribute('animation__moveBg', 'property: position; to: 0 -0.15 0.10; dur: 1000; easing: easeInOutQuad');
        
        // Mantener fondo en tamaño original
        selectedTextBg.setAttribute('animation__scaleBg', 'property: scale; to: 1 1 1; dur: 1000; easing: easeInOutQuad');
    }
    
    // Después de que la animación termine (1000ms), evaluar la elección
    setTimeout(() => {
        if (!choiceEvaluated) {
            choiceEvaluated = true;
            evaluateChoice(cardNumber, selectedText, selectedTextBg);
        }
    }, 2000); // Esperar 2 segundos después de la animación para mostrar resultado
}

// Función para evaluar si la elección es correcta y manejar las consecuencias
function evaluateChoice(cardNumber, selectedText, greyPlane) {
    console.log('Evaluating choice for card:', cardNumber);
    const isCorrect = cardNumber === '2'; // Opción 2 es la correcta
    
    if (isCorrect) {
        console.log('Correct choice! Option 2 (Salir silenciosamente de la casa) was selected.');
        handleCorrectChoice(selectedText, greyPlane);
    } else {
        console.log('Incorrect choice! Applying penalty...');
        handleIncorrectChoice(selectedText, greyPlane);
    }
}

// Función para manejar elección correcta - mostrar modelo 3D
function handleCorrectChoice(selectedText, greyPlane) {
    // Ocultar la carta seleccionada inmediatamente
    hideSelectedCard();
    
    // Cambiar plano gris a verde
    if (greyPlane) {
        greyPlane.setAttribute('animation__colorChange', 'property: color; to: #4CAF50; dur: 500; easing: easeInOutQuad');
    }
    
    // Cambiar texto para mostrar mensaje de éxito y deslizarlo hacia abajo para hacer espacio al modelo
    if (selectedText) {
        selectedText.setAttribute('value', '¡Opcion correcta! Ikki los felicita');
        selectedText.setAttribute('animation__colorChange', 'property: color; to: #ffffff; dur: 500; easing: easeInOutQuad');
        
        // Hacer texto más prominente y deslizarlo hacia abajo
        selectedText.setAttribute('animation__emphasize', 'property: scale; to: 1.2 1.2 1.2; dur: 500; easing: easeInOutQuad');
        selectedText.setAttribute('animation__slideDown', 'property: position; to: 0 -0.6 0.11; dur: 800; easing: easeInOutQuad');
    }
    
    // Mover plano gris hacia abajo con el texto
    if (greyPlane) {
        greyPlane.setAttribute('animation__slideDownBg', 'property: position; to: 0 -0.6 0.10; dur: 800; easing: easeInOutQuad');
    }
    
    // Mostrar el modelo 3D después de una breve demora
    setTimeout(() => {
        show3DModel();
    }, 1000);
    
    // Continuar el flujo del juego después de mostrar el modelo
    setTimeout(() => {
        continueGameFlow();
    }, 5000);
}

// Función para mostrar el modelo 3D de Ikki
function show3DModel() {
    const targetEntity = document.querySelector('[mindar-image-target]');
    
    if (targetEntity) {
        // 1. CREACIÓN Y POSICIÓN BASE
        const ikkiModel = document.createElement('a-entity');
        ikkiModel.setAttribute('obj-model', 'obj: #ikki-obj; mtl: #ikki-mtl');
        
        ikkiModel.setAttribute('position', '0 0 -0.2');
    
        const targetScale = '0.10 0.10 0.10'; 
        ikkiModel.setAttribute('scale', targetScale);
        
        ikkiModel.setAttribute('rotation', '0 0 0'); 
        
        ikkiModel.id = 'ikki-3d-model';
        
        // 2. ANIMACIONES

        ikkiModel.setAttribute('animation__scaleIn', `property: scale; from: 0 0 0; to: ${targetScale}; dur: 1000; easing: easeOutBack`);
        
        ikkiModel.setAttribute('animation__backflip', {
            property: 'rotation',
            from: '15 0 0',
            to: '-345 0 0',
            dur: 1200,
            loop: false,
            easing: 'easeInSine',
            delay: 1000
        });
        
        // 3. ADICIÓN AL TARGET
        targetEntity.appendChild(ikkiModel);
        
        console.log('3D Ikki model displayed successfully with backflip animation');
        
    } else {
        console.error('Could not find target entity to display 3D model');
    }
}

// Función para ocultar la carta seleccionada
function hideSelectedCard() {
    // Encontrar la carta restante (la seleccionada)
    const remainingCard = document.querySelector('#card1-plane, #card2-plane, #card3-plane');
    
    if (remainingCard) {
        // Animar carta desapareciendo
        remainingCard.setAttribute('animation__fadeOut', 'property: opacity; to: 0; dur: 300; easing: easeInOutQuad');
        remainingCard.setAttribute('animation__shrink', 'property: scale; to: 0 0 0; dur: 300; easing: easeInBack');
        
        // Remover de la escena después de la animación
        setTimeout(() => {
            if (remainingCard.parentNode) {
                remainingCard.parentNode.removeChild(remainingCard);
            }
        }, 300);
        
        console.log('Selected card hidden');
    }
}

// Función para continuar el flujo del juego después de la elección correcta
function continueGameFlow() {
    console.log('Continuing game flow after correct choice');
    
    // Mover al siguiente turno
    juego.siguienteTurno();

    // Guardar estado final y redirigir de vuelta al juego principal
    sessionStorage.setItem("juego", JSON.stringify(juego));
    setTimeout(() => {
        window.location.href = "ruleta.html";
    }, 1000);
}

// Función para manejar las consecuencias de elección incorrecta
function handleIncorrectChoice(selectedText, greyPlane) {
    // Encontrar el fondo de texto para la opción seleccionada
    let textBg;
    const selectedCard = document.querySelector('#card1-plane, #card2-plane, #card3-plane');
    if (selectedCard) {
        const cardNumber = selectedCard.getAttribute('data-card');
        if (cardNumber === '1') textBg = document.querySelector('#text1-bg');
        else if (cardNumber === '2') textBg = document.querySelector('#text2-bg');
        else if (cardNumber === '3') textBg = document.querySelector('#text3-bg');
    }
    
    // Cambiar fondo de texto a rojo
    if (textBg) {
        textBg.setAttribute('animation__colorChange', 'property: color; to: rgb(182, 21, 21); dur: 500; easing: easeInOutQuad');
    }
    
    // Cambiar texto para mostrar mensaje de penalización con color blanco
    if (selectedText) {
        selectedText.setAttribute('value', 'La opcion es incorrecta, retrocede 2 casilleros');
        selectedText.setAttribute('animation__colorChange', 'property: color; to: #ffffff; dur: 500; easing: easeInOutQuad');
        
        // Hacer texto más prominente
        selectedText.setAttribute('animation__emphasize', 'property: scale; to: 1.1 1.1 1.1; dur: 500; easing: easeInOutQuad');
    }
    
    // Aplicar lógica del juego para mover equipo hacia atrás 2 posiciones
    setTimeout(() => {
        applyPenalty();
    }, 2000);
}

// Función para aplicar la penalización en la lógica del juego
function applyPenalty() {
    // Obtener estado actual del juego desde sessionStorage
    const datosJuego = JSON.parse(sessionStorage.getItem("juego"));
    
    if (datosJuego && juego) {
        console.log('Applying penalty: moving current team back 2 positions');
        
        // Obtener equipo actual
        const equipoActual = juego.equipos[juego.turnoActual];
        const posicionAnterior = equipoActual.posicion;
        
        // Mover equipo hacia atrás 2 posiciones (posición mínima es 0)
        const movimiento = juego.retrocederEquipo(2);
        
        console.log(`${equipoActual.nombre} moved from position ${posicionAnterior} to position ${equipoActual.posicion}`);
        
        // Guardar estado actualizado del juego
        sessionStorage.setItem("juego", JSON.stringify(juego));
        
        // Mover al siguiente turno
        juego.siguienteTurno();
        
        // Guardar estado final y redirigir de vuelta al juego principal
        sessionStorage.setItem("juego", JSON.stringify(juego));
        
        // Redirigir de vuelta al tablero principal después de una breve demora
        setTimeout(() => {
            window.location.href = "ruleta.html";
        }, 2000);
    } else {
        console.error('No game data found or juego object not available');
        // Si no hay datos del juego, redirigir a página principal
        setTimeout(() => {
            window.location.href = "index.html";
        }, 2000);
    }
}

// Función para obtener el elemento de texto seleccionado
function getSelectedText(cardNumber) {
    switch(cardNumber) {
        case '1':
            return document.querySelector('a-text[value="Seguir a la figura"]');
        case '2':
            return document.querySelector('a-text[value="Salir silenciosamente de la casa"]');
        case '3':
            return document.querySelector('a-text[value="Hablar con la figura"]');
        default:
            return null;
    }
}

// Función para obtener el elemento de fondo de texto seleccionado
function getSelectedTextBackground(cardNumber) {
    switch(cardNumber) {
        case '1':
            return document.querySelector('#text1-bg');
        case '2':
            return document.querySelector('#text2-bg');
        case '3':
            return document.querySelector('#text3-bg');
        default:
            return null;
    }
}

