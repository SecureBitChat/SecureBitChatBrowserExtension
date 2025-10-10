# SecureBit Chat Extension - Installation Guide

Complete step-by-step guide for installing and using the SecureBit Chat browser extension.

## Table of Contents

1. [System Requirements](#system-requirements)
2. [Download Options](#download-options)
3. [Installation Methods](#installation-methods)
4. [First Time Setup](#first-time-setup)
5. [Usage Guide](#usage-guide)
6. [Troubleshooting](#troubleshooting)
7. [Uninstallation](#uninstallation)

## System Requirements

### Minimum Requirements
- **Operating System**: Windows 10/11, macOS 10.14+, or Linux (Ubuntu 18.04+)
- **Browser**: Microsoft Edge 88+ (Chromium-based)
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 100MB free space
- **Network**: Internet connection for initial setup

### Recommended Requirements
- **RAM**: 8GB or more
- **CPU**: Multi-core processor
- **Network**: Stable broadband connection
- **Camera**: For QR code scanning (optional)

## Download Options

### Option 1: Download from GitHub (Recommended)
1. Go to [SecureBit Chat Extension Repository](https://github.com/SecureBitChat/SecureBitChatBrowserExtension)
2. Click the green "Code" button
3. Select "Download ZIP"
4. Extract the ZIP file to your desired location

### Option 2: Clone with Git
```bash
git clone https://github.com/SecureBitChat/SecureBitChatBrowserExtension.git
cd SecureBitChatBrowserExtension
```

### Option 3: Build from Source
1. Download the source code
2. Run the build script:
   ```powershell
   powershell -ExecutionPolicy Bypass -File build-extension.ps1
   ```

## Installation Methods

### Method 1: Developer Mode Installation (Recommended)

#### Step 1: Enable Developer Mode
1. Open Microsoft Edge
2. Navigate to `edge://extensions/`
3. Find "Developer mode" toggle in the left sidebar
4. Turn ON the "Developer mode" toggle
5. You should see new buttons appear: "Load unpacked", "Pack extension", "Update"

#### Step 2: Load the Extension
1. Click the "Load unpacked" button
2. Navigate to the downloaded extension folder
3. Select the `extension-build` folder (not the root folder)
4. Click "Select Folder"
5. The extension should now appear in your extensions list

#### Step 3: Verify Installation
1. Look for "SecureBit Chat Extension" in the extensions list
2. Ensure it's enabled (toggle should be ON)
3. Check that the version shows "1.2.14"
4. You should see the SecureBit icon in the browser toolbar

### Method 2: Manual Installation

#### Step 1: Prepare Extension Files
1. Ensure you have the `extension-build` folder with all required files:
   - `manifest.json`
   - `background.js`
   - `content.js`
   - `popup.html`
   - `popup.js`
   - `assets/` folder
   - `dist/` folder
   - `libs/` folder
   - `logo/` folder

#### Step 2: Load Extension
1. Follow the same steps as Method 1, Step 1-2
2. Make sure to select the correct folder containing `manifest.json`

## First Time Setup

### Initial Configuration
1. **Pin the Extension**: Right-click the SecureBit icon in the toolbar and select "Pin"
2. **Grant Permissions**: The extension may request permissions for:
   - Storage access
   - Active tab access
   - Notifications
   - Background processing

### Security Setup
1. **Generate Keys**: The extension will automatically generate cryptographic keys
2. **Verify Installation**: Test the popup interface
3. **Test Widget**: Use `Ctrl + Shift + S` on any webpage to test the widget

## Usage Guide

### Main Interface (Popup)
1. **Open Extension**: Click the SecureBit icon in the toolbar
2. **Create Channel**: Click "Create Channel" to start a new chat
3. **Join Channel**: Click "Join Channel" and scan a QR code
4. **Send Messages**: Type and send encrypted messages

### Widget on Web Pages
1. **Activate Widget**: Press `Ctrl + Shift + S` on any webpage
2. **Widget Controls**:
   - **Minimize**: Click the "−" button
   - **Close**: Click the "×" button
   - **Resize**: Drag the bottom-right corner

### Keyboard Shortcuts
- `Ctrl + Shift + S`: Toggle widget on current page
- `Enter`: Send message (when input is focused)
- `Escape`: Close popup or widget

### Security Features
- **End-to-End Encryption**: All messages are encrypted
- **P2P Connection**: Direct peer-to-peer communication
- **QR Code Sharing**: Secure channel sharing via QR codes
- **Key Verification**: SAS (Short Authentication String) verification

## Troubleshooting

### Common Issues and Solutions

#### Extension Won't Load
**Problem**: Extension fails to load or shows errors
**Solutions**:
1. Check that Developer mode is enabled
2. Verify all files are in the `extension-build` folder
3. Ensure `manifest.json` is valid
4. Try reloading the extension

#### Widget Doesn't Appear
**Problem**: Widget doesn't show when using `Ctrl + Shift + S`
**Solutions**:
1. Check browser console for errors (F12)
2. Ensure content script is loaded
3. Try refreshing the page
4. Check if another extension is interfering

#### QR Codes Not Working
**Problem**: QR code scanning fails
**Solutions**:
1. Grant camera permissions to the browser
2. Ensure good lighting conditions
3. Try generating a new QR code
4. Check if camera is being used by another application

#### Connection Issues
**Problem**: Can't establish P2P connection
**Solutions**:
1. Check firewall settings
2. Ensure both parties have the extension installed
3. Try using a different network
4. Check if NAT traversal is working

#### Performance Issues
**Problem**: Extension is slow or unresponsive
**Solutions**:
1. Close unnecessary browser tabs
2. Restart the browser
3. Check system resources
4. Update to the latest version

### Error Messages

#### "Failed to load resource"
- Check that all files are present in the extension folder
- Verify file paths in `manifest.json`
- Try rebuilding the extension

#### "Permission denied"
- Grant necessary permissions in browser settings
- Check if the extension is blocked by security software
- Try running browser as administrator (Windows)

#### "Content script failed"
- Refresh the webpage
- Check browser console for detailed errors
- Try disabling other extensions temporarily

## Uninstallation

### Remove Extension
1. Go to `edge://extensions/`
2. Find "SecureBit Chat Extension"
3. Click the "Remove" button
4. Confirm removal

### Clean Up Data
1. Clear extension data (optional):
   - Go to `edge://settings/clearBrowserData`
   - Select "Extensions" data
   - Click "Clear data"

### Remove Files
1. Delete the extension folder from your computer
2. Remove any shortcuts or pinned icons

## Support and Updates

### Getting Help
- **GitHub Issues**: Report bugs or request features
- **Documentation**: Check README files for detailed information
- **Community**: Join discussions in the repository

### Updating the Extension
1. Download the latest version from GitHub
2. Remove the old extension
3. Install the new version following the installation guide
4. Your settings and data will be preserved

### Version History
- **v1.2.14**: Fixed content script errors, added keyboard shortcuts
- **v1.2.13**: Improved build process and error handling
- **v1.2.12**: Initial release with full functionality

## Security Considerations

### Best Practices
1. **Keep Updated**: Always use the latest version
2. **Verify Sources**: Only download from official repositories
3. **Check Permissions**: Review extension permissions regularly
4. **Secure Networks**: Use trusted networks for P2P connections

### Privacy Protection
- All communication is end-to-end encrypted
- No data is stored on external servers
- Keys are generated locally
- Messages are not logged

## Conclusion

The SecureBit Chat Extension provides secure, private communication directly in your browser. Follow this guide carefully for the best installation and usage experience.

For additional support or questions, please refer to the main README file or create an issue in the GitHub repository.
