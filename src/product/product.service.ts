import { Injectable } from '@nestjs/common';
import { ProductEntity } from './product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  async findAll(): Promise<ProductEntity[]> {
    return await this.productRepository.find({ relations: ['stores'] });
  }

  async findOne(id: string): Promise<ProductEntity> {
    const product: ProductEntity = await this.productRepository.findOne({
      where: { id },
      relations: ['stores'],
    });
    if (!product) {
      throw new BusinessLogicException(
        'The product with the provided id does not exist',
        BusinessError.NOT_FOUND,
      );
    }
    return product;
  }

  async create(product: ProductEntity): Promise<ProductEntity> {
    if (!['Perecedero', 'No perecedero'].includes(product.type)) {
      throw new BusinessLogicException(
        'Invalid product type',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    return this.productRepository.save(product);
  }

  async update(id: string, product: ProductEntity): Promise<ProductEntity> {
    const productToUpate: ProductEntity = await this.findOne(id);
    if (!productToUpate) {
      throw new BusinessLogicException(
        'The product with the provided id does not exist',
        BusinessError.NOT_FOUND,
      );
    }

    if (!['Perecedero', 'No perecedero'].includes(product.type)) {
      throw new BusinessLogicException(
        'Invalid product type',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    return this.productRepository.save({ ...productToUpate, ...product });
  }

  async remove(id: string): Promise<void> {
    const productToRemove: ProductEntity = await this.findOne(id);
    if (!productToRemove) {
      throw new BusinessLogicException(
        'The product with the provided id does not exist',
        BusinessError.NOT_FOUND,
      );
    }
    await this.productRepository.remove(productToRemove);
  }
}
