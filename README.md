# 🧠 Emotional Support Chatbot & Psychological Journal

This project is a **web application** built with **Next.js**, **TypeScript**, and **TailwindCSS**, integrating **Firebase** for authentication and data storage, and the **Gemini API** for natural language processing.  

The app acts as both an **emotional support chatbot** and a **digital psychological journal**.  
Users can write daily entries about their experiences, which are then analyzed by Gemini to provide:  
- **Sentiment analysis** of each entry  
- **Emotional trends** over time  
- **Summaries of well-being**  

This tool offers an interactive and insightful way to reflect on emotions, helping users better understand their mental and emotional states.  

---

## 🚀 Features
- 🔐 **Firebase Authentication** – Secure sign-in and user management  
- 📝 **Daily Journal** – Write and store personal reflections  
- 🤖 **Gemini-powered Chatbot** – Conversational emotional support  
- 📊 **Sentiment Analysis** – Insights into mood and well-being  
- 📈 **Emotional Trends** – Track changes in emotions over time  
- 🎨 **Modern UI** – Built with TailwindCSS for a clean, responsive design  

---

## 🛠️ Tech Stack
- [Next.js](https://nextjs.org/) – React framework for server-side rendering and routing  
- [TypeScript](https://www.typescriptlang.org/) – Strongly typed JavaScript  
- [TailwindCSS](https://tailwindcss.com/) – Utility-first CSS framework  
- [Firebase](https://firebase.google.com/) – Authentication & Firestore database  
- [Gemini API](https://ai.google.dev/) – Natural language understanding and sentiment analysis  

---

## ⚡ Getting Started

### 1. Clone the repository  
```
git clone https://github.com/your-username/pwa-psycho.git
cd pwa-psycho
```
### 2. Install dependencies
```
npm install
```
### 3. Set up environment variables

Create a .env.local file in the root directory and add your Firebase and Gemini credentials:
```
NEXT_PUBLIC_FIREBASE_API_KEY=your FIREBASE API
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your auth domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your project ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your storeage bucket ID
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your messaging sender ID
NEXT_PUBLIC_FIREBASE_APP_ID=your app ID
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your measurement ID
NEXT_PUBLIC_FIREBASE_CLIENT_ID=your firebase client ID
GOOGLE_API_KEY=your gemini API
FIREBASE_PROJECT_ID=your firebase ID project
FIREBASE_CLIENT_EMAIL=your firebase email
FIREBASE_PRIVATE_KEY=your private key

```
### 4. Run the development server

```

npm run dev

```

### 5. Open the app

Go to: http://localhost:3000
 🚀

 
