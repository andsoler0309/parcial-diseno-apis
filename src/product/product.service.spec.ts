import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductEntity } from './product.entity';
import { faker } from '@faker-js/faker';

describe('ProductService', () => {
  let service: ProductService;
  let repository: Repository<ProductEntity>;
  let productList: ProductEntity[] = [];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ProductService],
    }).compile();

    service = module.get<ProductService>(ProductService);
    repository = module.get<Repository<ProductEntity>>(
      getRepositoryToken(ProductEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    await repository.clear();
    productList = [];
    for (let i = 0; i < 5; i++) {
      const product: ProductEntity = await repository.save({
        id: faker.string.uuid(),
        name: faker.company.name(),
        price: parseFloat(faker.commerce.price()),
        type: faker.helpers.arrayElement(['Perecedero', 'No perecedero']),
        stores: [],
      });
      productList.push(product);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find all products', async () => {
    const products: ProductEntity[] = await service.findAll();
    expect(products).not.toBeNull();
    expect(products.length).toBe(productList.length);
  });

  it('findOne should return a product by id', async () => {
    const storedProduct: ProductEntity = productList[0];
    const product: ProductEntity = await service.findOne(storedProduct.id);
    expect(product).not.toBeNull();
    expect(product.id).toBe(storedProduct.id);
  });

  it('findOne should throw an error if the product does not exist', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The product with the provided id does not exist',
    );
  });

  it('create should create a product', async () => {
    const product: ProductEntity = await service.create({
      id: faker.string.uuid(),
      name: faker.company.name(),
      price: parseFloat(faker.commerce.price()),
      type: faker.helpers.arrayElement(['Perecedero', 'No perecedero']),
      stores: [],
    });
    expect(product).not.toBeNull();
    expect(product.id).not.toBeNull();

    const storedProduct: ProductEntity = await repository.findOne({
      where: { id: product.id },
    });
    expect(storedProduct).not.toBeNull();
    expect(storedProduct.id).toBe(product.id);
  });

  it('create should throw an error if the product type is invalid', async () => {
    await expect(() =>
      service.create({
        id: faker.string.uuid(),
        name: faker.company.name(),
        price: parseFloat(faker.commerce.price()),
        type: 'Invalid type',
        stores: [],
      }),
    ).rejects.toHaveProperty('message', 'Invalid product type');
  });

  it('update should update a product', async () => {
    const product: ProductEntity = productList[0];
    const updatedProduct: ProductEntity = await service.update(product.id, {
      ...product,
      name: faker.company.name(),
    });

    expect(updatedProduct).not.toBeNull();
    expect(updatedProduct.id).toBe(product.id);
    const storedProduct: ProductEntity = await repository.findOne({
      where: { id: product.id },
    });

    expect(storedProduct).not.toBeNull();
    expect(storedProduct.id).toBe(product.id);
  });

  it('update should throw an error if the product does not exist', async () => {
    await expect(() =>
      service.update('0', {
        id: faker.string.uuid(),
        name: faker.company.name(),
        price: parseFloat(faker.commerce.price()),
        type: faker.helpers.arrayElement(['Perecedero', 'No perecedero']),
        stores: [],
      }),
    ).rejects.toHaveProperty(
      'message',
      'The product with the provided id does not exist',
    );
  });

  it('update should throw an error if the product type is invalid', async () => {
    const product: ProductEntity = productList[0];
    await expect(() =>
      service.update(product.id, {
        ...product,
        type: 'Invalid type',
      }),
    ).rejects.toHaveProperty('message', 'Invalid product type');
  });

  it('remove should delete a product', async () => {
    const product: ProductEntity = productList[0];
    await service.remove(product.id);

    const storedProduct: ProductEntity = await repository.findOne({
      where: { id: product.id },
    });
    expect(storedProduct).toBeNull();
  });

  it('remove should throw an error if the product does not exist', async () => {
    await expect(() => service.remove('0')).rejects.toHaveProperty(
      'message',
      'The product with the provided id does not exist',
    );
  });
});
