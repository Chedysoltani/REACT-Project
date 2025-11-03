import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from 'src/users/user.entity';
import { Service } from 'src/services/service.entity';

@Entity('reservations')
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { eager: true })
  patient: User;

  @ManyToOne(() => Service, { eager: true })
  medecin: Service;

  @CreateDateColumn()
  dateReservation: Date;
  
}
