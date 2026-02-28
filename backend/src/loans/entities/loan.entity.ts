import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { Client } from 'src/clients/entities/client.entity';
import { Game } from 'src/games/entities/game.entity';
import { Column, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Loan {
  @PrimaryGeneratedColumn('increment')
  @Field(() => Int)
  id: number;

  // Optimización: eager: false
  @ManyToOne(() => Game, (game) => game.loans)
  @Field(() => Game)
  game: Game;

  @ManyToOne(() => Client, (client) => client.loans)
  @Field(() => Client)
  client: Client;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Field(() => Date)
  startDate: Date;

  @Column({ type: 'timestamp' })
  @Field(() => Date)
  endDate: Date;

  // Estandarización: Inglés (active, returned, overdue)
  @Column({ default: 'active' })
  @Field(() => String)
  status: string; 

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  @Field(() => Float)
  penalty: number;

  @DeleteDateColumn()
  deletedAt?: Date;
}
