import { UserTelephoneType } from "@prisma/client";
import { BaseEntity } from "../../common/entities/base.entity";
import { Security } from "../../utils/security.util";

interface UserTelephonesEntityInterface {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  disabledAt: Date | null;
  isPrimary: boolean;
  type: UserTelephoneType;
  telephone: string;
  telephoneHash: string;
  isVerified: boolean;
  userId: string;
}

interface UserTelephonesEntityCreateInterface {
  type: UserTelephoneType;
  telephone: string;
  userId: string;
}

export class UserTelephonesEntity extends BaseEntity {
  private _isPrimary: boolean;
  private _type: UserTelephoneType;
  private _telephone: string;
  private _telephoneHash: string;
  private _isVerified: boolean;
  private _userId: string;

  constructor(dto?: UserTelephonesEntityInterface) {
    super(dto);
    this._isPrimary = dto?.isPrimary;
    this._type = dto?.type;
    this._telephone = dto?.telephone;
    this._telephoneHash = dto?.telephoneHash;
    this._isVerified = dto?.isVerified;
    this._userId = dto?.userId;
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
      telephone: this._telephone,
      telephoneHash: this._telephoneHash,
      isVerified: this._isVerified,
      userId: this._userId,
    };
  }

  get id() {
    return this._id;
  }

  get telephone() {
    return this._telephoneHash;
  }

  set telephone(telephone: string) {
    this._telephone = Security.hash(telephone);
    this._telephoneHash = Security.encrypt(telephone);
  }

  set create(dto: UserTelephonesEntityCreateInterface) {
    this._isPrimary = false;
    this._type = dto.type;
    this.telephone = dto.telephone;
    this._isVerified = false;
    this._userId = dto.userId;
  }
}
