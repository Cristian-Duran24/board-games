import { Module } from '@nestjs/common';
import { LoansService } from './loans.service';
import { LoansResolver } from './loans.resolver';

@Module({
  providers: [LoansResolver, LoansService],
})
export class LoansModule {}
