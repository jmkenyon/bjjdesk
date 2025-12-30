import { User } from "@prisma/client";

export type GymWStudents = {
  name: string;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  slug: string;
  users: User[];
};
