import * as bcrypt from "bcrypt";
import { env } from "../../configs/env";
import { BaseEntity } from "../../common/entities/base.entity";
import { Language, UserType } from "@prisma/client";
import { HandleDate } from "../../utils/handle-date.util";
import { ConflictException } from "@nestjs/common";
import { Security } from "../../utils/security.util";
import { Generate } from "../../utils/generate.utils";

interface UsersEntityInterface {
  id?: string;
  code?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
  disabledAt?: Date | null;
  lastLoginAt?: Date | null;
  type?: UserType;
  firstName?: string;
  lastName?: string;
  username?: string;
  usernameHash?: string;
  nationalId?: string;
  nationalIdHash?: string;
  passwordHash?: string;
  birthDate?: string | null;
  avatarUrl?: string | null;
  language?: Language;
  darkMode?: boolean;
  isVerified?: boolean;
  verificationToken?: string | null;
  resetPasswordToken?: string | null;
  lastPasswordChangeAt?: Date | null;
  twoFactorEnabled?: boolean;
  businessId?: string;
}

interface UsersEntityCreate {
  firstName: string;
  lastName: string;
  username: string;
  nationalId: string;
  password: string;
  birthDate?: string | null;
  language?: Language;
  darkMode?: boolean;
  businessId: string;
}

export class UsersEntity extends BaseEntity {
  private _code: string;
  private _lastLoginAt: Date;
  private _type: UserType;
  private _firstName: string;
  private _lastName: string;
  private _username: string;
  private _usernameHash: string;
  private _nationalId: string;
  private _nationalIdHash: string;
  private _passwordHash: string;
  private _birthDate: string | null;
  private _avatarUrl: string | null;
  private _language: Language;
  private _darkMode: boolean;
  private _isVerified: boolean;
  private _verificationToken: string | null;
  private _resetPasswordToken: string | null;
  private _lastPasswordChangeAt: Date | null;
  private _twoFactorEnabled: boolean;
  private _businessId: string;

  constructor(dto?: UsersEntityInterface) {
    super(dto);
    this._code = dto?.code;
    this._lastLoginAt = dto?.lastLoginAt;
    this._type = dto?.type;
    this._firstName = dto?.firstName;
    this._lastName = dto?.lastName;
    this._username = dto?.username;
    this._usernameHash = dto?.usernameHash;
    this._nationalId = dto?.nationalId;
    this._nationalIdHash = dto?.nationalIdHash;
    this._passwordHash = dto?.passwordHash;
    this._birthDate = dto?.birthDate;
    this._avatarUrl = dto?.avatarUrl;
    this._language = dto?.language;
    this._darkMode = dto?.darkMode;
    this._isVerified = dto?.isVerified;
    this._verificationToken = dto?.verificationToken;
    this._resetPasswordToken = dto?.resetPasswordToken;
    this._lastPasswordChangeAt = dto?.lastPasswordChangeAt;
    this._twoFactorEnabled = dto?.twoFactorEnabled;
    this._businessId = dto?.businessId;
  }

  get response() {
    return {
      id: this._id,
      code: this._code,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      deletedAt: this._deletedAt,
      disabledAt: this._disabledAt,
      lastLoginAt: this._lastLoginAt,
      type: this._type,
      firstName: this._firstName,
      lastName: this._lastName,
      username: this._username,
      usernameHash: this._usernameHash,
      nationalId: this._nationalId,
      nationalIdHash: this._nationalIdHash,
      passwordHash: this._passwordHash,
      birthDate: this._birthDate,
      avatarUrl: this._avatarUrl,
      language: this._language,
      darkMode: this._darkMode,
      isVerified: this._isVerified,
      verificationToken: this._verificationToken,
      resetPasswordToken: this._resetPasswordToken,
      lastPasswordChangeAt: this._lastPasswordChangeAt,
      twoFactorEnabled: this._twoFactorEnabled,
      businessId: this._businessId,
    };
  }

  get id() {
    return this._id;
  }

  set create(dto: UsersEntityCreate) {
    this.baseCreate = new Date();
    this._code = Generate.code();
    this._lastLoginAt = null;
    this._firstName = dto.firstName;
    this._lastName = dto.lastName;
    this.handleUserName(dto.username);
    this.handleNationalId(dto.nationalId);
    this.handlePasswordHash(dto.password);
    this._birthDate = dto.birthDate ? dto.birthDate : null;
    this._avatarUrl = null;
    this._language = dto.language ? dto.language : Language.pt_BR;
    this._darkMode = dto.darkMode ? dto.darkMode : false;
    this._isVerified = false;
    this._verificationToken = ""; // TODO: Implementar geração do verificationToken
    this._resetPasswordToken = null;
    this._lastPasswordChangeAt = null;
    this._twoFactorEnabled = false;
    this._businessId = dto.businessId;
  }

  set disable(date: Date) {
    this._updatedAt = HandleDate.UTC(date, -3);
    this._disabledAt = HandleDate.UTC(date, -3);
  }

  set enable(date: Date) {
    this._updatedAt = HandleDate.UTC(date, -3);
    this._disabledAt = null;
  }

  set delete(date: Date) {
    this._updatedAt = HandleDate.UTC(date, -3);
    this._deletedAt = HandleDate.UTC(date, -3);
    this._disabledAt = HandleDate.UTC(date, -3);
  }

  set attLastLogin(date: Date) {
    this._updatedAt = HandleDate.UTC(date, -3);
    this._lastLoginAt = HandleDate.UTC(date, -3);
  }

  set changeType(type: UserType) {
    this._updatedAt = HandleDate.UTC(new Date(), -3);
    this._type = type;
  }

  set isVerified(isVerified: boolean) {
    this._isVerified = isVerified;
  }

  private handleNationalId(nationalId: string) {
    if (nationalId.length < 1) {
      throw new ConflictException(
        "nationalId precisa conter 1 ou mais caracteres",
      );
    }
    if (nationalId.length > 20) {
      throw new ConflictException(
        "nationalId precisa conter 20 ou menos caracteres",
      );
    }
    this._nationalId = Security.hash(nationalId);
    this._nationalIdHash = Security.encrypt(nationalId);
  }

  private handleUserName(userName: string) {
    if (userName.length < 4) {
      throw new ConflictException(
        "userName precisa conter 5 ou mais caracteres",
      );
    }
    if (userName.length > 20) {
      throw new ConflictException(
        "userName precisa conter 20 ou menos caracteres",
      );
    }
    this._username = Security.hash(userName);
    this._usernameHash = Security.encrypt(userName);
  }

  private handlePasswordHash(password: string) {
    if (password.length < 8) {
      throw new ConflictException(
        "Password must be at least 8 characters long",
      );
    }
    if (password.length > 128) {
      throw new ConflictException(
        "Password must be at most 128 characters long",
      );
    }
    const salt = bcrypt.genSaltSync(env.SALT_OR_ROUNDS);
    this._passwordHash = bcrypt.hashSync(password, salt);
  }
}
