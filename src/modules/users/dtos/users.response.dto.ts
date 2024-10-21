export class UsersResponseDto {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  disabledAt: Date | null;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  passwordHash: string;
  isVerified: boolean;
}
