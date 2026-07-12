# School Research Hub 🎓🚀

Welcome to the **School Research Hub**, a modern, premium, "Netflix-style" web application designed to showcase, browse, and save academic research papers from STE (Science, Technology, and Engineering) and STEM students.

## 📖 Overview

The School Research Hub moves away from traditional, boring file directory systems. Instead, it provides a highly visual, interactive, and responsive platform that treats academic research with the premium presentation it deserves.

### 🌟 Key Features
*   **Premium Visual Design**: Dark navy theme with gold accents, utilizing Tailwind CSS v4 for a cinematic UI.
*   **Netflix-Style Browsing**: Horizontal, smoothly scrollable carousels categorized by strand, trending status, and awards.
*   **Interactive Search**: Real-time filtering that seamlessly transforms carousels into an organized grid of search results.
*   **Quick-View Modal**: Clicking any paper instantly slides up a sleek overlay detailing the abstract, authors, keywords, and award badges.
*   **Offline Capability**: A robust caching system using `localStorage` (via a custom hook) allows users to save papers for offline reading.
*   **Simulated Offline Mode**: A UI toggle that restricts browsing to the local cache to demonstrate the offline functionality.
*   **Supabase Backend**: Integrated with Supabase for persistent data storage and potential future authentication.

## 🛠️ Technology Stack

*   **Frontend Framework**: React 19 (via Vite)
*   **Styling**: Tailwind CSS v4
*   **Icons**: Lucide React
*   **Backend & Database**: Supabase (PostgreSQL)

## 🚀 Quick Start Guide

Follow these instructions to get the project running locally on your machine.

### Prerequisites
*   Node.js (v18 or higher recommended)
*   npm (or your preferred package manager)
*   A Supabase account (for backend features)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/venstqs/Research-Hub-Website.git
    cd Research-Hub-Website
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables:**
    Ensure you have a `.env.local` file in the root directory with your Supabase credentials:
    ```env
    VITE_SUPABASE_URL=your_supabase_project_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will usually be available at `http://localhost:5173/`.

## 📚 Documentation

Detailed documentation can be found in the `docs/` folder:

*   [Project Proposal (docs/PROPOSAL.md)](docs/PROPOSAL.md)
*   [Usage & Demonstration Guide (docs/USAGE.md)](docs/USAGE.md)
*   [Backend Integration Guide (docs/BACKEND.md)](docs/BACKEND.md)
*   [Maintenance & Deployment (docs/MAINTENANCE.md)](docs/MAINTENANCE.md)

---
*Designed for Science, Technology, and Engineering programs to empower student researchers globally.*
