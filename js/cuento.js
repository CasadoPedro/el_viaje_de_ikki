import { iniciarPagina } from "./utils.js";

let juego = iniciarPagina();
let targetFound = false;
let choiceEvaluated = false; // Flag to prevent multiple evaluations
let cardClicked = false; // Flag to prevent multiple card clicks

// Add functionality to hide intro div when button is clicked
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
            
            // Show scanning message when AR starts
            scanningMessage.style.display = 'flex';
            
            // Initialize target detection
            initializeTargetDetection();
            
            // Initialize card click listeners after AR scene is shown
            initializeCardInteraction();
        });
    }
});

// Function to initialize target detection
function initializeTargetDetection() {
    const arScene = document.querySelector('a-scene');
    const targetEntity = document.querySelector('[mindar-image-target]');
    const scanningMessage = document.getElementById('scanningMessage');
    const instructionMessage = document.getElementById('instructionMessage');
    
    if (arScene && targetEntity) {
        // Listen for target found event on the target entity itself
        targetEntity.addEventListener('targetFound', function(event) {
            if (!targetFound) {
                targetFound = true;
                console.log('Target found! Hiding scanning message and showing instructions.');
                
                // Hide scanning message
                scanningMessage.style.display = 'none';
                
                // Show instruction message
                instructionMessage.style.display = 'block';
                
                // Hide instruction message after 5 seconds
                setTimeout(() => {
                    instructionMessage.style.display = 'none';
                }, 5000);
            }
        });
        
        // Listen for target lost event on the target entity itself
        targetEntity.addEventListener('targetLost', function(event) {
            if (targetFound) {
                targetFound = false;
                console.log('Target lost! Showing scanning message again.');
                
                // Show scanning message again
                scanningMessage.style.display = 'flex';
                
                // Hide instruction message
                instructionMessage.style.display = 'none';
            }
        });
        
        console.log('Target detection initialized');
    } else {
        console.error('Could not find AR scene or target entity');
    }
}

