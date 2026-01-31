const API_URL = "https://ib-bank-backend.onrender.com/chat";

const chatMessages = document.getElementById("chatMessages");
const userInput = document.getElementById("userInput");
const sendButton = document.getElementById("sendButton");

// Fonction pour ajouter un message
function addMessage(content, isUser = false) {
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
    
    const messageContent = document.createElement("div");
    messageContent.className = "message-content";
    messageContent.textContent = content;
    
    messageDiv.appendChild(messageContent);
    chatMessages.appendChild(messageDiv);
    
    // Scroll automatique
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Fonction pour afficher "en train d'écrire..."
function showTypingIndicator() {
    const typingDiv = document.createElement("div");
    typingDiv.className = "message bot-message";
    typingDiv.id = "typing-indicator";
    
    typingDiv.innerHTML = `
        <div class="typing-indicator">
            <span>•</span>
            <span>•</span>
            <span>•</span>
        </div>
    `;
    
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Fonction pour retirer l'indicateur
function hideTypingIndicator() {
    const typingDiv = document.getElementById("typing-indicator");
    if (typingDiv) typingDiv.remove();
}

// Fonction pour envoyer un message
async function sendMessage() {
    const message = userInput.value.trim();
    
    if (!message) return;
    
    // Afficher le message utilisateur
    addMessage(message, true);
    userInput.value = "";
    
    // Désactiver le bouton
    sendButton.disabled = true;
    
    // Afficher l'indicateur "typing"
    showTypingIndicator();
    
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message: message })
        });
        
        if (!response.ok) {
            throw new Error("Erreur serveur");
        }
        
        const data = await response.json();
        
        // Retirer l'indicateur
        hideTypingIndicator();
        
        // Afficher la réponse
        addMessage(data.reply, false);
        
    } catch (error) {
        hideTypingIndicator();
        addMessage("⚠️ Erreur de connexion au serveur. Veuillez réessayer.", false);
        console.error(error);
    } finally {
        sendButton.disabled = false;
        userInput.focus();
    }
}

// Événements
sendButton.addEventListener("click", sendMessage);

userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        sendMessage();
    }
});