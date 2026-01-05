/**
 * User repository
 * Data access layer for User entities
 */

import { PrismaClient } from "@prisma/client";
import { User, CreateUserParams } from "../../domain/entities/user";
import getPrismaClient from "../../config/database";

export class UserRepository {
  constructor(private readonly prisma: PrismaClient = getPrismaClient()) {}

  /**
   * Create a new user
   */
  async create(params: CreateUserParams): Promise<User> {
    const user = await this.prisma.user.create({
      data: {
        email: params.email,
      },
    });

    return this.toDomain(user);
  }

  /**
   * Find user by ID
   */
  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    return user ? this.toDomain(user) : null;
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    return user ? this.toDomain(user) : null;
  }

  private toDomain(user: any): User {
    return {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}

