// Adapted SecureBit Chat App for Browser Extension
// This is a simplified version of the main app adapted for extension use

class SecureBitExtensionApp {
    constructor() {
        this.isExtension = true;
        this.cryptoUtils = null;
        this.webrtcManager = null;
        this.currentChannel = null;
        this.isConnected = false;
        this.initializeApp();
    }

    async initializeApp() {
        try {
            // Initialize crypto utilities
            await this.initializeCrypto();
            
            // Initialize WebRTC manager
            await this.initializeWebRTC();
            
            // Set up extension-specific event listeners
            this.setupExtensionListeners();
            
            console.log('SecureBit Extension App initialized');

        } catch (error) {
            console.error('Failed to initialize SecureBit Extension App:', error);
        }
    }

    async initializeCrypto() {
        // Load and initialize crypto utilities
        try {
            // Import the crypto utilities (you'll need to adapt the import for extension)
            if (typeof EnhancedSecureCryptoUtils !== 'undefined') {
                this.cryptoUtils = EnhancedSecureCryptoUtils;
            } else {
                // Fallback crypto implementation for extension
                this.cryptoUtils = new ExtensionCryptoUtils();
            }
        } catch (error) {
            console.error('Crypto initialization error:', error);
            this.cryptoUtils = new ExtensionCryptoUtils();
        }
    }

    async initializeWebRTC() {
        // Initialize WebRTC manager for extension
        try {
            if (typeof EnhancedSecureWebRTCManager !== 'undefined') {
                this.webrtcManager = new EnhancedSecureWebRTCManager();
            } else {
                this.webrtcManager = new ExtensionWebRTCManager();
            }
        } catch (error) {
            console.error('WebRTC initialization error:', error);
            this.webrtcManager = new ExtensionWebRTCManager();
        }
    }

    setupExtensionListeners() {
        // Listen for messages from popup and content scripts
        if (typeof chrome !== 'undefined' && chrome.runtime) {
            chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
                this.handleExtensionMessage(request, sender, sendResponse);
                return true;
            });
        }
    }

    async handleExtensionMessage(request, sender, sendResponse) {
        try {
            switch (request.action) {
                case 'createChannel':
                    const channelId = await this.createChannel();
                    sendResponse({ success: true, data: { channelId } });
                    break;

                case 'joinChannel':
                    const result = await this.joinChannel(request.data.channelId);
                    sendResponse({ success: true, data: result });
                    break;

                case 'sendMessage':
                    await this.sendMessage(request.data.message);
                    sendResponse({ success: true });
                    break;

                case 'getConnectionStatus':
                    sendResponse({ success: true, data: { connected: this.isConnected } });
                    break;

                case 'disconnect':
                    await this.disconnect();
                    sendResponse({ success: true });
                    break;

                default:
                    sendResponse({ success: false, error: 'Unknown action' });
            }
        } catch (error) {
            console.error('Extension message handling error:', error);
            sendResponse({ success: false, error: error.message });
        }
    }

    async createChannel() {
        try {
            // Generate a new channel ID
            const channelId = this.generateChannelId();
            
            // Initialize WebRTC connection
            await this.webrtcManager.createOffer();
            
            this.currentChannel = channelId;
            this.isConnected = true;
            
            // Notify all connected components
            this.notifyComponents('channelCreated', { channelId });
            
            return channelId;

        } catch (error) {
            console.error('Create channel error:', error);
            throw error;
        }
    }

    async joinChannel(channelId) {
        try {
            // Join existing channel
            await this.webrtcManager.joinChannel(channelId);
            
            this.currentChannel = channelId;
            this.isConnected = true;
            
            // Notify all connected components
            this.notifyComponents('channelJoined', { channelId });
            
            return { success: true, channelId };

        } catch (error) {
            console.error('Join channel error:', error);
            throw error;
        }
    }

    async sendMessage(message) {
        try {
            if (!this.isConnected) {
                throw new Error('Not connected to any channel');
            }

            // Encrypt the message
            const encryptedMessage = await this.cryptoUtils.encryptMessage(message);
            
            // Send via WebRTC
            await this.webrtcManager.sendMessage(encryptedMessage);
            
            // Notify components
            this.notifyComponents('messageSent', { message, encrypted: true });

        } catch (error) {
            console.error('Send message error:', error);
            throw error;
        }
    }

    async disconnect() {
        try {
            if (this.webrtcManager) {
                await this.webrtcManager.disconnect();
            }
            
            this.isConnected = false;
            this.currentChannel = null;
            
            // Notify components
            this.notifyComponents('disconnected', {});

        } catch (error) {
            console.error('Disconnect error:', error);
        }
    }

    notifyComponents(event, data) {
        // Send notifications to popup and content scripts
        if (typeof chrome !== 'undefined' && chrome.runtime) {
            chrome.runtime.sendMessage({
                action: 'notifyComponents',
                event: event,
                data: data
            });
        }
    }

    generateChannelId() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
}

// Extension-specific crypto utilities
class ExtensionCryptoUtils {
    async encryptMessage(message) {
        // Simplified encryption for extension
        // In a real implementation, you'd use the full crypto suite
        const encoder = new TextEncoder();
        const data = encoder.encode(message);
        const key = await crypto.subtle.generateKey(
            { name: 'AES-GCM', length: 256 },
            true,
            ['encrypt', 'decrypt']
        );
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const encrypted = await crypto.subtle.encrypt(
            { name: 'AES-GCM', iv: iv },
            key,
            data
        );
        return {
            encrypted: Array.from(new Uint8Array(encrypted)),
            iv: Array.from(iv),
            keyId: 'temp'
        };
    }

    async decryptMessage(encryptedData) {
        // Simplified decryption for extension
        const key = await crypto.subtle.generateKey(
            { name: 'AES-GCM', length: 256 },
            true,
            ['encrypt', 'decrypt']
        );
        const decrypted = await crypto.subtle.decrypt(
            { name: 'AES-GCM', iv: new Uint8Array(encryptedData.iv) },
            key,
            new Uint8Array(encryptedData.encrypted)
        );
        const decoder = new TextDecoder();
        return decoder.decode(decrypted);
    }
}

// Extension-specific WebRTC manager
class ExtensionWebRTCManager {
    constructor() {
        this.peerConnection = null;
        this.dataChannel = null;
    }

    async createOffer() {
        // Simplified WebRTC implementation for extension
        this.peerConnection = new RTCPeerConnection({
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
        });

        this.dataChannel = this.peerConnection.createDataChannel('securebit');
        this.dataChannel.onopen = () => {
            console.log('Data channel opened');
        };
        this.dataChannel.onmessage = (event) => {
            this.handleMessage(event.data);
        };
    }

    async joinChannel(channelId) {
        // Simplified channel joining for extension
        console.log('Joining channel:', channelId);
    }

    async sendMessage(message) {
        if (this.dataChannel && this.dataChannel.readyState === 'open') {
            this.dataChannel.send(JSON.stringify(message));
        } else {
            throw new Error('Data channel not ready');
        }
    }

    handleMessage(data) {
        try {
            const message = JSON.parse(data);
            // Notify the app about received message
            if (typeof window !== 'undefined' && window.secureBitApp) {
                window.secureBitApp.handleReceivedMessage(message);
            }
        } catch (error) {
            console.error('Message handling error:', error);
        }
    }

    async disconnect() {
        if (this.dataChannel) {
            this.dataChannel.close();
        }
        if (this.peerConnection) {
            this.peerConnection.close();
        }
    }
}

// Initialize the extension app
window.secureBitApp = new SecureBitExtensionApp();
