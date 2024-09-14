import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { ProductoEntity } from '../producto/producto.entity';

@Entity()
export class TiendaEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  ciudad: string;

  @Column()
  direccion: string;

  @ManyToMany(() => ProductoEntity, (producto) => producto.tiendas)
  productos: ProductoEntity[];
}
