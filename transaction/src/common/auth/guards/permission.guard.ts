import {CanActivate, ExecutionContext, Injectable, mixin, Type,} from '@nestjs/common';
import {AccessTokenGuard} from './accessToken.guard';
import {InjectConnection} from '@nestjs/mongoose';
import {Connection} from 'mongoose';
import {PRIMARY_DATABASE_CONNECTION_NAME} from '../../database/constants/database-name.constant';
import { RoleDatabaseName } from 'src/shared/entities/role.entity';

export const PermissionGuard = (
    ...permissions: string[]
): Type<CanActivate> => {
    @Injectable()
    class PermissionMixin extends AccessTokenGuard {
        constructor(
            @InjectConnection(PRIMARY_DATABASE_CONNECTION_NAME)
            private readonly connection: Connection,
        ) {
            super();
        }

        async canActivate(context: ExecutionContext) {
            await super.canActivate(context);

            const request = context.switchToHttp().getRequest();
            const roleIds = request.user.roles;
            const isAdmin = request.user?.isAdmin;

            // If isAdmin has true value, then return true
            if (isAdmin) {
                return true;
            }

            // Get roles
            const roles = await this.connection
                .model(RoleDatabaseName)
                .find({_id: {$in: roleIds}})
                .select('name permissions')
                .exec();

            // Check if roles have one of the permissions from input
            const permissionsOfRoles = roles.reduce((acc, role) => {
                return [...acc, ...role.permissions];
            }, []);

            if (permissionsOfRoles.length === 0) {
                return false;
            }

            return permissions.some((permission) =>
                permissionsOfRoles.includes(permission),
            );
        }
    }

    return mixin(PermissionMixin);
};

export default PermissionGuard;
