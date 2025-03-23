export interface InsightConfig {
  caseId: string;
  databaseId: string;
  instructionId: string;
}

export const sendMessage = async (message: string): Promise<void> => {
  try {
    const response = await fetch('https://dialogica-demo-backend-c058.onrender.com/insights/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: message }),
    });

    if (!response.ok) {
      throw new Error('Failed to submit text for insight');
    }
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};
