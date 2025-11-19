// src/users/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import { Clinic } from '../clinics/entities/clinic.entity';
import * as bcrypt from 'bcrypt';

export enum UserRole {
  PATIENT = 'patient',
  DOCTOR = 'doctor',
  RECEPTIONIST = 'receptionist',
  ADMIN = 'admin',
  CLINIC_ADMIN = 'clinic_admin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  firstName: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  lastName: string | null;

  @Column({ unique: true, length: 255, nullable: false })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  password: string | null;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.PATIENT
  })
  role: UserRole;

  // Champs spécifiques aux médecins
  // Doctor specific fields
  @Column({ type: 'varchar', nullable: true })
  specialty: string | null;

  @Column({ type: 'varchar', nullable: true })
  phone: string | null;

  @Column({ type: 'varchar', nullable: true })
  photo: string | null;

  // Référence à l'ID du profil docteur sans créer de relation circulaire
  @Column({ name: 'doctorprofileid', type: 'int', nullable: true })
  doctorProfileId: number | null;

  @Column({ type: 'text', nullable: true })
  bio: string | null;

  @Column({ type: 'jsonb', nullable: true })
  workingHours: Record<string, any> | null;

  @Column({ type: 'varchar', nullable: true })
  rppsNumber: string | null;

  @Column({ type: 'varchar', nullable: true })
  diploma: string | null;

  @Column({ type: 'varchar', array: true, nullable: true })
  languages: string[] | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Clinic, clinic => clinic.users, { nullable: true })
  @JoinColumn({ name: 'clinicId' })
  clinic: Clinic | null;

  @Column({ type: 'uuid', nullable: true })
  clinicId: string | null;

  // Hash password before saving
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      // Use a consistent salt round of 10 for better security
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  // Validate password
  async validatePassword(password: string): Promise<boolean> {
    if (!this.password) {
      return false;
    }
    return bcrypt.compare(password, this.password);
  }

  constructor(partial?: Partial<User>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
}