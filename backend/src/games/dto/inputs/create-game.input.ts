import { InputType, Int, Field } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsNumber, IsPositive, IsString, MinLength } from 'class-validator';

@InputType()
export class CreateGameInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  title: string;

  @Field(() => Int)
  @IsInt()
  @IsPositive()
  categoryId: number;

  @Field(() => Int)
  @IsInt()
  @IsPositive()
  inTotal: number;

  @Field({ nullable: true })
  @IsString()
  image?: string;

  @Field(() => Number)
  @IsPositive()
  @IsNumber()
  price: number;
}
