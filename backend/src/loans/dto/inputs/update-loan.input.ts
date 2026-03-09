import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { CreateLoanInput } from './create-loan.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { LoanStatus } from '../../enums/loan-status.enum';

@InputType()
export class UpdateLoanInput extends PartialType(CreateLoanInput) {
  @Field(() => Int)
  @IsInt()
  id: number;

  @Field(() => LoanStatus, { nullable: true })
  @IsOptional()
  @IsEnum(LoanStatus)
  status?: LoanStatus;
}
