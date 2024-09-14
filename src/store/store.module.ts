import { Module } from '@nestjs/common';
import { StoreEntity } from './store.entity';
import { StoreService } from './store.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([StoreEntity])],
  providers: [StoreService],
})
export class StoreModule {}
