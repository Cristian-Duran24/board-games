import { Injectable } from '@nestjs/common';
import { CreateCategoryInput, UpdateCategoryInput } from './dto/inputs';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesService {

  constructor(@InjectRepository(Category) private readonly categoriesRepository: Repository<Category>){}

  async create(createCategoryInput: CreateCategoryInput): Promise<Category> {
    const category = this.categoriesRepository.create(createCategoryInput);
    return await this.categoriesRepository.save(category);
  }

  async findAll(): Promise<Category[]> {
    return await this.categoriesRepository.find();
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.categoriesRepository.findOneBy({ id });
    if (!category) throw new Error(`Category with id "${id}" not found`);
    return category;
  }

  async update(id: number, updateCategoryInput: UpdateCategoryInput): Promise<Category> {
    const category = await this.categoriesRepository.preload(updateCategoryInput)
    if (!category) throw new Error(`Category with id "${id}" not found`);
    return this.categoriesRepository.save(category);
  }

  async remove(id: number): Promise<Category> {
    const category = await this.findOne(id);
    await this.categoriesRepository.remove(category);
    return { ...category, id } as Category;
  }
}
