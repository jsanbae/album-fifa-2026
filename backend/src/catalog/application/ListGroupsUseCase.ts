import { GROUP_DISPLAY_ORDER } from '@album/common';
import type { CatalogRepository } from '../domain/repositories/CatalogRepository.js';
import type { GroupDTO } from './CatalogDTO.js';
import { toGroupDTO } from './CatalogMapper.js';

export class ListGroupsUseCase {
  constructor(private readonly catalogRepository: CatalogRepository) {}

  async execute(): Promise<GroupDTO[]> {
    const groups = await this.catalogRepository.findAllGroups();
    const orderIndex = new Map(GROUP_DISPLAY_ORDER.map((name, index) => [name, index]));

    return groups
      .map(toGroupDTO)
      .sort((a, b) => {
        const orderA = orderIndex.get(a.name as (typeof GROUP_DISPLAY_ORDER)[number]) ?? 999;
        const orderB = orderIndex.get(b.name as (typeof GROUP_DISPLAY_ORDER)[number]) ?? 999;
        return orderA - orderB;
      });
  }
}
