import { InputType, Int, Field } from '@nestjs/graphql';
import { IsBase64, IsInt, IsNotEmpty, IsNumber, IsPositive, IsString, MinLength } from 'class-validator';

@InputType()
export class CreateGameInput {
  @Field(() => String)
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
  @IsBase64({}, { message: 'Image must be a valid base64 string' })
  image?: string;

  @Field(() => Number)
  @IsPositive()
  @IsNumber()
  price: number;
}
