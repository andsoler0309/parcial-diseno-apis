import { Module } from '@nestjs/common';
import { ProductStoreService } from './product-store.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from '../product/product.entity';
import { StoreEntity } from '../store/store.entity';

@Module({
  providers: [ProductStoreService],
  imports: [TypeOrmModule.forFeature([ProductEntity, StoreEntity])],
})
export class ProductStoreModule {}
