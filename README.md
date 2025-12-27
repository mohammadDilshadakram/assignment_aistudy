# StudyTool AI - Interactive Economics Companion

An AI-powered study companion inspired by NotebookLM, designed to help students master Economics Chapter 1 through interactive text, audio, and video resources.

## 🌟 Features

### 1. Interactive Study Chat (Audio & Text)
-   **Audio Conversation**: Ask questions using your voice (Microphone) and listen to responses (Text-to-Speech).
-   **Context-Aware AI**: Asks and answers questions strictly based on the provided "Introduction to Economics" chapter.
-   **Out-of-Scope Detection**: Politely refuses questions unrelated to the chapter (e.g., sports, politics).

### 2. Deep Dive Source Content
-   **Full Textbook Chapter**: Access a comprehensive, textbook-style rendition of "Chapter 1: Introduction to Economics".
-   **Key Concepts**: Detailed sections on Scarcity, Opportunity Cost, PPF, and Economic Systems.

### 3. Smart Video Summaries
-   **On-Demand Generation**: Click "Generate Summary" to instantly analyze educational videos.
-   **Detailed Insights**: Get comprehensive, paragraph-style summaries of key video takeaways.
-   **Dual View**: Watch the lecture video while reading the AI-generated notes side-by-side.

## 🛠️ Tech Stack
-   **Frontend**: Next.js 14 (App Router), React, Tailwind CSS.
-   **Styling**: Lucide Icons, Custom Glassmorphism UI, Dark Mode compatible.
-   **Audio**: Web Speech API (SpeechRecognition & SpeechSynthesis).
-   **Backend**: Next.js API Routes (Node.js runtime).

## 🚀 How to Run

### Prerequisites
-   Node.js 18.17 or later

### Installation & Setup

1.  **Clone the repository** (if applicable) or navigate to the project folder.

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Start the Development Server**:
    ```bash
    npm run dev
    ```

4.  **Access the Application**:
    Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📂 Project Structure
-   `app/page.tsx`: Main dashboard combining Sidebar, Content View, and Chat.
-   `components/ChatInterface.tsx`: Handles chat logic, audio recording, and text-to-speech.
-   `lib/data.ts`: Contains the Mock Knowledge Base (Full Chapter Content & Video Summaries).
-   `app/api/chat/route.ts`: API route simulating the AI study guide logic.

## 💡 Usage Guide
1.  **Read**: Select "Chapter 1" from the sidebar to read the full source text.
2.  **Watch**: Click a video title to watch a lecture. Click "Generate Summary" to get notes.
3.  **Chat**: Switch to "Chat & Audio" mode. Type or use the **Mic** button to ask questions like "What is opportunity cost?". Click the **Speaker** icon on any message to hear it read aloud.
