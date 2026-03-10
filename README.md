# DC Tools

**DC Tools** is a desktop application developed by the [DC Highs team](https://github.com/dc-highs) - specifically by member [Marcuth](https://github.com/marcuth) - that provides a intuitive interface to search, download, and manage static files and game data related to **Dragon City**.

Instead of manually building URLs and writing parameters, DC Tools offers a user-friendly interface to perform these operations with just a few clicks.

## Objectives

- Simplify the process of finding and downloading Dragon City game assets
- Provide tools to parse and validate file URLs
- Enable players and content creators to access game resources easily
- Support the Dragon City community with useful utilities

## Features

### Assets Downloader

Download various game assets in multiple formats:

- **Dragons**
    - Sprite images
    - Thumbnails
    - Flash animations (.swf)
    - Spine animations (.zip)

- **Buildings**
    - Sprites
    - Thumbnails

- **Decorations**
    - Sprites
    - Thumbnails

- **Habitats**
    - Sprites
    - Thumbnails

- **Other Assets**
    - Chest sprites
    - Island packages
    - Music/sound files
    - Find all dragon files (bulk search)

### URL Tools

Parse and extract information from Dragon City file URLs:

- Dragon Sprite URL Parser
- Dragon Thumbnail URL Parser
- Dragon Flash Animation URL Parser
- Dragon Spine Animation URL Parser

### Game Config

Fetch game configuration data:

- **Config Fetcher**: Retrieve game configuration files
- **Localization Fetcher**: Get game localization/translation data

### Animation Players

- **Spine Player**: View and preview Spine animations directly in the app

### Settings

- Configure API keys (e.g., BigJPG for image upscaling)
- Customize download preferences
- Manage application settings

## Tech Stack

- **Frontend**: React 19, React Router DOM 7, Tailwind CSS 4
- **Desktop**: Electron 40
- **UI Components**: Shadcn UI, Radix UI, Lucide React
- **Forms**: React Hook Form + Zod
- **Build**: Vite 7, TypeScript 5.9
- **Backend**: Express (static server), electron-store

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Linting

```bash
npm run lint
npm run lint:fix
```

### Testing

```bash
npm run test           # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # With coverage report
```

## Project Structure

```
dc-tools/
├── electron/               # Electron main process
│   ├── handlers/          # IPC handlers
│   ├── lib/              # Utilities
│   ├── main.ts           # Entry point
│   └── preload.ts        # Context bridge
├── src/                   # React frontend
│   ├── components/       # UI components
│   ├── pages/            # Route pages
│   ├── hooks/            # Custom hooks
│   ├── schemas/          # Zod schemas
│   └── utils/            # Utilities
└── vite.config.ts        # Vite configuration
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request or open an Issue on our [GitHub repository](https://github.com/dc-highs/dc-tools).

## Donate

Support the development of DC Tools:

- [Buy Me A Coffee](https://www.buymeacoffee.com/marcuth)
- [Ko-fi](https://ko-fi.com/marcuth)
- [LivePix](https://livepix.gg/marcuth)
- PIX: pix@marcuth.dev

## License

This project is licensed under the [MIT](LICENSE) license.