// Function to initialize card interaction
function initializeCardInteraction() {
    // Wait a bit for the AR scene to fully load
    setTimeout(() => {
        const cards = document.querySelectorAll('.clickable');
        
        cards.forEach(card => {
            // Use A-Frame's click event system
            card.addEventListener('click', function(event) {
                // Prevent multiple clicks
                if (cardClicked) {
                    console.log('Card interaction already processed, ignoring click');
                    return;
                }
                
                const cardNumber = this.getAttribute('data-card');
                console.log(`Card ${cardNumber} was clicked!`);
                
                // Set flag to prevent further clicks
                cardClicked = true;
                
                // Disable all cards immediately
                disableAllCards();
                
                // Add enhanced visual feedback
                addVisualFeedback(this);
                
                // Handle the card selection logic here
                handleCardSelection(cardNumber);
            });
            
            // Add mouseenter and mouseleave for hover effects
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

// Function to disable all cards after selection
function disableAllCards() {
    const allCards = document.querySelectorAll('.clickable');
    allCards.forEach(card => {
        card.classList.remove('clickable');
        card.style.pointerEvents = 'none';
        card.style.cursor = 'default';
    });
}

// Function to add enhanced visual feedback
function addVisualFeedback(cardElement) {
    // Remove previous selection classes from all cards
    const allCards = document.querySelectorAll('.clickable');
    allCards.forEach(card => {
        card.classList.remove('card-selected');
    });
    
    // Add selection class to clicked card
    cardElement.classList.add('card-selected');
    
    // Get the associated text element
    const cardId = cardElement.id;
    let textElement;
    
    // Find the text element that corresponds to this card
    if (cardId === 'card1-plane') {
        textElement = document.querySelector('a-text[value="Seguir a la figura"]');
    } else if (cardId === 'card2-plane') {
        textElement = document.querySelector('a-text[value="Salir silenciosamente de la casa"]');
    } else if (cardId === 'card3-plane') {
        textElement = document.querySelector('a-text[value="Hablar con la figura"]');
    }
    
    // Enhanced A-Frame animation with bright white effect for card
    cardElement.setAttribute('animation__scale', 'property: scale; to: 1.2 1.2 1.2; dur: 300; easing: easeOutBack');
    cardElement.setAttribute('animation__glow', 'property: material.color; to: #ffffff; dur: 300');
    cardElement.setAttribute('animation__brightness', 'property: material.emissive; to: #666666; dur: 300');
    
    // Animate text to grow if found
    if (textElement) {
        textElement.setAttribute('animation__textScale', 'property: scale; to: 1.5 1.5 1.5; dur: 300; easing: easeOutBack');
        textElement.setAttribute('animation__textGlow', 'property: color; to: #ffffff; dur: 300');
    }
    
    // Return to normal after animation
    setTimeout(() => {
        cardElement.setAttribute('animation__scale', 'property: scale; to: 1 1 1; dur: 300; easing: easeInBack');
        cardElement.setAttribute('animation__glow', 'property: material.color; to: #ffffff; dur: 300');
        cardElement.setAttribute('animation__brightness', 'property: material.emissive; to: #000000; dur: 300');
        
        // Return text to normal if found
        if (textElement) {
            textElement.setAttribute('animation__textScale', 'property: scale; to: 1 1 1; dur: 300; easing: easeInBack');
            textElement.setAttribute('animation__textGlow', 'property: color; to: #ffffff; dur: 300');
        }
        
        // Keep the selected state for a bit longer
        setTimeout(() => {
            cardElement.classList.remove('card-selected');
        }, 1000);
    }, 300);
}

// Function to handle card selection
function handleCardSelection(cardNumber) {
    // Prevent multiple selections (additional safety check)
    if (choiceEvaluated) {
        console.log('Choice already evaluated, ignoring additional processing');
        return;
    }
    
    // Get the option text based on card number
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
    
    // Hide all cards and their texts except the selected one
    hideUnselectedOptions(cardNumber);
    
    // Move selected card to center and add confirmation text
    moveSelectedToCenter(cardNumber, optionText);
}

// Function to hide unselected options
function hideUnselectedOptions(selectedCard) {
    // Hide all cards except the selected one
    const allCards = document.querySelectorAll('#card1-plane, #card2-plane, #card3-plane');
    const allTexts = document.querySelectorAll('a-text[value*="Seguir"], a-text[value*="Salir"], a-text[value*="Hablar"]');
    const allTextBgs = document.querySelectorAll('#text1-bg, #text2-bg, #text3-bg');
    
    allCards.forEach(card => {
        const cardNum = card.getAttribute('data-card');
        if (cardNum !== selectedCard) {
            // Animate card disappearing
            card.setAttribute('animation__fadeOut', 'property: opacity; to: 0; dur: 500');
            card.setAttribute('animation__shrink', 'property: scale; to: 0 0 0; dur: 500');
            
            // Remove from scene after animation
            setTimeout(() => {
                if (card.parentNode) {
                    card.parentNode.removeChild(card);
                }
            }, 500);
        }
    });
    
    // Hide unselected text and their backgrounds
    allTexts.forEach((text, index) => {
        const textValue = text.getAttribute('value');
        let isSelectedText = false;
        
        if (selectedCard === '1' && textValue.includes('Seguir')) isSelectedText = true;
        if (selectedCard === '2' && textValue.includes('Salir')) isSelectedText = true;
        if (selectedCard === '3' && textValue.includes('Hablar')) isSelectedText = true;
        
        if (!isSelectedText) {
            // Animate text disappearing
            text.setAttribute('animation__fadeOut', 'property: opacity; to: 0; dur: 500');
            
            // Remove from scene after animation
            setTimeout(() => {
                if (text.parentNode) {
                    text.parentNode.removeChild(text);
                }
            }, 500);
        }
    });
    
    // Hide unselected text backgrounds
    allTextBgs.forEach((bg, index) => {
        let isSelectedBg = false;
        
        if (selectedCard === '1' && bg.id === 'text1-bg') isSelectedBg = true;
        if (selectedCard === '2' && bg.id === 'text2-bg') isSelectedBg = true;
        if (selectedCard === '3' && bg.id === 'text3-bg') isSelectedBg = true;
        
        if (!isSelectedBg) {
            // Animate background disappearing
            bg.setAttribute('animation__fadeOut', 'property: opacity; to: 0; dur: 500');
            
            // Remove from scene after animation
            setTimeout(() => {
                if (bg.parentNode) {
                    bg.parentNode.removeChild(bg);
                }
            }, 500);
        }
    });
}

// Function to move selected card to center and add confirmation text
function moveSelectedToCenter(cardNumber, optionText) {
    const selectedCard = document.querySelector(`[data-card="${cardNumber}"]`);
    const selectedText = getSelectedText(cardNumber);
    const selectedTextBg = getSelectedTextBackground(cardNumber);
    
    if (selectedCard) {
        // Animate card moving to center
        selectedCard.setAttribute('animation__moveToCenter', 'property: position; to: 0 0.1 0.1; dur: 1000; easing: easeInOutQuad');
        
        // Scale up the selected card slightly
        selectedCard.setAttribute('animation__scaleUp', 'property: scale; to: 1.3 1.3 1.3; dur: 1000; easing: easeInOutQuad');
    }
    
    if (selectedText) {
        // Change the text to show the selection
        selectedText.setAttribute('value', `Elegiste la opcion: ${optionText}`);
        
        // Move the text to below the card at center
        selectedText.setAttribute('animation__moveText', 'property: position; to: 0 -0.15 0.11; dur: 1000; easing: easeInOutQuad');
        
        // Keep text at normal size
        selectedText.setAttribute('animation__scaleText', 'property: scale; to: 1 1 1; dur: 1000; easing: easeInOutQuad');
        
        console.log('Text changed to:', `Elegiste la opcion: ${optionText}`);
    }
    
    if (selectedTextBg) {
        // Move the background to match the text position - keep same size
        selectedTextBg.setAttribute('animation__moveBg', 'property: position; to: 0 -0.15 0.10; dur: 1000; easing: easeInOutQuad');
        
        // Keep background at original size
        selectedTextBg.setAttribute('animation__scaleBg', 'property: scale; to: 1 1 1; dur: 1000; easing: easeInOutQuad');
    }
    
    // After animation completes (1000ms), evaluate the choice
    setTimeout(() => {
        if (!choiceEvaluated) {
            choiceEvaluated = true;
            evaluateChoice(cardNumber, selectedText, selectedTextBg);
        }
    }, 2000); // Wait 2 seconds after animation to show result
}

// Function to evaluate if the choice is correct and handle consequences
function evaluateChoice(cardNumber, selectedText, greyPlane) {
    console.log('Evaluating choice for card:', cardNumber);
    const isCorrect = cardNumber === '2'; // Option 2 is the correct one
    
    if (isCorrect) {
        console.log('Correct choice! Option 2 (Salir silenciosamente de la casa) was selected.');
        handleCorrectChoice(selectedText, greyPlane);
    } else {
        console.log('Incorrect choice! Applying penalty...');
        handleIncorrectChoice(selectedText, greyPlane);
    }
}

// Function to handle correct choice - show 3D model
function handleCorrectChoice(selectedText, greyPlane) {
    // Hide the selected card immediately
    hideSelectedCard();
    
    // Change grey plane to green
    if (greyPlane) {
        greyPlane.setAttribute('animation__colorChange', 'property: color; to: #4CAF50; dur: 500; easing: easeInOutQuad');
    }
    
    // Change text to show success message and slide it down to make space for model
    if (selectedText) {
        selectedText.setAttribute('value', '¡Opcion correcta! Ikki los felicita');
        selectedText.setAttribute('animation__colorChange', 'property: color; to: #ffffff; dur: 500; easing: easeInOutQuad');
        
        // Make text more prominent and slide it down
        selectedText.setAttribute('animation__emphasize', 'property: scale; to: 1.2 1.2 1.2; dur: 500; easing: easeInOutQuad');
        selectedText.setAttribute('animation__slideDown', 'property: position; to: 0 -0.6 0.11; dur: 800; easing: easeInOutQuad');
    }
    
    // Move grey plane down with the text
    if (greyPlane) {
        greyPlane.setAttribute('animation__slideDownBg', 'property: position; to: 0 -0.6 0.10; dur: 800; easing: easeInOutQuad');
    }
    
    // Show the 3D model after a short delay
    setTimeout(() => {
        show3DModel();
    }, 1000);
    
    // Continue the game flow after showing the model
    setTimeout(() => {
        continueGameFlow();
    }, 5000); // Give time to appreciate the model
}

// Function to show the 3D Ikki model
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
            from: '15 0 0',        // Ángulo inicial (sin rotación en X)
            to: '-345 0 0',        // Gira 360 grados en X
            dur: 1200,             // Duración rápida para el backflip
            loop: false,
            easing: 'easeInSine',  // Curva de aceleración para un movimiento realista
            delay: 1000            // Inicia después de 1 segundo
        });
        
        // 3. ADICIÓN AL TARGET
        targetEntity.appendChild(ikkiModel);
        
        console.log('3D Ikki model displayed successfully with backflip animation');
        
    } else {
        console.error('Could not find target entity to display 3D model');
    }
}

// Function to hide the selected card
function hideSelectedCard() {
    // Find the remaining card (the selected one)
    const remainingCard = document.querySelector('#card1-plane, #card2-plane, #card3-plane');
    
    if (remainingCard) {
        // Animate card disappearing
        remainingCard.setAttribute('animation__fadeOut', 'property: opacity; to: 0; dur: 300; easing: easeInOutQuad');
        remainingCard.setAttribute('animation__shrink', 'property: scale; to: 0 0 0; dur: 300; easing: easeInBack');
        
        // Remove from scene after animation
        setTimeout(() => {
            if (remainingCard.parentNode) {
                remainingCard.parentNode.removeChild(remainingCard);
            }
        }, 300);
        
        console.log('Selected card hidden');
    }
}

// Function to continue the game flow after correct choice
function continueGameFlow() {
    console.log('Continuing game flow after correct choice');
    
    // Move to next turn
    juego.siguienteTurno();

    // Save final state and redirect back to main game
    sessionStorage.setItem("juego", JSON.stringify(juego));
    setTimeout(() => {
        window.location.href = "ruleta.html";
    }, 1000);
}

// Function to handle incorrect choice consequences
function handleIncorrectChoice(selectedText, greyPlane) {
    // Find the text background for the selected option
    let textBg;
    const selectedCard = document.querySelector('#card1-plane, #card2-plane, #card3-plane');
    if (selectedCard) {
        const cardNumber = selectedCard.getAttribute('data-card');
        if (cardNumber === '1') textBg = document.querySelector('#text1-bg');
        else if (cardNumber === '2') textBg = document.querySelector('#text2-bg');
        else if (cardNumber === '3') textBg = document.querySelector('#text3-bg');
    }
    
    // Change text background to red
    if (textBg) {
        textBg.setAttribute('animation__colorChange', 'property: color; to: rgb(182, 21, 21); dur: 500; easing: easeInOutQuad');
    }
    
    // Change text to show penalty message with white color
    if (selectedText) {
        selectedText.setAttribute('value', 'La opcion es incorrecta, retrocede 2 casilleros');
        selectedText.setAttribute('animation__colorChange', 'property: color; to: #ffffff; dur: 500; easing: easeInOutQuad');
        
        // Make text more prominent
        selectedText.setAttribute('animation__emphasize', 'property: scale; to: 1.1 1.1 1.1; dur: 500; easing: easeInOutQuad');
    }
    
    // Apply game logic to move team back 2 positions
    setTimeout(() => {
        applyPenalty();
    }, 2000); // Wait 2 seconds to show the penalty message
}

// Function to apply the penalty in the game logic
function applyPenalty() {
    // Get current game state from sessionStorage
    const datosJuego = JSON.parse(sessionStorage.getItem("juego"));
    
    if (datosJuego && juego) {
        console.log('Applying penalty: moving current team back 2 positions');
        
        // Get current team
        const equipoActual = juego.equipos[juego.turnoActual];
        const posicionAnterior = equipoActual.posicion;
        
        // Move team back 2 positions (minimum position is 0)
        const movimiento = juego.retrocederEquipo(2);
        
        console.log(`${equipoActual.nombre} moved from position ${posicionAnterior} to position ${equipoActual.posicion}`);
        
        // Save updated game state
        sessionStorage.setItem("juego", JSON.stringify(juego));
        
        // Move to next turn
        juego.siguienteTurno();
        
        // Save final state and redirect back to main game
        sessionStorage.setItem("juego", JSON.stringify(juego));
        
        // Redirect back to the main game board after a short delay
        setTimeout(() => {
            window.location.href = "ruleta.html";
        }, 2000);
    } else {
        console.error('No game data found or juego object not available');
        // If no game data, redirect to main page
        setTimeout(() => {
            window.location.href = "index.html";
        }, 2000);
    }
}

// Function to get the selected text element
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

// Function to get the selected text background element
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

