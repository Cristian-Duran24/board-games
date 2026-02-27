import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateClientInput, UpdateClientInput } from './dto/inputs';
import { Client } from './entities/client.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ClientsService {

  constructor(
    @InjectRepository(Client) private readonly clientsRepository: Repository<Client>,
  ) { }

  async create(createClientInput: CreateClientInput): Promise<Client> {
    try {
      const client = await this.clientsRepository.create(createClientInput);
      return await this.clientsRepository.save(client);
    } catch (error) {
      if (error.code === '23505') {
        throw new BadRequestException(`Client with phone "${createClientInput.phone}" already exists`);
      }
      throw new InternalServerErrorException('An error occurred while creating the client');
    }
  }

  async findAll(): Promise<Client[]> {
    return await this.clientsRepository.find();
  }

  async findOne(id: number): Promise<Client> {
    const client = await this.clientsRepository.findOneBy({ id });
    if (!client) throw new Error('Client not found');
    return client;
  }

  async update(id: number, updateClientInput: UpdateClientInput): Promise<Client> {
    const client = await this.findOne(id);
    // Fusionamos los cambios
    Object.assign(client, updateClientInput);
    try {
      return await this.clientsRepository.save(client);
    } catch (error) {
      if (error.code === '23505') {
        throw new BadRequestException(`Client with phone "${updateClientInput.phone}" already exists`);
      }
      throw new InternalServerErrorException('An error occurred while updating the client');
    }
  }

  async remove(id: number): Promise<Client> {
    const client = await this.findOne(id);
    await this.clientsRepository.remove(client);
    return { ...client, id };
  }
}
