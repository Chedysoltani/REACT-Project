import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { Reservation } from '../Reservation/reservation.entity';
import { User } from '../users/user.entity';

@Entity('services')
export class Service {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // nom du service ou nom du médecin si chaque service = médecin

  @Column()
  price: number;

  @Column()
  duration: string;

  // 🔹 Un service peut avoir plusieurs réservations
  @OneToMany(() => Reservation, (reservation) => reservation.medecin)
  reservations: Reservation[];

  // 🔹 (optionnel) lier à un utilisateur "médecin" si tu veux gérer les logins
  @ManyToOne(() => User, { nullable: true })
  doctor?: User;
}
