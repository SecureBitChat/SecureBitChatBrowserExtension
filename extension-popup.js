// Popup script for SecureBit Chat Extension
// Handles the popup UI and communication with background script

class SecureBitPopup {
    constructor() {
        this.isConnected = false;
        this.currentChannel = null;
        this.settings = {};
        this.initializePopup();
    }

    async initializePopup() {
        try {
            // Hide loading and show content
            document.getElementById('loading').classList.add('hidden');
            document.getElementById('app-content').classList.remove('hidden');

            // Load settings
            await this.loadSettings();

            // Initialize the popup UI
            this.renderPopup();

            // Set up event listeners
            this.setupEventListeners();

            // Check connection status
            await this.checkConnectionStatus();

        } catch (error) {
            console.error('Popup initialization error:', error);
            this.showError('Failed to initialize SecureBit Chat');
        }
    }

    async loadSettings() {
        try {
            const response = await this.sendMessage({ action: 'getSettings' });
            this.settings = response.data || {};
        } catch (error) {
            console.error('Failed to load settings:', error);
            this.settings = {};
        }
    }

    renderPopup() {
        const appContent = document.getElementById('app-content');
        
        appContent.innerHTML = `
            <div class="p-4 space-y-4">
                <!-- Header -->
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center">
                        <img src="logo/icon-32x32.png" alt="SecureBit" class="w-8 h-8 mr-3">
                        <h1 class="text-lg font-bold text-orange-500">SecureBit Chat</h1>
                    </div>
                    <button id="settings-btn" class="text-gray-400 hover:text-white">
                        <i class="fas fa-cog"></i>
                    </button>
                </div>

                <!-- Connection Status -->
                <div id="connection-status" class="p-3 rounded-lg border border-gray-700">
                    <div class="flex items-center">
                        <div id="status-indicator" class="w-3 h-3 rounded-full bg-red-500 mr-3"></div>
                        <span id="status-text" class="text-sm">Disconnected</span>
                    </div>
                </div>

                <!-- Quick Actions -->
                <div class="space-y-2">
                    <button id="create-channel-btn" class="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg transition-colors">
                        <i class="fas fa-plus mr-2"></i>Create Channel
                    </button>
                    <button id="join-channel-btn" class="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors">
                        <i class="fas fa-qrcode mr-2"></i>Join Channel
                    </button>
                    <button id="scan-qr-btn" class="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition-colors">
                        <i class="fas fa-camera mr-2"></i>Scan QR Code
                    </button>
                </div>

                <!-- Recent Channels -->
                <div id="recent-channels" class="space-y-2">
                    <h3 class="text-sm font-medium text-gray-400 mb-2">Recent Channels</h3>
                    <div id="channels-list" class="space-y-1">
                        <!-- Channels will be populated here -->
                    </div>
                </div>

                <!-- Settings Panel -->
                <div id="settings-panel" class="hidden space-y-3">
                    <h3 class="text-sm font-medium text-gray-400">Settings</h3>
                    
                    <div class="space-y-2">
                        <label class="flex items-center">
                            <input type="checkbox" id="auto-connect" class="mr-2">
                            <span class="text-sm">Auto-connect</span>
                        </label>
                        <label class="flex items-center">
                            <input type="checkbox" id="notifications" class="mr-2">
                            <span class="text-sm">Notifications</span>
                        </label>
                    </div>

                    <div class="space-y-2">
                        <label class="block text-sm text-gray-400">Theme</label>
                        <select id="theme-select" class="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm">
                            <option value="dark">Dark</option>
                            <option value="light">Light</option>
                            <option value="auto">Auto</option>
                        </select>
                    </div>

                    <button id="save-settings-btn" class="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors">
                        Save Settings
                    </button>
                </div>

                <!-- QR Scanner Modal -->
                <div id="qr-scanner-modal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div class="bg-gray-800 rounded-lg p-4 w-80">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="text-lg font-medium">Scan QR Code</h3>
                            <button id="close-qr-scanner" class="text-gray-400 hover:text-white">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        <div id="qr-scanner-container" class="w-full h-64 bg-gray-900 rounded-lg flex items-center justify-center">
                            <div class="text-center">
                                <i class="fas fa-camera text-4xl text-gray-600 mb-2"></i>
                                <p class="text-gray-400">Camera access required</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        // Settings toggle
        document.getElementById('settings-btn').addEventListener('click', () => {
            const settingsPanel = document.getElementById('settings-panel');
            settingsPanel.classList.toggle('hidden');
        });

        // Create channel
        document.getElementById('create-channel-btn').addEventListener('click', () => {
            this.createChannel();
        });

        // Join channel
        document.getElementById('join-channel-btn').addEventListener('click', () => {
            this.joinChannel();
        });

        // Scan QR
        document.getElementById('scan-qr-btn').addEventListener('click', () => {
            this.showQRScanner();
        });

        // Close QR scanner
        document.getElementById('close-qr-scanner').addEventListener('click', () => {
            this.hideQRScanner();
        });

        // Save settings
        document.getElementById('save-settings-btn').addEventListener('click', () => {
            this.saveSettings();
        });

        // Load saved settings into form
        this.loadSettingsIntoForm();
    }

    async checkConnectionStatus() {
        try {
            // This would check if there's an active WebRTC connection
            // For now, we'll simulate the status
            this.updateConnectionStatus(false);
        } catch (error) {
            console.error('Connection check error:', error);
            this.updateConnectionStatus(false);
        }
    }

    updateConnectionStatus(connected) {
        this.isConnected = connected;
        const indicator = document.getElementById('status-indicator');
        const text = document.getElementById('status-text');
        
        if (connected) {
            indicator.className = 'w-3 h-3 rounded-full bg-green-500 mr-3';
            text.textContent = 'Connected';
        } else {
            indicator.className = 'w-3 h-3 rounded-full bg-red-500 mr-3';
            text.textContent = 'Disconnected';
        }
    }

    async createChannel() {
        try {
            // Generate a new channel ID
            const channelId = this.generateChannelId();
            
            // Show notification
            await this.sendMessage({
                action: 'showNotification',
                data: {
                    title: 'Channel Created',
                    message: `Channel ID: ${channelId}`
                }
            });

            // Update UI
            this.updateConnectionStatus(true);
            this.currentChannel = channelId;
            
            // Add to recent channels
            this.addToRecentChannels(channelId, 'New Channel');

        } catch (error) {
            console.error('Create channel error:', error);
            this.showError('Failed to create channel');
        }
    }

    async joinChannel() {
        // This would open a QR scanner or input field
        this.showQRScanner();
    }

    showQRScanner() {
        document.getElementById('qr-scanner-modal').classList.remove('hidden');
        // Here you would initialize the QR scanner
        this.initializeQRScanner();
    }

    hideQRScanner() {
        document.getElementById('qr-scanner-modal').classList.add('hidden');
    }

    initializeQRScanner() {
        // Initialize QR scanner functionality
        // This would integrate with your existing QR scanner component
        console.log('QR Scanner initialized');
    }

    addToRecentChannels(channelId, name) {
        const channelsList = document.getElementById('channels-list');
        const channelElement = document.createElement('div');
        channelElement.className = 'flex items-center justify-between p-2 bg-gray-800 rounded-lg hover:bg-gray-700 cursor-pointer';
        channelElement.innerHTML = `
            <div>
                <div class="text-sm font-medium">${name}</div>
                <div class="text-xs text-gray-400">${channelId}</div>
            </div>
            <div class="flex space-x-2">
                <button class="text-blue-400 hover:text-blue-300">
                    <i class="fas fa-external-link-alt"></i>
                </button>
                <button class="text-red-400 hover:text-red-300">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        channelsList.appendChild(channelElement);
    }

    loadSettingsIntoForm() {
        document.getElementById('auto-connect').checked = this.settings.autoConnect || false;
        document.getElementById('notifications').checked = this.settings.notifications || false;
        document.getElementById('theme-select').value = this.settings.theme || 'dark';
    }

    async saveSettings() {
        try {
            const newSettings = {
                autoConnect: document.getElementById('auto-connect').checked,
                notifications: document.getElementById('notifications').checked,
                theme: document.getElementById('theme-select').value
            };

            await this.sendMessage({
                action: 'updateSettings',
                data: newSettings
            });

            this.settings = { ...this.settings, ...newSettings };
            this.showSuccess('Settings saved');

        } catch (error) {
            console.error('Save settings error:', error);
            this.showError('Failed to save settings');
        }
    }

    generateChannelId() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    async sendMessage(message) {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage(message, (response) => {
                if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError.message));
                } else {
                    resolve(response);
                }
            });
        });
    }

    showError(message) {
        // Simple error notification
        console.error(message);
        // You could implement a toast notification here
    }

    showSuccess(message) {
        // Simple success notification
        console.log(message);
        // You could implement a toast notification here
    }
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SecureBitPopup();
});
