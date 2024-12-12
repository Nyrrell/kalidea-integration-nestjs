import {
  Args,
  ID,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import {
  AddEmail,
  DeleteEmail,
  EmailFiltersArgs,
  UserEmail,
} from './email.types';
import { User, UserIdArgs } from '../user/user.types';
import { EmailService } from './email.service';
import { UserService } from '../user/user.service';
import { EmailId } from './email.interfaces';

@Resolver(() => UserEmail)
export class EmailResolver {
  constructor(
    private readonly _service: EmailService,
    private readonly _userService: UserService,
  ) {}

  @Query(() => UserEmail, { name: 'email' })
  getEmail(@Args({ name: 'emailId', type: () => ID }) emailId: string) {
    return this._service.get(emailId);
  }

  @Query(() => [UserEmail], { name: 'emailsList' })
  async getEmails(@Args() filters: EmailFiltersArgs): Promise<UserEmail[]> {
    return this._service.getEmails(filters);
  }

  @ResolveField(() => User, { name: 'user' })
  async getUser(@Parent() parent: UserEmail): Promise<User> {
    return this._userService.getByEmail(parent);
  }

  @Mutation(() => ID)
  async addEmail(
    @Args() { userId }: UserIdArgs,
    @Args() address: AddEmail,
  ): Promise<EmailId> {
    const user = await this._userService.get(userId);
    return this._service.addEmail(address, user);
  }

  @Mutation(() => Int)
  async deleteEmail(
    @Args() { userId }: UserIdArgs,
    @Args() email: DeleteEmail,
  ): Promise<number> {
    const user = await this._userService.get(userId);
    return this._service.deleteEmail(email, user);
  }
}
