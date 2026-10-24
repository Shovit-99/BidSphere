import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

class WebSocketService {
  constructor() {
    this.client = null;
    this.subscriptions = new Map();
    this.connected = false;
    this.reconnectAttempts = 0;
  }

  connect(onConnectedCallback) {
    if (this.client && this.client.active) {
      if (onConnectedCallback) onConnectedCallback();
      return;
    }

    try {
      this.client = new Client({
        webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        debug: (str) => {
          // console.debug('[STOMP]', str);
        },
        onConnect: () => {
          this.connected = true;
          this.reconnectAttempts = 0;
          console.log('[BidSphere STOMP] Connected to live auction broker');
          if (onConnectedCallback) onConnectedCallback();
          // Resubscribe active subscriptions
          this.subscriptions.forEach((callback, destination) => {
            this._subscribe(destination, callback);
          });
        },
        onStompError: (frame) => {
          console.warn('[BidSphere STOMP] Broker error:', frame.headers['message']);
        },
        onWebSocketClose: () => {
          this.connected = false;
        }
      });

      this.client.activate();
    } catch (e) {
      console.warn('[BidSphere STOMP] Connection exception:', e);
    }
  }

  subscribeToAuction(auctionId, callback) {
    const destination = `/topic/auction/${auctionId}`;
    this.subscriptions.set(destination, callback);

    if (this.connected && this.client) {
      return this._subscribe(destination, callback);
    }
    return null;
  }

  _subscribe(destination, callback) {
    try {
      return this.client.subscribe(destination, (message) => {
        try {
          const payload = JSON.parse(message.body);
          callback(payload);
        } catch (e) {
          console.error('[BidSphere STOMP] Message parse error', e);
        }
      });
    } catch (err) {
      console.warn('[BidSphere STOMP] Subscription failed:', err);
      return null;
    }
  }

  unsubscribe(auctionId) {
    const destination = `/topic/auction/${auctionId}`;
    this.subscriptions.delete(destination);
  }

  disconnect() {
    if (this.client) {
      this.client.deactivate();
      this.connected = false;
    }
  }
}

export const wsService = new WebSocketService();
