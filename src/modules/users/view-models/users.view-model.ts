export class UsersViewModel {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  disabledAt: Date | null;
  firstName: string;
  lastName: string;
  username: string;
  email: string;

  constructor(dto: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    disabledAt: Date | null;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
  }) {
    this.id = dto.id;
    this.createdAt = dto.createdAt;
    this.updatedAt = dto.updatedAt;
    this.deletedAt = dto.deletedAt;
    this.disabledAt = dto.disabledAt;
    this.firstName = dto.firstName;
    this.lastName = dto.lastName;
    this.username = dto.username;
    this.email = dto.email;
  }

  get response() {
    return <UsersViewModel>{
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
      disabledAt: this.disabledAt,
      firstName: this.firstName,
      lastName: this.lastName,
      username: this.username,
      email: this.email,
    };
  }
}
