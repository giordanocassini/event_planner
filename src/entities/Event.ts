import { User } from './User';
import { Quotation } from './Quotation';
import { Guest } from "./Guest"
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  ManyToMany
} from "typeorm";
import { Length, IsDate } from "class-validator";

@Entity("event")
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Length(1, 300)
  place: string;

  @Column()
  @Length(1, 300)
  name: string;

  @Column()
  @IsDate()
  date: Date;

  @Column()
  @Length(1,10)
  invite_number : number;

  @Column()
  @Length(1,1000)
  event_budget : number;

  @CreateDateColumn({
    nullable: false
  })
  created_at: Date;

  @UpdateDateColumn({
    nullable: false
  })
  updated_at: Date;

  @ManyToMany(() => User, user => user.events)
  users: User[]

  @OneToMany(() => Quotation, quotation => quotation.event_id)
  quotation: Quotation[]

  @OneToMany(() => Guest, (guest) => guest.event)
  guest: Guest[]


  formatDate(date:string){
    let splitDate = date.split("/");
    return splitDate.reverse().join("/");
  }

}