// file: lib/google-sheet.ts

import { google } from 'googleapis';

// Retrieve credentials from environment variables
const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
// Handle potential escaped newlines in the private key string
const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

if (!clientEmail || !privateKey) {
  throw new Error('Missing Google Service Account credentials in .env.local');
}

// Initialize the Google Auth client
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: clientEmail,
    private_key: privateKey,
  },
  // We only need read access for this report card app
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

// Export the authenticated Sheets API client to be used in our route handlers
export const sheets = google.sheets({
  version: 'v4',
  auth: auth,
});