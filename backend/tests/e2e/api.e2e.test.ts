import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';
import { API_ROUTES } from '@album/common';
import { createTestCatalogRepository } from '../helpers/testCatalog.js';
import { Factory } from '../../src/shared/Factory.js';
import { createServer } from '../../src/shared/Server.js';

describe('API e2e', () => {
  const originalDevUserId = process.env.DEV_USER_ID;

  beforeEach(() => {
    Factory.reset();
    Factory.configure({
      useInMemoryCatalog: true,
      useInMemoryCollection: true,
      catalogRepository: createTestCatalogRepository(),
    });
    process.env.DEV_USER_ID = 'test-user';
  });

  afterEach(() => {
    Factory.reset();
    if (originalDevUserId === undefined) {
      delete process.env.DEV_USER_ID;
    } else {
      process.env.DEV_USER_ID = originalDevUserId;
    }
  });

  it('reports healthy status for deploy healthchecks', async () => {
    const app = createServer();
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });

  it('lists catalog stickers publicly', async () => {
    const app = createServer();
    const response = await request(app).get(API_ROUTES.catalog.stickers);
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(5);
    expect(response.body[0]).toHaveProperty('countryName');
  });

  it('filters stickers by group query param', async () => {
    const app = createServer();
    const response = await request(app).get(`${API_ROUTES.catalog.stickers}?group=Grupo%20A`);
    expect(response.status).toBe(200);
    expect(response.body.every((s: { group: string }) => s.group === 'Grupo A')).toBe(true);
  });

  it('lists countries and groups', async () => {
    const app = createServer();
    const countries = await request(app).get(API_ROUTES.catalog.countries);
    const groups = await request(app).get(API_ROUTES.catalog.groups);
    expect(countries.status).toBe(200);
    expect(countries.body).toHaveLength(2);
    expect(groups.status).toBe(200);
    expect(groups.body.length).toBeGreaterThan(0);
  });

  it('searches stickers by id via search query param', async () => {
    const app = createServer();
    const response = await request(app).get(`${API_ROUTES.catalog.stickers}?search=mex`);
    expect(response.status).toBe(200);
    expect(response.body.map((s: { id: string }) => s.id)).toEqual(['MEX1', 'MEX2']);
  });

  it('searches stickers by name via search query param', async () => {
    const app = createServer();
    const response = await request(app).get(`${API_ROUTES.catalog.stickers}?search=yamal`);
    expect(response.status).toBe(200);
    expect(response.body.map((s: { id: string }) => s.id)).toEqual(['CC1']);
  });

  it('falls back to dev auth when bearer token is invalid', async () => {
    const app = createServer();
    const response = await request(app)
      .get(API_ROUTES.collection.root)
      .set('Authorization', 'Bearer invalid-token');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('requires auth for collection when DEV_USER_ID is unset', async () => {
    delete process.env.DEV_USER_ID;
    const app = createServer();
    const response = await request(app).get(API_ROUTES.collection.root);
    expect(response.status).toBe(401);
  });

  it('manages collection with dev auth', async () => {
    const app = createServer();

    const increment = await request(app).post(API_ROUTES.collection.increment('MEX1'));
    expect(increment.status).toBe(200);
    expect(increment.body).toEqual({ stickerId: 'MEX1', count: 1 });

    const collection = await request(app).get(API_ROUTES.collection.root);
    expect(collection.body).toEqual([{ stickerId: 'MEX1', count: 1 }]);

    const progress = await request(app).get(API_ROUTES.collection.progress);
    expect(progress.body.owned).toBe(1);

    const stickers = await request(app).get(API_ROUTES.catalog.stickers);
    const mex1 = stickers.body.find((s: { id: string }) => s.id === 'MEX1');
    expect(mex1.count).toBe(1);

    const decrement = await request(app).post(API_ROUTES.collection.decrement('MEX1'));
    expect(decrement.body.count).toBe(0);

    const setCount = await request(app)
      .put(API_ROUTES.collection.sticker('MEX2'))
      .send({ count: 5 });
    expect(setCount.body).toEqual({ stickerId: 'MEX2', count: 5 });
  });

  it('registers stickers by comma-separated codes', async () => {
    const app = createServer();

    const register = await request(app)
      .post(API_ROUTES.collection.register)
      .send({ codes: 'MEX1, MEX2' });

    expect(register.status).toBe(200);
    expect(register.body).toEqual({
      updated: [
        { stickerId: 'MEX1', count: 1 },
        { stickerId: 'MEX2', count: 1 },
      ],
      unknownCodes: [],
    });

    const collection = await request(app).get(API_ROUTES.collection.root);
    expect(collection.body).toEqual(
      expect.arrayContaining([
        { stickerId: 'MEX1', count: 1 },
        { stickerId: 'MEX2', count: 1 },
      ]),
    );
  });

  it('reports unknown codes when registering by code', async () => {
    const app = createServer();

    const register = await request(app)
      .post(API_ROUTES.collection.register)
      .send({ codes: 'MEX1, NOTREAL' });

    expect(register.status).toBe(200);
    expect(register.body).toEqual({
      updated: [{ stickerId: 'MEX1', count: 1 }],
      unknownCodes: ['NOTREAL'],
    });
  });

  it('rejects empty codes when registering by code', async () => {
    const app = createServer();

    const register = await request(app)
      .post(API_ROUTES.collection.register)
      .send({ codes: '   ' });

    expect(register.status).toBe(422);
  });

  it('requires auth for register by code when DEV_USER_ID is unset', async () => {
    delete process.env.DEV_USER_ID;
    const app = createServer();

    const register = await request(app)
      .post(API_ROUTES.collection.register)
      .send({ codes: 'MEX1' });

    expect(register.status).toBe(401);
  });
});
