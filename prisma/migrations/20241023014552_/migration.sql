-- CreateEnum
CREATE TYPE "languages" AS ENUM ('pt_BR', 'en_US');

-- CreateEnum
CREATE TYPE "user_types" AS ENUM ('normal', 'admin', 'superadmin');

-- CreateEnum
CREATE TYPE "user_email_types" AS ENUM ('personal', 'work');

-- CreateEnum
CREATE TYPE "user_telephone_types" AS ENUM ('mobile', 'home', 'work');

-- CreateTable
CREATE TABLE "businesses" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "disabled_at" TIMESTAMP(3),

    CONSTRAINT "businesses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "disabled_at" TIMESTAMP(3),
    "last_login_at" TIMESTAMP(3),
    "type" "user_types" NOT NULL DEFAULT 'normal',
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "username_hash" TEXT NOT NULL,
    "national_id" TEXT NOT NULL,
    "national_id_hash" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "birth_date" TEXT,
    "avatar_url" TEXT,
    "language" "languages" NOT NULL DEFAULT 'pt_BR',
    "dark_mode" BOOLEAN NOT NULL DEFAULT false,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "verification_token" TEXT,
    "reset_password_token" TEXT,
    "last_password_change_at" TIMESTAMP(3),
    "two_factor_enabled" BOOLEAN NOT NULL DEFAULT false,
    "business_id" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_emails" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "disabled_at" TIMESTAMP(3),
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "type" "user_email_types" NOT NULL DEFAULT 'personal',
    "email" TEXT NOT NULL,
    "email_hash" TEXT NOT NULL,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "user_emails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_telephones" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "disabled_at" TIMESTAMP(3),
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "type" "user_telephone_types" NOT NULL DEFAULT 'mobile',
    "telephone" TEXT NOT NULL,
    "telephone_hash" TEXT NOT NULL,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "user_telephones_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "businesses_id_key" ON "businesses"("id");

-- CreateIndex
CREATE UNIQUE INDEX "businesses_code_key" ON "businesses"("code");

-- CreateIndex
CREATE INDEX "businesses_code_idx" ON "businesses"("code");

-- CreateIndex
CREATE UNIQUE INDEX "users_id_key" ON "users"("id");

-- CreateIndex
CREATE UNIQUE INDEX "users_code_key" ON "users"("code");

-- CreateIndex
CREATE INDEX "users_code_idx" ON "users"("code");

-- CreateIndex
CREATE INDEX "users_first_name_idx" ON "users"("first_name");

-- CreateIndex
CREATE INDEX "users_last_name_idx" ON "users"("last_name");

-- CreateIndex
CREATE INDEX "users_username_idx" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_business_id_key" ON "users"("username", "business_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_emails_id_key" ON "user_emails"("id");

-- CreateIndex
CREATE INDEX "user_emails_email_idx" ON "user_emails"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_telephones_id_key" ON "user_telephones"("id");

-- CreateIndex
CREATE INDEX "user_telephones_telephone_idx" ON "user_telephones"("telephone");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_emails" ADD CONSTRAINT "user_emails_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_telephones" ADD CONSTRAINT "user_telephones_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
