import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsResolver } from './clients.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { Loan } from 'src/loans/entities/loan.entity';

@Module({
  providers: [
    ClientsResolver,
    ClientsService
  ],
  imports: [
    TypeOrmModule.forFeature([Client, Loan])
  ],
})
export class ClientsModule { }
