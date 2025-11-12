import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from 'src/users/user.entity';
import { Doctor } from 'src/services/doctor.entity'; // ✅ corrige ici

@Entity('reservations')
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { eager: true })
  patient: User;

  @ManyToOne(() => Doctor, { eager: true }) // ✅ changer Service -> Doctor
  medecin: Doctor;

  @CreateDateColumn()
  dateReservation: Date;
}
