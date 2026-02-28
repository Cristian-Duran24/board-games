import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { GamesService } from './games.service';
import { Game } from './entities/game.entity';
import { CreateGameInput, UpdateGameInput } from './dto/inputs';
import { PaginationArgs } from 'src/common/dto/args/pagination.args';

@Resolver(() => Game)
export class GamesResolver {
  constructor(private readonly gamesService: GamesService) { }

  @Mutation(() => Game)
  async createGame(@Args('createGameInput') createGameInput: CreateGameInput): Promise<Game> {
    return this.gamesService.create(createGameInput);
  }

  @Query(() => [Game], { name: 'games' })
  async findAll(@Args() paginationArgs: PaginationArgs): Promise<Game[]> {
    return this.gamesService.findAll(paginationArgs);
  }

  @Query(() => [Game], { name: 'gamesAvailable' })
  async findAvailable(@Args() paginationArgs: PaginationArgs): Promise<Game[]> {
    return this.gamesService.findAvailable(paginationArgs);
  }

  @Query(() => Game, { name: 'game' })
  async findOne(@Args('id', { type: () => Int }) id: number): Promise<Game> {
    return this.gamesService.findOne(id);
  }

  @Mutation(() => Game)
  async updateGame(@Args('updateGameInput') updateGameInput: UpdateGameInput): Promise<Game> {
    return this.gamesService.update(updateGameInput.id, updateGameInput);
  }

  @Mutation(() => Game)
  async removeGame(@Args('id', { type: () => Int }) id: number): Promise<Game> {
    return this.gamesService.remove(id);
  }
}
