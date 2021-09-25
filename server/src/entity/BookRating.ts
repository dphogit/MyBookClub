import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from "typeorm";
import { Field, Int, ObjectType, registerEnumType } from "type-graphql";
import { BookStatus } from "../common/types";
import User from "./User";

registerEnumType(BookStatus, {
  name: "BookStatus",
});

@ObjectType()
@Entity()
class BookRating extends BaseEntity {
  @Field(() => String)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column()
  volumeId: string;

  @Field()
  @Column()
  title: string;

  @Field(() => Int, { nullable: true })
  @Column({ type: "int", nullable: true })
  rating: number;

  @Field(() => BookStatus)
  @Column({ type: "enum", enum: BookStatus })
  status: BookStatus;

  @Field()
  @Column()
  creatorId: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.bookRatings)
  creator: User;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}

export default BookRating;
