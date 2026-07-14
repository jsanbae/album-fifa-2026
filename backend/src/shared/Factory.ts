import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { readSupabaseEnv } from './supabaseEnv.js';
import { ListCountriesUseCase } from '../catalog/application/ListCountriesUseCase.js';
import { ListGroupsUseCase } from '../catalog/application/ListGroupsUseCase.js';
import { ListStickersUseCase } from '../catalog/application/ListStickersUseCase.js';
import { JsonFileCatalogRepository } from '../catalog/infrastructure/adapters/JsonFileCatalogRepository.js';
import { CatalogController } from '../catalog/infrastructure/http/CatalogController.js';
import type { CatalogRepository } from '../catalog/domain/repositories/CatalogRepository.js';
import { InMemoryCatalogRepository } from '../catalog/domain/repositories/InMemoryCatalogRepository.js';
import { GetCollectionProgressUseCase } from '../collection/application/GetCollectionProgressUseCase.js';
import { GetCollectionUseCase } from '../collection/application/GetCollectionUseCase.js';
import { IncrementStickerCountUseCase } from '../collection/application/IncrementStickerCountUseCase.js';
import { DecrementStickerCountUseCase } from '../collection/application/DecrementStickerCountUseCase.js';
import { RegisterStickersByCodeUseCase } from '../collection/application/RegisterStickersByCodeUseCase.js';
import { SetStickerCountUseCase } from '../collection/application/SetStickerCountUseCase.js';
import { InMemoryCollectionRepository } from '../collection/domain/repositories/InMemoryCollectionRepository.js';
import type { CollectionRepository } from '../collection/domain/repositories/CollectionRepository.js';
import { SupabaseCollectionRepository } from '../collection/infrastructure/adapters/SupabaseCollectionRepository.js';
import { CollectionController } from '../collection/infrastructure/http/CollectionController.js';

export interface FactoryConfig {
  useInMemoryCatalog?: boolean;
  useInMemoryCollection?: boolean;
  catalogRepository?: CatalogRepository;
  collectionRepository?: CollectionRepository;
  dataDir?: string;
}

export class Factory {
  private static catalogRepository?: CatalogRepository;
  private static collectionRepository?: CollectionRepository;
  private static supabaseClient?: SupabaseClient;
  private static config: FactoryConfig = {};

  static configure(config: FactoryConfig): void {
    this.config = config;
    this.catalogRepository = config.catalogRepository;
    this.collectionRepository = config.collectionRepository;
  }

  static reset(): void {
    this.config = {};
    this.catalogRepository = undefined;
    this.collectionRepository = undefined;
    this.supabaseClient = undefined;
  }

  private static getCatalogRepository(): CatalogRepository {
    if (!this.catalogRepository) {
      if (this.config.catalogRepository) {
        this.catalogRepository = this.config.catalogRepository;
      } else if (this.config.useInMemoryCatalog) {
        this.catalogRepository = InMemoryCatalogRepository.empty();
      } else {
        this.catalogRepository = JsonFileCatalogRepository.create(this.config.dataDir);
      }
    }
    return this.catalogRepository;
  }

  private static getSupabaseClient(): SupabaseClient | undefined {
    if (this.supabaseClient) {
      return this.supabaseClient;
    }

    const { url: supabaseUrl, publishableKey, secretKey } = readSupabaseEnv();
    const key = secretKey ?? publishableKey;

    if (!supabaseUrl || !key) {
      return undefined;
    }

    this.supabaseClient = createClient(supabaseUrl, key);
    return this.supabaseClient;
  }

  private static getCollectionRepository(): CollectionRepository {
    if (!this.collectionRepository) {
      if (this.config.collectionRepository) {
        this.collectionRepository = this.config.collectionRepository;
      } else if (this.config.useInMemoryCollection) {
        this.collectionRepository = new InMemoryCollectionRepository();
      } else {
        const supabase = this.getSupabaseClient();
        if (supabase) {
          this.collectionRepository = new SupabaseCollectionRepository(supabase);
        } else {
          this.collectionRepository = new InMemoryCollectionRepository();
        }
      }
    }
    return this.collectionRepository;
  }

  static createListStickersUseCase(): ListStickersUseCase {
    return new ListStickersUseCase(this.getCatalogRepository());
  }

  static createListCountriesUseCase(): ListCountriesUseCase {
    return new ListCountriesUseCase(this.getCatalogRepository());
  }

  static createListGroupsUseCase(): ListGroupsUseCase {
    return new ListGroupsUseCase(this.getCatalogRepository());
  }

  static createGetCollectionUseCase(): GetCollectionUseCase {
    return new GetCollectionUseCase(this.getCollectionRepository());
  }

  static createGetCollectionProgressUseCase(): GetCollectionProgressUseCase {
    return new GetCollectionProgressUseCase(
      this.getCollectionRepository(),
      this.getCatalogRepository(),
    );
  }

  static createIncrementStickerCountUseCase(): IncrementStickerCountUseCase {
    return new IncrementStickerCountUseCase(this.getCollectionRepository());
  }

  static createDecrementStickerCountUseCase(): DecrementStickerCountUseCase {
    return new DecrementStickerCountUseCase(this.getCollectionRepository());
  }

  static createSetStickerCountUseCase(): SetStickerCountUseCase {
    return new SetStickerCountUseCase(this.getCollectionRepository());
  }

  static createRegisterStickersByCodeUseCase(): RegisterStickersByCodeUseCase {
    return new RegisterStickersByCodeUseCase(
      this.getCollectionRepository(),
      this.getCatalogRepository(),
    );
  }

  static createCatalogController(): CatalogController {
    return new CatalogController(
      this.createListStickersUseCase(),
      this.createListCountriesUseCase(),
      this.createListGroupsUseCase(),
      this.createGetCollectionUseCase(),
    );
  }

  static createCollectionController(): CollectionController {
    return new CollectionController(
      this.createGetCollectionUseCase(),
      this.createGetCollectionProgressUseCase(),
      this.createIncrementStickerCountUseCase(),
      this.createDecrementStickerCountUseCase(),
      this.createSetStickerCountUseCase(),
      this.createRegisterStickersByCodeUseCase(),
    );
  }
}
