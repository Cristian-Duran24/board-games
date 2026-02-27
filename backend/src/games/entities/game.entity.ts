import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Category } from 'src/categories/entities/category.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Game {
  @PrimaryGeneratedColumn('increment')
  @Field(() => Int)
  id: number;

  @Column()
  @Field(() => String)
  title: string;

  @ManyToOne(() => Category, (category) => category.games, { eager: true })
  category: Category;

  @Column({ default: 1 })
  @Field(() => Int)
  inTotal: number;

  @Column({ default: 1 })
  @Field(() => Int)
  inStock: number;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  image: string;

  @Column({ type: 'decimal', default: 0 })
  @Field(() => Number)
  price: number;

  // @OneToMany(() => Prestamo, (prestamo) => prestamo.juego)
  // prestamos: Prestamo[]; // Relación inversa
}
