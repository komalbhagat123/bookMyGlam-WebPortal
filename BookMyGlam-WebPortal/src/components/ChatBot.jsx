import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { MessageCircle, Bot, SendHorizontal } from 'lucide-react';
import '../ChatBot.css';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([
    { text: "Hi! Welcome to *BookMyGlam*. How can I help?", sender: "bot" }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  // 1. ADD THIS REF
  const chatEndRef = useRef(null);

  // 2. ADD THIS EFFECT (This won't cause the 429 error)
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = async () => {
    if (userInput.trim() === "" || isLoading) return;

    // 1. Update UI with User Message
    const currentInput = userInput;
    setMessages((prev) => [...prev, { text: currentInput, sender: "user" }]);
    setUserInput("");
    setIsLoading(true);

    try {                                     

      // The 2026 Stable Endpoint for Gemini 2.5 Flash
      const url = "/api/chat";

      const promptContext = `
  You are the Professional Virtual Assistant for 'BookMyGlam'

  LOCATION & HOURS:
  - Location: Nagpur, Maharashtra.
  - Mon-Sat: 10:00 AM - 8:00 PM.
  - Sunday: 11:00 AM - 4:00 PM (Half day).

  SERVICE MENU & CHARGES:
  1. HAIR CARE:
     - Basic Haircut: ₹500
     - Hair Wash & Blow Dry: ₹400
     - Deep Conditioning: ₹800
     - Hair Coloring (Global): Starting ₹1500
  
  2. SKIN & FACIALS:
     - Premium Gold Facial: ₹1200
     - Fruit/O3+ Facial: ₹1500
     - Face Cleanup: ₹600
     - De-Tan Treatment: ₹500
  
  3. BRIDAL & MAKEUP:
     - Luxury Bridal Makeup: ₹5000
     - Party Makeup: ₹2000
     - Engagement Makeup: ₹3500
     - Saree Draping: ₹300
  
  4. GROOMING:
     - Threading (Eyebrows): ₹50
     - Full Body Waxing: ₹1200
     - Manicure/Pedicure: ₹800

  FORMATTING RULES:
  1. ALWAYS use a double line break (\n\n) between categories.
  2. Use bold headers like **1. HAIR CARE**.
  3. Use bullet points for each service like * Service Name: Price.
  4. Ensure the output is strictly organized for a professional salon view.

  STRICT FORMATTING RULES:
        1. Use **BOLD** for category headers.
        2. Use bullet points (*) for services.
        3. Use double line breaks (\n\n) between categories to ensure zero clutter.
        4. NEVER use pet names like 'darling'.

  BEHAVIOR RULES:
  - Avoid pet names like 'darling' or 'dear' at all costs.
  - If a user asks for a service not listed, tell them to check the 'Services' page or contact the salon.
  - Always encourage users to use the purple 'Book Now' button for scheduling.

  USER MESSAGE: ${currentInput}
`;
      // 3. The Fetch Request
      const response = await fetch(url, {

        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: promptContext
            }]
          }]
        })
      });

      const data = await response.json();

      if (response.ok && data.candidates) {
        const botText = data.candidates[0].content.parts[0].text;
        setMessages((prev) => [...prev, { text: botText, sender: "bot" }]);
      } else {
        console.error("API Error Detail:", data);
        setMessages((prev) => [...prev, { text: "I'm having a bit of a glitch. Try again?", sender: "bot" }]);
      }
    } catch (error) {
      console.error("Network Error:", error);
      setMessages((prev) => [...prev, { text: "Connection error. Check your internet!", sender: "bot" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chat-icon" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '✖' : (<Bot size={30} strokeWidth={2} />)}
      </div>

      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">BOOKMYGLAM AI</div>

          <div className="chat-body">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                {/* If it's from the bot, use ReactMarkdown */}
                {msg.sender === "bot" ? (
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                ) : (
                  msg.text
                )}
              </div>
            ))}

            {isLoading && (
              <div className="message bot typing">
                <span className="dot">.</span>
                <span className="dot">.</span>
                <span className="dot">.</span>
              </div>
            )}
            {/* --------------------------------- */}

            <div ref={chatEndRef} />
          </div>

          <div className="chat-footer">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type here..."
            />
            <button onClick={handleSend} className="send-btn">
              <SendHorizontal size={20} color="white" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;