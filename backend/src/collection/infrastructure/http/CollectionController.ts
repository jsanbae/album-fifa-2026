import type { Request, Response } from 'express';
import { DomainError } from '@album/common';
import type { DecrementStickerCountUseCase } from '../../application/DecrementStickerCountUseCase.js';
import type { GetCollectionProgressUseCase } from '../../application/GetCollectionProgressUseCase.js';
import type { GetCollectionUseCase } from '../../application/GetCollectionUseCase.js';
import type { IncrementStickerCountUseCase } from '../../application/IncrementStickerCountUseCase.js';
import type { RegisterStickersByCodeUseCase } from '../../application/RegisterStickersByCodeUseCase.js';
import type { SetStickerCountUseCase } from '../../application/SetStickerCountUseCase.js';
import type { UserId } from '../../domain/entities/UserId.js';

type AuthenticatedRequest = Request & { userId: UserId };

export class CollectionController {
  constructor(
    private readonly getCollectionUseCase: GetCollectionUseCase,
    private readonly getCollectionProgressUseCase: GetCollectionProgressUseCase,
    private readonly incrementStickerCountUseCase: IncrementStickerCountUseCase,
    private readonly decrementStickerCountUseCase: DecrementStickerCountUseCase,
    private readonly setStickerCountUseCase: SetStickerCountUseCase,
    private readonly registerStickersByCodeUseCase: RegisterStickersByCodeUseCase,
  ) {}

  async getCollection(req: Request, res: Response): Promise<void> {
    try {
      const entry = await this.getCollectionUseCase.execute(this.getUserId(req));
      res.json(entry);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async getProgress(req: Request, res: Response): Promise<void> {
    try {
      const progress = await this.getCollectionProgressUseCase.execute(this.getUserId(req));
      res.json(progress);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async increment(req: Request, res: Response): Promise<void> {
    try {
      const stickerId = this.getStickerId(req);
      if (!stickerId) {
        res.status(400).json({ error: 'Sticker id is required' });
        return;
      }
      const entry = await this.incrementStickerCountUseCase.execute(this.getUserId(req), stickerId);
      res.json(entry);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async decrement(req: Request, res: Response): Promise<void> {
    try {
      const stickerId = this.getStickerId(req);
      if (!stickerId) {
        res.status(400).json({ error: 'Sticker id is required' });
        return;
      }
      const entry = await this.decrementStickerCountUseCase.execute(this.getUserId(req), stickerId);
      res.json(entry);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async registerByCode(req: Request, res: Response): Promise<void> {
    try {
      const { codes } = req.body as { codes?: unknown };
      if (typeof codes !== 'string') {
        res.status(400).json({ error: 'codes must be a string' });
        return;
      }
      const result = await this.registerStickersByCodeUseCase.execute(this.getUserId(req), codes);
      res.json(result);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async setCount(req: Request, res: Response): Promise<void> {
    try {
      const stickerId = this.getStickerId(req);
      if (!stickerId) {
        res.status(400).json({ error: 'Sticker id is required' });
        return;
      }
      const { count } = req.body as { count?: unknown };
      if (typeof count !== 'number') {
        res.status(400).json({ error: 'count must be a number' });
        return;
      }
      const entry = await this.setStickerCountUseCase.execute(this.getUserId(req), stickerId, count);
      res.json(entry);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  private getUserId(req: Request): UserId {
    return (req as AuthenticatedRequest).userId;
  }

  private getStickerId(req: Request): string | undefined {
    const id = req.params.id;
    return typeof id === 'string' ? id : undefined;
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
