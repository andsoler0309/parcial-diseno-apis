import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StoreEntity } from '../store/store.entity';
import { ProductEntity } from '../product/product.entity';
import {
  BusinessLogicException,
  BusinessError,
} from '../shared/errors/business-errors';

@Injectable()
export class ProductStoreService {
  constructor(
    @InjectRepository(StoreEntity)
    private readonly storeRepository: Repository<StoreEntity>,
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  async addStoreToProduct(
    storeId: string,
    productId: string,
  ): Promise<ProductEntity> {
    const store: StoreEntity = await this.storeRepository.findOne({
      where: { id: storeId },
      relations: ['products'],
    });
    if (!store) {
      throw new BusinessLogicException(
        'The store with the provided id does not exist',
        BusinessError.NOT_FOUND,
      );
    }

    const product: ProductEntity = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['stores'],
    });
    if (!product) {
      throw new BusinessLogicException(
        'The product with the provided id does not exist',
        BusinessError.NOT_FOUND,
      );
    }

    product.stores.push(store);
    return this.productRepository.save(product);
  }

  async findStoresFromProduct(productId: string): Promise<StoreEntity[]> {
    const product: ProductEntity = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['stores'],
    });
    if (!product) {
      throw new BusinessLogicException(
        'The product with the provided id does not exist',
        BusinessError.NOT_FOUND,
      );
    }

    return product.stores;
  }

  async findStoreFromProduct(
    productId: string,
    storeId: string,
  ): Promise<StoreEntity> {
    const product: ProductEntity = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['stores'],
    });
    if (!product) {
      throw new BusinessLogicException(
        'The product with the provided id does not exist',
        BusinessError.NOT_FOUND,
      );
    }

    const store: StoreEntity = product.stores.find(
      (store) => store.id === storeId,
    );
    if (!store) {
      throw new BusinessLogicException(
        'The store with the provided id does not exist',
        BusinessError.NOT_FOUND,
      );
    }

    return store;
  }

  async updateStoresFromProduct(
    productId: string,
    stores: StoreEntity[],
  ): Promise<ProductEntity> {
    const product: ProductEntity = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['stores'],
    });
    if (!product) {
      throw new BusinessLogicException(
        'The product with the provided id does not exist',
        BusinessError.NOT_FOUND,
      );
    }

    for (const store of stores) {
      if (!store.id) {
        throw new BusinessLogicException(
          'The store id is required',
          BusinessError.UNPROCESSABLE_ENTITY,
        );
      }
      const storeExists: StoreEntity = await this.storeRepository.findOne({
        where: { id: store.id },
      });
      if (!storeExists) {
        throw new BusinessLogicException(
          'The store with the provided id does not exist',
          BusinessError.NOT_FOUND,
        );
      }
    }

    product.stores = stores;
    return this.productRepository.save(product);
  }

  async removeStoreFromProduct(
    productId: string,
    storeId: string,
  ): Promise<ProductEntity> {
    const product: ProductEntity = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['stores'],
    });
    if (!product) {
      throw new BusinessLogicException(
        'The product with the provided id does not exist',
        BusinessError.NOT_FOUND,
      );
    }

    const storeIndex: number = product.stores.findIndex(
      (store) => store.id === storeId,
    );
    if (storeIndex === -1) {
      throw new BusinessLogicException(
        'The store with the provided id does not exist',
        BusinessError.NOT_FOUND,
      );
    }

    product.stores.splice(storeIndex, 1);
    return this.productRepository.save(product);
  }
}
