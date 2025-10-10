// Content script for SecureBit Chat Extension
// Injects SecureBit functionality into web pages

class SecureBitContentScript {
    constructor() {
        this.isInjected = false;
        this.secureBitWidget = null;
        this.initializeContentScript();
    }

    initializeContentScript() {
        // Check if already injected
        if (document.getElementById('securebit-widget')) {
            return;
        }

        // Don't auto-inject widget, wait for user action
        this.setupKeyboardShortcut();

        // Listen for messages from background script
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            this.handleMessage(request, sender, sendResponse);
            return true;
        });
    }

    injectSecureBit() {
        if (this.isInjected) return;

        try {
            // Create the SecureBit widget
            this.createSecureBitWidget();
            
            // Inject the widget into the page
            document.body.appendChild(this.secureBitWidget);
            
            this.isInjected = true;
            console.log('SecureBit Chat widget injected');

        } catch (error) {
            console.error('Failed to inject SecureBit widget:', error);
        }
    }

    createSecureBitWidget() {
        // Create the main widget container
        this.secureBitWidget = document.createElement('div');
        this.secureBitWidget.id = 'securebit-widget';
        this.secureBitWidget.className = 'securebit-widget';
        
        // Add styles
        this.addWidgetStyles();
        
        // Create widget content
        this.secureBitWidget.innerHTML = `
            <div class="securebit-container">
                <div class="securebit-header">
                    <div class="securebit-logo">
                        <img src="${chrome.runtime.getURL('logo/icon-32x32.png')}" alt="SecureBit">
                        <span>SecureBit Chat</span>
                    </div>
                    <div class="securebit-controls">
                        <button id="securebit-minimize" class="securebit-control-btn" title="Minimize">
                            <i class="fas fa-minus"></i>
                        </button>
                        <button id="securebit-close" class="securebit-control-btn" title="Close">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
                
                <div class="securebit-content">
                    <div class="securebit-status">
                        <div class="status-indicator"></div>
                        <span class="status-text">Ready</span>
                    </div>
                    
                    <div class="securebit-actions">
                        <button id="securebit-create" class="securebit-action-btn">
                            <i class="fas fa-plus"></i>
                            Create Channel
                        </button>
                        <button id="securebit-join" class="securebit-action-btn">
                            <i class="fas fa-qrcode"></i>
                            Join Channel
                        </button>
                    </div>
                    
                    <div class="securebit-chat" id="securebit-chat-area" style="display: none;">
                        <div class="chat-messages" id="securebit-messages"></div>
                        <div class="chat-input">
                            <input type="text" id="securebit-input" placeholder="Type a message...">
                            <button id="securebit-send">Send</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add event listeners
        this.setupWidgetEventListeners();
    }

    addWidgetStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .securebit-widget {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 300px;
                height: 400px;
                background: #1a1a1a;
                border: 1px solid #333;
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                z-index: 10000;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                color: white;
                overflow: hidden;
                transition: all 0.3s ease;
            }

            .securebit-widget.minimized {
                height: 60px;
            }

            .securebit-container {
                height: 100%;
                display: flex;
                flex-direction: column;
            }

            .securebit-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px 16px;
                background: #2a2a2a;
                border-bottom: 1px solid #333;
            }

            .securebit-logo {
                display: flex;
                align-items: center;
                font-weight: 600;
                font-size: 14px;
            }

            .securebit-logo img {
                width: 20px;
                height: 20px;
                margin-right: 8px;
            }

            .securebit-controls {
                display: flex;
                gap: 4px;
            }

            .securebit-control-btn {
                background: none;
                border: none;
                color: #ccc;
                cursor: pointer;
                padding: 4px;
                border-radius: 3px;
                transition: all 0.2s;
                font-size: 12px;
            }

            .securebit-control-btn:hover {
                background: #444;
                color: #fff;
            }

            .securebit-btn {
                background: none;
                border: none;
                color: #999;
                cursor: pointer;
                padding: 4px;
                border-radius: 4px;
                transition: all 0.2s;
            }

            .securebit-btn:hover {
                background: #333;
                color: white;
            }

            .securebit-content {
                flex: 1;
                padding: 16px;
                display: flex;
                flex-direction: column;
            }

            .securebit-status {
                display: flex;
                align-items: center;
                margin-bottom: 16px;
                font-size: 12px;
            }

            .status-indicator {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: #4ade80;
                margin-right: 8px;
            }

            .status-indicator.disconnected {
                background: #ef4444;
            }

            .securebit-actions {
                display: flex;
                flex-direction: column;
                gap: 8px;
                margin-bottom: 16px;
            }

            .securebit-action-btn {
                background: #ff6b35;
                border: none;
                color: white;
                padding: 10px 16px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 13px;
                font-weight: 500;
                transition: all 0.2s;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
            }

            .securebit-action-btn:hover {
                background: #e55a2b;
            }

            .securebit-action-btn:active {
                transform: translateY(1px);
            }

            .securebit-chat {
                flex: 1;
                display: flex;
                flex-direction: column;
            }

            .chat-messages {
                flex: 1;
                overflow-y: auto;
                padding: 8px;
                background: #0f0f0f;
                border-radius: 6px;
                margin-bottom: 8px;
                max-height: 200px;
            }

            .chat-input {
                display: flex;
                gap: 8px;
            }

            .chat-input input {
                flex: 1;
                background: #2a2a2a;
                border: 1px solid #333;
                color: white;
                padding: 8px 12px;
                border-radius: 6px;
                font-size: 13px;
            }

            .chat-input input:focus {
                outline: none;
                border-color: #ff6b35;
            }

            .chat-input button {
                background: #ff6b35;
                border: none;
                color: white;
                padding: 8px 16px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 13px;
            }

            .chat-input button:hover {
                background: #e55a2b;
            }

            .message {
                margin-bottom: 8px;
                padding: 6px 8px;
                border-radius: 4px;
                font-size: 12px;
            }

            .message.sent {
                background: #ff6b35;
                margin-left: 20px;
            }

            .message.received {
                background: #333;
                margin-right: 20px;
            }
        `;
        document.head.appendChild(style);
    }

    setupWidgetEventListeners() {
        // Minimize button
        const minimizeBtn = document.getElementById('securebit-minimize');
        if (minimizeBtn) {
            minimizeBtn.addEventListener('click', () => {
                this.secureBitWidget.classList.toggle('minimized');
            });
        }

        // Close button
        const closeBtn = document.getElementById('securebit-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.secureBitWidget.remove();
                this.isInjected = false;
            });
        }

        // Create channel button
        const createBtn = document.getElementById('securebit-create');
        if (createBtn) {
            createBtn.addEventListener('click', () => {
                this.createChannel();
            });
        }

        // Join channel button
        const joinBtn = document.getElementById('securebit-join');
        if (joinBtn) {
            joinBtn.addEventListener('click', () => {
                this.joinChannel();
            });
        }

        // Send message button
        const sendBtn = document.getElementById('securebit-send');
        if (sendBtn) {
            sendBtn.addEventListener('click', () => {
                this.sendMessage();
            });
        }

        // Enter key in input
        const inputField = document.getElementById('securebit-input');
        if (inputField) {
            inputField.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });
        }
    }

    setupKeyboardShortcut() {
        // Add keyboard shortcut to toggle widget (Ctrl+Shift+S)
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'S') {
                e.preventDefault();
                this.toggleWidget();
            }
        });
    }

    toggleWidget() {
        if (this.isInjected) {
            // Hide widget
            this.secureBitWidget.style.display = 'none';
            this.isInjected = false;
        } else {
            // Show widget
            this.injectSecureBit();
        }
    }

    async createChannel() {
        try {
            // Generate channel ID
            const channelId = this.generateChannelId();
            
            // Update status
            this.updateStatus('Connected', true);
            
            // Show chat area
            document.getElementById('securebit-chat-area').style.display = 'flex';
            
            // Notify background script
            chrome.runtime.sendMessage({
                action: 'channelCreated',
                data: { channelId }
            });

            console.log('Channel created:', channelId);

        } catch (error) {
            console.error('Create channel error:', error);
        }
    }

    async joinChannel() {
        // This would open a QR scanner or input field
        const channelId = prompt('Enter channel ID:');
        if (channelId) {
            this.updateStatus('Connected', true);
            document.getElementById('securebit-chat-area').style.display = 'flex';
            
            chrome.runtime.sendMessage({
                action: 'channelJoined',
                data: { channelId }
            });
        }
    }

    sendMessage() {
        const input = document.getElementById('securebit-input');
        const message = input.value.trim();
        
        if (message) {
            this.addMessage(message, 'sent');
            input.value = '';
            
            // Send to background script
            chrome.runtime.sendMessage({
                action: 'sendMessage',
                data: { message }
            });
        }
    }

    addMessage(text, type) {
        const messagesContainer = document.getElementById('securebit-messages');
        const messageElement = document.createElement('div');
        messageElement.className = `message ${type}`;
        messageElement.textContent = text;
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    updateStatus(text, connected) {
        const statusText = document.querySelector('.status-text');
        const statusIndicator = document.querySelector('.status-indicator');
        
        statusText.textContent = text;
        statusIndicator.classList.toggle('disconnected', !connected);
    }

    generateChannelId() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    handleMessage(request, sender, sendResponse) {
        switch (request.action) {
            case 'injectWidget':
                this.injectSecureBit();
                sendResponse({ success: true });
                break;
            
            case 'removeWidget':
                if (this.secureBitWidget) {
                    this.secureBitWidget.remove();
                    this.isInjected = false;
                }
                sendResponse({ success: true });
                break;
            
            case 'toggleWidget':
                this.toggleWidget();
                sendResponse({ success: true });
                break;
            
            case 'updateStatus':
                this.updateStatus(request.data.text, request.data.connected);
                sendResponse({ success: true });
                break;
            
            default:
                sendResponse({ success: false, error: 'Unknown action' });
        }
    }
}

// Initialize content script
new SecureBitContentScript();
