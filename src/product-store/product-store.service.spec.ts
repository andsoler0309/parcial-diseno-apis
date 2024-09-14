import { Test, TestingModule } from '@nestjs/testing';
import { ProductStoreService } from './product-store.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { StoreEntity } from '../store/store.entity';
import { Repository } from 'typeorm';
import { ProductEntity } from '../product/product.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('ProductStoreService', () => {
  let service: ProductStoreService;
  let storeRepository: Repository<StoreEntity>;
  let productRepository: Repository<ProductEntity>;
  let product: ProductEntity;
  let storeList: StoreEntity[] = [];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ProductStoreService],
    }).compile();

    service = module.get<ProductStoreService>(ProductStoreService);
    storeRepository = module.get<Repository<StoreEntity>>(
      getRepositoryToken(StoreEntity),
    );
    productRepository = module.get<Repository<ProductEntity>>(
      getRepositoryToken(ProductEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    await storeRepository.clear();
    await productRepository.clear();
    storeList = [];

    for (let i = 0; i < 5; i++) {
      const store: StoreEntity = await storeRepository.save({
        id: faker.string.uuid(),
        name: faker.company.name(),
        city: faker.string.alpha({ length: 3 }).toUpperCase(),
        address: faker.location.streetAddress(),
        products: [],
      });
      storeList.push(store);
    }

    product = await productRepository.save({
      id: faker.string.uuid(),
      name: faker.company.name(),
      price: parseFloat(faker.commerce.price()),
      type: faker.helpers.arrayElement(['Perecedero', 'No perecedero']),
      stores: storeList,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addStoreToProduct should add a store to a product', async () => {
    const newStore: StoreEntity = await storeRepository.save({
      id: faker.string.uuid(),
      name: faker.company.name(),
      city: faker.string.alpha({ length: 3 }).toUpperCase(),
      address: faker.location.streetAddress(),
      products: [],
    });

    const newProduct: ProductEntity = await productRepository.save({
      id: faker.string.uuid(),
      name: faker.company.name(),
      price: parseFloat(faker.commerce.price()),
      type: faker.helpers.arrayElement(['Perecedero', 'No perecedero']),
      stores: [],
    });

    const result: ProductEntity = await service.addStoreToProduct(
      newStore.id,
      newProduct.id,
    );

    expect(result.stores.length).toBe(1);
    expect(result.stores[0].id).toBe(newStore.id);
    expect(result.stores[0].name).toBe(newStore.name);
  });

  it('addStoreToProduct should throw an error if the store does not exist', async () => {
    await expect(() =>
      service.addStoreToProduct('0', product.id),
    ).rejects.toHaveProperty(
      'message',
      'The store with the provided id does not exist',
    );
  });

  it('addStoreToProduct should throw an error if the product does not exist', async () => {
    await expect(() =>
      service.addStoreToProduct(storeList[0].id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The product with the provided id does not exist',
    );
  });

  it('findStoresFromProduct should return the stores from a product', async () => {
    const result: StoreEntity[] = await service.findStoresFromProduct(
      product.id,
    );

    expect(result.length).toBe(5);
  });

  it('findStoresFromProduct should throw an error for an invalid product', async () => {
    await expect(() =>
      service.findStoresFromProduct('0'),
    ).rejects.toHaveProperty(
      'message',
      'The product with the provided id does not exist',
    );
  });

  it('findStoreFromProduct should return a store from a product', async () => {
    const result: StoreEntity = await service.findStoreFromProduct(
      product.id,
      storeList[0].id,
    );

    expect(result).not.toBeNull();
    expect(result.id).toBe(storeList[0].id);
    expect(result.name).toBe(storeList[0].name);
  });

  it('findStoreFromProduct should throw an error for an invalid store', async () => {
    await expect(() =>
      service.findStoreFromProduct(product.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The store with the provided id does not exist',
    );
  });

  it('findStoreFromProduct shoudl throw an error or a non-associated store', async () => {
    const newStore: StoreEntity = await storeRepository.save({
      id: faker.string.uuid(),
      name: faker.company.name(),
      city: faker.string.alpha({ length: 3 }).toUpperCase(),
      address: faker.location.streetAddress(),
      products: [],
    });

    await expect(() =>
      service.findStoreFromProduct(product.id, newStore.id),
    ).rejects.toHaveProperty(
      'message',
      'The store with the provided id does not exist',
    );
  });

  it('updateStoresFromProduct should update the stores from a product', async () => {
    const newStoresList: StoreEntity[] = [];
    for (let i = 0; i < 3; i++) {
      const store: StoreEntity = await storeRepository.save({
        id: faker.string.uuid(),
        name: faker.company.name(),
        city: faker.string.alpha({ length: 3 }).toUpperCase(),
        address: faker.location.streetAddress(),
        products: [],
      });
      newStoresList.push(store);
    }

    const updatedProduct: ProductEntity = await service.updateStoresFromProduct(
      product.id,
      newStoresList,
    );

    expect(updatedProduct.stores.length).toBe(3);
    expect(updatedProduct.stores[0].id).toBe(newStoresList[0].id);
    expect(updatedProduct.stores[1].id).toBe(newStoresList[1].id);
    expect(updatedProduct.stores[2].id).toBe(newStoresList[2].id);
  });

  it('updateStoresFromProduct should throw an error for an invalid product', async () => {
    await expect(() =>
      service.updateStoresFromProduct('0', storeList),
    ).rejects.toHaveProperty(
      'message',
      'The product with the provided id does not exist',
    );
  });

  it('updateStoresFromProduct should throw an error for an invalid store', async () => {
    const newStoresList: StoreEntity[] = [];
    for (let i = 0; i < 3; i++) {
      const store: StoreEntity = await storeRepository.save({
        id: faker.string.uuid(),
        name: faker.company.name(),
        city: faker.string.alpha({ length: 3 }).toUpperCase(),
        address: faker.location.streetAddress(),
        products: [],
      });
      newStoresList.push(store);
    }

    newStoresList[0].id = '0';

    await expect(() =>
      service.updateStoresFromProduct(product.id, newStoresList),
    ).rejects.toHaveProperty(
      'message',
      'The store with the provided id does not exist',
    );
  });

  it('deleteStoreFromProduct should delete a store from a product', async () => {
    const result: ProductEntity = await service.removeStoreFromProduct(
      product.id,
      storeList[0].id,
    );

    expect(result.stores.length).toBe(4);
    expect(result.stores[0].id).not.toBe(storeList[0].id);
  });

  it('deleteStoreFromProduct should throw an error for an invalid product', async () => {
    await expect(() =>
      service.removeStoreFromProduct('0', storeList[0].id),
    ).rejects.toHaveProperty(
      'message',
      'The product with the provided id does not exist',
    );
  });

  it('deleteStoreFromProduct should throw an error for an invalid store', async () => {
    await expect(() =>
      service.removeStoreFromProduct(product.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The store with the provided id does not exist',
    );
  });

  it('deleteStoreFromProduct should throw an error for a non-associated store', async () => {
    const newStore: StoreEntity = await storeRepository.save({
      id: faker.string.uuid(),
      name: faker.company.name(),
      city: faker.string.alpha({ length: 3 }).toUpperCase(),
      address: faker.location.streetAddress(),
      products: [],
    });

    await expect(() =>
      service.removeStoreFromProduct(product.id, newStore.id),
    ).rejects.toHaveProperty(
      'message',
      'The store with the provided id does not exist',
    );
  });
});
