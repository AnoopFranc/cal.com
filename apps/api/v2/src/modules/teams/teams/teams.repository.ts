import { PrismaReadService } from "@/modules/prisma/prisma-read.service";
import { PrismaWriteService } from "@/modules/prisma/prisma-write.service";
import { Injectable } from "@nestjs/common";

import { Prisma } from "@calcom/prisma/client";

@Injectable()
export class TeamsRepository {
  constructor(private readonly dbRead: PrismaReadService, private readonly dbWrite: PrismaWriteService) {}

  async create(team: Prisma.TeamCreateInput) {
    return this.dbWrite.prisma.team.create({
      data: team,
    });
  }

  async getById(teamId: number) {
    return this.dbRead.prisma.team.findUnique({
      where: { id: teamId },
    });
  }

  async getByIds(teamIds: number[]) {
    return this.dbRead.prisma.team.findMany({
      where: {
        id: {
          in: teamIds,
        },
      },
    });
  }

  async getTeamUsersIds(teamId: number) {
    const teamMembers = await this.dbRead.prisma.membership.findMany({
      where: {
        teamId,
      },
    });
    if (!teamMembers || teamMembers.length === 0) {
      return [];
    }

    return teamMembers.map((member) => member.userId);
  }

  async getTeamManagedUsersIds(teamId: number) {
    const teamMembers = await this.dbRead.prisma.membership.findMany({
      where: {
        teamId,
        user: {
          isPlatformManaged: true,
        },
      },
    });
    if (!teamMembers || teamMembers.length === 0) {
      return [];
    }

    return teamMembers.map((member) => member.userId);
  }

  async getTeamsUserIsMemberOf(userId: number) {
    return this.dbRead.prisma.team.findMany({
      where: {
        members: {
          some: {
            userId,
          },
        },
      },
    });
  }

  async update(teamId: number, team: Prisma.TeamUpdateInput) {
    return this.dbWrite.prisma.team.update({
      where: { id: teamId },
      data: team,
    });
  }

  async delete(teamId: number) {
    return this.dbWrite.prisma.team.delete({
      where: { id: teamId },
    });
  }
}
