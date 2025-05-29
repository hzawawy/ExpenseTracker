// src/utils/permissions.js - Create this new file
import { PermissionsAndroid, Platform, Alert } from 'react-native';

export const requestCameraPermission = async () => {
  if (Platform.OS === 'ios') {
    // iOS permissions are handled automatically via Info.plist
    return true;
  }

  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'Camera Permission',
        message: 'ExpenseTracker needs camera access to scan receipts',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      }
    );

    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.warn('Camera permission error:', err);
    return false;
  }
};

export const requestStoragePermissions = async () => {
  if (Platform.OS === 'ios') {
    // iOS handles this automatically
    return true;
  }

  try {
    // For Android 13+ (API level 33+), we need different permissions
    const androidVersion = Platform.Version;
    
    if (androidVersion >= 33) {
      // Android 13+ uses scoped storage, request media permissions
      const permissions = [
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
      ];
      
      const results = await PermissionsAndroid.requestMultiple(permissions);
      
      return Object.values(results).every(
        result => result === PermissionsAndroid.RESULTS.GRANTED
      );
    } else {
      // Android 12 and below
      const permissions = [
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ];

      const results = await PermissionsAndroid.requestMultiple(permissions);
      
      return Object.values(results).every(
        result => result === PermissionsAndroid.RESULTS.GRANTED
      );
    }
  } catch (err) {
    console.warn('Storage permission error:', err);
    return false;
  }
};

export const requestAllPermissions = async () => {
  try {
    const cameraGranted = await requestCameraPermission();
    const storageGranted = await requestStoragePermissions();

    if (!cameraGranted || !storageGranted) {
      Alert.alert(
        'Permissions Required',
        'Camera and storage permissions are needed for receipt scanning. Please grant them in Settings.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => {
            // You can add code to open app settings here
            console.log('Open app settings');
          }},
        ]
      );
      return false;
    }

    return true;
  } catch (error) {
    console.error('Permission request failed:', error);
    return false;
  }
};

export const checkPermissions = async () => {
  if (Platform.OS === 'ios') {
    return true; // iOS handles permissions differently
  }

  try {
    const cameraPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.CAMERA
    );

    let storagePermission;
    if (Platform.Version >= 33) {
      storagePermission = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
      );
    } else {
      storagePermission = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
      );
    }

    return cameraPermission && storagePermission;
  } catch (error) {
    console.error('Permission check failed:', error);
    return false;
  }
};
