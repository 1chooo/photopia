export interface TelegramChat {
  id: string;
  name: string;
  botToken: string;
  chatId: string;
  isDefault?: boolean;
}

export interface UserSettings {
  telegramChats?: TelegramChat[];
  updatedAt?: Date;
}

export interface SettingsFormData {
  telegramChats: TelegramChat[];
}
