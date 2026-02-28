import { IsIn, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { CreateLoanInput } from './create-loan.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateLoanInput extends PartialType(CreateLoanInput) {
  @Field(() => Int)
  @IsInt()
  id: number;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsNotEmpty()
  @IsIn(['activo', 'devuelto', 'vencido']) // Validación estricta de estados
  status?: string;
}
