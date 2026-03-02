import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, Logger } from '@nestjs/common';
import { CreateLoanInput, UpdateLoanInput } from './dto/inputs';
import { Loan } from './entities/loan.entity';
import { Game } from '../games/entities/game.entity';
import { Client } from '../clients/entities/client.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, LessThan } from 'typeorm';
import { PaginationArgs } from 'src/common/dto/args/pagination.args';
import { LoanStatus } from './enums/loan-status.enum';


@Injectable()
export class LoansService {

  private readonly logger = new Logger('LoansService');

  constructor(
    @InjectRepository(Loan) private readonly loansRepository: Repository<Loan>,
    @InjectRepository(Game) private readonly gamesRepository: Repository<Game>,
    @InjectRepository(Client) private readonly clientsRepository: Repository<Client>,
    private readonly dataSource: DataSource,
  ) { }

  async create(createLoanInput: CreateLoanInput): Promise<Loan> {
    const { gameId, clientId, startDate, endDate } = createLoanInput;
    const game = await this.gamesRepository.findOneBy({ id: gameId });
    const client = await this.clientsRepository.findOneBy({ id: clientId });

    if (!game) throw new NotFoundException(`Game with id ${gameId} not found`);
    if (!client) throw new NotFoundException(`Client with id ${clientId} not found`);

    if (game.inStock <= 0) throw new BadRequestException(`Game "${game.title}" is out of stock`);

    // Fechas: Usan las del input o valores por defecto
    const startTimeRequest = startDate ? new Date(startDate) : new Date();
    // Por defecto 1 día de préstamo si no se proporciona endDate
    const endTimeRequest = endDate ? new Date(endDate) : new Date(new Date(startTimeRequest).setDate(startTimeRequest.getDate() + 1));

    // Validación fecha fin > fecha inicio
    if (endTimeRequest <= startTimeRequest) {
      throw new BadRequestException('La fecha de fin debe ser mayor a la fecha de inicio');
    }

    // Calcular el precio total basado en los días de préstamo
    const diffTime = Math.abs(endTimeRequest.getTime() - startTimeRequest.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    const daysToCharge = diffDays === 0 ? 1 : diffDays;
    const calculatedTotal = daysToCharge * game.price;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      game.inStock--;
      await queryRunner.manager.save(game);

      const newLoan = this.loansRepository.create({
        game,
        client,
        startDate: startTimeRequest,
        endDate: endTimeRequest,
        status: LoanStatus.ACTIVE, // Uso de Enum
        totalPrice: calculatedTotal,
        penalty: 0
      });

      const savedLoan = await queryRunner.manager.save(newLoan);
      await queryRunner.commitTransaction();
      return savedLoan;

    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(error);
      throw new InternalServerErrorException('Error creating loan');
    } finally {
      await queryRunner.release();
    }
  }

  async returnLoan(id: number): Promise<Loan> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const loan = await queryRunner.manager.findOne(Loan, {
        where: { id },
        relations: ['game', 'client'],
      });

      if (!loan) throw new NotFoundException(`Loan with id ${id} not found`);
      if (loan.status === LoanStatus.RETURNED) throw new BadRequestException('Loan already returned');

      const today = new Date();
      loan.penalty = 0;

      if (today > loan.endDate) {
        const diffTime = Math.abs(today.getTime() - loan.endDate.getTime());
        const daysLate = Math.ceil(diffTime / (1000 * 3600 * 24));
        loan.penalty = daysLate * 1.0;
      }

      loan.status = LoanStatus.RETURNED; // Uso de Enum
      loan.actualReturnDate = today; // Nueva columna, conservamos endDate original

      // Guardado atómico stock del juego
      if (loan.game) {
        loan.game.inStock++;
        await queryRunner.manager.save(loan.game);
      }

      // Guardado atómico del préstamo
      await queryRunner.manager.save(loan);
      await queryRunner.commitTransaction();
      return loan;

    } catch (error) {
      await queryRunner.rollbackTransaction();
      // Solo logueamos si no es una excepción controlada
      if (!(error instanceof BadRequestException) && !(error instanceof NotFoundException)) {
        this.logger.error(error);
      }
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // Método para verificar y marcar préstamos vencidos automáticamente
  async checkOverdueLoans(): Promise<string> {
    const today = new Date();

    // Buscar préstamos activos cuya fecha fin haya pasado
    const overdueLoans = await this.loansRepository.find({
      where: {
        status: LoanStatus.ACTIVE,
        endDate: LessThan(today)
      }
    });

    let modifiedCount = 0;
    for (const loan of overdueLoans) {
      loan.status = LoanStatus.OVERDUE; // Uso de Enum
      await this.loansRepository.save(loan);
      modifiedCount++;
    }

    return `Processed ${modifiedCount} overdue loans`;
  }

  async findAll(paginationArgs: PaginationArgs): Promise<Loan[]> {
    const { limit, offset } = paginationArgs;
    return this.loansRepository.find({
      take: limit,
      skip: offset,
      relations: ['game', 'client'] // Asegurar relations aquí para findAll
    });
  }

  async findOne(id: number): Promise<Loan> {
    const loan = await this.loansRepository.findOne({
      where: { id },
      relations: ['game', 'client']
    });
    if (!loan) throw new NotFoundException(`Loan with id "${id}" not found`);
    return loan;
  }

  async update(id: number, updateLoanInput: UpdateLoanInput): Promise<Loan> {
    const loan = await this.findOne(id);
    if (updateLoanInput.status === LoanStatus.RETURNED && loan.status !== LoanStatus.RETURNED) {
      throw new BadRequestException('Use the "returnGame" mutation to return a game.');
    }
    Object.assign(loan, updateLoanInput);
    return this.loansRepository.save(loan);
  }

  async remove(id: number): Promise<Loan> {
    const loan = await this.findOne(id);
    if (loan.status === 'active') {
      const game = await this.gamesRepository.findOneBy({ id: loan.game.id });
      if (game) {
        game.inStock++;
        await this.gamesRepository.save(game);
      }
    }
    // Soft Remove
    await this.loansRepository.softRemove(loan);
    return { ...loan, id };
  }
}
