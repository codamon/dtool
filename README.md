# World Clock & Weather

A modern world clock and weather application built with Next.js 14.

## Features

- 🌍 Display current time and weather for multiple cities
- 🌤️ Real-time weather info and tomorrow's forecast
- 🎯 Draggable clock cards with persistent order
- 🌐 English and Chinese language support
- 💾 Auto-save card arrangement
- 🎨 Responsive design for mobile and desktop
- ⚡ Real-time clock updates

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Framer Motion
- React DnD
- next-intl
- OpenWeather API

## Getting Started

1. Clone the repository:
```bash
git clone [repository-url]
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file and add:
```bash
NEXT_PUBLIC_WEATHER_API_KEY=your_openweather_api_key
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
app/
├── [locale]/           # Localized routes
│   ├── layout.tsx     # Locale layout
│   └── page.tsx       # Main page
├── components/         # React components
│   ├── WorldClock/    # Clock components
│   └── ...           # Other components
├── i18n/              # Internationalization
├── lib/               # Utilities and API
└── messages/          # Translation files
```

## Internationalization

The app supports English and Chinese languages. Language files are located in the `messages/` directory.

## Weather Data

Weather information is fetched from OpenWeather API, including:
- Current temperature
- Temperature range
- Weather conditions
- Tomorrow's forecast

## Development

- Built with Next.js 14 App Router
- Uses Server Components and Client Components
- Implements drag-and-drop functionality
- Features smooth animations with Framer Motion

## License

MIT
