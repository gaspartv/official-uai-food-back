import { Language, UserType } from "@prisma/client";

export class UsersResponseDto {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  disabledAt: Date | null;
  code: string;
  lastLoginAt: Date;
  type: UserType;
  firstName: string;
  lastName: string;
  username: string;
  usernameHash: string;
  nationalId: string;
  nationalIdHash: string;
  passwordHash: string;
  birthDate: string | null;
  avatarUrl: string | null;
  language: Language;
  darkMode: boolean;
  isVerified: boolean;
  verificationToken: string | null;
  resetPasswordToken: string | null;
  lastPasswordChangeAt: Date | null;
  twoFactorEnabled: boolean;
  businessId: string;
}
