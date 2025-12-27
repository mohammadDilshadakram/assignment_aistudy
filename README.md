# Interactive Economics Study Tool

An AI-powered study companion inspired by NotebookLM, designed to help students master Economics Chapter 1.

## Features

### 1. Interactive Study Chat (Core)
- **Context-Aware AI**: Asks and answers questions strictly based on the provided PDF ("Introduction to Economics").
- **Out-of-Scope Detection**: Politely refuses questions unrelated to the chapter (e.g., sports, politics).
- **Backend API**: Powered by a Node.js/Next.js route handler (`/api/chat`) simulating an LLM response.

### 2. Two-Person Audio Dialogue
- **Simulated Conversation**: Listen to a "Teacher" and "Student" discuss complex topics like Opportunity Cost.
- **Audio Player**: Simple controls (Play/Pause) to manage the learning session.
- **Technology**: Uses Web Speech API for client-side Text-to-Speech generation.

### 3. Video Summaries
- **Dual View**: Watch the lecture video while reading AI-generated key points.
- **Structure**: Includes Summary Points, Exam Tips, and Key Definitions.

## Tech Stack
- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS, Lucide Icons.
- **Backend**: Next.js API Routes (Node.js runtime).
- **Styling**: Custom Glassmorphism UI with Dark Mode support.
- **AI Simulation**: Custom keyword-matching algorithm (for demo reliability without API keys) simulating semantic search.

## How to Run

1.  **Install Dependencies**:
    ```bash
    npm install
    ```
2.  **Start Development Server**:
    ```bash
    npm run dev
    ```
3.  **Access the App**:
    Open `http://localhost:3000` in your browser.

## Relation to NotebookLM
Like NotebookLM, this tool takes a specific source (PDF/Video) and "grounds" the AI's knowledge in that source, preventing hallucinations. It transforms passive content into active dialogues and Q&A sessions.

## Project Structure
- `app/api/chat`: Backend logic for AI responses.
- `components/ChatInterface.tsx`: Main chat & audio visualizer UI.
- `lib/data.ts`: Mock knowledge base (PDF text/Video summaries).
- `prompts.md`: Documentation of System Prompts used for the AI.
