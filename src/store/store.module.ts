import { Module } from '@nestjs/common';
import { StoreEntity } from './store.entity';
import { StoreService } from './store.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreController } from './store.controller';

@Module({
  imports: [TypeOrmModule.forFeature([StoreEntity])],
  providers: [StoreService],
  controllers: [StoreController],
})
export class StoreModule {}
