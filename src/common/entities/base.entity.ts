import cuid from "cuid";
import { HandleDate } from "../../utils/handle-date.util";

interface BaseEntityInterface {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
  disabledAt?: Date | null;
}

export class BaseEntity {
  _id: string;
  _createdAt: Date;
  _updatedAt: Date;
  _deletedAt: Date | null;
  _disabledAt: Date | null;

  constructor(dto?: BaseEntityInterface) {
    this._id = dto?.id;
    this._createdAt = dto?.createdAt;
    this._updatedAt = dto?.updatedAt;
    this._deletedAt = dto?.deletedAt;
    this._disabledAt = dto?.disabledAt;
  }

  set baseCreate(date: Date) {
    this._id = cuid();
    this._createdAt = HandleDate.UTC(date, -3);
    this._updatedAt = HandleDate.UTC(date, -3);
    this._deletedAt = null;
    this._disabledAt = null;
  }
}
