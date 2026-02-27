import { Module } from '@nestjs/common';
import { GamesService } from './games.service';
import { GamesResolver } from './games.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './entities/game.entity';
import { Category } from 'src/categories/entities/category.entity';

@Module({
  providers: [
    GamesResolver, 
    GamesService
  ],
  imports: [
    TypeOrmModule.forFeature([Game, Category])
  ],
})
export class GamesModule { }
