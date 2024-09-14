import { Module } from '@nestjs/common';
import { TiendaEntity } from './tienda.entity';

@Module({
  imports: [TiendaEntity],
})
export class TiendaModule {}
