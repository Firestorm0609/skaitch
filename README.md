# 🎨 SKAITCH
**Sketch + AI = Skaitch**

The first drawing platform where you and AI collaborate turn-by-turn. Draw, click assist, and watch your vision come to life.

![Skaitch](https://img.shields.io/badge/Hackathon-Solana_Graveyard-purple)
![License](https://img.shields.io/badge/license-MIT-blue)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Solana wallet (Phantom recommended)
- API keys (Replicate, OpenAI)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/skaitch.git
cd skaitch

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Add your API keys to .env.local

# Run development server
npm run dev

# Open http://localhost:3000
```

### Environment Variables

Create `.env.local` with:

```env
# AI Services
REPLICATE_API_KEY=your_key_here
OPENAI_API_KEY=your_key_here

# Solana
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com

# Database (optional for hackathon)
DATABASE_URL=your_postgresql_url
```

## 🎯 Features

### ✅ MVP (Implemented)
- ✅ Full canvas with Fabric.js
- ✅ Professional drawing tools
- ✅ Layer management system
- ✅ AI assist interface
- ✅ Undo/redo functionality
- ✅ Project state management (Zustand)
- ✅ Responsive UI with Tailwind

### 🚧 In Progress
- 🚧 AI model integration (Replicate API)
- 🚧 Solana wallet connection
- 🚧 NFT minting with Metaplex
- 🚧 Arweave upload

### 🎁 Stretch Goals
- ⬜ Real-time collaboration
- ⬜ Animation timeline
- ⬜ Custom brushes
- ⬜ Mobile responsive

## 🏗️ Architecture

```
skaitch/
├── app/                    # Next.js 14 app directory
│   ├── page.tsx           # Landing page
│   ├── editor/page.tsx    # Main editor
│   └── api/               # API routes
│       └── ai/
│           └── assist/    # AI assistance endpoint
├── components/
│   ├── canvas/            # Canvas components
│   │   ├── SkaitchCanvas.tsx
│   │   ├── ToolPanel.tsx
│   │   └── LayerManager.tsx
│   └── ai-assist/         # AI components
│       └── AIAssistPanel.tsx
├── lib/
│   ├── utils.ts           # Utility functions
│   └── store.ts           # Zustand state management
├── types/
│   └── index.ts           # TypeScript definitions
└── styles/
    └── globals.css        # Global styles
```

## 🎨 Usage

### Basic Drawing
1. Select a tool from the left panel
2. Choose your color and brush size
3. Start drawing on the canvas
4. Use layers for complex artwork

### AI Assistance
1. Draw your sketch
2. Click the "AI Assist" button
3. Select a quick action OR enter a custom prompt
4. Review the AI suggestion
5. Accept or reject, then continue drawing

### Example Prompts
- "make this a basketball, uncolored"
- "perfect this circle"
- "straighten this line"
- "add shading to make it 3D"
- "suggest colors for this sketch"

## 🔧 Tech Stack

| Category | Technology |
|----------|-----------|
| Frontend | Next.js 14, React, TypeScript |
| Canvas | Fabric.js |
| Styling | TailwindCSS, shadcn/ui |
| State | Zustand |
| AI | Replicate (Stable Diffusion) |
| Blockchain | Solana, Metaplex |
| Storage | Arweave |

## 📝 Development Notes

### For Next Developer

**Completed:**
- ✅ Project structure and configuration
- ✅ Core canvas functionality
- ✅ UI components and layout
- ✅ State management
- ✅ Type definitions

**TODO Priority:**

1. **AI Integration** (High Priority)
   - Implement Replicate API calls in `/app/api/ai/assist/route.ts`
   - Add actual image-to-image generation
   - Implement ControlNet for structure preservation
   - Test different AI assist types

2. **Solana/NFT** (High Priority)
   - Add wallet adapter component
   - Implement Metaplex NFT minting
   - Add Arweave upload functionality
   - Create NFT metadata generator

3. **Canvas Improvements**
   - Add more drawing tools (shapes, fill, text)
   - Implement actual layer rendering
   - Add canvas export (PNG, JPG)
   - Improve brush engine

4. **Polish**
   - Add loading states
   - Add error handling
   - Add toast notifications
   - Create demo video

### Quick Commands

```bash
# Development
npm run dev

# Type check
npm run type-check

# Build for production
npm run build

# Start production server
npm start
```

### Key Files to Modify

1. **AI Integration**: `/app/api/ai/assist/route.ts`
   - Add Replicate API key
   - Implement actual AI model calls
   - Handle different assist types

2. **Canvas Enhancement**: `/components/canvas/SkaitchCanvas.tsx`
   - Add more Fabric.js features
   - Implement advanced drawing tools
   - Add layer composition

3. **State Management**: `/lib/store.ts`
   - Add blockchain state
   - Implement save/load from database
   - Add user authentication state

## 🏆 Hackathon Submission

**Category**: Exchange Art - Most Innovative Art Tool ($2,500)

**Unique Value:**
- First turn-by-turn AI collaboration platform
- Artist maintains creative control
- Full professional drawing suite
- On-chain provenance tracking

**Demo Script:**
1. Show landing page and brand
2. Open editor, demonstrate drawing tools
3. Draw a simple sketch (e.g., circle)
4. Use AI assist to transform it
5. Show layer management
6. Demonstrate quick actions
7. Show project stats (AI contribution)

## 📄 License

MIT License - Built for Solana Graveyard Hackathon 2026

## 🙏 Acknowledgments

- Solana Foundation
- Exchange Art
- Anthropic (for Claude!)

---

**Built with ❤️ where sketch meets AI ✨**
