# Read It Fast

Read It Fast is a browser extension that enables rapid reading using **RSVP (Rapid Serial Visual Presentation)**. By holding a modifier key (Alt by default) and hovering over any text, words are displayed one at a time at a fixed location—eliminating eye movement and enabling you to read 2-3x faster. Customize the speed and experience optimal recognition point (ORP) highlighting for maximum reading efficiency.

## What is RSVP Reading?

RSVP reading stands for Rapid Serial Visual Presentation, a technique that displays text one word (or small groups of words) at a time in the same fixed location on a screen. This method eliminates the need for your eyes to move across lines of text, allowing you to focus on a single point while words flash by in rapid succession. By minimizing eye movement, RSVP can help you read faster than traditional methods—typically increasing speed from an average of 250-300 words per minute to 500 or more words per minute with practice. [elvers](https://elvers.us/perception/rsvp/)

The technique works by leveraging the brain's ability to process visual information quickly when the eyes remain stationary. RSVP tools and apps allow you to adjust the reading speed (measured in words per minute) to find a comfortable pace, and you can gradually increase the speed as you become more accustomed to the method. [7speedreading](https://www.7speedreading.com/what-is-rsvp/)

While traditional RSVP implementations work best with shorter texts—as longer materials may require the ability to pause, review previous sections, or create a mental "map" of the content—this extension solves that limitation. By holding down the trigger key and selecting which portion of text to read, you can pause anytime, take time to understand paragraphs, and navigate through longer materials at your own pace. Simply release the trigger to stop, then hover over a different section when you're ready to continue.

## 🚀 Features

- **RSVP Reading**: Word-by-word display at configurable speeds (WPM)
- **Hover Activation**: Hold modifier key and hover to start reading
- **Smart Text Selection**: Automatically extracts visible text from any webpage
- **Expandable Selection**: Expand to parent elements while reading
- **ORP Highlighting**: Highlights the optimal recognition point in each word
- **Customizable**: Adjust speed, colors, scale, hotkeys, and timing

## 📦 Installation

### From the store (recommended)

- **Chrome/Edge**: [Install from Chrome Web Store](https://chromewebstore.google.com/detail/read-it-fast/kkmjgffnjckcddlmhfbffbnkjgnmhlag)
- **Firefox**: [Install from Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/read-it-fast/)

### From Source

1. **Clone and install**:

   ```bash
   git clone https://github.com/codyadam/read-it-fast.git
   cd read-it-fast
   bun install
   ```

2. **Build**:

   ```bash
   bun run build
   ```

3. **Load in browser**:
   - **Chrome/Edge**: Open `chrome://extensions/`, enable "Developer mode", click "Load unpacked", select `.output/chrome-mv3`
   - **Firefox**: Open `about:debugging`, click "This Firefox", click "Load Temporary Add-on", select manifest.json from `.output/firefox-mv2`

### Development

```bash
bun run dev          # Chrome/Edge
bun run dev:firefox  # Firefox
```

## ⚙️ Settings

Access settings by clicking the extension icon. All settings are saved automatically.

### Reading Settings

| Setting              | Description                              | Default | Range  |
| -------------------- | ---------------------------------------- | ------- | ------ |
| **Words Per Minute** | Reading speed                            | 200     | 1-9999 |
| **Start Delay (s)**  | Delay before RSVP begins                 | 0.5     | 0-10   |
| **End Pause (mult)** | Multiplier for pause at sentence endings | 3.0     | 1-20   |

### Display Settings

| Setting          | Description                       | Default     |
| ---------------- | --------------------------------- | ----------- | ------- |
| **Scale**        | Size multiplier for the RSVP card | 1.0         | 0.1-5.0 |
| **Background**   | Background color (hex with alpha) | `#000000f0` |
| **Text Color**   | Text color                        | `#FFFFFF`   |
| **Accent Color** | ORP highlight color               | `#FB2C36`   |

### Hotkey Settings

| Setting         | Description                                            | Default |
| --------------- | ------------------------------------------------------ | ------- |
| **Trigger Key** | Key to hold for RSVP activation                        | `Meta`  |
| **Expand Key**  | Key to press while holding trigger to expand selection | `Shift` |

**Supported keys**: `Meta`, `Alt`, `Control`/`Ctrl`, `Shift`

### Advanced Settings

| Setting           | Description                             | Default |
| ----------------- | --------------------------------------- | ------- |
| **New Line Char** | Character used to represent line breaks | `›`     |

## 🎯 Usage

1. **Hold the trigger key** (default: `Alt`)
2. **Hover over any text element**
3. **Press Expand Key** (`Shift` by default) while holding trigger to expand selection to parent element
4. **Release trigger** to stop reading

## 🔬 How It Works

### Optimal Recognition Point (ORP)

Each word highlights the letter where your eye naturally focuses for fastest recognition:

- **1-3 letters**: First letter
- **4-5 letters**: Second letter
- **6-9 letters**: Third letter
- **10-12 letters**: Fourth letter
- **13+ letters**: Logarithmic calculation for optimal positioning

### Smart Timing

- **Base speed**: Calculated from WPM setting
- **Sentence endings**: Longer pauses at `.`, `!`, `?`, `;`, `:`
- **Commas**: Medium pauses for natural rhythm

### Text Extraction

Automatically extracts readable text while ignoring:

- Hidden elements (not visible on screen)
- Script and style tags
- Elements with `aria-hidden="true"` or `display: none`

## 🛠️ Development

### Project Structure

```
read-it-fast/
├── components/
│   ├── hover-card.tsx      # RSVP display component
│   └── hover-logic.tsx     # Main hover and keyboard logic
├── entrypoints/
│   ├── content.tsx         # Content script
│   └── popup/              # Settings popup UI
├── hooks/
│   └── useSettings.ts      # Settings management
├── utils/
│   └── rsvp.ts             # RSVP calculation utilities
└── wxt.config.ts           # WXT extension configuration
```

### Scripts

```bash
bun run dev              # Development (Chrome/Edge)
bun run dev:firefox      # Development (Firefox)
bun run build            # Build for production
bun run build:firefox    # Build for Firefox
bun run zip              # Create zip for distribution
bun run compile          # Type checking
```

### Tech Stack

- **[WXT](https://wxt.dev/)** - Browser extension framework
- **[React](https://react.dev/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Panda CSS](https://panda-css.com/)** - CSS-in-JS styling

## 🙏 Credits

- **[Spritz](https://www.spritz.com/)** - Pioneered RSVP reading and ORP concept
- **[rsvp-reading](https://github.com/thomaskolmans/rsvp-reading)** by [@thomaskolmans](https://github.com/thomaskolmans) - Core RSVP utilities reference implementation

## 📄 License

This project is private and not licensed for public use.

---

**Happy fast reading!** 🚀
