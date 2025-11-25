<a name="readme-top"></a>

<!-- PROJECT SHIELDS -->

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/Seebaastiaan/MindfulSpace">
    <h1>🧠</h1>
  </a>

  <h3 align="center">MindfulSpace</h3>

  <p align="center">
    An intelligent emotional support companion and psychological journal
    <br />
    <a href="https://github.com/Seebaastiaan/MindfulSpace"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/Seebaastiaan/MindfulSpace">View Demo</a>
    ·
    <a href="https://github.com/Seebaastiaan/MindfulSpace/issues">Report Bug</a>
    ·
    <a href="https://github.com/Seebaastiaan/MindfulSpace/issues">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#features">Features</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

MindfulSpace is a comprehensive web application that combines the power of AI-driven emotional support with a sophisticated digital journaling system. Built with modern technologies, it provides users with a safe space to express their feelings, track emotional patterns, and receive personalized support through an intelligent chatbot.

The application leverages Google's Gemini AI to analyze journal entries and provide meaningful insights into emotional well-being. Users can write daily reflections, track their emotional journey over time, and engage in supportive conversations with an AI assistant trained to provide empathetic responses.

**Key Capabilities:**

- 🔐 Secure authentication and personalized user experience
- 📝 Daily journaling with automatic sentiment analysis
- 🤖 AI-powered emotional support chatbot
- 📊 Visual emotional trend tracking and analytics
- 🔥 Streak tracking to encourage consistent journaling
- 🎨 Beautiful, responsive UI with smooth animations

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

This project is built with cutting-edge technologies to ensure performance, scalability, and an excellent user experience:

- [![Next][Next.js]][Next-url]
- [![React][React.js]][React-url]
- [![TypeScript][TypeScript]][TypeScript-url]
- [![TailwindCSS][TailwindCSS]][Tailwind-url]
- [![Firebase][Firebase]][Firebase-url]
- [![Material-UI][MUI]][MUI-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18 or higher)
- npm
  ```sh
  npm install npm@latest -g
  ```
