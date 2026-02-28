import { Module } from '@nestjs/common';
import { LoansService } from './loans.service';
import { LoansResolver } from './loans.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from 'src/clients/entities/client.entity';
import { Game } from 'src/games/entities/game.entity';
import { Loan } from './entities/loan.entity';

@Module({
  providers: [
    LoansResolver,
    LoansService
  ],
  imports: [
    TypeOrmModule.forFeature([Client, Game, Loan])
  ],
})
export class LoansModule { }
