import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsInt,
  IsNumber,
  IsBoolean,
  IsOptional,
} from 'class-validator';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ type: 'varchar', length: 120 })
  public email: string;

  @Column({ type: 'varchar', length: 120 })
  public first_name: string;

  @Column({ type: 'varchar', length: 120 })
  public last_name: string;

  @Column({ type: 'varchar', length: 120 })
  public password: string;

  @Column({ type: 'varchar', length: 500 })
  public currentHashedRefreshToken: string;

  /*
   * Create and Update Date Columns
   */

  @CreateDateColumn({ type: 'timestamp' })
  public createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  public updatedAt!: Date;
}
