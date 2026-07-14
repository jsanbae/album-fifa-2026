import cors from 'cors';
import express, { type Express } from 'express';
import { API_ROUTES } from '@album/common';
import { authMiddleware } from './authMiddleware.js';
import { optionalAuthMiddleware } from './optionalAuthMiddleware.js';
import { Factory } from './Factory.js';

export function createServer(): Express {
  const app = express();

  app.use(
    cors({
      origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
    }),
  );
  app.use(express.json());

  const catalogController = Factory.createCatalogController();
  const collectionController = Factory.createCollectionController();

  app.get(API_ROUTES.catalog.stickers, optionalAuthMiddleware, (req, res) =>
    catalogController.listStickers(req, res),
  );
  app.get(API_ROUTES.catalog.countries, (req, res) => catalogController.listCountries(req, res));
  app.get(API_ROUTES.catalog.groups, (req, res) => catalogController.listGroups(req, res));

  app.get(API_ROUTES.collection.root, authMiddleware, (req, res) =>
    collectionController.getCollection(req, res),
  );
  app.get(API_ROUTES.collection.progress, authMiddleware, (req, res) =>
    collectionController.getProgress(req, res),
  );
  app.post(API_ROUTES.collection.increment(':id'), authMiddleware, (req, res) =>
    collectionController.increment(req, res),
  );
  app.post(API_ROUTES.collection.decrement(':id'), authMiddleware, (req, res) =>
    collectionController.decrement(req, res),
  );
  app.put(API_ROUTES.collection.sticker(':id'), authMiddleware, (req, res) =>
    collectionController.setCount(req, res),
  );
  app.post(API_ROUTES.collection.register, authMiddleware, (req, res) =>
    collectionController.registerByCode(req, res),
  );

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  return app;
}
