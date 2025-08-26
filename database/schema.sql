-- Better Auth Database Schema for NeonDB
-- Run this in your NeonDB SQL console to set up the authentication tables

-- Users table
CREATE TABLE "user" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT,
  "email" TEXT NOT NULL UNIQUE,
  "password" TEXT,
  "email_verified" BOOLEAN DEFAULT FALSE,
  "image" TEXT,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP DEFAULT NOW()
);

-- Sessions table
CREATE TABLE "session" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "user_id" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "session_token" TEXT NOT NULL UNIQUE,
  "expires_at" TIMESTAMP NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP DEFAULT NOW()
);

-- Accounts table (for social providers)
CREATE TABLE "account" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "user_id" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "account_id" TEXT NOT NULL,
  "provider_id" TEXT NOT NULL,
  "access_token" TEXT,
  "refresh_token" TEXT,
  "access_token_expires_at" TIMESTAMP,
  "refresh_token_expires_at" TIMESTAMP,
  "scope" TEXT,
  "id_token" TEXT,
  "password" TEXT,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP DEFAULT NOW()
);

-- Verification table (for email verification, password reset, etc.)
CREATE TABLE "verification" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "identifier" TEXT NOT NULL,
  "value" TEXT NOT NULL,
  "expires_at" TIMESTAMP NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX "user_email_idx" ON "user"("email");
CREATE INDEX "session_user_id_idx" ON "session"("user_id");
CREATE INDEX "session_session_token_idx" ON "session"("session_token");
CREATE INDEX "account_user_id_idx" ON "account"("user_id");
CREATE INDEX "verification_identifier_idx" ON "verification"("identifier");
CREATE INDEX "verification_value_idx" ON "verification"("value");
