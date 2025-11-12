import { db } from "@/core/config/pool";
import { users } from "@/core/database/schemas";
import { NewUser, UpdateUser } from "@/core/database/entities";
import { eq } from "drizzle-orm";
import { logger } from "@/shared/utils";
import { register } from "module";

export const usersModel = {
  findUserByEmail: async (email: string) => {
    try {
      logger.info("Searching for user with email: " + email);
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      return user;

    } catch (error) {
      logger.error("Error finding user by email:", error);
      throw error;
    }
  },
  findUserById: async (id: string) => {
    try {
      logger.info("Searching for user with ID: " + id);
        const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, id))
        .limit(1);
      return user;

    } catch (error) {
      logger.error("Error finding user by ID:", error);
      throw error;
    }
  },
  register: async (newUser: NewUser) => {
    try {
      logger.info("Registering new user with email: " + newUser.email);
      const [createdUser] = await db
        .insert(users)
        .values(newUser)
        .returning({ id: users.id, role: users.role });
        return createdUser;
    } catch (error) {
      logger.error("Error registering new user:", error);
      throw error;
    }
  }
};