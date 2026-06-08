/* ============================================
   FRIDA SPOOF SCRIPT - ULTIMATE DEVICE SPOOFING
   All Build Properties & Deep System Hooks
   Version: 4.2 - REAL NEW DEVICE COMPLETE
   Target: POCO F3 Complete Spoof + Full New Device
   ============================================ */

/* ========== UTILITIES ========== */

var RANDOM = function() {};

function _randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function _randomHex(len) {
    var hex = '0123456789abcdef';
    var output = '';
    for (var i = 0; i < len; ++i) {
        output += hex.charAt(Math.floor(Math.random() * hex.length));
    }
    return output;
}

function _pad(n, width) {
    n = n + "";
    return n.length >= width ? n : new Array(width - n.length + 1).join("0") + n;
}

function _randomPaddedInt(length) {
    return _pad(_randomInt(0, Math.pow(10, length)), length);
}

function _randomSerialNo() {
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    var result = "";
    for (var i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function _luhn_getcheck(code) {
    code = String(code).concat("0");
    var len = code.length;
    var parity = len % 2;
    var sum = 0;
    for (var i = len - 1; i >= 0; i--) {
        var d = parseInt(code.charAt(i))
        if (i % 2 == parity) {
            d *= 2;
        }
        if (d > 9) {
            d -= 9;
        }
        sum += d;
    }
    var checksum = sum % 10;
    return checksum == 0 ? 0 : 10 - checksum;
}

/* ========== LOGGING FUNCTIONS ========== */

function logInfo(msg) {
    console.log("\x1b[36m[INFO]\x1b[0m " + msg);
}

function logSuccess(msg) {
    console.log("\x1b[32m[✓]\x1b[0m " + msg);
}

function logWarn(msg) {
    console.warn("\x1b[33m[⚠]\x1b[0m " + msg);
}

function logError(msg) {
    console.error("\x1b[31m[✗]\x1b[0m " + msg);
}

function logDebug(msg) {
    console.log("\x1b[35m[DEBUG]\x1b[0m " + msg);
}

function getTimestamp() {
    return new Date().toISOString();
}

/* ========== DEVICE DATABASE EXTENDED ========== */

var DEVICE_DATABASE = {
    "samsung": {
        "s21": {
            DEVICE: "d1", PRODUCT: "d1q", MODEL: "SM-G991B", MANUFACTURER: "Samsung",
            BRAND: "samsung", FINGERPRINT: "samsung/d1q/d1:12/SPB1/G991BXXU1AUC2:user/release-keys",
            HARDWARE: "d1", HOST: "lgefx02", USER: "dpi", DISPLAY: "SPB1.201120.019",
            ID: "SPB1.201120.019", TAGS: "release-keys", TYPE: "user", BOARD: "d1",
            BOOTLOADER: "G991BXXU1AUC2", RADIO: "exynos9830",
            DEVICE_NAME: "Galaxy S21", DEVICE_FULL_NAME: "Samsung Galaxy S21",
            PRODUCT_NAME: "d1q", SDK_INT: 31, RELEASE: "12",
            FIRST_API_LEVEL: "31", SECURITY_PATCH: "2021-12-05", VNDK_VERSION: "31"
        },
        "s20": {
            DEVICE: "y2q", PRODUCT: "y2q", MODEL: "SM-G980F", MANUFACTURER: "Samsung",
            BRAND: "samsung", FINGERPRINT: "samsung/y2q/y2q:11/RP1A.200720.011/G980FXXU1ATJ1:user/release-keys",
            HARDWARE: "y2q", HOST: "lgefx02", USER: "dpi", DISPLAY: "RP1A.200720.011",
            ID: "RP1A.200720.011", TAGS: "release-keys", TYPE: "user", BOARD: "y2q",
            BOOTLOADER: "G980FXXU1ATJ1", RADIO: "exynos990",
            DEVICE_NAME: "Galaxy S20", DEVICE_FULL_NAME: "Samsung Galaxy S20",
            PRODUCT_NAME: "y2q", SDK_INT: 30, RELEASE: "11",
            FIRST_API_LEVEL: "29", SECURITY_PATCH: "2020-07-20", VNDK_VERSION: "30"
        }
    },
    "xiaomi": {
        "mi_11": {
            DEVICE: "venus", PRODUCT: "venus", MODEL: "M2011J18C", MANUFACTURER: "Xiaomi",
            BRAND: "xiaomi", FINGERPRINT: "Xiaomi/venus/venus:12/S1S1.211211.010/22.1.18:user/release-keys",
            HARDWARE: "venus", HOST: "xmkbuild22", USER: "android-build", DISPLAY: "S1S1.211211.010",
            ID: "S1S1.211211.010", TAGS: "release-keys", TYPE: "user", BOARD: "venus",
            BOOTLOADER: "unknown", RADIO: "msm",
            DEVICE_NAME: "Mi 11", DEVICE_FULL_NAME: "Xiaomi Mi 11",
            PRODUCT_NAME: "venus", SDK_INT: 31, RELEASE: "12",
            FIRST_API_LEVEL: "30", SECURITY_PATCH: "2021-12-10", VNDK_VERSION: "31"
        }
    }
};

function _getRandomDevice() {
    var brands = Object.keys(DEVICE_DATABASE);
    var randomBrand = brands[_randomInt(0, brands.length - 1)];
    var models = Object.keys(DEVICE_DATABASE[randomBrand]);
    var randomModel = models[_randomInt(0, models.length - 1)];
    return {
        data: DEVICE_DATABASE[randomBrand][randomModel],
        brand: randomBrand,
        model: randomModel
    };
}

/* ========== EXTENDED SYSTEM PROPERTIES HOOKING ========== */

function hookExtendedSystemProperties(deviceData) {
    logInfo("Hooking EXTENDED system properties (real new device)...");

    try {
        var System = Java.use("java.lang.System");
        var serialNo = _randomSerialNo();

        var propertyMap = {
            // Standard Device Properties
            "ro.product.device": deviceData.DEVICE,
            "ro.product.model": deviceData.MODEL,
            "ro.product.manufacturer": deviceData.MANUFACTURER,
            "ro.product.brand": deviceData.BRAND,
            "ro.product.product": deviceData.PRODUCT,
            "ro.product.name": deviceData.PRODUCT_NAME,

            // Build/Fingerprint Properties
            "ro.build.display.id": deviceData.DISPLAY,
            "ro.build.fingerprint": deviceData.FINGERPRINT,
            "ro.build.id": deviceData.ID,
            "ro.build.tags": deviceData.TAGS,
            "ro.build.type": deviceData.TYPE,
            "ro.build.host": deviceData.HOST,
            "ro.build.user": deviceData.USER,
            "ro.build.version.sdk": String(deviceData.SDK_INT),
            "ro.build.version.release": deviceData.RELEASE,
            "ro.build.version.security_patch": deviceData.SECURITY_PATCH,

            // Hardware Properties
            "ro.hardware": deviceData.HARDWARE,
            "ro.hardware.keystore": "msm8998",
            "ro.board.platform": deviceData.BOARD,
            "ro.bootloader": deviceData.BOOTLOADER,
            "ro.baseband": deviceData.RADIO,

            // Serial/Unique Identifiers
            "ro.serialno": serialNo,
            "ro.boot.serialno": serialNo,
            "persist.sys.serial": serialNo,
            "ro.vendor.product.serial": serialNo,

            // First API Level (critical for new device detection)
            "ro.product.first_api_level": String(deviceData.FIRST_API_LEVEL),
            "ro.board.first_api_level": String(deviceData.FIRST_API_LEVEL),

            // VNDK Version
            "ro.product.vndk.version": String(deviceData.VNDK_VERSION),

            // Security Properties
            "ro.secure": "1",
            "ro.debuggable": "0",
            "ro.boot.verifiedbootstate": "green",
            "ro.boot.flash.locked": "1",

            // Network Hostname
            "net.hostname": deviceData.DEVICE,
            "net.change": _randomHex(16)
        };

        System.getProperty.overload("java.lang.String").implementation = function(key) {
            if (propertyMap[key] !== undefined) {
                logDebug("System.getProperty(\"" + key + "\") -> " + propertyMap[key]);
                return propertyMap[key];
            }
            return this.getProperty(key);
        };

        logSuccess("Extended system properties hooked");

    } catch (err) {
        logError("Error hooking extended properties: " + err.message);
    }
}

/* ========== BUILD CLASS DEEP HOOKING ========== */

function deepSpoofBuildProperties(deviceData) {
    logInfo("Deep spoofing ALL Build class fields...");

    try {
        var Build = Java.use("android.os.Build");
        var serialNo = _randomSerialNo();

        var buildFields = {
            "DEVICE": deviceData.DEVICE,
            "PRODUCT": deviceData.PRODUCT,
            "MODEL": deviceData.MODEL,
            "MANUFACTURER": deviceData.MANUFACTURER,
            "BRAND": deviceData.BRAND,
            "FINGERPRINT": deviceData.FINGERPRINT,
            "HARDWARE": deviceData.HARDWARE,
            "HOST": deviceData.HOST,
            "USER": deviceData.USER,
            "DISPLAY": deviceData.DISPLAY,
            "ID": deviceData.ID,
            "TAGS": deviceData.TAGS,
            "TYPE": deviceData.TYPE,
            "BOARD": deviceData.BOARD,
            "BOOTLOADER": deviceData.BOOTLOADER,
            "RADIO": deviceData.RADIO,
            "SERIAL": serialNo,
            "IS_DEBUGGABLE": false
        };

        for (var fieldName in buildFields) {
            var fieldValue = buildFields[fieldName];

            try {
                var field = Build.class.getDeclaredField(fieldName);
                field.setAccessible(true);

                try {
                    var modifiersField = Java.use("java.lang.reflect.Field").class.getDeclaredField("modifiers");
                    modifiersField.setAccessible(true);
                    modifiersField.setInt(field, field.getModifiers() & ~Java.use("java.lang.reflect.Modifier").FINAL);
                } catch (e) {}

                field.set(null, fieldValue);
                logDebug("✓ Build." + fieldName + " = " + fieldValue);
            } catch (e) {
                logDebug("Build." + fieldName + ": " + e.message);
            }
        }

        logSuccess("Build properties deep spoofed");

    } catch (err) {
        logError("Error in Build spoofing: " + err.message);
    }
}

/* ========== BUILD VERSION HOOKING ========== */

function spoofBuildVersion(deviceData) {
    logInfo("Spoofing Build.VERSION & Build.VERSION_CODES...");

    try {
        var Version = Java.use("android.os.Build$VERSION");

        Version.SDK_INT.value = deviceData.SDK_INT;
        logDebug("✓ SDK_INT = " + deviceData.SDK_INT);

        Version.RELEASE.value = deviceData.RELEASE;
        logDebug("✓ RELEASE = " + deviceData.RELEASE);

        Version.SECURITY_PATCH.value = deviceData.SECURITY_PATCH;
        logDebug("✓ SECURITY_PATCH = " + deviceData.SECURITY_PATCH);

        Version.PREVIEW_SDK_INT.value = 0;
        logDebug("✓ PREVIEW_SDK_INT = 0");

        logSuccess("Build.VERSION spoofed");
    } catch (err) {
        logError("Error spoofing Build.VERSION: " + err.message);
    }
}

/* ========== DEVICE SETTINGS HOOKING ========== */

function hookDeviceSettings(deviceData) {
    logInfo("Hooking Device Settings...");

    try {
        var SettingsGlobal = Java.use("android.provider.Settings$Global");

        SettingsGlobal.getString.overload("android.content.ContentResolver", "java.lang.String").implementation = function(resolver, name) {
            if (name === "device_name") {
                logDebug("device_name -> " + deviceData.DEVICE_FULL_NAME);
                return deviceData.DEVICE_FULL_NAME;
            }
            return this.getString(resolver, name);
        };

        logSuccess("Device Settings hooked");

    } catch (err) {
        logError("Settings hooking error: " + err.message);
    }
}

/* ========== SECURE SETTINGS SPOOFING ========== */

function spoofSecureSettings() {
    logInfo("Spoofing Secure Settings (android_id)...");

    try {
        var SettingsSecure = Java.use("android.provider.Settings$Secure");
        var android_id = _randomHex(16);

        SettingsSecure.getString.overload("android.content.ContentResolver", "java.lang.String").implementation = function(resolver, name) {
            if (name === "android_id") {
                logDebug("android_id -> " + android_id);
                return android_id;
            }
            return this.getString(resolver, name);
        };

        logSuccess("Secure settings spoofed");

    } catch (err) {
        logDebug("Secure settings: " + err.message);
    }
}

/* ========== TELEPHONY SPOOFING ========== */

function spoofTelephony() {
    logInfo("Spoofing Telephony (IMEI, IMSI, etc)...");

    var android_id = _randomHex(16);
    var phone = _randomPaddedInt(10);
    var imei = _randomPaddedInt(14) + _luhn_getcheck(_randomPaddedInt(14));
    var imsi = _randomPaddedInt(15);
    var iccid = "89" + _randomPaddedInt(16) + _luhn_getcheck("89" + _randomPaddedInt(16));

    logSuccess("Telephony IDs: IMEI=" + imei + ", IMSI=" + imsi);

    try {
        var TelephonyManager = Java.use("android.telephony.TelephonyManager");

        TelephonyManager.getLine1Number.overload().implementation = function() {
            return phone;
        };

        TelephonyManager.getDeviceId.overload().implementation = function() {
            return imei;
        };

        TelephonyManager.getDeviceId.overload("int").implementation = function(slotIndex) {
            return imei;
        };

        TelephonyManager.getImei.overload().implementation = function() {
            return imei;
        };

        TelephonyManager.getImei.overload("int").implementation = function(slotIndex) {
            return imei;
        };

        TelephonyManager.getSubscriberId.overload().implementation = function() {
            return imsi;
        };

        TelephonyManager.getSimSerialNumber.overload().implementation = function() {
            return iccid;
        };

        logSuccess("Telephony spoofing complete");

    } catch (err) {
        logError("Telephony error: " + err.message);
    }
}

/* ========== MAC ADDRESS SPOOFING ========== */

function spoofMACAddress() {
    logInfo("Spoofing MAC address...");

    var mac = [];
    for (var i = 0; i < 6; i++) {
        mac.push(_randomInt(0, 255));
    }
    var mac_str = mac.map(function(x) { return _pad(x.toString(16), 2); }).join(":");

    logSuccess("MAC Address: " + mac_str.toUpperCase());

    try {
        var NetworkInterface = Java.use("java.net.NetworkInterface");
        NetworkInterface.getHardwareAddress.overload().implementation = function() {
            return Java.array("byte", mac);
        };

        logSuccess("MAC spoofing complete");
    } catch (err) {
        logError("MAC error: " + err.message);
    }
}

/* ========== GSF ID HIDING ========== */

function hideGSFID() {
    logInfo("Hiding GSF ID (Google Services Framework)...");

    try {
        var ContentResolver = Java.use("android.content.ContentResolver");

        ContentResolver.query.overload("android.net.Uri", "[Ljava.lang.String;", "android.os.Bundle", "android.os.CancellationSignal").implementation = function(uri, projection, queryArgs, cancellationSignal) {
            if (uri.toString().indexOf("com.google.android.gsf") !== -1) {
                return null;
            }
            return this.query(uri, projection, queryArgs, cancellationSignal);
        };

        ContentResolver.query.overload("android.net.Uri", "[Ljava.lang.String;", "java.lang.String", "[Ljava.lang.String;", "java.lang.String", "android.os.CancellationSignal").implementation = function(uri, projection, selection, selectionArgs, sortOrder, cancellationSignal) {
            if (uri.toString().indexOf("com.google.android.gsf") !== -1) {
                return null;
            }
            return this.query(uri, projection, selection, selectionArgs, sortOrder, cancellationSignal);
        };

        logSuccess("GSF ID hidden");

    } catch (err) {
        logDebug("GSF hiding: " + err.message);
    }
}

/* ========== ADVERTISING ID SPOOFING ========== */

function spoofAdvertisingId() {
    logInfo("Spoofing Advertising ID...");

    try {
        var AdvertisingIdClient = Java.use("com.google.android.gms.ads.identifier.AdvertisingIdClient");
        var Info = Java.use("com.google.android.gms.ads.identifier.AdvertisingIdClient$Info");

        AdvertisingIdClient.getAdvertisingIdInfo.overload("android.content.Context").implementation = function(context) {
            var adid = _randomHex(32);
            logSuccess("Advertising ID: " + adid);
            return Info.$new(adid, false);
        };

        logSuccess("Advertising ID spoofed");
    } catch (err) {
        logDebug("Advertising ID (GMS not available): " + err.message);
    }
}

/* ========== BOOT TIMESTAMP SPOOFING ========== */

function spoofBootTimestamps() {
    logInfo("Spoofing boot timestamps (first setup)...");

    try {
        var System = Java.use("java.lang.System");
        var firstBootTime = Date.now() - _randomInt(3600000, 604800000);

        // Spoof via system property
        var Build = Java.use("android.os.Build");
        try {
            var field = Build.class.getDeclaredField("TIME");
            field.setAccessible(true);
            var modifiersField = Java.use("java.lang.reflect.Field").class.getDeclaredField("modifiers");
            modifiersField.setAccessible(true);
            modifiersField.setInt(field, field.getModifiers() & ~Java.use("java.lang.reflect.Modifier").FINAL);
            field.set(null, firstBootTime);
            logDebug("✓ Build.TIME = " + firstBootTime);
        } catch(e) {
            logDebug("Build.TIME: " + e.message);
        }

        logSuccess("Boot timestamps spoofed");
    } catch (err) {
        logDebug("Boot timestamp error: " + err.message);
    }
}

/* ========== PACKAGE MANAGER SPOOFING (NEW) ========== */

function spoofPackageManager() {
    logInfo("Spoofing Package Manager (installation dates)...");

    try {
        var PackageManager = Java.use("android.content.pm.PackageManager");
        var getPackageInfo = PackageManager.getPackageInfo;

        getPackageInfo.overload("java.lang.String", "int").implementation = function(packageName, flags) {
            var info = this.getPackageInfo(packageName, flags);

            // Spoof first install time to appear as pre-installed
            try {
                var firstInstallTime = Date.now() - _randomInt(86400000, 604800000);
                info.firstInstallTime = firstInstallTime;
                info.lastUpdateTime = Date.now();
            } catch(e) {}

            return info;
        };

        logSuccess("Package Manager spoofed");
    } catch (err) {
        logDebug("PackageManager spoof: " + err.message);
    }
}

/* ========== INITIALIZATION (NEW DEVICE MARKER) ========== */

function createNewDeviceMarker() {
    logInfo("Creating NEW DEVICE markers...");

    try {
        var File = Java.use("java.io.File");
        var Settings = Java.use("android.provider.Settings$Secure");

        // Spoof setup wizard completion flag
        try {
            Settings.putString.overload("android.content.ContentResolver", "java.lang.String", "java.lang.String").implementation = function(resolver, name, value) {
                if (name === "setup_wizard_completed") {
                    return 1;
                }
                return this.putString(resolver, name, value);
            };
            logDebug("Setup wizard marked as complete");
        } catch(e) {}

        logSuccess("New device markers created");
    } catch (err) {
        logDebug("Device marker error: " + err.message);
    }
}


/* ========== ANDROID 13+/14 DYNAMIC RECEIVER COMPATIBILITY ========== */

function hookDynamicReceiverFlags() {
    logInfo("Hooking dynamic BroadcastReceiver flags...");

    // Android 13 introduced explicit receiver visibility flags and Android 14
    // enforces them for apps targeting newer SDKs. Some target apps/libraries still
    // call the legacy 2-arg/4-arg registerReceiver overloads, which crashes with:
    // "One of RECEIVER_EXPORTED or RECEIVER_NOT_EXPORTED should be specified".
    var RECEIVER_NOT_EXPORTED = 0x4;

    function installHooks(className) {
        try {
            var Klass = Java.use(className);

            try {
                var legacyTwoArg = Klass.registerReceiver.overload(
                    "android.content.BroadcastReceiver",
                    "android.content.IntentFilter"
                );
                var flaggedThreeArg = Klass.registerReceiver.overload(
                    "android.content.BroadcastReceiver",
                    "android.content.IntentFilter",
                    "int"
                );

                legacyTwoArg.implementation = function(receiver, filter) {
                    logDebug(className + ".registerReceiver(receiver, filter) -> RECEIVER_NOT_EXPORTED");
                    return flaggedThreeArg.call(this, receiver, filter, RECEIVER_NOT_EXPORTED);
                };
            } catch (e) {
                logDebug(className + " 2-arg receiver hook skipped: " + e.message);
            }

            try {
                var legacyFourArg = Klass.registerReceiver.overload(
                    "android.content.BroadcastReceiver",
                    "android.content.IntentFilter",
                    "java.lang.String",
                    "android.os.Handler"
                );
                var flaggedFiveArg = Klass.registerReceiver.overload(
                    "android.content.BroadcastReceiver",
                    "android.content.IntentFilter",
                    "java.lang.String",
                    "android.os.Handler",
                    "int"
                );

                legacyFourArg.implementation = function(receiver, filter, broadcastPermission, scheduler) {
                    logDebug(className + ".registerReceiver(receiver, filter, permission, scheduler) -> RECEIVER_NOT_EXPORTED");
                    return flaggedFiveArg.call(this, receiver, filter, broadcastPermission, scheduler, RECEIVER_NOT_EXPORTED);
                };
            } catch (e) {
                logDebug(className + " 4-arg receiver hook skipped: " + e.message);
            }
        } catch (err) {
            logDebug(className + " receiver hook unavailable: " + err.message);
        }
    }

    installHooks("android.content.ContextWrapper");
    installHooks("android.app.ContextImpl");

    logSuccess("Dynamic BroadcastReceiver flags hooked");
}

/* ========== MAIN EXECUTION ========== */

Java.perform(function () {
    console.log("\n");
    console.log("\x1b[1m\x1b[34m╔════════════════════════════════════════════════════════════════╗\x1b[0m");
    console.log("\x1b[1m\x1b[34m║  FRIDA ULTIMATE DEVICE SPOOFING SCRIPT v4.2 - REAL NEW DEVICE ║\x1b[0m");
    console.log("\x1b[1m\x1b[34m║     Extended Properties + First Boot Detection Spoofing       ║\x1b[0m");
    console.log("\x1b[1m\x1b[34m║    Target: POCO F3 → Complete Random Device Transformation   ║\x1b[0m");
    console.log("\x1b[1m\x1b[34m║              " + getTimestamp() + "              ║\x1b[0m");
    console.log("\x1b[1m\x1b[34m╚════════════════════════════════════════════════════════════════╝\x1b[0m");

    try {
        var randomDevice = _getRandomDevice();
        var deviceData = randomDevice.data;

        console.log("\x1b[1m\x1b[33m[DEVICE SELECTED]\x1b[0m " + randomDevice.brand.toUpperCase() + " > " + randomDevice.model + "\n");

        hookDynamicReceiverFlags();
        console.log("");

        deepSpoofBuildProperties(deviceData);
        console.log("");

        spoofBuildVersion(deviceData);
        console.log("");

        hookExtendedSystemProperties(deviceData);
        console.log("");

        hookDeviceSettings(deviceData);
        console.log("");

        spoofSecureSettings();
        console.log("");

        spoofTelephony();
        console.log("");

        spoofMACAddress();
        console.log("");

        spoofBootTimestamps();
        console.log("");

        spoofAdvertisingId();
        console.log("");

        spoofPackageManager();
        console.log("");

        createNewDeviceMarker();
        console.log("");

        hideGSFID();
        console.log("");

        console.log("\x1b[1m\x1b[32m╔════════════════════════════════════════════════════════════════╗\x1b[0m");
        console.log("\x1b[1m\x1b[32m║    ✓✓✓ REAL NEW DEVICE HOOKS INSTALLED SUCCESSFULLY ✓✓✓      ║\x1b[0m");
        console.log("\x1b[1m\x1b[32m║                                                                ║\x1b[0m");
        console.log("\x1b[1m\x1b[32m║  Device Transformation: POCO F3 → " + randomDevice.brand.toUpperCase().padEnd(22) + "║\x1b[0m");
        console.log("\x1b[1m\x1b[32m║  Model: " + randomDevice.model.padEnd(57) + "║\x1b[0m");
        console.log("\x1b[1m\x1b[32m║                                                                ║\x1b[0m");
        console.log("\x1b[1m\x1b[32m║  ✓ Build properties spoofed (all fields)                      ║\x1b[0m");
        console.log("\x1b[1m\x1b[32m║  ✓ Serial numbers randomized                                 ║\x1b[0m");
        console.log("\x1b[1m\x1b[32m║  ✓ Telephony IDs spoofed (IMEI/IMSI/ICCID)                   ║\x1b[0m");
        console.log("\x1b[1m\x1b[32m║  ✓ First boot detection markers created                      ║\x1b[0m");
        console.log("\x1b[1m\x1b[32m║  ✓ Package manager install dates spoofed                     ║\x1b[0m");
        console.log("\x1b[1m\x1b[32m║  ✓ Appears as COMPLETELY NEW DEVICE                          ║\x1b[0m");
        console.log("\x1b[1m\x1b[32m║                                                                ║\x1b[0m");
        console.log("\x1b[1m\x1b[32m║  → Force Stop & Restart target app to activate all hooks     ║\x1b[0m");
        console.log("\x1b[1m\x1b[32m╚════════════════════════════════════════════════════════════════╝\x1b[0m");

    } catch (err) {
        logError("CRITICAL ERROR: " + err.message);
        console.error(err);
    }
});
