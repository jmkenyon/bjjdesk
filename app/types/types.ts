import { Prisma } from "@prisma/client";

export type GymWStudents = Prisma.GymGetPayload<{
  include: {
    users: {
      include: {
        membership: true;
      };
    };
  };
}>;