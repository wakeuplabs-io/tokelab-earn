/**
 * User domain entity
 * Represents an end-user of the platform
 */

export interface User {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserParams {
  email: string;
}
