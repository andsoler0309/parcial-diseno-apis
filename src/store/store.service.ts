import { Injectable } from '@nestjs/common';
import { StoreEntity } from './store.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(StoreEntity)
    private readonly storeRepository: Repository<StoreEntity>,
  ) {}

  async findAll(): Promise<StoreEntity[]> {
    return await this.storeRepository.find({ relations: ['products'] });
  }

  async findOne(id: string): Promise<StoreEntity> {
    const store: StoreEntity = await this.storeRepository.findOne({
      where: { id },
      relations: ['products'],
    });
    if (!store) {
      throw new BusinessLogicException(
        'The store with the provided id does not exist',
        BusinessError.NOT_FOUND,
      );
    }
    return store;
  }

  async create(store: StoreEntity): Promise<StoreEntity> {
    if (!/^[A-Z]{3}$/.test(store.city)) {
      throw new BusinessLogicException(
        'Invalid city',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    return this.storeRepository.save(store);
  }

  async update(id: string, store: StoreEntity): Promise<StoreEntity> {
    const storeToUpdate: StoreEntity = await this.findOne(id);
    if (!storeToUpdate) {
      throw new BusinessLogicException(
        'The store with the provided id does not exist',
        BusinessError.NOT_FOUND,
      );
    }

    if (!/^[A-Z]{3}$/.test(store.city)) {
      throw new BusinessLogicException(
        'Invalid city',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    return this.storeRepository.save(store);
  }

  async remove(id: string): Promise<void> {
    const store: StoreEntity = await this.findOne(id);
    if (!store) {
      throw new BusinessLogicException(
        'The store with the provided id does not exist',
        BusinessError.NOT_FOUND,
      );
    }

    await this.storeRepository.delete(id);
  }
}
