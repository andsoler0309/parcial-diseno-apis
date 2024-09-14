import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { TiendaEntity } from '../tienda/tienda.entity';

@Entity()
export class ProductoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column('decimal')
  precio: number;

  @Column()
  tipo: string;

  @ManyToMany(() => TiendaEntity, (tienda) => tienda.productos)
  @JoinTable()
  tiendas: TiendaEntity[];
}
