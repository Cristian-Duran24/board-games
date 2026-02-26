// src/hello.resolver.ts
import { Resolver, Query } from '@nestjs/graphql';

@Resolver()
export class HelloResolver {
    // Define una Query básica que devuelve un String
    @Query(() => String, { name: 'helloWorld', description: 'Query de prueba para inicializar GraphQL' })
    hello(): string {
        return '¡Hola desde 10Minds BoardHub GraphQL!';
    }
}