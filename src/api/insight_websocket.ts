import { Socket, io } from 'socket.io-client';

type InsightData = {
  type: 'insight';
  text: string;
}

type InsightCallbacks = {
  onInsightStart?: () => void;
  onInsightData?: (data: InsightData) => void;
  onInsightFinished?: () => void;
  onError?: (error: Error) => void;
  onStatusChange?: (status: string) => void;
}

class InsightWebSocket {
  private socket: Socket | null = null;
  private callbacks: InsightCallbacks = {};
  private isServerOffline: boolean = false;

  connect(callbacks: InsightCallbacks) {
    if (this.socket) {
      console.log("🔌 Socket already exists, returning existing socket");
      return this.socket;
    }

    console.log("🔌 Attempting to connect to WebSocket at /ws/insights/stream");
    
    this.callbacks = callbacks;
    this.socket = io('https://dialogica-demo-backend-c058.onrender.com/ws/insights/stream', {
      path: '/socket.io',
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.setupEventListeners();
    return this.socket;
  }

  private setupEventListeners() {
    if (!this.socket) {
      console.error("❌ Cannot setup event listeners: socket is null");
      return;
    }

    // Connection events
    this.socket.on('connect', () => {
      console.log("🔌 WebSocket Connected to insights namespace");
      this.isServerOffline = false;
      this.callbacks.onStatusChange?.("Connected");
    });

    // Connection established event from server
    this.socket.on('connection_established', (data) => {
      console.log("🔌 Server acknowledged connection:", data);
    });

    // Insight events
    this.socket.on('insight_start', () => {
      console.log("🚀 INSIGHT: Generation started");
      this.callbacks.onInsightStart?.();
    });

    this.socket.on('insight', (data: InsightData) => {
      console.log("📝 INSIGHT: Received chunk:", data);
      if (data.type === 'insight') {
        this.callbacks.onInsightData?.(data);
      }
    });

    this.socket.on('insight_complete', () => {
      console.log("✅ INSIGHT: Generation complete");
      this.callbacks.onInsightFinished?.();
    });

    // Error handling
    this.socket.on('connect_error', (error) => {
      console.error("❌ WebSocket Connection Error:", error);
      this.isServerOffline = true;
      this.callbacks.onStatusChange?.("Server Offline");
      this.callbacks.onError?.(new Error("Server is currently offline. Please try again later."));
    });

    this.socket.on('error', (error: { message: string }) => {
      console.error("❌ WebSocket Error:", error);
      this.callbacks.onError?.(new Error(error.message));
    });

    this.socket.on('disconnect', (reason) => {
      console.log("🔌 WebSocket Disconnected. Reason:", reason);
      this.isServerOffline = reason === 'io server disconnect' || reason === 'transport close';
      this.callbacks.onStatusChange?.(this.isServerOffline ? "Server Offline" : "Disconnected");
    });

    // Debug events
    this.socket.on('reconnect_attempt', (attemptNumber) => {
      console.log("🔄 Reconnection attempt:", attemptNumber);
    });

    this.socket.on('reconnect', () => {
      console.log("🔄 Reconnected successfully");
    });
  }

  disconnect() {
    if (this.socket) {
      console.log("🔌 Disconnecting WebSocket");
      this.socket.disconnect();
      this.socket = null;
      this.callbacks = {};
      console.log("🔌 WebSocket connection closed");
    }
  }

  getSocket() {
    return this.socket;
  }

  isConnected(): boolean {
    const connected = this.socket?.connected ?? false;
    console.log("🔌 Connection status:", connected);
    return connected;
  }

  isOffline(): boolean {
    return this.isServerOffline;
  }
}

export const insightWebSocket = new InsightWebSocket();