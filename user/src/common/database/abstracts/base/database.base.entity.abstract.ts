/**
 * Abstract class {@link DatabaseBaseEntityAbstract} with a generic type parameter.
 * This class is used as a base for entities.
 *
 * @property _id - The unique identifier for the entity. It is of type T.
 */
export abstract class DatabaseBaseEntityAbstract<T = any> {
    abstract _id: T;
}
