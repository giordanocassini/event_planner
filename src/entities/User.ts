import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, Unique, ManyToMany, ManyToOne, JoinColumn, JoinTable } from "typeorm"
import { Length, IsNotEmpty, IsEmail, IsDate } from "class-validator"
import * as bcrypt from "bcryptjs"
import { Event } from "./Event"

@Entity("user")
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    @Length(3, 40)
    name: string

    @Column({unique: true})
    @IsEmail()
    @IsNotEmpty()
    email: string

    @Column()
    @IsDate()
    birth_date: Date

    @Column()
    @Length(6, 60)
    @IsNotEmpty()
    password: string

    @Column()
    @CreateDateColumn()
    createdAt: Date

    @Column()
    @UpdateDateColumn()
    updatedAt: Date

    @ManyToMany(() => Event, event => event.users)
    @JoinTable({
        name: 'event_user',
        joinColumn: {
            name: 'event_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'user_id',
            referencedColumnName: 'id',
        },
    })
    events: Event[]
}