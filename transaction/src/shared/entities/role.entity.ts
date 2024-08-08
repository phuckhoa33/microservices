import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AutoMap } from '@automapper/classes';
import { ObjectId } from 'bson';

export const RoleDatabaseName = 'roles';

@Schema({ collection: RoleDatabaseName })
export class RoleEntity {
  _id: ObjectId;

  @AutoMap()
  @Prop({
    required: true,
    index: true,
    unique: true,
    type: String,
    maxlength: 50,
  })
  name: string;

  @AutoMap()
  @Prop({
    required: true,
    type: [String],
  })
  permissions: string[];

  @AutoMap()
  @Prop({
    type: Date,
    default: Date.now,
  })
  createdAt: Date;

  @AutoMap()
  @Prop({
    type: Date,
  })
  updatedAt: Date | null;

  @AutoMap()
  @Prop({
    type: Date,
  })
  deletedAt: Date | null;
}

export const RoleSchema = SchemaFactory.createForClass(RoleEntity);

export type RoleDocument = RoleEntity & Document;
