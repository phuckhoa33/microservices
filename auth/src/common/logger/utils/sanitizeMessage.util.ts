// Check message, if it has properties, convert them values to ********
export function sanitizeMessage(message: string): string {
    const properties = [
        'password',
        'confirmPassword',
        'oldPassword',
        'newPassword',
        'currentPassword',
        'otp',
        'token',
        'refresh',
    ];

    properties.forEach((property) => {
        const regex = new RegExp(`"${property}":\\s*"[^"]*"`, 'g');
        message = message.replace(regex, `"${property}": "********"`);
    });

    return message;
}