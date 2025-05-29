// src/utils/permissions.js - Native React Native permissions only
import { PermissionsAndroid, Platform, Alert, Linking } from 'react-native';

export const requestCameraPermission = async () => {
  if (Platform.OS === 'ios') {
    // iOS permissions are handled automatically via Info.plist
    return true;
  }

  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'Camera Permission Required',
        message: 'ExpenseTracker needs access to your camera to scan receipts',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'Grant Permission',
      }
    );

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Camera permission granted');
      return true;
    } else {
      console.log('Camera permission denied');
      return false;
    }
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
    // Check Android version to determine which permissions to request
    const androidVersion = Platform.Version;
    
    if (androidVersion >= 33) {
      // Android 13+ (API level 33+) - Request media permissions
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        {
          title: 'Media Access Permission',
          message: 'ExpenseTracker needs access to save and read receipt images',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'Grant Permission',
        }
      );
      
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } else {
      // Android 12 and below - Request storage permissions
      const results = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ]);
      
      return (
        results[PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE] === PermissionsAndroid.RESULTS.GRANTED &&
        results[PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE] === PermissionsAndroid.RESULTS.GRANTED
      );
    }
  } catch (err) {
    console.warn('Storage permission error:', err);
    return false;
  }
};

export const checkCameraPermission = async () => {
  if (Platform.OS === 'ios') {
    return true; // iOS handles this differently
  }

  try {
    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.CAMERA
    );
    return hasPermission;
  } catch (error) {
    console.error('Camera permission check failed:', error);
    return false;
  }
};

export const checkStoragePermissions = async () => {
  if (Platform.OS === 'ios') {
    return true;
  }

  try {
    const androidVersion = Platform.Version;
    
    if (androidVersion >= 33) {
      const hasPermission = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
      );
      return hasPermission;
    } else {
      const hasReadPermission = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
      );
      const hasWritePermission = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      );
      return hasReadPermission && hasWritePermission;
    }
  } catch (error) {
    console.error('Storage permission check failed:', error);
    return false;
  }
};

export const requestAllPermissions = async () => {
  try {
    console.log('Requesting camera permission...');
    const cameraGranted = await requestCameraPermission();
    
    console.log('Requesting storage permissions...');
    const storageGranted = await requestStoragePermissions();

    console.log(`Permissions - Camera: ${cameraGranted}, Storage: ${storageGranted}`);

    if (!cameraGranted) {
      Alert.alert(
        'Camera Permission Required',
        'Camera access is needed to scan receipts. Please enable it in your device settings.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Open Settings', 
            onPress: () => Linking.openSettings()
          },
        ]
      );
      return false;
    }

    if (!storageGranted) {
      Alert.alert(
        'Storage Permission Required',
        'Storage access is needed to save receipt images. Please enable it in your device settings.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Open Settings', 
            onPress: () => Linking.openSettings()
          },
        ]
      );
      return false;
    }

    return true;
  } catch (error) {
    console.error('Permission request failed:', error);
    Alert.alert(
      'Permission Error',
      'Unable to request permissions. Please check your device settings manually.',
      [{ text: 'OK' }]
    );
    return false;
  }
};

export const checkAllPermissions = async () => {
  try {
    const cameraGranted = await checkCameraPermission();
    const storageGranted = await checkStoragePermissions();
    
    console.log(`Current permissions - Camera: ${cameraGranted}, Storage: ${storageGranted}`);
    
    return cameraGranted && storageGranted;
  } catch (error) {
    console.error('Permission check failed:', error);
    return false;
  }
};

// Helper function for receipt scanning
export const ensureReceiptScanPermissions = async () => {
  try {
    // First check if we already have permissions
    const hasPermissions = await checkAllPermissions();
    
    if (hasPermissions) {
      return true;
    }
    
    // If not, request them
    console.log('Permissions not found, requesting...');
    return await requestAllPermissions();
  } catch (error) {
    console.error('Error ensuring permissions:', error);
    return false;
  }
};
