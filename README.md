# صلواتي - Salawati

A cross-platform Islamic day cycle routine management application built with Electron and React.

## Features

### 🕌 Islamic Day Cycle
- **Maghrib to Maghrib**: The app follows the Islamic day cycle starting from Maghrib
- **Dynamic Day Labels**: Shows "ليلة [Next Day]" after Maghrib, "[Current Day]" before Maghrib
- **Prayer Time Integration**: All time blocks are derived from accurate prayer times

### ⏰ Time Block System
- **Prayer Blocks (●)**: 1.5 hours for Qiyam, Fajr, Dhuhr, Asr; 3 hours for Maghrib & Isha
- **Interstitial Blocks (○)**: Variable duration between prayer blocks
- **Real-time Countdown**: Shows remaining time for active blocks
- **Status Indicators**: Active, past, and future block states

### 📝 Task Management
- **Contextual Tasks**: Add, edit, delete, and reorder tasks in prayer blocks
- **Drag & Drop**: Reorder tasks and sub-tasks seamlessly
- **Smart Filtering**: Filter tasks by "Normal Day", "Fasting Day", "Holiday"
- **Visual Hierarchy**: Main tasks (□) and sub-tasks (○) with different styling

### 📖 RTL Markdown Editor
- **Full RTL Support**: Natural Arabic writing experience
- **Rich Markdown**: Headings, bold, italics, lists, code blocks, links
- **Auto-save**: Notes are automatically saved to the database
- **Block-specific**: Notes are tied to specific day and time blocks

### 🔔 Notifications
- **Smart Reminders**: 5-minute notifications before every time block
- **Cross-platform**: Works on Windows, Mac, and Linux

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Desktop**: Electron 28
- **Styling**: CSS with RTL support
- **Date/Time**: date-fns with Arabic locale
- **Data**: Electron Store for local persistence
- **Build**: Vite for fast development

## Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/HaithamAlduais/salawati.git
cd salawati

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build
```bash
# Build for production
npm run build

# Build for specific platforms
npm run dist:win    # Windows
npm run dist:mac    # macOS
npm run dist:linux  # Linux
```

## Project Structure

```
salawati/
├── src/                    # React frontend
│   ├── components/        # React components
│   ├── hooks/            # Custom React hooks
│   ├── types/            # TypeScript type definitions
│   └── main.tsx          # React entry point
├── electron/              # Electron main process
│   └── src/              # Main process source
├── dist/                  # Built frontend
└── package.json           # Project configuration
```

## Localization

The app is fully localized in Arabic with RTL support:

- **Day Labels**: Dynamic Islamic day cycle labels
- **Prayer Names**: Arabic prayer names
- **UI Text**: All interface text in Arabic
- **Date/Time**: Arabic locale formatting

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Author

HaithamAlduais - [GitHub](https://github.com/HaithamAlduais)

---

**صلواتي** - Your Islamic day cycle companion 