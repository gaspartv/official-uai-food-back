import { Language, UserType } from "@prisma/client";

export class UsersViewModel {
  id: string;
  code: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  disabledAt: Date | null;
  lastLoginAt: Date | null;
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

  constructor(dto: {
    id: string;
    code: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    disabledAt: Date | null;
    lastLoginAt: Date | null;
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
  }) {
    this.id = dto.id;
    this.code = dto.code;
    this.createdAt = dto.createdAt;
    this.updatedAt = dto.updatedAt;
    this.deletedAt = dto.deletedAt;
    this.disabledAt = dto.disabledAt;
    this.lastLoginAt = dto.lastLoginAt;
    this.type = dto.type;
    this.firstName = dto.firstName;
    this.lastName = dto.lastName;
    this.username = dto.username;
    this.usernameHash = dto.usernameHash;
    this.nationalId = dto.nationalId;
    this.nationalIdHash = dto.nationalIdHash;
    this.passwordHash = dto.passwordHash;
    this.birthDate = dto.birthDate;
    this.avatarUrl = dto.avatarUrl;
    this.language = dto.language;
    this.darkMode = dto.darkMode;
    this.isVerified = dto.isVerified;
    this.verificationToken = dto.verificationToken;
    this.resetPasswordToken = dto.resetPasswordToken;
    this.lastPasswordChangeAt = dto.lastPasswordChangeAt;
    this.twoFactorEnabled = dto.twoFactorEnabled;
    this.businessId = dto.businessId;
  }

  get response() {
    return <UsersViewModel>{
      id: this.id,
      code: this.code,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
      disabledAt: this.disabledAt,
      lastLoginAt: this.lastLoginAt,
      type: this.type,
      firstName: this.firstName,
      lastName: this.lastName,
      username: this.username,
      usernameHash: this.usernameHash,
      nationalId: this.nationalId,
      nationalIdHash: this.nationalIdHash,
      passwordHash: this.passwordHash,
      birthDate: this.birthDate,
      avatarUrl: this.avatarUrl,
      language: this.language,
      darkMode: this.darkMode,
      isVerified: this.isVerified,
      verificationToken: this.verificationToken,
      resetPasswordToken: this.resetPasswordToken,
      lastPasswordChangeAt: this.lastPasswordChangeAt,
      twoFactorEnabled: this.twoFactorEnabled,
      businessId: this.businessId,
    };
  }
}
