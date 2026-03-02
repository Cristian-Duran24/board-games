import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Loan } from 'src/loans/entities/loan.entity';
import { Column, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Client {
  @PrimaryGeneratedColumn('increment')
  @Field(() => Int)
  id: number;

  @Column()
  @Field(() => String)
  name: string;

  @Column({ unique: true })
  @Field(() => String)
  phone: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  email?: string;

  @OneToMany(() => Loan, (loan) => loan.client)
  loans: Loan[];

  @DeleteDateColumn()
  deletedAt: Date;
}
