import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseInterceptors,
  Logger,
} from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { ProductStoreService } from './product-store.service';
import { plainToInstance } from 'class-transformer';
import { StoreDto } from 'src/store/store.dto';
import { StoreEntity } from 'src/store/store.entity';

@Controller('products/:productId/stores')
@UseInterceptors(BusinessErrorsInterceptor)
export class ProductStoreController {
  private readonly logger = new Logger(ProductStoreController.name);

  constructor(private readonly productStoreService: ProductStoreService) {}

  @Post(':storeId')
  async addStoreToProduct(
    @Param('productId') productId: string,
    @Param('storeId') storeId: string,
  ) {
    return await this.productStoreService.addStoreToProduct(productId, storeId);
  }

  @Get()
  async findStoresFromProduct(@Param('productId') productId: string) {
    return await this.productStoreService.findStoresFromProduct(productId);
  }

  @Get(':storeId')
  async findStoreFromProduct(
    @Param('productId') productId: string,
    @Param('storeId') storeId: string,
  ) {
    return await this.productStoreService.findStoreFromProduct(
      productId,
      storeId,
    );
  }

  @Put()
  async updateStoresFromProduct(
    @Param('productId') productId: string,
    @Body() storeDto: StoreDto[],
  ) {
    const store: StoreEntity[] = plainToInstance(StoreEntity, storeDto);
    return await this.productStoreService.updateStoresFromProduct(
      productId,
      store,
    );
  }

  @Delete()
  @HttpCode(204)
  async removeStoresFromProduct(
    @Param('productId') productId: string,
    @Body() storeDto: StoreDto[],
  ) {
    const stores: StoreEntity[] = plainToInstance(StoreEntity, storeDto);

    for (const store of stores) {
      await this.productStoreService.removeStoreFromProduct(
        productId,
        store.id,
      );
    }
  }

  @Delete(':storeId')
  @HttpCode(204)
  async removeStoreFromProduct(
    @Param('productId') productId: string,
    @Param('storeId') storeId: string,
  ) {
    return await this.productStoreService.removeStoreFromProduct(
      productId,
      storeId,
    );
  }
}
