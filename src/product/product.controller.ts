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
import { ProductService } from './product.service';
import { ProductDto } from './product.dto';
import { ProductEntity } from './product.entity';
import { plainToInstance } from 'class-transformer';

@Controller('products')
@UseInterceptors(BusinessErrorsInterceptor)
export class ProductController {
  private readonly logger = new Logger(ProductController.name);

  constructor(private readonly productService: ProductService) {}

  @Get()
  async findAll() {
    return await this.productService.findAll();
  }

  @Get(':productId')
  async findOne(@Param('productId') productId: string) {
    return await this.productService.findOne(productId);
  }

  @Post()
  async create(@Body() productDto: ProductDto) {
    const product: ProductEntity = plainToInstance(ProductEntity, productDto);
    return await this.productService.create(product);
  }

  @Put(':productId')
  async update(
    @Param('productId') productId: string,
    @Body() productDto: ProductDto,
  ) {
    const product: ProductEntity = plainToInstance(ProductEntity, productDto);
    return await this.productService.update(productId, product);
  }

  @Delete(':productId')
  @HttpCode(204)
  async remove(@Param('productId') productId: string) {
    return await this.productService.remove(productId);
  }
}
