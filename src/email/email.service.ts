import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, FindOptionsWhere, In, Or, Repository } from 'typeorm';
import { EmailId, IEmail } from './email.interfaces';
import { EmailEntity } from './email.entity';
import { EmailFiltersArgs, UserEmail } from './email.types';
import { User } from '../user/user.types';

@Injectable()
export class EmailService {
  constructor(
    @InjectRepository(EmailEntity)
    private readonly emailRepository: Repository<EmailEntity>,
  ) {}

  /**
   * Récupère un email par rapport à son identifiant
   * @param id Identifiant de l'adresse mail à récupérer
   * @returns L'adresse mail correspondant à l'identifiant ou undefined
   */
  get(id: EmailId): Promise<IEmail> {
    return this.emailRepository.findOneBy({ id: Equal(id) });
  }

  /**
   * Récupérer une liste d'e-mails correspondants à des filtres
   * @param filters les filtres à appliquer pour la recherche
   * @param [user] L'utilisateur associé à un email
   * @returns Liste d'emails en fonction des filtres
   */
  getEmails(filters: EmailFiltersArgs, user?: User): Promise<UserEmail[]> {
    const where: FindOptionsWhere<EmailEntity> = {};

    if (user) {
      where.userId = Equal(user.id);
    }

    if (filters.address) {
      if (filters.address.equal) {
        where.address = Equal(filters.address.equal);
      }

      if (filters.address.in?.length > 0) {
        where.address = In(filters.address.in);
      }

      if (filters.address.equal && filters.address.in?.length > 0) {
        where.address = Or(
          Equal(filters.address.equal),
          In(filters.address.in),
        );
      }
    }

    return this.emailRepository.find({
      where,
      order: { address: 'asc' },
    });
  }
}