export type NotificationType = "Placement" | "Result" | "Event";

export interface Notification {
  ID: string;
  Type: NotificationType;
  Message: string;
  Timestamp: string; // "YYYY-MM-DD HH:MM:SS" format from API
}

export interface LocalNotification extends Notification {
  isRead: boolean;
  priorityScore?: number;
}

export interface FetchNotificationsResponse {
  notifications: Notification[];
}

export interface LogRequest {
  stack: string;
  level: "info" | "error" | "warn" | "debug";
  package: string;
  message: string;
}

export interface AuthResponse {
  token_type: string;
  access_token: string;
  expires_in: number;
}
