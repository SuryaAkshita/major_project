# Legal Risk Analyzer - Frontend

Professional law-firm-grade frontend for AI-powered legal document analysis.

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Framer Motion** - Subtle animations
- **Lucide Icons** - Icon library
- **Axios** - HTTP client

## Design Philosophy

This frontend is designed with a conservative, professional aesthetic suitable for:
- Law firms
- Corporate legal teams
- Compliance officers
- Judicial environments

### Color Palette
- Primary: Deep navy (#0E1628) and charcoal (#111827)
- Panels: Slate (#1F2937) and stone gray (#E5E7EB)
- Accent: Muted gold (#C8A24D) and steel blue (#4B6FAF)
- Text: Off-white and soft gray

### Typography
- Headings: Playfair Display (serif)
- Body: Inter (sans-serif)

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
cd legal-risk-analyzer/frontend/legal-ui
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

### Environment Variables

Create a `.env` file (see `.env.example`):

```
VITE_API_BASE=http://localhost:8000
```

## Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Sidebar.jsx      # Left sidebar navigation
│   │   └── Header.jsx       # Top header bar
│   └── chat/
│       ├── ChatContainer.jsx    # Main chat interface
│       ├── MessageCard.jsx      # Individual message display
│       ├── InputBar.jsx        # Message input and file upload
│       ├── EmptyState.jsx      # Initial empty state
│       └── DocumentPreview.jsx # Uploaded file preview
├── lib/
│   ├── api.js           # API integration
│   └── utils.js         # Utility functions
├── App.jsx              # Main app component
├── main.jsx            # React entry point
└── index.css           # Global styles
```

## Features

- **Professional Chat Interface** - Formal consultation-style messaging
- **Document Upload** - PDF and DOCX file support
- **Analysis History** - Sidebar with previous analyses
- **Real-time Analysis** - Integration with backend API
- **Responsive Design** - Desktop-first, mobile-responsive
- **Accessibility** - High contrast, readable typography

## API Integration

The frontend expects the following backend endpoints:

- `POST /analyze` - Analyze text input
- `POST /analyze-upload` - Analyze uploaded file

See `src/lib/api.js` for implementation details.

## License

Proprietary - Law Firm Internal Use

