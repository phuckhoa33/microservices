import {Permission} from './permission';

export class PermissionDictionary {
    public static PERMISSION_DICTIONARY: Permission[] = [];

    public static addPermission(permission: Permission) {
        this.PERMISSION_DICTIONARY.push(permission);
    }
}
