# SecureBit Chat Browser Extension

Browser extension for SecureBit Chat - P2P messenger with military-grade cryptography.

## Features

- 🔐 **Military-grade cryptography**: ECDH + DTLS + SAS
- 🌐 **P2P communication**: Direct connection without servers
- 📱 **QR codes**: Quick connection via QR scanning
- ⚡ **High performance**: Optimized for speed
- 🎯 **Non-intrusive**: Widget appears only on demand

## Installation

1. Download or clone this repository
2. Open Microsoft Edge browser
3. Navigate to `edge://extensions/`
4. Enable "Developer mode" toggle
5. Click "Load unpacked" button
6. Select the `extension-build` folder

## Usage

### Main Interface
- Click the extension icon in the toolbar
- Use all chat features as in the web version

### Widget on Web Pages
The widget does **NOT** appear automatically on all pages.

**Ways to activate the widget:**

1. **Keyboard shortcut**: `Ctrl + Shift + S` on any web page
2. **From popup**: "Show widget" button (if added)

**Widget controls:**
- `Ctrl + Shift + S` - show/hide widget
- "−" button - minimize widget
- "×" button - close widget

## Building

To build the extension, use the PowerShell script:

```powershell
powershell -ExecutionPolicy Bypass -File build-extension.ps1
```

## Project Structure

```
├── extension-build/          # Built extension
├── extension-manifest.json   # Extension manifest
├── extension-background.js   # Background script
├── extension-content.js      # Content script
├── extension-popup.html      # Popup HTML
├── extension-popup.js        # Popup script
├── build-extension.ps1       # Build script
└── README.md                 # This file
```

## Security Features

- **ECDH Key Exchange**: Elliptic Curve Diffie-Hellman for secure key generation
- **DTLS Encryption**: Datagram Transport Layer Security for data protection
- **SAS Verification**: Short Authentication String for identity verification
- **P2P Architecture**: No central servers, direct peer-to-peer communication
- **Military-grade**: Enterprise-level security standards

## Version

Current version: **1.2.14**

## License

MIT License

## Support

For questions or issues, create an issue in the repository.

## Documentation

- [Installation Guide](INSTALLATION_GUIDE_EN.md) - Detailed installation instructions