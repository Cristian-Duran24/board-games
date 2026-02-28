import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateGameInput, UpdateGameInput } from './dto/inputs';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from './entities/game.entity';
import { MoreThan, Repository } from 'typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { PaginationArgs } from 'src/common/dto/args/pagination.args';

@Injectable()
export class GamesService {

  constructor(
    @InjectRepository(Game) private readonly gamesRepository: Repository<Game>,
    @InjectRepository(Category) private readonly categoriesRepository: Repository<Category>,

  ) { }

  async create(createGameInput: CreateGameInput): Promise<Game> {
    const category = await this.categoriesRepository.findOneBy({ id: createGameInput.categoryId });
    if (!category) throw new BadRequestException('Category not found');
    
    // Convertir precio a decimal si es necesario (TypeORM lo maneja con el tipo 'decimal')
    const game = this.gamesRepository.create({ 
      ...createGameInput, 
      category, 
      inStock: createGameInput.inTotal 
    });
    return this.gamesRepository.save(game);
  }

  async findAll(paginationArgs: PaginationArgs): Promise<Game[]> {
    const { limit, offset } = paginationArgs;
    return await this.gamesRepository.find({ 
      take: limit, 
      skip: offset,
      relations: ['category'] 
    });
  }

  async findAvailable(paginationArgs: PaginationArgs): Promise<Game[]> {
    const { limit, offset } = paginationArgs;
    return await this.gamesRepository.find({
      where: { inStock: MoreThan(0) },
      take: limit,
      skip: offset,
      relations: ['category']
    });
  }

  async findOne(id: number): Promise<Game> {
    const game = await this.gamesRepository.findOne({ where: { id }, relations: ['category'] });
    if (!game) throw new BadRequestException('Game not found');
    return game;
  }

  async update(id: number, updateGameInput: UpdateGameInput): Promise<Game> {
    // 1. Buscamos el juego ORIGINAL antes de modificarlo para saber sus valores actuales
    const currentGame = await this.findOne(id);
    // 2. Si se está actualizando 'inTotal', recalculamos 'inStock'
    if (updateGameInput.inTotal !== undefined) {
      const totalDifference = updateGameInput.inTotal - currentGame.inTotal;
      // Ajustamos el stock disponible con la misma diferencia
      currentGame.inStock += totalDifference;
      // Validación de seguridad (opcional pero recomendada)
      if (currentGame.inStock < 0) {
        throw new BadRequestException('No puedes reducir el total por debajo de la cantidad actualmente prestada.');
      }
    }

    // 3. Fusionamos los cambios
    const updatedGame = this.gamesRepository.merge(currentGame, updateGameInput);

    // 4. Guardamos
    return this.gamesRepository.save(updatedGame);
  }

  async remove(id: number): Promise<Game> {
    const game = await this.findOne(id);
    // Soft Remove (Borrado Lógico)
    await this.gamesRepository.softRemove(game);
    // Copiamos el ID para devolverlo ya que al eliminar puede quedar undefined en memoria
    return { ...game, id };
  }
}
