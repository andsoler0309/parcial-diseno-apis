import { Module } from '@nestjs/common';
import { ProductoEntity } from './producto.entity';

@Module({
  imports: [ProductoEntity],
})
export class ProductoModule {}
