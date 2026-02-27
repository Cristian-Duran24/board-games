import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ClientsService } from './clients.service';
import { Client } from './entities/client.entity';
import { CreateClientInput, UpdateClientInput } from './dto/inputs';

@Resolver(() => Client)
export class ClientsResolver {
  constructor(private readonly clientsService: ClientsService) {}

  @Mutation(() => Client)
  async createClient(@Args('createClientInput') createClientInput: CreateClientInput): Promise<Client> {
    return await this.clientsService.create(createClientInput);
  }

  @Query(() => [Client], { name: 'clients' })
  findAll(): Promise<Client[]> {
    return this.clientsService.findAll();
  }

  @Query(() => Client, { name: 'client' })
  findOne(@Args('id', { type: () => Int }) id: number): Promise<Client> {
    return this.clientsService.findOne(id);
  }

  @Mutation(() => Client)
  async updateClient(@Args('updateClientInput') updateClientInput: UpdateClientInput): Promise<Client> {
    return await this.clientsService.update(updateClientInput.id, updateClientInput);
  }

  @Mutation(() => Client)
  async removeClient(@Args('id', { type: () => Int }) id: number): Promise<Client> {
    return await this.clientsService.remove(id);
  }
}
