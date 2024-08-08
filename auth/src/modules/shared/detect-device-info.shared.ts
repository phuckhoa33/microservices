import DeviceDetector from 'device-detector-js';

export const detectDeviceInfoShared = (userAgent: string) => {
    const deviceDetector = new DeviceDetector();
    return deviceDetector.parse(userAgent);
};