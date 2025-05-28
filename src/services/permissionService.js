import { Alert, Platform, Linking } from 'react-native'; // Import Linking for openSettings
import { requestMultiple, PERMISSIONS, RESULTS } from 'react-native-permissions'; // Import from react-native-permissions

/**
 * Requests necessary permissions for the app (Camera and Storage).
 * On Android, it requests runtime permissions.
 * On iOS, it usually relies on Info.plist declarations and specific library prompts.
 * @returns {Promise<boolean>} True if all critical permissions are granted, false otherwise.
 */
export const requestAppPermissions = async () => {
    let permissionsToRequest = [];

    if (Platform.OS === 'android') {
        permissionsToRequest = [
            PERMISSIONS.ANDROID.CAMERA,
            PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
            // PERMISSIONS.ANDROID.READ_MEDIA_VIDEO, // If you might deal with videos
        ];
    } else if (Platform.OS === 'ios') {
        permissionsToRequest = [
            PERMISSIONS.IOS.CAMERA,
            PERMISSIONS.IOS.PHOTO_LIBRARY, // For accessing gallery
            // PERMISSIONS.IOS.MEDIA_LIBRARY, // Alternative for broader media library access
        ];
    } else {
        console.log("Unsupported platform for permission requests.");
        return true; // Assume true for unsupported platforms
    }

    try {
        const statuses = await requestMultiple(permissionsToRequest);

        let allGranted = true;
        let rationaleNeeded = false;
        let permanentlyDenied = false;

        for (const permission of permissionsToRequest) {
            const status = statuses[permission];
            console.log(`Permission ${permission} status: ${status}`); // Log status for debugging

            if (status !== RESULTS.GRANTED) {
                allGranted = false;
                if (status === RESULTS.DENIED) {
                    rationaleNeeded = true; // User denied, but can be asked again
                } else if (status === RESULTS.BLOCKED || status === RESULTS.LIMITED) { // BLOCKED is "never ask again" on Android
                    permanentlyDenied = true; // User denied permanently or limited access
                }
            }
        }

        if (allGranted) {
            console.log("All required permissions granted.");
            return true;
        } else {
            console.warn("One or more permissions denied.");

            if (permanentlyDenied) {
                Alert.alert(
                    "Permission Required",
                    "It looks like some essential permissions were permanently denied. Please go to your device settings to enable them for ExpenseTracker.",
                    [
                        { text: "Cancel", style: "cancel" },
                        { text: "Open Settings", onPress: () => Linking.openSettings() }, // THIS IS THE KEY CHANGE
                    ]
                );
            } else if (rationaleNeeded) {
                // This is for cases where user denied but can be asked again.
                // The `requestMultiple` already handles showing the prompt if needed,
                // but this alert can provide additional context if the prompt isn't enough.
                Alert.alert(
                    "Permission Required",
                    "Camera and Storage permissions are essential for scanning receipts and managing your data. Please grant them to continue.",
                    [
                        { text: "OK" }, // User can re-attempt the in-app prompt
                        { text: "Open Settings", onPress: () => Linking.openSettings() }, // Offer settings anyway
                    ]
                );
            }
            return false;
        }
    } catch (err) {
        console.error("Error requesting permissions:", err);
        Alert.alert("Permission Request Error", "An unexpected error occurred while requesting permissions.");
        return false;
    }
};

// You can still keep this for clarity, but it just calls the main function
export const requestCameraPermission = async () => {
    return requestAppPermissions();
};
