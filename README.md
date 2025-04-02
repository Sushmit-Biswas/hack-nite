# ✨ MockMate: AI Mock Interview Platform ✨

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14+-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3+-cyan?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-SDK_v9+-orange?logo=firebase&logoColor=white)](https://firebase.google.com/)
[![Vapi AI](https://img.shields.io/badge/Vapi-AI_Voice-lightgrey)](https://vapi.ai/)

---

🚀 **Welcome to MockMate!** Practice your interviewing skills with an intelligent AI interviewer that provides instant feedback. Ace your next technical or behavioral interview! 🤖💼

<!-- ![Project Banner Placeholder](https://via.placeholder.com/1200x400/cccccc/888888?text=MockMate+Project+Banner)
*(Suggestion: Replace the placeholder above with a cool banner for your project!)* -->

---

## 🌟 Overview

MockMate is a web application designed to help users prepare for job interviews by simulating realistic interview scenarios with an AI agent. Users can select interview types (e.g., technical, behavioral), engage in a voice-based conversation with the AI, and receive detailed feedback on their performance, covering aspects like clarity, relevance, and technical accuracy.

---

## ✨ Key Features

*   🗣️ **AI-Powered Interviews:** Engage in realistic voice conversations.
*   🧠 **Multiple Interview Types:** Practice for various roles and scenarios.
*   📈 **Instant Feedback:** Get detailed analysis of your answers.
*   🔒 **Secure Authentication:** User accounts powered by Firebase Auth.
*   🎨 **Modern UI:** Clean and responsive interface built with Tailwind CSS.
*   💾 **Interview History:** Track your progress over time (Firebase Firestore).
*   ⚙️ **Customizable Settings:** (Future goal) Tailor interview difficulty and focus areas.

---

## 🛠️ Tech Stack

*   **Framework:** [Next.js](https://nextjs.org/)<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nextjs/nextjs-original.svg" alt="Next.js" width="20" height="20"/>
*   **Language:** [TypeScript](https://www.typescriptlang.org/) <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg" alt="TypeScript" width="20" height="20"/>
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/) <img src="https://camo.githubusercontent.com/f36990f11f932129fd60e5d06de1d4340057f62caddd151453609d6ad28b069f/68747470733a2f2f6564656e742e6769746875622e696f2f537570657254696e7949636f6e732f696d616765732f7376672f7461696c77696e644373732e737667" alt="Tailwind CSS" width="20" height="20"/>
*   **Backend & Auth:** [Firebase (Auth, Firestore)](https://firebase.google.com/) <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/firebase/firebase-plain.svg" alt="Firebase" width="20" height="20"/>
*   **AI Voice Agent:** [Vapi](https://vapi.ai/)
*   **UI Components:** [Shadcn/ui](https://ui.shadcn.com/)
*   **Deployment:** Vercel

---

## 🚀 Getting Started

Follow these steps to set up and run the project locally:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Sushmit-Biswas/hack-nite.git
    cd hack-nite
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3.  **Set up Environment Variables:**
    Create a `.env.local` file in the root directory and add the necessary environment variables. Refer to `.env.example` (if available) or the required keys below:
    ```plaintext
    # Firebase Configuration (obtain from your Firebase project console)
    NEXT_PUBLIC_FIREBASE_API_KEY=
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
    NEXT_PUBLIC_FIREBASE_APP_ID=
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
    
    # For Firebase Admin SDK (used in backend functions/API routes)
    FIREBASE_PRIVATE_KEY=
    FIREBASE_CLIENT_EMAIL=
    FIREBASE_PROJECT_ID=

    # Vapi Configuration (obtain from Vapi dashboard)
    NEXT_PUBLIC_VAPI_WEB_TOKEN=
    NEXT_PUBLIC_VAPI_WORKFLOW_ID=

    # Google AI Studio Configuration
    GOOGLE_GENERATIVE_AI_API_KEY=

    # Other necessary variables (if any)
    # e.g., NEXT_PUBLIC_API_BASE_URL=
    ```
    *Note: Ensure Firebase Admin SDK setup is correctly configured if used in API routes.*

4.  **Run the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) in your browser to see the application. 🎉

---

## 📁 Folder Structure (Simplified)

```
hack-nite/
├── app/                  # Next.js App Router (Pages, Layouts, API Routes)
│   ├── (auth)/           # Authentication pages (Sign In, Sign Up)
│   ├── (root)/           # Main application pages (Dashboard, Interview)
│   └── api/              # API endpoints (e.g., Vapi integration)
├── components/           # Reusable UI components (Shadcn/ui, custom)
├── constants/            # Application constants (e.g., navigation links)
├── firebase/             # Firebase configuration (client, admin SDK)
├── lib/                  # Utility functions, SDKs, actions (server/client)
├── public/               # Static assets (images, icons)
├── types/                # TypeScript type definitions
├── .env.local            # Local environment variables (Gitignored)
├── next.config.ts        # Next.js configuration
├── package.json          # Project dependencies and scripts
└── tsconfig.json         # TypeScript configuration
```

---

## 🤝 Contributing

Contributions are welcome! If you'd like to contribute, please follow these steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'Add some feature'`).
5.  Push to the branch (`git push origin feature/your-feature-name`).
6.  Open a Pull Request.

Please ensure your code adheres to the project's coding standards and includes tests where applicable.

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details (if one exists, otherwise state MIT).

---

## 🙏 Acknowledgements

*   Inspiration from similar AI interview platforms.
*   Thanks to the creators of the libraries and tools used.
*   Shoutout to the Hackathon organizers/community (if applicable).

---

Made with ❤️ and lots of ☕ by NexusKnight
