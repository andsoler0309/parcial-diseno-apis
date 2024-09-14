import { Module } from '@nestjs/common';
import { ProductEntity } from './product.entity';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity])],
  providers: [ProductService],
})
export class ProductModule {}
