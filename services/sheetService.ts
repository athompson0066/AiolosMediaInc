
import { LeadData } from '../types';

/**
 * Service to handle lead submission.
 * To use this in production:
 * 1. Create a Google Apps Script in your Spreadsheet.
 * 2. Add a 'doPost' function that takes the e.parameter and appends to the sheet.
 * 3. Deploy as a Web App and replace the URL below.
 */
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz_placeholder/exec'; 

export const submitLeadToSheet = async (data: LeadData): Promise<boolean> => {
  try {
    // Map internal field names to the client's requested column names
    const payload = {
      'Full Name': data.name,
      'Email Address': data.email,
      'Phone Number': data.phone,
      'Company Name': data.companyName,
      'Job Title': data.jobTitle,
      'Website': data.website,
      'The Goal': data.painPoint,
      'Feedback': data.notes || ''
    };

    // Note: We use 'no-cors' if we are posting to a standard Apps Script endpoint 
    // that doesn't handle preflight, but JSON POST usually needs CORS.
    // In a real-world scenario, you'd use a serverless function as a proxy.
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors', // Standard for direct Google Script posts to avoid CORS preflight issues
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    // Since 'no-cors' always returns an opaque response with status 0, 
    // we assume success if no error was thrown.
    return true;
  } catch (error) {
    console.error('Failed to submit lead to Google Sheets:', error);
    return false;
  }
};
