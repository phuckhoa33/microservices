export interface RoleInterface {
    name: string;

    permissions: string[];

    createdAt: Date;

    updatedAt: Date | null;

    deletedAt: Date | null;
}