- A Firebase project set up ([Create one here](https://console.firebase.google.com/))
- A Google Gemini API key ([Get one here](https://ai.google.dev/))

### Installation

1. **Get your API Keys**

   - Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
   - Get a Gemini API Key at [https://ai.google.dev/](https://ai.google.dev/)
   - Set up Firebase Admin SDK credentials

2. **Clone the repository**

   ```sh
   git clone https://github.com/Seebaastiaan/MindfulSpace.git
   cd MindfulSpace
   ```

3. **Install NPM packages**

   ```sh
   npm install
   ```

4. **Create environment variables**

   Create a `.env.local` file in the root directory and add your credentials:

   ```env
   # Firebase Client Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
   NEXT_PUBLIC_FIREBASE_CLIENT_ID=your_client_id

   # Firebase Admin Configuration (for server-side operations)
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_CLIENT_EMAIL=your_service_account_email
   FIREBASE_PRIVATE_KEY="your_private_key"

   # Google Gemini API
   GOOGLE_API_KEY=your_gemini_api_key
   ```

5. **Run the development server**

   ```sh
   npm run dev
   ```

6. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

## Usage

### 🔐 Authentication

1. Click "Sign in with Google" on the homepage
2. Authorize with your Google account
3. You'll be redirected to your personalized dashboard

### 📝 Writing Journal Entries

1. Navigate to the **Diario** (Journal) section
2. Click the "Write new entry" button
3. Type your thoughts, feelings, or experiences
4. Click "Save" to store your entry
5. Entries are automatically analyzed for sentiment

### 📊 Viewing Emotional Analytics

1. Go to the **Bonito** (Analytics) section
2. View your emotional trends over time
3. See weekly emotion breakdowns with visual charts
4. Track your journaling streak
5. Click "Analyze Emotions" to generate AI-powered insights (requires at least 3 entries)

### 💬 Using the Emotional Support Chat

1. Navigate to the **Chat** section
2. Type your message or concern
3. Receive empathetic, AI-generated responses
4. Continue the conversation for support and guidance
5. All conversations are stored privately in your account

### 🔥 Tracking Your Streak

- Write at least one journal entry per day to maintain your streak
- View your current streak count on the dashboard
- Streaks reset if you miss a day

### 📈 Understanding Sentiment Analysis

The app analyzes each journal entry and categorizes emotions into:

- **Positive emotions**: Feliz (Happy), Emocionado (Excited), Motivado (Motivated)
- **Neutral emotions**: Neutral, Tranquilo (Calm)
- **Negative emotions**: Triste (Sad), Ansioso (Anxious), Estresado (Stressed)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- FEATURES -->

## Features

### 🔐 **Secure Authentication**

- Google OAuth integration via Firebase
- Secure session management
- User-specific data isolation

### 📝 **Smart Journaling**

- Rich text input for daily entries
- Automatic date stamping
- Entry editing and deletion
- Persistent storage in Firestore

### 🤖 **AI-Powered Chat Assistant**

- Gemini 1.5 Flash model for fast responses
- Empathetic conversation design
- Context-aware emotional support
- Real-time message streaming

### 📊 **Emotional Analytics**

- Sentiment analysis of journal entries
- Weekly emotion tracking with visual charts
- Mood trend identification (improving/stable/declining)
- Personalized recommendations based on patterns
- Historical analysis viewing

### 🔥 **Engagement Features**

- Daily journaling streak tracking
- Motivational tips and reminders
- Progress visualization
- Achievement milestones

### 🎨 **Modern User Interface**

- Responsive design for all devices
- Smooth animations and transitions
- Intuitive navigation
- Dark mode support
- Material-UI components with custom styling

### 🔒 **Privacy & Security**

- End-to-end data encryption
- Secure Firebase Admin SDK for server operations
- Private user data collections
- No third-party data sharing

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ROADMAP -->

## Roadmap

- [x] Core journaling functionality
- [x] Google authentication
- [x] AI chatbot integration
- [x] Sentiment analysis
- [x] Emotional trend visualization
- [x] Streak tracking
- [ ] Multi-language support
  - [ ] Spanish
  - [ ] French
  - [ ] German
- [ ] Export journal entries (PDF/CSV)
- [ ] Advanced analytics dashboard
- [ ] Mood prediction using ML
- [ ] Mobile app (React Native)
- [ ] Voice journaling
- [ ] Therapist collaboration features
- [ ] Community support groups (anonymous)

See the [open issues](https://github.com/Seebaastiaan/MindfulSpace/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

Sebastian - [@Seebaastiaan](https://github.com/Seebaastiaan)

Project Link: [https://github.com/Seebaastiaan/MindfulSpace](https://github.com/Seebaastiaan/MindfulSpace)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->

## Acknowledgments

Resources and libraries that made this project possible:

- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Google Gemini API](https://ai.google.dev/gemini-api/docs)
- [Material-UI](https://mui.com/)
- [Lucide Icons](https://lucide.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [Vercel Deployment](https://vercel.com/)
- [Best-README-Template](https://github.com/othneildrew/Best-README-Template)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/Seebaastiaan/MindfulSpace.svg?style=for-the-badge
[contributors-url]: https://github.com/Seebaastiaan/MindfulSpace/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/Seebaastiaan/MindfulSpace.svg?style=for-the-badge
[forks-url]: https://github.com/Seebaastiaan/MindfulSpace/network/members
[stars-shield]: https://img.shields.io/github/stars/Seebaastiaan/MindfulSpace.svg?style=for-the-badge
[stars-url]: https://github.com/Seebaastiaan/MindfulSpace/stargazers
[issues-shield]: https://img.shields.io/github/issues/Seebaastiaan/MindfulSpace.svg?style=for-the-badge
[issues-url]: https://github.com/Seebaastiaan/MindfulSpace/issues
[license-shield]: https://img.shields.io/github/license/Seebaastiaan/MindfulSpace.svg?style=for-the-badge
[license-url]: https://github.com/Seebaastiaan/MindfulSpace/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/your-linkedin
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[TypeScript]: https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white
[TypeScript-url]: https://www.typescriptlang.org/
[TailwindCSS]: https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white
[Tailwind-url]: https://tailwindcss.com/
[Firebase]: https://img.shields.io/badge/Firebase-039BE5?style=for-the-badge&logo=Firebase&logoColor=white
[Firebase-url]: https://firebase.google.com/
[MUI]: https://img.shields.io/badge/Material--UI-0081CB?style=for-the-badge&logo=material-ui&logoColor=white
[MUI-url]: https://mui.com/
