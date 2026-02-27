import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Game } from 'src/games/entities/game.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Category {
  @PrimaryGeneratedColumn('increment')
  @Field(() => Int)
  id: number;

  @Column({ unique: true })
  @Field(() => String)
  name: string;

  @OneToMany(() => Game, (game) => game.category)
  games: Game[]; // Relación inversa para joins futuros
}
