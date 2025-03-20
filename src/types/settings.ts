export interface NotificationSettings {
  emailNotifications: boolean;
  caseUpdates: boolean;
}

export interface AppearanceSettings {
  darkMode: boolean;
  language: string;
  timezone: string;
}

export interface ProfileSettings {
  email: string;
}

export interface LanguageOption {
  value: string;
  label: string;
}

export interface TimezoneOption {
  value: string;
  label: string;
} 