import { InputType, Int, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, MinLength } from 'class-validator';

@InputType()
export class CreateClientInput {

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  name: string;

  @Field(() => String)
  @IsPhoneNumber('BO')
  phone: string;
  
  @Field(() => String, { nullable: true })
  @IsEmail()
  email?: string;
}
