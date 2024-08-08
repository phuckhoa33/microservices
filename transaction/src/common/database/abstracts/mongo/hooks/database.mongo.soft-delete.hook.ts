import {Schema} from 'mongoose';

/**
 * Apply soft delete hooks to the schema.
 *
 * @param {Schema} schema - The schema to apply the hooks to.
 */
export function applySoftDeleteHooks(schema: Schema): void {
    // Hooks for prevent get isDeleted data for mongo schema
    const isDeletedFilter = {isDeleted: {$ne: true}};
    schema.pre(['find', 'findOne', 'countDocuments', 'updateOne'], function (next) {
        this.find(isDeletedFilter);
        next();
    });
    schema.pre(['deleteOne', 'deleteMany', 'findOneAndDelete'], function (next) {
        this.updateOne(isDeletedFilter, {isDeleted: true});
        next();
    });
    schema.pre('updateMany', function (next) {
        this.updateMany(isDeletedFilter);
        next();
    });
    schema.pre('findOneAndUpdate', function (next) {
        this.findOneAndUpdate(isDeletedFilter);
        next();
    });

    // Hooks for change behavior of deleteOne, deleteMany, findOneAndDelete for mongo schema
    schema.pre('deleteOne', function (next) {
        this.updateOne({}, {isDeleted: true});
        next();
    });
    schema.pre('deleteMany', function (next) {
        this.updateMany({}, {isDeleted: true});
        next();
    });
    schema.pre('findOneAndDelete', function (next) {
        this.updateOne({}, {isDeleted: true});
        next();
    });
}