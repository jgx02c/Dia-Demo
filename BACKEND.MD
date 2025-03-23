# Dialogica API Documentation

## Overview
This API provides WebSocket and REST endpoints for real-time audio transcription and insight generation. The system uses three separate WebSocket connections to handle different aspects of the functionality.

## WebSocket Connections

### 1. Audio Input WebSocket
**Endpoint**: `ws://your-server/ws/audio-stream/{client_id}`

**Purpose**: Receives raw audio data from the client for transcription.

**Usage**:
```javascript
const audioWs = new WebSocket(`ws://your-server/ws/audio-stream/${clientId}`);
```

### 2. Transcription Output WebSocket
**Endpoint**: `ws://your-server/transcription/stream/{client_id}`

**Purpose**: Sends transcription results back to the client.

**Message Types**:
```javascript
// Final transcription
{
    "type": "transcription",
    "text": "transcribed text here",
    "is_final": true
}

// Partial transcription (buffer)
{
    "type": "transcription",
    "text": "partial text...",
    "is_final": false
}

// Session opened
{
    "type": "session_opened",
    "session_id": "session-id-here"
}

// Error message
{
    "type": "error",
    "message": "error description"
}

// Session closed
{
    "type": "session_closed"
}
```

### 3. Insight Output WebSocket
**Endpoint**: `ws://your-server/insights/stream/{client_id}`

**Purpose**: Sends insight results back to the client.

**Message Types**:
```javascript
// Start of insight processing
{
    "type": "insight_start"
}

// Insight chunk
{
    "type": "insight",
    "text": "insight text here"
}

// Completion of insight processing
{
    "type": "insight_complete"
}

// Error message
{
    "type": "error",
    "message": "error description"
}
```

## REST Endpoints

### Transcription Control

#### Start Transcription
**Endpoint**: `POST /transcription/start/{client_id}`

**Purpose**: Starts the transcription process for a specific client.

**Response**:
```json
{
    "status": "success",
    "message": "Transcription started"
}
```

**Error Response** (404):
```json
{
    "detail": "Client not connected"
}
```

#### Stop Transcription
**Endpoint**: `POST /transcription/stop/{client_id}`

**Purpose**: Stops the transcription process for a specific client.

**Response**:
```json
{
    "status": "success",
    "message": "Transcription stopped"
}
```

**Error Response** (404):
```json
{
    "detail": "Client not connected"
}
```

### Insight Management

#### Submit Text for Insight
**Endpoint**: `POST /insights/submit/{client_id}`

**Purpose**: Manually submit text for insight generation.

**Request Body**:
```json
{
    "text": "text to process for insights"
}
```

**Response**:
```json
{
    "status": "success",
    "message": "Insight processed"
}
```

**Error Responses**:
- 404: Client not connected
- 500: Processing error

#### Set Batch Size
**Endpoint**: `POST /insights/batch-size/{client_id}`

**Purpose**: Set the number of sentences to process before generating insights.

**Request Body**:
```json
{
    "size": 3
}
```

**Response**:
```json
{
    "status": "success",
    "message": "Batch size set to 3"
}
```

## Workflow Example

1. Connect to all three WebSocket endpoints:
```javascript
const audioWs = new WebSocket(`ws://your-server/ws/audio-stream/${clientId}`);
const transcriptionWs = new WebSocket(`ws://your-server/transcription/stream/${clientId}`);
const insightWs = new WebSocket(`ws://your-server/insights/stream/${clientId}`);
```

2. Set up WebSocket message handlers:
```javascript
transcriptionWs.onmessage = (event) => {
    const data = JSON.parse(event.data);
    // Handle transcription updates
};

insightWs.onmessage = (event) => {
    const data = JSON.parse(event.data);
    // Handle insight updates
};
```

3. Start transcription:
```http
POST /transcription/start/{client_id}
```

4. Start sending audio data through the audio WebSocket:
```javascript
audioWs.send(audioData);
```

5. The system will automatically:
   - Stream transcription results through the transcription WebSocket
   - Process completed sentences (every 3 sentences by default) for insights
   - Stream insight results through the insight WebSocket

6. Stop transcription when done:
```http
POST /transcription/stop/{client_id}
```

## Notes
- The system processes insights automatically after every 3 completed sentences
- The batch size for insight processing can be adjusted using the `/insights/batch-size/{client_id}` endpoint
- All WebSocket connections should be maintained throughout the session
- Error handling should be implemented for both WebSocket and REST endpoints 