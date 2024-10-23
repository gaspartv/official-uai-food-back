import * as bcrypt from "bcrypt";
import { env } from "../../configs/env";
import { HandleDate } from "../../utils/handle-date.util";
import cuid from "cuid";
import { BaseEntity } from "../../common/entities/base.entity";

interface UsersEntityInterface {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
  disabledAt?: Date | null;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  passwordHash: string;
  isVerified: boolean;
  lastLoginAt?: Date;
}

interface UsersEntityCreate {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}

export class UsersEntity extends BaseEntity {
  private _firstName: string;
  private _lastName: string;
  private _username: string;
  private _email: string;
  private _password: string;
  private _isVerified: boolean;
  private _lastLoginAt: Date;

  constructor(dto?: UsersEntityInterface) {
    super(dto);
    this._firstName = dto?.firstName;
    this._lastName = dto?.lastName;
    this._username = dto?.username;
    this._email = dto?.email;
    this._password = dto?.passwordHash;
    this._isVerified = dto?.isVerified;
    this._lastLoginAt = dto?.lastLoginAt;
  }

  get response() {
    return {
      id: this._id,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      deletedAt: this._deletedAt,
      disabledAt: this._disabledAt,
      firstName: this._firstName,
      lastName: this._lastName,
      username: this._username,
      email: this._email,
      passwordHash: this._password,
      isVerified: this._isVerified,
      lastLoginAt: this._lastLoginAt,
    };
  }

  get id() {
    return this._id;
  }

  set create(dto: UsersEntityCreate) {
    this.baseCreate = new Date();
    this._firstName = dto.firstName;
    this._lastName = dto.lastName;
    this._username = dto.username;
    this._email = dto.email;
    this.passwordHash = dto.password;
  }

  set passwordHash(password: string) {
    if (password.length < 8) {
      throw new Error("Password must be at least 8 characters long");
    }
    if (password.length > 128) {
      throw new Error("Password must be at most 128 characters long");
    }
    const salt = bcrypt.genSaltSync(env.SALT_OR_ROUNDS);
    this._password = bcrypt.hashSync(password, salt);
  }

  set updateDate(date: Date) {
    this._updatedAt = date;
  }

  set lastLoginAt(date: Date) {
    this._lastLoginAt = date;
  }

  set isVerified(isVerified: boolean) {
    this._isVerified = isVerified;
  }
}
