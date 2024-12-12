import { ArgsType, Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { IsEmail, IsOptional } from 'class-validator';
import { Maybe } from 'graphql/jsutils/Maybe';
import { IAddEmail, IEmail, IEmailFilters } from './email.interfaces';

@ObjectType()
export class UserEmail implements IEmail {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  address: string;

  userId: string;
}

@InputType()
export class StringFilters {
  @IsOptional()
  @Field(() => String, { nullable: true })
  equal: Maybe<string>;

  @IsOptional()
  @Field(() => [String], { nullable: true })
  in: Maybe<string[]>;
}

@ArgsType()
export class EmailFiltersArgs implements IEmailFilters {
  @IsOptional()
  @Field(() => StringFilters, { nullable: true })
  address?: Maybe<StringFilters>;
}

/**
 * Type d'entrée GraphQL d'un email à ajouter
 */
@InputType()
@ArgsType()
export class AddEmail implements IAddEmail {
  @IsEmail()
  @Field(() => String)
  address: string;
}

/**
 * Type d'entrée GraphQL d'un email à supprimer
 */
@InputType()
@ArgsType()
export class DeleteEmail {
  @IsEmail()
  @Field(() => String)
  address: string;
}
