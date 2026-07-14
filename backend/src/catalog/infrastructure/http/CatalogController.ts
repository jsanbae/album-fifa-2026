import type { Request, Response } from 'express';
import { DomainError } from '@album/common';
import type { ListCountriesUseCase } from '../../application/ListCountriesUseCase.js';
import type { ListGroupsUseCase } from '../../application/ListGroupsUseCase.js';
import type { ListStickersUseCase } from '../../application/ListStickersUseCase.js';
import type { GetCollectionUseCase } from '../../../collection/application/GetCollectionUseCase.js';
import type { UserId } from '../../../collection/domain/entities/UserId.js';

export class CatalogController {
  constructor(
    private readonly listStickersUseCase: ListStickersUseCase,
    private readonly listCountriesUseCase: ListCountriesUseCase,
    private readonly listGroupsUseCase: ListGroupsUseCase,
    private readonly getCollectionUseCase?: GetCollectionUseCase,
  ) {}

  async listStickers(req: Request, res: Response): Promise<void> {
    try {
      const group = typeof req.query.group === 'string' ? req.query.group : undefined;
      const search = typeof req.query.search === 'string' ? req.query.search : undefined;

      const userId = (req as Request & { userId?: UserId }).userId;
      let countsByStickerId: Map<string, number> | undefined;

      if (userId && this.getCollectionUseCase) {
        const collection = await this.getCollectionUseCase.execute(userId);
        countsByStickerId = new Map(collection.map((entry) => [entry.stickerId, entry.count]));
      }

      const stickers = await this.listStickersUseCase.execute({ group, search }, countsByStickerId);
      res.json(stickers);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async listCountries(_req: Request, res: Response): Promise<void> {
    try {
      const countries = await this.listCountriesUseCase.execute();
      res.json(countries);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async listGroups(_req: Request, res: Response): Promise<void> {
    try {
      const groups = await this.listGroupsUseCase.execute();
      res.json(groups);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  private handleError(error: unknown, res: Response): void {
    if (error instanceof DomainError) {
      const statusMap: Record<DomainError['type'], number> = {
        notFound: 404,
        validation: 422,
        unauthorized: 401,
        other: 400,
      };
      res.status(statusMap[error.type]).json({ error: error.message });
      return;
    }
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
