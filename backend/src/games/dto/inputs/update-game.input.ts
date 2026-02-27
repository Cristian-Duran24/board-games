import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { CreateGameInput } from './create-game.input';
import { IsInt, IsPositive } from 'class-validator';

@InputType()
export class UpdateGameInput extends PartialType(CreateGameInput) {
  @Field(() => Int)
  @IsInt()
  @IsPositive()
  id: number;
}
