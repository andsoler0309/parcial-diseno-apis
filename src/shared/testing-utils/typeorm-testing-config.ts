import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from '../../product/product.entity';
import { StoreEntity } from '../../store/store.entity';

export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [StoreEntity, ProductEntity],
    synchronize: true,
    keepConnectionAlive: true,
  }),
  TypeOrmModule.forFeature([StoreEntity, ProductEntity]),
];
