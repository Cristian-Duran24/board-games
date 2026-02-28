import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryInput, UpdateCategoryInput } from './dto/inputs';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { PaginationArgs } from 'src/common/dto/args/pagination.args';

@Injectable()
export class CategoriesService {

  constructor(@InjectRepository(Category) private readonly categoriesRepository: Repository<Category>){}

  async create(createCategoryInput: CreateCategoryInput): Promise<Category> {
    const category = this.categoriesRepository.create(createCategoryInput);
    return await this.categoriesRepository.save(category);
  }

  async findAll(paginationArgs: PaginationArgs): Promise<Category[]> {
    const { limit, offset } = paginationArgs;
    return await this.categoriesRepository.find({
      take: limit,
      skip: offset
    });
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.categoriesRepository.findOneBy({ id });
    if (!category) throw new NotFoundException(`Category with id "${id}" not found`);
    return category;
  }

  async update(id: number, updateCategoryInput: UpdateCategoryInput): Promise<Category> {
    const category = await this.categoriesRepository.preload(updateCategoryInput)
    if (!category) throw new NotFoundException(`Category with id "${id}" not found`);
    return this.categoriesRepository.save(category);
  }

  async remove(id: number): Promise<Category> {
    const category = await this.findOne(id);
    await this.categoriesRepository.softRemove(category);
    return { ...category, id } as Category;
  }
}
