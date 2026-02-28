import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { LoansService } from './loans.service';
import { Loan } from './entities/loan.entity';
import { CreateLoanInput, UpdateLoanInput } from './dto/inputs';
import { PaginationArgs } from 'src/common/dto/args/pagination.args';

@Resolver(() => Loan)
export class LoansResolver {
  constructor(private readonly loansService: LoansService) { }

  @Mutation(() => Loan)
  createLoan(@Args('createLoanInput') createLoanInput: CreateLoanInput): Promise<Loan> {
    return this.loansService.create(createLoanInput);
  }

  @Query(() => [Loan], { name: 'loans' })
  findAll(@Args() paginationArgs: PaginationArgs): Promise<Loan[]> {
    return this.loansService.findAll(paginationArgs);
  }

  @Query(() => Loan, { name: 'loan' })
  findOne(@Args('id', { type: () => Int }) id: number): Promise<Loan> {
    return this.loansService.findOne(id);
  }

  @Mutation(() => Loan)
  updateLoan(@Args('updateLoanInput') updateLoanInput: UpdateLoanInput): Promise<Loan> {
    return this.loansService.update(updateLoanInput.id, updateLoanInput);
  }

  @Mutation(() => Loan)
  returnGame(@Args('id', { type: () => Int }) id: number): Promise<Loan> {
    return this.loansService.returnLoan(id);
  }

  @Mutation(() => String, { name: 'checkOverdueLoans' })
  checkOverdueLoans(): Promise<string> {
    return this.loansService.checkOverdueLoans();
  }

  @Mutation(() => Loan)
  removeLoan(@Args('id', { type: () => Int }) id: number): Promise<Loan> {
    return this.loansService.remove(id);
  }
}
