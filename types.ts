
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export enum LeadPainPoint {
  MISSED_CALLS = 'Missed Calls',
  MANUAL_BOOKING = 'Manual Booking',
  CUSTOMER_SUPPORT = 'Customer Support',
  LEAD_GENERATION = 'Lead Generation',
  COST_ESTIMATION = 'Cost Estimation',
  OTHER = 'Other'
}

export interface LeadData {
  name: string;
  email: string;
  phone: string;
  companyName: string;
  jobTitle: string;
  website: string;
  painPoint: LeadPainPoint;
  notes?: string;
}
