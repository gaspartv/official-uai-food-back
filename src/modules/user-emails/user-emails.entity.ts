import { UserEmailType } from "@prisma/client";
import { Security } from "../../utils/security.util";
import { BaseEntity } from "../../common/entities/base.entity";

interface UserEmailsEntityInterface {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  disabledAt: Date | null;
  isPrimary: boolean;
  type: UserEmailType;
  email: string;
  emailHash: string;
  isVerified: boolean;
  userId: string;
}

interface UserEmailsEntityCreateInterface {
  type: UserEmailType;
  email: string;
  userId: string;
}

export class UserEmailsEntity extends BaseEntity {
  private _isPrimary: boolean;
  private _type: UserEmailType;
  private _email: string;
  private _emailHash: string;
  private _isVerified: boolean;
  private _userId: string;

  constructor(dto?: UserEmailsEntityInterface) {
    super(dto);
    this._isPrimary = dto.isPrimary;
    this._type = dto.type;
    this._email = dto.email;
    this._emailHash = dto.emailHash;
    this._isVerified = dto.isVerified;
    this._userId = dto.userId;
  }

  get response() {
    return {
      id: this._id,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      deletedAt: this._deletedAt,
      disabledAt: this._disabledAt,
      isPrimary: this._isPrimary,
      type: this._type,
      email: this._email,
      emailHash: this._emailHash,
      isVerified: this._isVerified,
      userId: this._userId,
    };
  }

  get id() {
    return this._id;
  }

  set email(email: string) {
    this._email = Security.hash(email);
    this._emailHash = Security.encrypt(email);
  }

  set create(dto: UserEmailsEntityCreateInterface) {
    this.baseCreate = new Date();
    this._isPrimary = false;
    this._type = dto.type;
    this.email = dto.email;
    this._isVerified = false;
    this._userId = dto.userId;
  }
}
