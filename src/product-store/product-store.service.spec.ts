import { Test, TestingModule } from '@nestjs/testing';
import { ProductStoreService } from './product-store.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
// import { StoreEntity } from '../store/store.entity';
// import { Repository } from 'typeorm';
// import { ProductEntity } from 'src/product/product.entity';

describe('ProductStoreService', () => {
  let service: ProductStoreService;
  // let storeRepository: Repository<StoreEntity>;
  // let productRepository: Repository<ProductEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ProductStoreService],
    }).compile();

    service = module.get<ProductStoreService>(ProductStoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
