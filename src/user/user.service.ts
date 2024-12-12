import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { IAddUser, IUser, UserId } from './user.interfaces';
import { UserEmail } from '../email/email.types';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  /**
   * Ajoute un utilisateur
   * @param user Utilisateur à ajouter au système
   */
  async add(user: IAddUser) {
    const addedUser = await this.userRepository.insert({
      ...user,
      status: 'active',
    });
    const userId = addedUser.identifiers[0].id;

    return userId;
  }

  /**
   * Suppression d'un utilisateur (soft delete)
   *
   * @param userId Identifiant de l'utilisateur à désactiver
   * @returns L'identifiant de l'utilisateur désactivé
   */
  async deactivate(userId: UserId) {
    await this.get(userId);

    await this.userRepository.update(
      { id: Equal(userId) },
      { status: 'inactive' },
    );

    return userId;
  }

  /**
   * Récupère un utilisateur par rapport à un identifiant
   * @param id Identifiant de l'utilisateur à récupérer
   * @returns L'utilisateur correspondant à l'identifiant ou undefined
   */
  async get(id: UserId): Promise<IUser> {
    const user = await this.userRepository.findOneBy({ id: Equal(id) });

    if (!user) {
      throw new NotFoundException(`L'utilisateur n'a pas été trouvé`);
    }

    return user;
  }

  /**
   * Récupère un utilisateur par rapport à son addresse mail
   * @param userEmail Email de l'utilisateur à récupérer
   * @returns L'utilisateur correspondant à l'identifiant ou undefined
   */
  getByEmail(userEmail: UserEmail): Promise<IUser> {
    return this.userRepository.findOne({
      where: {
        emails: {
          address: userEmail.address,
        },
      },
      relations: ['emails'],
    });
  }
}
