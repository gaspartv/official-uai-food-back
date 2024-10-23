import { UserEmailType } from "@prisma/client";

export class UserEmailsResponseDto {
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
