import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Bot, SendHorizontal } from 'lucide-react';
import '../ChatBot.css';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([
    { text: "Hi! Welcome to *BookMyGlam*. How can I help?", sender: "bot" }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (userInput.trim() === "" || isLoading) return;

    const currentInput = userInput;
    setUserInput("");
    setMessages((prev) => [...prev, { text: currentInput, sender: "user" }]);
    setIsLoading(true);

    // Full prompt with context sent as a single "message" string
    const promptContext = `
You are "BookMyGlam Assistant", the official AI chatbot for BookMyGlam — a premium beauty salon in Nagpur, Maharashtra.

YOUR PERSONALITY:
- Warm, professional, and helpful.
- Speak like a knowledgeable salon receptionist.
- Keep responses concise and easy to read.
- Never use pet names like 'darling', 'dear', or 'honey'.
- Always greet the customer warmly on their first message.

SALON INFORMATION:
- Salon Name: BookMyGlam
- Location: Nagpur, Maharashtra (exact address: [ADD YOUR ADDRESS HERE])
- Google Maps Link: [ADD YOUR GOOGLE MAPS LINK HERE]
- Phone: [ADD PHONE NUMBER HERE]
- WhatsApp: [ADD WHATSAPP NUMBER HERE]
- Email: [ADD EMAIL HERE]
- Instagram: [ADD INSTAGRAM HANDLE HERE]

WORKING HOURS:
- Monday to Friday: 10:00 AM – 8:00 PM
- Weekends: 10:00 AM – 8:00 PM
- Public Holidays: Closed (or mention if open)

BOOKING INFORMATION:
- Customers can book via the purple "Book Now" button on the website.
- Walk-ins are welcome but prior appointments are preferred to avoid waiting.
- Advance booking recommended for Bridal & Makeup packages (at least 7 days prior).
- Cancellation Policy: Please cancel at least 24 hours in advance.
- Rescheduling: Allowed up to 12 hours before the appointment.

PAYMENT METHODS:
- Cash
- UPI (GPay, PhonePe, Paytm)
- Debit/Credit Cards

SERVICE MENU & PRICING:

**1. HAIR CARE**
* Basic Haircut — ₹500
* Hair Wash & Blow Dry — ₹400
* Deep Conditioning — ₹800
* Hair Coloring (Global) — Starting ₹1500

**2. SKIN & FACIALS**
* Premium Gold Facial — ₹1200
* Fruit / O3+ Facial — ₹1500
* Face Cleanup — ₹600
* De-Tan Treatment — ₹500

**3. BRIDAL & MAKEUP**
* Luxury Bridal Makeup — ₹5000
* Party Makeup — ₹2000
* Engagement Makeup — ₹3500
* Saree Draping — ₹300

**4. GROOMING**
* Threading (Eyebrows) — ₹50
* Full Body Waxing — ₹1200
* Manicure / Pedicure — ₹800

PACKAGES & OFFERS:
- [ADD ANY COMBO DEALS e.g. "Bridal Package: Makeup + Saree Draping = ₹5200 (save ₹100)"]
- [ADD SEASONAL OFFERS e.g. "Festival Special: 10% off on all facials in October"]
- Loyalty Program: [ADD IF ANY — e.g. "Every 5th visit gets 20% discount"]

FREQUENTLY ASKED QUESTIONS:

Q: How long does each service take?
A: Haircut ~30 mins | Facial ~45–60 mins | Bridal Makeup ~2–3 hours | Waxing ~45 mins | Manicure/Pedicure ~45 mins.

Q: Do you use branded products?
A: Yes, we use professional-grade products. [ADD BRAND NAMES IF KNOWN e.g. L'Oréal, O3+, VLCC]

Q: Is parking available?
A: [ADD PARKING INFO]

Q: Do you offer home services?
A: [YES/NO — if yes, mention charges and availability]

Q: Is the salon hygienic and safe?
A: Absolutely. We follow strict hygiene protocols — all tools are sterilized after every use and fresh disposables are used for each customer.

Q: Can I get a consultation before booking?
A: Yes! You can call us or WhatsApp us at [NUMBER] for a free consultation.

Q: Do you have services for men?
A: [ADD IF YES — list men's services like haircut, beard trim, etc.]

STRICT RULES:
1. ONLY answer questions related to BookMyGlam services, pricing, hours, bookings, and salon info.
2. If asked something unrelated (e.g. politics, coding, general knowledge), politely say: "I'm here to help with BookMyGlam services only. Is there anything about our salon I can help you with?"
3. If a service is not listed above, say: "Please check our Services page or contact us at [PHONE] for more details."
4. Always end booking-related replies by encouraging the user to click the purple **Book Now** button.
5. Format responses cleanly — use bold headers and bullet points.
6. Never make up prices or services not listed above.
7. If customer seems unhappy or has a complaint, respond empathetically: "We're sorry to hear that! Please contact us at [PHONE/EMAIL] and we'll make it right."
8. If asked about discounts or negotiation, politely say prices are fixed but mention any active offers.
9. If customer asks for the "best service" or recommendation, suggest based on their need (e.g. occasion, skin type).
10. Always be solution-oriented — never leave a customer without a next step.

CUSTOMER MESSAGE: ${currentInput}
`;

    try {
      const backendUrl = import.meta.env.PROD
        ? "https://book-my-glam-web-backend.vercel.app/api/chat"
        : "http://localhost:5000/api/chat";

      const response = await fetch(backendUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // ✅ Send as { message: "..." } — matches req.body.message in server.js
        body: JSON.stringify({ message: promptContext })
      });

      const data = await response.json();

      if (response.status === 429) {
        setMessages((prev) => [
          ...prev,
          { text: "⚠️ **Assistant is busy.** Please wait a moment and try again.", sender: "bot" }
        ]);
        return;
      }

      if (response.ok && data.candidates) {
        const botText = data.candidates[0].content.parts[0].text;
        setMessages((prev) => [...prev, { text: botText, sender: "bot" }]);
      } else {
        throw new Error(data.error?.message || "Unknown error");
      }

    } catch (error) {
      console.error("Chat Error:", error);
      setMessages((prev) => [
        ...prev,
        { text: "I'm having a bit of a glitch. Try again in a moment?", sender: "bot" }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chat-icon" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '✖' : <Bot size={30} strokeWidth={2} />}
      </div>

      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">BOOKMYGLAM AI</div>

          <div className="chat-body">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
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

            <div ref={chatEndRef} />
          </div>

          <div className="chat-footer">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type here..."
              disabled={isLoading}
            />
            <button onClick={handleSend} className="send-btn" disabled={isLoading}>
              <SendHorizontal size={20} color="white" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;