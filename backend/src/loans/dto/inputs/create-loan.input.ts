import { InputType, Int, Field } from '@nestjs/graphql';
import { IsDate, IsInt, IsOptional, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

@InputType()
export class CreateLoanInput {
  @Field(() => Int)
  @IsInt()
  @IsPositive()
  gameId: number;

  @Field(() => Int)
  @IsInt()
  @IsPositive()
  clientId: number;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;
}
