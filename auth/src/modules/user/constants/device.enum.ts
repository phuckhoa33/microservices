export enum DeviceTypeEnum {
    DESKTOP_BROWSER = 'DESKTOP_BROWSER',
    MOBILE_APP = 'MOBILE_APP',
}

export enum DeviceStatusEnum {
    ACTIVE = 'ACTIVE', // When user login with the device or the device is registered for QR login successfully
    INACTIVE = 'INACTIVE', // When user logins with another device, the current device will be in this status
    WAITING_FOR_APPROVAL = 'WAITING_FOR_APPROVAL', // When user register a new device, it will be in this status, until the user accept the access permission
}