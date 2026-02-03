export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'MANAGER' | 'AGENT';
  avatar?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  source?: string;
  status: 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'PROPOSAL' | 'NEGOTIATION' | 'WON' | 'LOST';
  stageId?: string;
  assignedTo?: string;
  tags: string[];
  customFields?: any;
  createdAt: string;
  updatedAt: string;
  stage?: Stage;
  assigned?: User;
}

export interface Stage {
  id: string;
  name: string;
  color: string;
  order: number;
  pipelineId: string;
}

export interface Pipeline {
  id: string;
  name: string;
  isDefault: boolean;
  stages: Stage[];
}

export interface Message {
  id: string;
  leadId: string;
  userId?: string;
  content: string;
  messageType: 'TEXT' | 'IMAGE' | 'VIDEO' | 'AUDIO' | 'DOCUMENT' | 'LOCATION' | 'TEMPLATE';
  direction: 'INBOUND' | 'OUTBOUND';
  whatsappId?: string;
  status: 'SENT' | 'DELIVERED' | 'READ' | 'FAILED';
  mediaUrl?: string;
  createdAt: string;
  user?: User;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  leadId?: string;
  assignedTo: string;
  dueDate?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  lead?: Lead;
  user: User;
}

export interface Automation {
  id: string;
  name: string;
  description?: string;
  trigger: 'NEW_MESSAGE' | 'LEAD_CREATED' | 'STAGE_CHANGED' | 'TAG_ADDED' | 'SCHEDULED';
  conditions?: any;
  actions: any;
  isActive: boolean;
  createdAt: string;
}

export interface Template {
  id: string;
  name: string;
  content: string;
  category?: string;
  variables: string[];
  mediaUrl?: string;
  isActive: boolean;
  createdAt: string;
}
