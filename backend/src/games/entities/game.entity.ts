import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { Category } from 'src/categories/entities/category.entity';
import { Loan } from 'src/loans/entities/loan.entity';
import { Column, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Game {
  @PrimaryGeneratedColumn('increment')
  @Field(() => Int)
  id: number;

  @Column()
  @Field(() => String)
  title: string;

  // Optimización: eager: false (por defecto) para no traer la categoría siempre
  @ManyToOne(() => Category, (category) => category.games) 
  @Field(() => Category)
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

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  @Field(() => Float)
  price: number;

  @OneToMany(() => Loan, (loan) => loan.game)
  loans: Loan[]; 

  @DeleteDateColumn()
  deletedAt?: Date;
}
