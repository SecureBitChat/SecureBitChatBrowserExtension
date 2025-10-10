// Background script for SecureBit Chat Extension
// Handles extension lifecycle, notifications, and communication

class SecureBitBackground {
    constructor() {
        this.initializeExtension();
    }

    initializeExtension() {
        // Handle extension installation
        chrome.runtime.onInstalled.addListener((details) => {
            console.log('SecureBit Chat Extension installed:', details);
            this.setupDefaultSettings();
        });

        // Handle extension startup
        chrome.runtime.onStartup.addListener(() => {
            console.log('SecureBit Chat Extension started');
        });

        // Handle messages from content scripts and popup
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            this.handleMessage(request, sender, sendResponse);
            return true; // Keep message channel open for async responses
        });

        // Handle tab updates for content script injection
        chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
            if (changeInfo.status === 'complete' && tab.url) {
                this.injectContentScriptIfNeeded(tabId, tab.url);
            }
        });
    }

    setupDefaultSettings() {
        // Set default extension settings
        chrome.storage.local.set({
            'securebit_settings': {
                autoConnect: true,
                notifications: true,
                theme: 'dark',
                language: 'en',
                encryptionLevel: 'military',
                lastActive: Date.now()
            }
        });
    }

    async handleMessage(request, sender, sendResponse) {
        try {
            switch (request.action) {
                case 'getSettings':
                    const settings = await this.getSettings();
                    sendResponse({ success: true, data: settings });
                    break;

                case 'updateSettings':
                    await this.updateSettings(request.data);
                    sendResponse({ success: true });
                    break;

                case 'showNotification':
                    await this.showNotification(request.data);
                    sendResponse({ success: true });
                    break;

                case 'getActiveTab':
                    const tab = await this.getActiveTab();
                    sendResponse({ success: true, data: tab });
                    break;

                case 'executeScript':
                    const result = await this.executeScript(request.script, request.tabId);
                    sendResponse({ success: true, data: result });
                    break;

                case 'getStorageData':
                    const data = await this.getStorageData(request.key);
                    sendResponse({ success: true, data: data });
                    break;

                case 'setStorageData':
                    await this.setStorageData(request.key, request.value);
                    sendResponse({ success: true });
                    break;

                default:
                    sendResponse({ success: false, error: 'Unknown action' });
            }
        } catch (error) {
            console.error('Background script error:', error);
            sendResponse({ success: false, error: error.message });
        }
    }

    async getSettings() {
        const result = await chrome.storage.local.get(['securebit_settings']);
        return result.securebit_settings || {};
    }

    async updateSettings(newSettings) {
        const currentSettings = await this.getSettings();
        const updatedSettings = { ...currentSettings, ...newSettings };
        await chrome.storage.local.set({ 'securebit_settings': updatedSettings });
    }

    async showNotification(data) {
        if (data.title && data.message) {
            await chrome.notifications.create({
                type: 'basic',
                iconUrl: 'logo/icon-128x128.png',
                title: data.title,
                message: data.message
            });
        }
    }

    async getActiveTab() {
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        return tabs[0] || null;
    }

    async executeScript(script, tabId) {
        try {
            const results = await chrome.scripting.executeScript({
                target: { tabId: tabId || (await this.getActiveTab()).id },
                func: new Function(script)
            });
            return results[0]?.result;
        } catch (error) {
            console.error('Script execution error:', error);
            throw error;
        }
    }

    async getStorageData(key) {
        const result = await chrome.storage.local.get([key]);
        return result[key];
    }

    async setStorageData(key, value) {
        await chrome.storage.local.set({ [key]: value });
    }

    async injectContentScriptIfNeeded(tabId, url) {
        // Only inject on http/https pages
        if (url.startsWith('http://') || url.startsWith('https://')) {
            try {
                await chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    files: ['content.js']
                });
            } catch (error) {
                // Content script might already be injected
                console.log('Content script injection skipped:', error.message);
            }
        }
    }
}

// Initialize the background script
new SecureBitBackground();
