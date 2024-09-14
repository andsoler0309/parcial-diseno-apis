import { Test, TestingModule } from '@nestjs/testing';
import { StoreService } from './store.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { StoreEntity } from './store.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('StoreService', () => {
  let service: StoreService;
  let repository: Repository<StoreEntity>;
  let storeList: StoreEntity[] = [];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [StoreService],
    }).compile();

    service = module.get<StoreService>(StoreService);
    repository = module.get<Repository<StoreEntity>>(
      getRepositoryToken(StoreEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    await repository.clear();
    storeList = [];
    for (let i = 0; i < 5; i++) {
      const store: StoreEntity = await repository.save({
        id: faker.string.uuid(),
        name: faker.company.name(),
        city: faker.string.alpha({ length: 3 }).toUpperCase(),
        address: faker.location.streetAddress(),
        products: [],
      });
      storeList.push(store);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find all stores', async () => {
    const stores: StoreEntity[] = await service.findAll();
    expect(stores).not.toBeNull();
    expect(stores.length).toBe(storeList.length);
  });

  it('findOne should return a store by id', async () => {
    const storedStore: StoreEntity = storeList[0];
    const store: StoreEntity = await service.findOne(storedStore.id);
    expect(store).not.toBeNull();
    expect(store.id).toBe(storedStore.id);
  });

  it('findOne should throw an error if the store does not exist', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The store with the provided id does not exist',
    );
  });

  it('create should create a store', async () => {
    const store: StoreEntity = await service.create({
      id: faker.string.uuid(),
      name: faker.company.name(),
      city: faker.string.alpha({ length: 3 }).toUpperCase(),
      address: faker.location.streetAddress(),
      products: [],
    });
    expect(store).not.toBeNull();
    expect(store.id).not.toBeNull();

    const storedStore: StoreEntity = await repository.findOne({
      where: { id: store.id },
    });
    expect(storedStore).not.toBeNull();
    expect(storedStore.id).toBe(store.id);
  });

  it('create should throw an error if the city is invalid', async () => {
    await expect(() =>
      service.create({
        id: faker.string.uuid(),
        name: faker.company.name(),
        city: faker.location.city(),
        address: faker.location.streetAddress(),
        products: [],
      }),
    ).rejects.toHaveProperty('message', 'Invalid city');
  });

  it('update should update a store', async () => {
    const store: StoreEntity = storeList[0];
    store.city = faker.string.alpha({ length: 3 }).toUpperCase();
    const updatedStore: StoreEntity = await service.update(store.id, store);
    expect(updatedStore).not.toBeNull();
    expect(updatedStore.id).toBe(store.id);

    const storedStore: StoreEntity = await repository.findOne({
      where: { id: store.id },
    });
    expect(storedStore).not.toBeNull();
    expect(storedStore.id).toBe(store.id);
  });

  it('update should throw an error if the city is invalid', async () => {
    const store: StoreEntity = storeList[0];
    store.city = faker.location.city();
    await expect(() => service.update(store.id, store)).rejects.toHaveProperty(
      'message',
      'Invalid city',
    );
  });

  it('update should throw an error if the store does not exist', async () => {
    await expect(() =>
      service.update('0', {
        id: faker.string.uuid(),
        name: faker.company.name(),
        city: faker.string.alpha({ length: 3 }).toUpperCase(),
        address: faker.location.streetAddress(),
        products: [],
      }),
    ).rejects.toHaveProperty(
      'message',
      'The store with the provided id does not exist',
    );
  });

  it('delete should remove a store', async () => {
    const store: StoreEntity = storeList[0];
    await service.remove(store.id);
    const storedStore: StoreEntity = await repository.findOne({
      where: { id: store.id },
    });
    expect(storedStore).toBeNull();
  });

  it('delete should throw an error if the store does not exist', async () => {
    await expect(() => service.remove('0')).rejects.toHaveProperty(
      'message',
      'The store with the provided id does not exist',
    );
  });
});
