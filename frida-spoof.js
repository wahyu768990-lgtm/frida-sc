/* ============================================
   FRIDA SPOOF SCRIPT - ULTIMATE DEVICE SPOOFING
   All Build Properties & Deep System Hooks
   Version: 4.2 - REAL NEW DEVICE COMPLETE
   Target: POCO F3 Complete Spoof + Full New Device
   ============================================ */

/* ========== CONFIGURATION ========== */
// Set these to false to disable specific modules for debugging/testing
var CONFIG = {
    ENABLE_DYNAMIC_RECEIVER_FIX: true,
    ENABLE_BUILD_SPOOFING: true,
    ENABLE_BUILD_VERSION_SPOOFING: true,
    ENABLE_JAVA_SYSTEM_PROPERTIES: true,
    ENABLE_NETWORK_MONITOR: false, // Keep false to reduce log noise
    ENABLE_PACKAGE_MANAGER_SPOOF: true,
    ENABLE_WEBVIEW_UA_SPOOF: true,
    ENABLE_TELEPHONY_SPOOF: true,
    ENABLE_NETWORK_INFO_SPOOF: true,
    ENABLE_PLAY_SERVICES_SPOOF: true,
    ENABLE_ADVERTISING_ID_SPOOF: true,
    ENABLE_APPSFLYER_SPOOF: true,
    ENABLE_INSTALL_REFERRER_SPOOF: true,

    ENABLE_ROOT_BYPASS: true,
    ENABLE_ANTI_DEBUG: true,
    ENABLE_NATIVE_SYSTEM_PROPERTIES: true,
    ENABLE_RESET_SESSION: true,
    ENABLE_HIDE_GSF: true,
    ENABLE_SSL_BYPASS: false, // Keep SSL bypass OFF for now to allow Shopee to communicate normally

    // Other smaller features
    ENABLE_LOCALE_TIMEZONE_SPOOF: true,
    ENABLE_SCREEN_METRICS_SPOOF: true,
    ENABLE_DEVICE_SETTINGS_SPOOF: true,
    ENABLE_SECURE_SETTINGS_SPOOF: true,
    ENABLE_MAC_ADDRESS_SPOOF: true,
    ENABLE_BOOT_TIMESTAMPS_SPOOF: true,
    ENABLE_NEW_DEVICE_MARKER: true
};

/* ========== UTILITIES ========== */

var RANDOM = function() {};
var ACTIVE_PROPERTY_MAP = {};
var NATIVE_PROPERTY_POINTERS = {};
var NATIVE_CALLBACK_REFS = [];

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
    return _pad(_randomInt(0, Math.pow(10, length) - 1), length);
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

var ERROR_LOG_FILE = "/sdcard/Download/fail.txt"; // Target path in Android external storage
var ERROR_LOG_INITIALIZED = false;

function _writeErrorToFile(msg) {
    try {
        var File = Java.use("java.io.File");
        var FileWriter = Java.use("java.io.FileWriter");
        var BufferedWriter = Java.use("java.io.BufferedWriter");
        var PrintWriter = Java.use("java.io.PrintWriter");

        var file = File.$new(ERROR_LOG_FILE);

        // Delete the file on first write
        if (!ERROR_LOG_INITIALIZED) {
            if (file.exists()) {
                file.delete();
            }
            ERROR_LOG_INITIALIZED = true;
        }

        var fw = FileWriter.$new(file, true);
        var bw = BufferedWriter.$new(fw);
        var pw = PrintWriter.$new(bw);

        pw.println("[" + getTimestamp() + "] " + msg);

        pw.close();
        bw.close();
        fw.close();
    } catch (e) {
        // Fallback to app's private directory if external storage is denied by SecurityException
        if (ERROR_LOG_FILE === "/sdcard/Download/fail.txt") {
            var context = null;
            try {
                var ActivityThread = Java.use('android.app.ActivityThread');
                context = ActivityThread.currentApplication().getApplicationContext();
            } catch (err) {}

            if (context) {
                ERROR_LOG_FILE = context.getFilesDir().getAbsolutePath() + "/fail.txt";
                ERROR_LOG_INITIALIZED = false; // reset to clear the new file
                _writeErrorToFile(msg); // retry
            }
        }
    }
}

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
    _writeErrorToFile(msg);
}

function logDebug(msg) {
    console.log("\x1b[35m[DEBUG]\x1b[0m " + msg);
}

function getTimestamp() {
    return new Date().toISOString();
}

/* ========== DEVICE DATABASE EXTENDED ========== */

var DEVICE_DATABASE = {
    "google": {
        "pixel_9_pro_xl": { DEVICE: "komodo", PRODUCT: "komodo", MODEL: "Pixel 9 Pro XL", MANUFACTURER: "Google", BRAND: "google", FINGERPRINT: "google/komodo/komodo:16/BP2A.250605.031.A2/13010374:user/release-keys", HARDWARE: "komodo", HOST: "ab", USER: "android-build", DISPLAY: "BP2A.250605.031.A2", ID: "BP2A.250605.031.A2", TAGS: "release-keys", TYPE: "user", BOARD: "komodo", BOOTLOADER: "komodo-1.0-12821422", RADIO: "g5400p-145620-250311-B-12999434", DEVICE_NAME: "Pixel 9 Pro XL", DEVICE_FULL_NAME: "Pixel 9 Pro XL", PRODUCT_NAME: "komodo", SDK_INT: 36, RELEASE: "16", FIRST_API_LEVEL: "35", SECURITY_PATCH: "2026-06-05", VNDK_VERSION: "36", CPU_ABI: "arm64-v8a", CPU_ABI2: "", EGL: "mali" },
        "pixel_9_pro": { DEVICE: "caiman", PRODUCT: "caiman", MODEL: "Pixel 9 Pro", MANUFACTURER: "Google", BRAND: "google", FINGERPRINT: "google/caiman/caiman:16/BP2A.250605.031.A2/13010374:user/release-keys", HARDWARE: "caiman", HOST: "ab", USER: "android-build", DISPLAY: "BP2A.250605.031.A2", ID: "BP2A.250605.031.A2", TAGS: "release-keys", TYPE: "user", BOARD: "caiman", BOOTLOADER: "caiman-1.0-12821422", RADIO: "g5400p-145620-250311-B-12999434", DEVICE_NAME: "Pixel 9 Pro", DEVICE_FULL_NAME: "Pixel 9 Pro", PRODUCT_NAME: "caiman", SDK_INT: 36, RELEASE: "16", FIRST_API_LEVEL: "35", SECURITY_PATCH: "2026-06-05", VNDK_VERSION: "36", CPU_ABI: "arm64-v8a", CPU_ABI2: "", EGL: "mali" },
        "pixel_9": { DEVICE: "tokay", PRODUCT: "tokay", MODEL: "Pixel 9", MANUFACTURER: "Google", BRAND: "google", FINGERPRINT: "google/tokay/tokay:16/BP2A.250605.031.A2/13010374:user/release-keys", HARDWARE: "tokay", HOST: "ab", USER: "android-build", DISPLAY: "BP2A.250605.031.A2", ID: "BP2A.250605.031.A2", TAGS: "release-keys", TYPE: "user", BOARD: "tokay", BOOTLOADER: "tokay-1.0-12821422", RADIO: "g5400p-145620-250311-B-12999434", DEVICE_NAME: "Pixel 9", DEVICE_FULL_NAME: "Pixel 9", PRODUCT_NAME: "tokay", SDK_INT: 36, RELEASE: "16", FIRST_API_LEVEL: "35", SECURITY_PATCH: "2026-06-05", VNDK_VERSION: "36", CPU_ABI: "arm64-v8a", CPU_ABI2: "", EGL: "mali" },
        "pixel_9_pro_fold": { DEVICE: "comet", PRODUCT: "comet", MODEL: "Pixel 9 Pro Fold", MANUFACTURER: "Google", BRAND: "google", FINGERPRINT: "google/comet/comet:16/BP2A.250605.031.A2/13010374:user/release-keys", HARDWARE: "comet", HOST: "ab", USER: "android-build", DISPLAY: "BP2A.250605.031.A2", ID: "BP2A.250605.031.A2", TAGS: "release-keys", TYPE: "user", BOARD: "comet", BOOTLOADER: "comet-1.0-12821422", RADIO: "g5400p-145620-250311-B-12999434", DEVICE_NAME: "Pixel 9 Pro Fold", DEVICE_FULL_NAME: "Pixel 9 Pro Fold", PRODUCT_NAME: "comet", SDK_INT: 36, RELEASE: "16", FIRST_API_LEVEL: "35", SECURITY_PATCH: "2026-06-05", VNDK_VERSION: "36", CPU_ABI: "arm64-v8a", CPU_ABI2: "", EGL: "mali" },
        "pixel_8_pro": { DEVICE: "husky", PRODUCT: "husky", MODEL: "Pixel 8 Pro", MANUFACTURER: "Google", BRAND: "google", FINGERPRINT: "google/husky/husky:16/BP2A.250605.031.A2/13010374:user/release-keys", HARDWARE: "husky", HOST: "ab", USER: "android-build", DISPLAY: "BP2A.250605.031.A2", ID: "BP2A.250605.031.A2", TAGS: "release-keys", TYPE: "user", BOARD: "husky", BOOTLOADER: "husky-1.0-12821422", RADIO: "g5300g-250228-250311-B-12999434", DEVICE_NAME: "Pixel 8 Pro", DEVICE_FULL_NAME: "Pixel 8 Pro", PRODUCT_NAME: "husky", SDK_INT: 36, RELEASE: "16", FIRST_API_LEVEL: "34", SECURITY_PATCH: "2026-06-05", VNDK_VERSION: "36", CPU_ABI: "arm64-v8a", CPU_ABI2: "", EGL: "mali" },
        "pixel_8": { DEVICE: "shiba", PRODUCT: "shiba", MODEL: "Pixel 8", MANUFACTURER: "Google", BRAND: "google", FINGERPRINT: "google/shiba/shiba:16/BP2A.250605.031.A2/13010374:user/release-keys", HARDWARE: "shiba", HOST: "ab", USER: "android-build", DISPLAY: "BP2A.250605.031.A2", ID: "BP2A.250605.031.A2", TAGS: "release-keys", TYPE: "user", BOARD: "shiba", BOOTLOADER: "shiba-1.0-12821422", RADIO: "g5300g-250228-250311-B-12999434", DEVICE_NAME: "Pixel 8", DEVICE_FULL_NAME: "Pixel 8", PRODUCT_NAME: "shiba", SDK_INT: 36, RELEASE: "16", FIRST_API_LEVEL: "34", SECURITY_PATCH: "2026-06-05", VNDK_VERSION: "36", CPU_ABI: "arm64-v8a", CPU_ABI2: "", EGL: "mali" },
        "pixel_8a": { DEVICE: "akita", PRODUCT: "akita", MODEL: "Pixel 8a", MANUFACTURER: "Google", BRAND: "google", FINGERPRINT: "google/akita/akita:16/BP2A.250605.031.A2/13010374:user/release-keys", HARDWARE: "akita", HOST: "ab", USER: "android-build", DISPLAY: "BP2A.250605.031.A2", ID: "BP2A.250605.031.A2", TAGS: "release-keys", TYPE: "user", BOARD: "akita", BOOTLOADER: "akita-1.0-12821422", RADIO: "g5300g-250228-250311-B-12999434", DEVICE_NAME: "Pixel 8a", DEVICE_FULL_NAME: "Pixel 8a", PRODUCT_NAME: "akita", SDK_INT: 36, RELEASE: "16", FIRST_API_LEVEL: "34", SECURITY_PATCH: "2026-06-05", VNDK_VERSION: "36", CPU_ABI: "arm64-v8a", CPU_ABI2: "", EGL: "mali" },
        "pixel_fold": { DEVICE: "felix", PRODUCT: "felix", MODEL: "Pixel Fold", MANUFACTURER: "Google", BRAND: "google", FINGERPRINT: "google/felix/felix:16/BP2A.250605.031.A2/13010374:user/release-keys", HARDWARE: "felix", HOST: "ab", USER: "android-build", DISPLAY: "BP2A.250605.031.A2", ID: "BP2A.250605.031.A2", TAGS: "release-keys", TYPE: "user", BOARD: "felix", BOOTLOADER: "felix-1.0-12821422", RADIO: "g5300g-250228-250311-B-12999434", DEVICE_NAME: "Pixel Fold", DEVICE_FULL_NAME: "Pixel Fold", PRODUCT_NAME: "felix", SDK_INT: 36, RELEASE: "16", FIRST_API_LEVEL: "33", SECURITY_PATCH: "2026-06-05", VNDK_VERSION: "36", CPU_ABI: "arm64-v8a", CPU_ABI2: "", EGL: "mali" },
        "pixel_tablet": { DEVICE: "tangorpro", PRODUCT: "tangorpro", MODEL: "Pixel Tablet", MANUFACTURER: "Google", BRAND: "google", FINGERPRINT: "google/tangorpro/tangorpro:16/BP2A.250605.031.A2/13010374:user/release-keys", HARDWARE: "tangorpro", HOST: "ab", USER: "android-build", DISPLAY: "BP2A.250605.031.A2", ID: "BP2A.250605.031.A2", TAGS: "release-keys", TYPE: "user", BOARD: "tangorpro", BOOTLOADER: "tangorpro-1.0-12821422", RADIO: "g5300g-250228-250311-B-12999434", DEVICE_NAME: "Pixel Tablet", DEVICE_FULL_NAME: "Pixel Tablet", PRODUCT_NAME: "tangorpro", SDK_INT: 36, RELEASE: "16", FIRST_API_LEVEL: "33", SECURITY_PATCH: "2026-06-05", VNDK_VERSION: "36", CPU_ABI: "arm64-v8a", CPU_ABI2: "", EGL: "mali" },
        "pixel_7_pro": { DEVICE: "cheetah", PRODUCT: "cheetah", MODEL: "Pixel 7 Pro", MANUFACTURER: "Google", BRAND: "google", FINGERPRINT: "google/cheetah/cheetah:16/BP2A.250605.031.A2/13010374:user/release-keys", HARDWARE: "cheetah", HOST: "ab", USER: "android-build", DISPLAY: "BP2A.250605.031.A2", ID: "BP2A.250605.031.A2", TAGS: "release-keys", TYPE: "user", BOARD: "cheetah", BOOTLOADER: "cheetah-1.0-12821422", RADIO: "g5300g-250228-250311-B-12999434", DEVICE_NAME: "Pixel 7 Pro", DEVICE_FULL_NAME: "Pixel 7 Pro", PRODUCT_NAME: "cheetah", SDK_INT: 36, RELEASE: "16", FIRST_API_LEVEL: "33", SECURITY_PATCH: "2026-06-05", VNDK_VERSION: "36", CPU_ABI: "arm64-v8a", CPU_ABI2: "", EGL: "mali" },
        "pixel_7": { DEVICE: "panther", PRODUCT: "panther", MODEL: "Pixel 7", MANUFACTURER: "Google", BRAND: "google", FINGERPRINT: "google/panther/panther:16/BP2A.250605.031.A2/13010374:user/release-keys", HARDWARE: "panther", HOST: "ab", USER: "android-build", DISPLAY: "BP2A.250605.031.A2", ID: "BP2A.250605.031.A2", TAGS: "release-keys", TYPE: "user", BOARD: "panther", BOOTLOADER: "panther-1.0-12821422", RADIO: "g5300g-250228-250311-B-12999434", DEVICE_NAME: "Pixel 7", DEVICE_FULL_NAME: "Pixel 7", PRODUCT_NAME: "panther", SDK_INT: 36, RELEASE: "16", FIRST_API_LEVEL: "33", SECURITY_PATCH: "2026-06-05", VNDK_VERSION: "36", CPU_ABI: "arm64-v8a", CPU_ABI2: "", EGL: "mali" },
        "pixel_7a": { DEVICE: "lynx", PRODUCT: "lynx", MODEL: "Pixel 7a", MANUFACTURER: "Google", BRAND: "google", FINGERPRINT: "google/lynx/lynx:16/BP2A.250605.031.A2/13010374:user/release-keys", HARDWARE: "lynx", HOST: "ab", USER: "android-build", DISPLAY: "BP2A.250605.031.A2", ID: "BP2A.250605.031.A2", TAGS: "release-keys", TYPE: "user", BOARD: "lynx", BOOTLOADER: "lynx-1.0-12821422", RADIO: "g5300g-250228-250311-B-12999434", DEVICE_NAME: "Pixel 7a", DEVICE_FULL_NAME: "Pixel 7a", PRODUCT_NAME: "lynx", SDK_INT: 36, RELEASE: "16", FIRST_API_LEVEL: "33", SECURITY_PATCH: "2026-06-05", VNDK_VERSION: "36", CPU_ABI: "arm64-v8a", CPU_ABI2: "", EGL: "mali" },
        "pixel_6_pro": { DEVICE: "raven", PRODUCT: "raven", MODEL: "Pixel 6 Pro", MANUFACTURER: "Google", BRAND: "google", FINGERPRINT: "google/raven/raven:16/BP2A.250605.031.A2/13010374:user/release-keys", HARDWARE: "raven", HOST: "ab", USER: "android-build", DISPLAY: "BP2A.250605.031.A2", ID: "BP2A.250605.031.A2", TAGS: "release-keys", TYPE: "user", BOARD: "raven", BOOTLOADER: "raven-1.0-12821422", RADIO: "g5123b-123456-250311-B-12999434", DEVICE_NAME: "Pixel 6 Pro", DEVICE_FULL_NAME: "Pixel 6 Pro", PRODUCT_NAME: "raven", SDK_INT: 36, RELEASE: "16", FIRST_API_LEVEL: "31", SECURITY_PATCH: "2026-06-05", VNDK_VERSION: "36", CPU_ABI: "arm64-v8a", CPU_ABI2: "", EGL: "mali" },
        "pixel_6": { DEVICE: "oriole", PRODUCT: "oriole", MODEL: "Pixel 6", MANUFACTURER: "Google", BRAND: "google", FINGERPRINT: "google/oriole/oriole:16/BP2A.250605.031.A2/13010374:user/release-keys", HARDWARE: "oriole", HOST: "ab", USER: "android-build", DISPLAY: "BP2A.250605.031.A2", ID: "BP2A.250605.031.A2", TAGS: "release-keys", TYPE: "user", BOARD: "oriole", BOOTLOADER: "oriole-1.0-12821422", RADIO: "g5123b-123456-250311-B-12999434", DEVICE_NAME: "Pixel 6", DEVICE_FULL_NAME: "Pixel 6", PRODUCT_NAME: "oriole", SDK_INT: 36, RELEASE: "16", FIRST_API_LEVEL: "31", SECURITY_PATCH: "2026-06-05", VNDK_VERSION: "36", CPU_ABI: "arm64-v8a", CPU_ABI2: "", EGL: "mali" },
        "pixel_6a": { DEVICE: "bluejay", PRODUCT: "bluejay", MODEL: "Pixel 6a", MANUFACTURER: "Google", BRAND: "google", FINGERPRINT: "google/bluejay/bluejay:16/BP2A.250605.031.A2/13010374:user/release-keys", HARDWARE: "bluejay", HOST: "ab", USER: "android-build", DISPLAY: "BP2A.250605.031.A2", ID: "BP2A.250605.031.A2", TAGS: "release-keys", TYPE: "user", BOARD: "bluejay", BOOTLOADER: "bluejay-1.0-12821422", RADIO: "g5123b-123456-250311-B-12999434", DEVICE_NAME: "Pixel 6a", DEVICE_FULL_NAME: "Pixel 6a", PRODUCT_NAME: "bluejay", SDK_INT: 36, RELEASE: "16", FIRST_API_LEVEL: "31", SECURITY_PATCH: "2026-06-05", VNDK_VERSION: "36", CPU_ABI: "arm64-v8a", CPU_ABI2: "", EGL: "mali" }
    },
    "poco": {
        "f3_android16": {
            DEVICE: "alioth", PRODUCT: "alioth", MODEL: "M2012K11AG", MANUFACTURER: "Xiaomi",
            BRAND: "POCO", FINGERPRINT: "POCO/alioth_global/alioth:16/BP2A.250605.031.A2/V816.0.3.0.WKHMIXM:user/release-keys",
            HARDWARE: "qcom", HOST: "builder-miui", USER: "builder", DISPLAY: "BP2A.250605.031.A2 release-keys",
            ID: "BP2A.250605.031.A2", TAGS: "release-keys", TYPE: "user", BOARD: "kona",
            BOOTLOADER: "unknown", RADIO: "2.5.c1-gl-21664-0605_0000_0000000",
            DEVICE_NAME: "POCO F3", DEVICE_FULL_NAME: "POCO F3",
            PRODUCT_NAME: "alioth_global", SDK_INT: 36, RELEASE: "16",
            FIRST_API_LEVEL: "30", SECURITY_PATCH: "2026-06-05", VNDK_VERSION: "36",
            CPU_ABI: "arm64-v8a", CPU_ABI2: "", EGL: "adreno"
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

function _randomUuid() {
    var hex = _randomHex(32);
    return hex.substring(0, 8) + "-" + hex.substring(8, 12) + "-" + hex.substring(12, 16) + "-" + hex.substring(16, 20) + "-" + hex.substring(20);
}

function _randomImei() {
    var base = _randomPaddedInt(14);
    return base + _luhn_getcheck(base);
}

function _randomIccid() {
    var base = "89" + _randomPaddedInt(16);
    return base + _luhn_getcheck(base);
}

function _randomMacBytes() {
    var mac = [];
    for (var i = 0; i < 6; i++) {
        mac.push(_randomInt(0, 255));
    }

    // Locally administered unicast MAC: realistic for randomized Android Wi-Fi MACs.
    mac[0] = (mac[0] | 0x02) & 0xfe;
    return mac;
}

function _macBytesToString(mac) {
    return mac.map(function(x) { return _pad(x.toString(16), 2); }).join(":").toUpperCase();
}

function createSpoofProfile(deviceData) {
    var serialNo = _randomSerialNo();
    var androidId = _randomHex(16);
    var phone = _randomPaddedInt(10);
    var imei = _randomImei();
    var imsi = _randomPaddedInt(15);
    var iccid = _randomIccid();
    var macBytes = _randomMacBytes();

    return {
        serialNo: serialNo,
        androidId: androidId,
        phone: phone,
        imei: imei,
        imsi: imsi,
        iccid: iccid,
        macBytes: macBytes,
        macString: _macBytesToString(macBytes),
        advertisingId: _randomUuid(),
        appsFlyerId: _randomHex(16) + "-" + _randomHex(8),
        installReferrer: "utm_source=google-play&utm_medium=organic&utm_campaign=organic",
        userAgent: "Mozilla/5.0 (Linux; Android " + deviceData.RELEASE + "; " + deviceData.MODEL + ") AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/96.0." + _randomInt(1000, 4999) + "." + _randomInt(10, 199) + " Mobile Safari/537.36",
        bootTime: Date.now() - _randomInt(3600000, 604800000),
        firstInstallTime: Date.now() - _randomInt(86400000, 604800000),
        lastUpdateTime: Date.now(),
        deviceName: deviceData.DEVICE_NAME || deviceData.DEVICE_FULL_NAME || deviceData.MODEL,
        wifiSsid: "AndroidWifi_" + _randomHex(4),
        bssid: _macBytesToString(_randomMacBytes()),
        ipv4: "192.168." + _randomInt(0, 254) + "." + _randomInt(2, 254),
        asn: "AS24203",
        networkOperator: "51011",
        simOperator: "51011",
        carrierName: "XL Axiata",
        localeLanguage: "id",
        localeCountry: "ID",
        localeTag: "id-ID",
        timezoneId: "Asia/Jakarta",
        screenWidth: 1080,
        screenHeight: 2400,
        density: 2.75,
        densityDpi: 440,
        packageInstallSource: "com.android.vending",
        playServicesVersionName: "24.20.16",
        playServicesVersionCode: 242016000,
        tlsSessionId: _randomHex(64)
    };
}

/* ========== EXTENDED SYSTEM PROPERTIES HOOKING ========== */

function hookExtendedSystemProperties(deviceData, spoofProfile) {
    logInfo("Hooking EXTENDED system properties (real new device)...");

    try {
        var System = Java.use("java.lang.System");
        var serialNo = spoofProfile.serialNo;

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
            "service.adb.root": "0",
            "ro.boot.verifiedbootstate": "green",
            "ro.boot.flash.locked": "1",

            // Market/device names often used by Device Info apps and OEM SDKs
            "ro.product.marketname": deviceData.DEVICE_NAME,
            "ro.vendor.product.marketname": deviceData.DEVICE_NAME,
            "ro.product.vendor.marketname": deviceData.DEVICE_NAME,
            "ro.config.marketing_name": deviceData.DEVICE_NAME,
            "ro.product.system.model": deviceData.MODEL,
            "ro.product.vendor.model": deviceData.MODEL,
            "ro.product.odm.model": deviceData.MODEL,
            "ro.product.system.device": deviceData.DEVICE,
            "ro.product.vendor.device": deviceData.DEVICE,
            "ro.product.odm.device": deviceData.DEVICE,
            "ro.product.system.brand": deviceData.BRAND,
            "ro.product.vendor.brand": deviceData.BRAND,
            "ro.product.odm.brand": deviceData.BRAND,
            "ro.product.system.manufacturer": deviceData.MANUFACTURER,
            "ro.product.vendor.manufacturer": deviceData.MANUFACTURER,
            "ro.product.odm.manufacturer": deviceData.MANUFACTURER,

            // Network Hostname / browser agent
            "net.hostname": deviceData.DEVICE,
            "net.change": _randomHex(16),
            "http.agent": spoofProfile.userAgent,
            "ro.com.google.clientidbase": "android-" + deviceData.BRAND,
            "ro.build.characteristics": "nosdcard",
            "gsm.sim.operator.numeric": spoofProfile.simOperator,
            "gsm.operator.numeric": spoofProfile.networkOperator,
            "gsm.sim.operator.alpha": spoofProfile.carrierName,
            "gsm.operator.alpha": spoofProfile.carrierName,
            "wifi.interface": "wlan0",
            "ro.product.cpu.abi": deviceData.CPU_ABI || "arm64-v8a",
            "ro.product.cpu.abi2": deviceData.CPU_ABI2 || "",
            "ro.product.cpu.abilist": "arm64-v8a,armeabi-v7a,armeabi",
            "ro.product.cpu.abilist64": "arm64-v8a",
            "ro.product.cpu.abilist32": "armeabi-v7a,armeabi",
            "ro.hardware.egl": deviceData.EGL || "adreno",
            "gsm.version.baseband": deviceData.RADIO,
            "gsm.sim.operator.iso-country": spoofProfile.localeCountry.toLowerCase(),
            "gsm.operator.iso-country": spoofProfile.localeCountry.toLowerCase(),
            "gsm.operator.isroaming": "false,false",
            "persist.radio.multisim.config": "dsds",
            "persist.sys.locale": spoofProfile.localeTag,
            "persist.sys.language": spoofProfile.localeLanguage,
            "persist.sys.country": spoofProfile.localeCountry,
            "persist.sys.timezone": spoofProfile.timezoneId,
            "ro.product.bootimage.model": deviceData.MODEL,
            "ro.product.bootimage.brand": deviceData.BRAND,
            "ro.product.bootimage.device": deviceData.DEVICE,
            "ro.product.bootimage.manufacturer": deviceData.MANUFACTURER,
            "ro.product.bootimage.name": deviceData.PRODUCT_NAME,
            "ro.product.system_ext.model": deviceData.MODEL,
            "ro.product.system_ext.brand": deviceData.BRAND,
            "ro.product.system_ext.device": deviceData.DEVICE,
            "ro.product.system_ext.manufacturer": deviceData.MANUFACTURER,
            "ro.product.system_ext.name": deviceData.PRODUCT_NAME,
            "ro.boot.hardware": deviceData.HARDWARE,
            "ro.boot.hardware.platform": deviceData.BOARD
        };

        ACTIVE_PROPERTY_MAP = propertyMap;

        System.getProperty.overload("java.lang.String").implementation = function(key) {
            if (propertyMap[key] !== undefined) {
                logDebug("System.getProperty(\"" + key + "\") -> " + propertyMap[key]);
                return propertyMap[key];
            }
            return this.getProperty(key);
        };

        try {
            var SystemProperties = Java.use("android.os.SystemProperties");

            SystemProperties.get.overload("java.lang.String").implementation = function(key) {
                if (propertyMap[key] !== undefined) {
                    logDebug("SystemProperties.get(\"" + key + "\") -> " + propertyMap[key]);
                    return propertyMap[key];
                }
                return this.get(key);
            };

            SystemProperties.get.overload("java.lang.String", "java.lang.String").implementation = function(key, def) {
                if (propertyMap[key] !== undefined) {
                    logDebug("SystemProperties.get(\"" + key + "\", def) -> " + propertyMap[key]);
                    return propertyMap[key];
                }
                return this.get(key, def);
            };

            try {
                SystemProperties.native_get.overload("java.lang.String").implementation = function(key) {
                    if (propertyMap[key] !== undefined) {
                        logDebug("SystemProperties.native_get(\"" + key + "\") -> " + propertyMap[key]);
                        return propertyMap[key];
                    }
                    return this.native_get(key);
                };
            } catch (nativeOneArgErr) {
                logDebug("SystemProperties.native_get 1-arg hook skipped: " + nativeOneArgErr.message);
            }

            try {
                SystemProperties.native_get.overload("java.lang.String", "java.lang.String").implementation = function(key, def) {
                    if (propertyMap[key] !== undefined) {
                        logDebug("SystemProperties.native_get(\"" + key + "\", def) -> " + propertyMap[key]);
                        return propertyMap[key];
                    }
                    return this.native_get(key, def);
                };
            } catch (nativeTwoArgErr) {
                logDebug("SystemProperties.native_get 2-arg hook skipped: " + nativeTwoArgErr.message);
            }
        } catch (e) {
            logDebug("SystemProperties hook skipped: " + e.message);
        }

        logSuccess("Extended system properties hooked");

    } catch (err) {
        logError("Error hooking extended properties: " + err.message);
    }
}

/* ========== BUILD CLASS DEEP HOOKING ========== */

function deepSpoofBuildProperties(deviceData, spoofProfile) {
    logInfo("Deep spoofing ALL Build class fields...");

    try {
        var Build = Java.use("android.os.Build");
        var serialNo = spoofProfile.serialNo;

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
            "CPU_ABI": deviceData.CPU_ABI || "arm64-v8a",
            "CPU_ABI2": deviceData.CPU_ABI2 || ""
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

        try {
            Build.getSerial.overload().implementation = function() {
                logDebug("Build.getSerial() -> " + serialNo);
                return serialNo;
            };
        } catch (e) {
            logDebug("Build.getSerial hook skipped: " + e.message);
        }

        try {
            var supportedAbis = Java.array("java.lang.String", [deviceData.CPU_ABI || "arm64-v8a", "armeabi-v7a", "armeabi"]);
            var supported64 = Java.array("java.lang.String", [deviceData.CPU_ABI || "arm64-v8a"]);
            var supported32 = Java.array("java.lang.String", ["armeabi-v7a", "armeabi"]);
            Build.SUPPORTED_ABIS.value = supportedAbis;
            Build.SUPPORTED_64_BIT_ABIS.value = supported64;
            Build.SUPPORTED_32_BIT_ABIS.value = supported32;
            logDebug("✓ Build.SUPPORTED_ABIS = " + supportedAbis.join(","));
        } catch (e) {
            logDebug("Build SUPPORTED_ABIS hook skipped: " + e.message);
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

function hookDeviceSettings(deviceData, spoofProfile) {
    logInfo("Hooking Device Settings...");

    var spoofedDeviceName = spoofProfile.deviceName;
    var deviceNameSettings = {
        "device_name": spoofedDeviceName,
        "bluetooth_name": spoofedDeviceName,
        "wifi_p2p_device_name": spoofedDeviceName,
        "packageinstaller_first_boot_time": String(spoofProfile.bootTime),
        "lock_screen_owner_info": "",
        "lock_screen_owner_info_enabled": "0"
    };

    function hookSettingsClass(className) {
        try {
            var SettingsClass = Java.use(className);

            try {
                SettingsClass.getString.overload("android.content.ContentResolver", "java.lang.String").implementation = function(resolver, name) {
                    if (deviceNameSettings[name] !== undefined) {
                        logDebug(className + ".getString(" + name + ") -> " + deviceNameSettings[name]);
                        return deviceNameSettings[name];
                    }
                    return this.getString(resolver, name);
                };
            } catch (e) {
                logDebug(className + ".getString hook skipped: " + e.message);
            }

            try {
                SettingsClass.getStringForUser.overload("android.content.ContentResolver", "java.lang.String", "int").implementation = function(resolver, name, userHandle) {
                    if (deviceNameSettings[name] !== undefined) {
                        logDebug(className + ".getStringForUser(" + name + ") -> " + deviceNameSettings[name]);
                        return deviceNameSettings[name];
                    }
                    return this.getStringForUser(resolver, name, userHandle);
                };
            } catch (e) {
                logDebug(className + ".getStringForUser hook skipped: " + e.message);
            }
        } catch (err) {
            logDebug(className + " hook unavailable: " + err.message);
        }
    }

    hookSettingsClass("android.provider.Settings$Global");
    hookSettingsClass("android.provider.Settings$Secure");
    hookSettingsClass("android.provider.Settings$System");

    try {
        var BluetoothAdapter = Java.use("android.bluetooth.BluetoothAdapter");
        BluetoothAdapter.getName.overload().implementation = function() {
            logDebug("BluetoothAdapter.getName() -> " + spoofedDeviceName);
            return spoofedDeviceName;
        };
    } catch (err) {
        logDebug("Bluetooth name hook unavailable: " + err.message);
    }

    try {
        var Build = Java.use("android.os.Build");
        Build.getRadioVersion.overload().implementation = function() {
            logDebug("Build.getRadioVersion() -> " + deviceData.RADIO);
            return deviceData.RADIO;
        };
    } catch (err) {
        logDebug("Build radio hook unavailable: " + err.message);
    }

    logSuccess("Device Settings hooked");
}

/* ========== SECURE SETTINGS SPOOFING ========== */

function spoofSecureSettings(deviceData, spoofProfile) {
    logInfo("Spoofing Secure Settings (android_id)...");

    try {
        var SettingsSecure = Java.use("android.provider.Settings$Secure");
        var android_id = spoofProfile.androidId;
        var secureSpoofMap = {
            "android_id": android_id
        };

        if (deviceData) {
            var spoofedDeviceName = spoofProfile.deviceName;
            secureSpoofMap.device_name = spoofedDeviceName;
            secureSpoofMap.bluetooth_name = spoofedDeviceName;
            secureSpoofMap.wifi_p2p_device_name = spoofedDeviceName;
        }

        SettingsSecure.getString.overload("android.content.ContentResolver", "java.lang.String").implementation = function(resolver, name) {
            if (secureSpoofMap[name] !== undefined) {
                logDebug(name + " -> " + secureSpoofMap[name]);
                return secureSpoofMap[name];
            }
            return this.getString(resolver, name);
        };

        try {
            SettingsSecure.getStringForUser.overload("android.content.ContentResolver", "java.lang.String", "int").implementation = function(resolver, name, userHandle) {
                if (secureSpoofMap[name] !== undefined) {
                    logDebug("Secure.getStringForUser(" + name + ") -> " + secureSpoofMap[name]);
                    return secureSpoofMap[name];
                }
                return this.getStringForUser(resolver, name, userHandle);
            };
        } catch (e) {
            logDebug("Secure.getStringForUser hook skipped: " + e.message);
        }

        try {
            SettingsSecure.getInt.overload("android.content.ContentResolver", "java.lang.String").implementation = function(resolver, name) {
                if (secureSpoofMap[name] !== undefined) {
                    return parseInt(secureSpoofMap[name], 16) || 0;
                }
                return this.getInt(resolver, name);
            };
        } catch (e) {
            logDebug("Secure.getInt hook skipped: " + e.message);
        }

        try {
            SettingsSecure.getInt.overload("android.content.ContentResolver", "java.lang.String", "int").implementation = function(resolver, name, def) {
                if (secureSpoofMap[name] !== undefined) {
                    return parseInt(secureSpoofMap[name], 16) || def;
                }
                return this.getInt(resolver, name, def);
            };
        } catch (e) {
            logDebug("Secure.getInt default hook skipped: " + e.message);
        }

        try {
            SettingsSecure.getLong.overload("android.content.ContentResolver", "java.lang.String", "long").implementation = function(resolver, name, def) {
                if (secureSpoofMap[name] !== undefined) {
                    return parseInt(secureSpoofMap[name].substring(0, 12), 16) || def;
                }
                return this.getLong(resolver, name, def);
            };
        } catch (e) {
            logDebug("Secure.getLong default hook skipped: " + e.message);
        }

        logSuccess("Secure settings spoofed");

    } catch (err) {
        logDebug("Secure settings: " + err.message);
    }
}

/* ========== TELEPHONY SPOOFING ========== */

function spoofTelephony(spoofProfile) {
    logInfo("Spoofing Telephony (IMEI, IMSI, etc)...");

    var phone = spoofProfile.phone;
    var imei = spoofProfile.imei;
    var imsi = spoofProfile.imsi;
    var iccid = spoofProfile.iccid;

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

        try {
            TelephonyManager.getMeid.overload().implementation = function() {
                return imei.substring(0, 14);
            };
        } catch (e) {
            logDebug("Telephony getMeid hook skipped: " + e.message);
        }

        try {
            TelephonyManager.getMeid.overload("int").implementation = function(slotIndex) {
                return imei.substring(0, 14);
            };
        } catch (e) {
            logDebug("Telephony getMeid(slot) hook skipped: " + e.message);
        }

        TelephonyManager.getSubscriberId.overload().implementation = function() {
            return imsi;
        };

        try {
            TelephonyManager.getSubscriberId.overload("int").implementation = function(subId) {
                return imsi;
            };
        } catch (e) {
            logDebug("Telephony getSubscriberId(int) hook skipped: " + e.message);
        }

        TelephonyManager.getSimSerialNumber.overload().implementation = function() {
            return iccid;
        };

        try {
            TelephonyManager.getSimSerialNumber.overload("int").implementation = function(subId) {
                return iccid;
            };
        } catch (e) {
            logDebug("Telephony getSimSerialNumber(int) hook skipped: " + e.message);
        }

        try {
            TelephonyManager.getSimOperator.overload().implementation = function() {
                return spoofProfile.simOperator;
            };
            TelephonyManager.getNetworkOperator.overload().implementation = function() {
                return spoofProfile.networkOperator;
            };
            TelephonyManager.getSimOperatorName.overload().implementation = function() {
                return spoofProfile.carrierName;
            };
            TelephonyManager.getNetworkOperatorName.overload().implementation = function() {
                return spoofProfile.carrierName;
            };
        } catch (e) {
            logDebug("Telephony operator hook skipped: " + e.message);
        }

        logSuccess("Telephony spoofing complete");

    } catch (err) {
        logError("Telephony error: " + err.message);
    }
}

/* ========== MAC ADDRESS SPOOFING ========== */

function spoofMACAddress(spoofProfile) {
    logInfo("Spoofing MAC address...");

    var mac = spoofProfile.macBytes;
    var mac_str = spoofProfile.macString;

    logSuccess("MAC Address: " + mac_str);

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

function spoofAdvertisingId(spoofProfile) {
    logInfo("Spoofing Advertising ID...");

    try {
        var AdvertisingIdClient = Java.use("com.google.android.gms.ads.identifier.AdvertisingIdClient");
        var Info = Java.use("com.google.android.gms.ads.identifier.AdvertisingIdClient$Info");
        var adid = spoofProfile.advertisingId;

        AdvertisingIdClient.getAdvertisingIdInfo.overload("android.content.Context").implementation = function(context) {
            logDebug("Advertising ID -> " + adid);
            return Info.$new(adid, false);
        };

        try {
            Info.getId.overload().implementation = function() {
                logDebug("AdvertisingIdClient.Info.getId() -> " + adid);
                return adid;
            };
        } catch (e) {
            logDebug("AdvertisingIdClient.Info.getId hook skipped: " + e.message);
        }

        try {
            Info.isLimitAdTrackingEnabled.overload().implementation = function() {
                return false;
            };
        } catch (e) {
            logDebug("AdvertisingIdClient.Info.isLimitAdTrackingEnabled hook skipped: " + e.message);
        }

        logSuccess("Advertising ID spoofed: " + adid);
    } catch (err) {
        logDebug("Advertising ID (GMS not available): " + err.message);
    }
}

/* ========== BOOT TIMESTAMP SPOOFING ========== */

function spoofBootTimestamps(spoofProfile) {
    logInfo("Spoofing boot timestamps (first setup)...");

    try {
        var System = Java.use("java.lang.System");
        var firstBootTime = spoofProfile.bootTime;

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

function spoofPackageManager(spoofProfile) {
    logInfo("Spoofing PackageManager (install source, installer, install dates)...");

    var installSource = spoofProfile.packageInstallSource;

    function setJavaField(obj, name, value) {
        try { obj[name].value = value; return; } catch (e) {}
        try { obj[name] = value; } catch (ignored) {}
    }

    function isPlayPackage(packageName) {
        return packageName === "com.google.android.gms" ||
            packageName === "com.android.vending" ||
            packageName === "com.google.android.gsf";
    }

    function fakeApplicationInfo(packageName) {
        try {
            var ApplicationInfo = Java.use("android.content.pm.ApplicationInfo");
            var appInfo = ApplicationInfo.$new();
            setJavaField(appInfo, "packageName", packageName);
            setJavaField(appInfo, "name", packageName);
            setJavaField(appInfo, "enabled", true);
            setJavaField(appInfo, "flags", 1);
            return appInfo;
        } catch (e) {
            logDebug("fakeApplicationInfo failed for " + packageName + ": " + e.message);
            return null;
        }
    }

    function fakePackageInfo(packageName) {
        try {
            var PackageInfo = Java.use("android.content.pm.PackageInfo");
            var info = PackageInfo.$new();
            setJavaField(info, "packageName", packageName);
            setJavaField(info, "firstInstallTime", spoofProfile.firstInstallTime);
            setJavaField(info, "lastUpdateTime", spoofProfile.lastUpdateTime);
            setJavaField(info, "versionName", packageName === "com.google.android.gms" ? spoofProfile.playServicesVersionName : "1.0");
            setJavaField(info, "versionCode", packageName === "com.google.android.gms" ? spoofProfile.playServicesVersionCode : 1);
            setJavaField(info, "applicationInfo", fakeApplicationInfo(packageName));
            return info;
        } catch (e) {
            logDebug("fakePackageInfo failed for " + packageName + ": " + e.message);
            return null;
        }
    }

    function normalizePackageInfo(info) {
        if (info === null || info === undefined) {
            return info;
        }

        try { info.firstInstallTime = spoofProfile.firstInstallTime; } catch (e) {}
        try { info.lastUpdateTime = spoofProfile.lastUpdateTime; } catch (e) {}
        try { info.installLocation = 0; } catch (e) {}
        return info;
    }

    function normalizeApplicationInfo(info) {
        if (info === null || info === undefined) {
            return info;
        }

        try { info.enabled = true; } catch (e) {}
        return info;
    }

    try {
        var PackageManager = Java.use("android.content.pm.PackageManager");

        try {
            var getPackageInfoInt = PackageManager.getPackageInfo.overload("java.lang.String", "int");
            getPackageInfoInt.implementation = function(packageName, flags) {
                try {
                    return normalizePackageInfo(getPackageInfoInt.call(this, packageName, flags));
                } catch (e) {
                    if (isPlayPackage(packageName)) {
                        return normalizePackageInfo(fakePackageInfo(packageName));
                    }
                    throw e;
                }
            };
        } catch (e) {
            logDebug("PackageManager.getPackageInfo(String,int) hook skipped: " + e.message);
        }

        try {
            var PackageInfoFlags = Java.use("android.content.pm.PackageManager$PackageInfoFlags");
            var getPackageInfoFlags = PackageManager.getPackageInfo.overload("java.lang.String", "android.content.pm.PackageManager$PackageInfoFlags");
            getPackageInfoFlags.implementation = function(packageName, flags) {
                try {
                    return normalizePackageInfo(getPackageInfoFlags.call(this, packageName, flags));
                } catch (e) {
                    if (isPlayPackage(packageName)) {
                        return normalizePackageInfo(fakePackageInfo(packageName));
                    }
                    throw e;
                }
            };
        } catch (e) {
            logDebug("PackageManager.getPackageInfo(String,PackageInfoFlags) hook skipped: " + e.message);
        }

        try {
            var getApplicationInfoInt = PackageManager.getApplicationInfo.overload("java.lang.String", "int");
            getApplicationInfoInt.implementation = function(packageName, flags) {
                try {
                    return normalizeApplicationInfo(getApplicationInfoInt.call(this, packageName, flags));
                } catch (e) {
                    if (isPlayPackage(packageName)) {
                        return normalizeApplicationInfo(fakeApplicationInfo(packageName));
                    }
                    throw e;
                }
            };
        } catch (e) {
            logDebug("PackageManager.getApplicationInfo(String,int) hook skipped: " + e.message);
        }

        try {
            var ApplicationInfoFlags = Java.use("android.content.pm.PackageManager$ApplicationInfoFlags");
            var getApplicationInfoFlags = PackageManager.getApplicationInfo.overload("java.lang.String", "android.content.pm.PackageManager$ApplicationInfoFlags");
            getApplicationInfoFlags.implementation = function(packageName, flags) {
                try {
                    return normalizeApplicationInfo(getApplicationInfoFlags.call(this, packageName, flags));
                } catch (e) {
                    if (isPlayPackage(packageName)) {
                        return normalizeApplicationInfo(fakeApplicationInfo(packageName));
                    }
                    throw e;
                }
            };
        } catch (e) {
            logDebug("PackageManager.getApplicationInfo(String,ApplicationInfoFlags) hook skipped: " + e.message);
        }

        try {
            PackageManager.getInstallerPackageName.overload("java.lang.String").implementation = function(packageName) {
                logDebug("PackageManager.getInstallerPackageName(" + packageName + ") -> " + installSource);
                return installSource;
            };
        } catch (e) {
            logDebug("PackageManager.getInstallerPackageName hook skipped: " + e.message);
        }

        try {
            var ApplicationPackageManager = Java.use("android.app.ApplicationPackageManager");
            ApplicationPackageManager.getInstallerPackageName.overload('java.lang.String').implementation = function(Str) {
                logDebug("ApplicationPackageManager.getInstallerPackageName(" + Str + ") -> " + installSource);
                return installSource;
            };
        } catch (e) {
            logDebug("ApplicationPackageManager.getInstallerPackageName hook skipped: " + e.message);
        }

        try {
            var getInstallSourceInfo = PackageManager.getInstallSourceInfo.overload("java.lang.String");
            getInstallSourceInfo.implementation = function(packageName) {
                logDebug("PackageManager.getInstallSourceInfo(" + packageName + ") -> original object with spoofed getters");
                return getInstallSourceInfo.call(this, packageName);
            };
        } catch (e) {
            logDebug("PackageManager.getInstallSourceInfo hook skipped: " + e.message);
        }

        try {
            var InstallSourceInfo = Java.use("android.content.pm.InstallSourceInfo");

            InstallSourceInfo.getInstallingPackageName.overload().implementation = function() {
                return installSource;
            };
            InstallSourceInfo.getInitiatingPackageName.overload().implementation = function() {
                return installSource;
            };
            InstallSourceInfo.getOriginatingPackageName.overload().implementation = function() {
                return installSource;
            };
        } catch (e) {
            logDebug("InstallSourceInfo getter hook skipped: " + e.message);
        }

        logSuccess("PackageManager spoofed: installer=" + installSource + ", firstInstallTime=" + spoofProfile.firstInstallTime);
    } catch (err) {
        logDebug("PackageManager spoof unavailable: " + err.message);
    }
}

/* ========== WEBVIEW / USER-AGENT SPOOFING ========== */

function spoofWebViewUserAgent(deviceData, spoofProfile) {
    logInfo("Spoofing WebView/User-Agent...");

    var userAgent = spoofProfile.userAgent;

    try {
        var System = Java.use("java.lang.System");
        System.setProperty("http.agent", userAgent);
    } catch (e) {
        logDebug("System http.agent set skipped: " + e.message);
    }

    try {
        var WebSettings = Java.use("android.webkit.WebSettings");

        try {
            WebSettings.getDefaultUserAgent.overload("android.content.Context").implementation = function(context) {
                logDebug("WebSettings.getDefaultUserAgent() -> " + userAgent);
                return userAgent;
            };
        } catch (e) {
            logDebug("WebSettings.getDefaultUserAgent hook skipped: " + e.message);
        }

        try {
            WebSettings.getUserAgentString.overload().implementation = function() {
                logDebug("WebSettings.getUserAgentString() -> " + userAgent);
                return userAgent;
            };
        } catch (e) {
            logDebug("WebSettings.getUserAgentString hook skipped: " + e.message);
        }

        try {
            WebSettings.setUserAgentString.overload("java.lang.String").implementation = function(value) {
                logDebug("WebSettings.setUserAgentString(" + value + ") forced -> " + userAgent);
                return this.setUserAgentString(userAgent);
            };
        } catch (e) {
            logDebug("WebSettings.setUserAgentString hook skipped: " + e.message);
        }

        logSuccess("WebView/User-Agent spoofed: " + userAgent);
    } catch (err) {
        logDebug("WebView/User-Agent hook unavailable: " + err.message);
    }
}

/* ========== APPSFLYER SPOOFING ========== */

function spoofAppsFlyer(spoofProfile) {
    logInfo("Spoofing AppsFlyer identifiers...");

    var appsFlyerId = spoofProfile.appsFlyerId;
    var installSource = spoofProfile.packageInstallSource;

    try {
        var AppsFlyerLib = Java.use("com.appsflyer.AppsFlyerLib");

        try {
            AppsFlyerLib.getAppsFlyerUID.overload("android.content.Context").implementation = function(context) {
                logDebug("AppsFlyerLib.getAppsFlyerUID() -> " + appsFlyerId);
                return appsFlyerId;
            };
        } catch (e) {
            logDebug("AppsFlyer getAppsFlyerUID hook skipped: " + e.message);
        }

        try {
            AppsFlyerLib.setCollectAndroidID.overload("boolean").implementation = function(enabled) {
                logDebug("AppsFlyer setCollectAndroidID(" + enabled + ") forced false");
                return this.setCollectAndroidID(false);
            };
        } catch (e) {
            logDebug("AppsFlyer setCollectAndroidID hook skipped: " + e.message);
        }

        try {
            AppsFlyerLib.setCollectIMEI.overload("boolean").implementation = function(enabled) {
                logDebug("AppsFlyer setCollectIMEI(" + enabled + ") forced false");
                return this.setCollectIMEI(false);
            };
        } catch (e) {
            logDebug("AppsFlyer setCollectIMEI hook skipped: " + e.message);
        }

        logSuccess("AppsFlyer spoofed: " + appsFlyerId + " via " + installSource);
    } catch (err) {
        logDebug("AppsFlyer SDK hook unavailable: " + err.message);
    }
}

/* ========== INSTALL REFERRER SPOOFING ========== */

function spoofInstallReferrer(spoofProfile) {
    logInfo("Spoofing Install Referrer...");

    var referrer = spoofProfile.installReferrer;
    var clickTs = Math.floor((spoofProfile.firstInstallTime - _randomInt(60000, 3600000)) / 1000);
    var installTs = Math.floor(spoofProfile.firstInstallTime / 1000);

    try {
        var ReferrerDetails = Java.use("com.android.installreferrer.api.ReferrerDetails");

        try {
            ReferrerDetails.getInstallReferrer.overload().implementation = function() {
                logDebug("ReferrerDetails.getInstallReferrer() -> " + referrer);
                return referrer;
            };
        } catch (e) {
            logDebug("InstallReferrer getInstallReferrer hook skipped: " + e.message);
        }

        try {
            ReferrerDetails.getReferrerClickTimestampSeconds.overload().implementation = function() {
                return clickTs;
            };
        } catch (e) {
            logDebug("InstallReferrer click timestamp hook skipped: " + e.message);
        }

        try {
            ReferrerDetails.getInstallBeginTimestampSeconds.overload().implementation = function() {
                return installTs;
            };
        } catch (e) {
            logDebug("InstallReferrer install timestamp hook skipped: " + e.message);
        }

        try {
            ReferrerDetails.getGooglePlayInstantParam.overload().implementation = function() {
                return false;
            };
        } catch (e) {
            logDebug("InstallReferrer instant param hook skipped: " + e.message);
        }

        logSuccess("Install Referrer spoofed: " + referrer);
    } catch (err) {
        logDebug("Install Referrer API hook unavailable: " + err.message);
    }
}

/* ========== NETWORK INFO SPOOFING ========== */

function spoofNetworkInfo(spoofProfile) {
    logInfo("Spoofing network info...");

    var macString = spoofProfile.macString;
    var bssid = spoofProfile.bssid;
    var ssid = '"' + spoofProfile.wifiSsid + '"';
    var ipParts = spoofProfile.ipv4.split(".");
    var ipInt = (parseInt(ipParts[0]) & 0xff) | ((parseInt(ipParts[1]) & 0xff) << 8) | ((parseInt(ipParts[2]) & 0xff) << 16) | ((parseInt(ipParts[3]) & 0xff) << 24);

    try {
        var WifiInfo = Java.use("android.net.wifi.WifiInfo");

        try {
            WifiInfo.getMacAddress.overload().implementation = function() {
                logDebug("WifiInfo.getMacAddress() -> " + macString);
                return macString;
            };
        } catch (e) {
            logDebug("WifiInfo.getMacAddress hook skipped: " + e.message);
        }

        try {
            WifiInfo.getBSSID.overload().implementation = function() {
                logDebug("WifiInfo.getBSSID() -> " + bssid);
                return bssid;
            };
        } catch (e) {
            logDebug("WifiInfo.getBSSID hook skipped: " + e.message);
        }

        try {
            WifiInfo.getSSID.overload().implementation = function() {
                logDebug("WifiInfo.getSSID() -> " + ssid);
                return ssid;
            };
        } catch (e) {
            logDebug("WifiInfo.getSSID hook skipped: " + e.message);
        }

        try {
            WifiInfo.getIpAddress.overload().implementation = function() {
                return ipInt;
            };
        } catch (e) {
            logDebug("WifiInfo.getIpAddress hook skipped: " + e.message);
        }
    } catch (err) {
        logDebug("WifiInfo hook unavailable: " + err.message);
    }

    try {
        var TelephonyManager = Java.use("android.telephony.TelephonyManager");

        TelephonyManager.getNetworkOperator.overload().implementation = function() {
            return spoofProfile.networkOperator;
        };
        TelephonyManager.getSimOperator.overload().implementation = function() {
            return spoofProfile.simOperator;
        };
        TelephonyManager.getNetworkOperatorName.overload().implementation = function() {
            return spoofProfile.carrierName;
        };
        TelephonyManager.getSimOperatorName.overload().implementation = function() {
            return spoofProfile.carrierName;
        };
        TelephonyManager.getNetworkCountryIso.overload().implementation = function() {
            return spoofProfile.localeCountry.toLowerCase();
        };
        TelephonyManager.getSimCountryIso.overload().implementation = function() {
            return spoofProfile.localeCountry.toLowerCase();
        };
    } catch (err) {
        logDebug("Telephony network info hook unavailable: " + err.message);
    }

    logSuccess("Network info spoofed: SSID=" + ssid + ", BSSID=" + bssid + ", IP=" + spoofProfile.ipv4);
}

/* ========== NATIVE / JNI SYSTEM PROPERTY SPOOFING ========== */

function hookNativeSystemProperties() {
    logInfo("Hooking native/JNI system properties...");

    function findNativeExport(moduleName, exportName) {
        try {
            if (typeof Module.findExportByName === "function") {
                var legacyPtr = Module.findExportByName(moduleName, exportName);
                if (legacyPtr !== null) {
                    return legacyPtr;
                }
            }
        } catch (e) {
            logDebug("Module.findExportByName failed for " + exportName + ": " + e.message);
        }

        try {
            if (typeof Module.findGlobalExportByName === "function") {
                var globalPtr = Module.findGlobalExportByName(exportName);
                if (globalPtr !== null) {
                    return globalPtr;
                }
            }
        } catch (e) {
            logDebug("Module.findGlobalExportByName failed for " + exportName + ": " + e.message);
        }

        try {
            if (typeof Module.getGlobalExportByName === "function") {
                var strictGlobalPtr = Module.getGlobalExportByName(exportName);
                if (strictGlobalPtr !== null) {
                    return strictGlobalPtr;
                }
            }
        } catch (e) {
            logDebug("Module.getGlobalExportByName failed for " + exportName + ": " + e.message);
        }

        try {
            if (moduleName && typeof Process.getModuleByName === "function") {
                var moduleObj = Process.getModuleByName(moduleName);
                if (moduleObj && typeof moduleObj.findExportByName === "function") {
                    var modulePtr = moduleObj.findExportByName(exportName);
                    if (modulePtr !== null) {
                        return modulePtr;
                    }
                }
                if (moduleObj && typeof moduleObj.getExportByName === "function") {
                    try {
                        var strictModulePtr = moduleObj.getExportByName(exportName);
                        if (strictModulePtr !== null) {
                            return strictModulePtr;
                        }
                    } catch (strictModuleErr) {}
                }
                if (moduleObj && typeof moduleObj.enumerateExports === "function") {
                    var exports = moduleObj.enumerateExports();
                    for (var i = 0; i < exports.length; i++) {
                        if (exports[i].name === exportName) {
                            return exports[i].address;
                        }
                    }
                }
            }
        } catch (e) {
            logDebug("Process module export lookup failed for " + exportName + ": " + e.message);
        }

        return null;
    }

    function spoofedValueForKey(key) {
        if (!key) {
            return undefined;
        }
        return ACTIVE_PROPERTY_MAP[key];
    }

    function attachPropertyGet(propertyGet) {
        Interceptor.attach(propertyGet, {
            onEnter: function(args) {
                try {
                    this.key = args[0].readCString();
                    this.valuePtr = args[1];
                } catch (e) {
                    this.key = null;
                    this.valuePtr = null;
                }
            },
            onLeave: function(retval) {
                var spoofed = spoofedValueForKey(this.key);
                if (spoofed !== undefined && this.valuePtr !== null) {
                    var spoofedString = String(spoofed);
                    this.valuePtr.writeUtf8String(spoofedString);
                    retval.replace(spoofedString.length);
                    logDebug("native __system_property_get(" + this.key + ") -> " + spoofedString);
                }
            }
        });
    }

    function attachPropertyFind(propertyFind) {
        Interceptor.attach(propertyFind, {
            onEnter: function(args) {
                try {
                    this.key = args[0].readCString();
                } catch (e) {
                    this.key = null;
                }
            },
            onLeave: function(retval) {
                if (this.key && !retval.isNull()) {
                    NATIVE_PROPERTY_POINTERS[retval.toString()] = this.key;
                }
            }
        });
    }

    function safeWriteUtf8String(ptr, str) {
        if (ptr === null || ptr.isNull()) return;
        try {
            var len = str.length * 2 + 1; // conservative size for utf8
            Memory.protect(ptr, Process.pageSize, 'rwx');
            ptr.writeUtf8String(str);
        } catch (e) {
            logDebug("safeWriteUtf8String failed: " + e.message);
        }
    }

    function attachPropertyRead(propertyRead) {
        Interceptor.attach(propertyRead, {
            onEnter: function(args) {
                this.propInfo = args[0];
                this.namePtr = args[1];
                this.valuePtr = args[2];
            },
            onLeave: function(retval) {
                var key = NATIVE_PROPERTY_POINTERS[this.propInfo.toString()];
                var spoofed = spoofedValueForKey(key);
                if (spoofed !== undefined && this.valuePtr !== null && !this.valuePtr.isNull()) {
                    var spoofedString = String(spoofed);
                    try {
                        safeWriteUtf8String(this.namePtr, key);
                        safeWriteUtf8String(this.valuePtr, spoofedString);
                        retval.replace(spoofedString.length);
                        logDebug("native __system_property_read(" + key + ") -> " + spoofedString);
                    } catch (e) {
                        logDebug("Failed to write spoofed property " + key + ": " + e);
                    }
                }
            }
        });
    }

    function attachPropertyReadCallback(propertyReadCallback) {
        Interceptor.attach(propertyReadCallback, {
            onEnter: function(args) {
                var propInfo = args[0];
                if (propInfo === null || propInfo.isNull()) return;

                var key = NATIVE_PROPERTY_POINTERS[propInfo.toString()];
                if (!key) return;

                var spoofed = spoofedValueForKey(key);
                if (spoofed === undefined) return;

                try {
                    var originalCallback = args[1];
                    if (originalCallback === null || originalCallback.isNull()) return;

                    var callbackFn = new NativeFunction(originalCallback, "void", ["pointer", "pointer", "pointer", "uint"]);
                    var namePtr = Memory.allocUtf8String(key);
                    var valuePtr = Memory.allocUtf8String(String(spoofed));

                    var replacement = new NativeCallback(function(cookie, name, value, serial) {
                        // Forward the cookie and serial unmodified, but inject our spoofed pointers
                        callbackFn(cookie, namePtr, valuePtr, serial);
                    }, "void", ["pointer", "pointer", "pointer", "uint"]);

                    NATIVE_CALLBACK_REFS.push(replacement, namePtr, valuePtr);
                    args[1] = replacement;
                    logDebug("native __system_property_read_callback(" + key + ") -> " + spoofed);
                } catch (e) {
                    logDebug("native read_callback replacement failed: " + e.message);
                }
            }
        });
    }

    var hooked = 0;

    try {
        var propertyGet = findNativeExport(null, "__system_property_get") || findNativeExport("libc.so", "__system_property_get");
        if (propertyGet !== null) {
            attachPropertyGet(propertyGet);
            hooked++;
        }

        var propertyFind = findNativeExport(null, "__system_property_find") || findNativeExport("libc.so", "__system_property_find");
        if (propertyFind !== null) {
            attachPropertyFind(propertyFind);
            hooked++;
        }

        var propertyRead = findNativeExport(null, "__system_property_read") || findNativeExport("libc.so", "__system_property_read");
        if (propertyRead !== null) {
            attachPropertyRead(propertyRead);
            hooked++;
        }

        var propertyReadCallback = findNativeExport(null, "__system_property_read_callback") || findNativeExport("libc.so", "__system_property_read_callback");
        if (propertyReadCallback !== null) {
            attachPropertyReadCallback(propertyReadCallback);
            hooked++;
        }

        if (hooked === 0) {
            logDebug("No native system property exports found");
            return;
        }

        logSuccess("Native/JNI system properties hooked (" + hooked + " exports)");
    } catch (err) {
        logDebug("Native/JNI property hook unavailable: " + err.message);
    }
}

/* ========== LOCALE / TIMEZONE SPOOFING ========== */

function spoofLocaleTimezone(spoofProfile) {
    logInfo("Spoofing locale/timezone...");

    // Do not override Locale.getDefault()/TimeZone.getDefault() directly. On
    // recent Android/Frida combinations returning a retained wrapper from a
    // static method hook can trip Frida's return-type validation and leave
    // framework LocaleList state null, crashing resource inflation. Setting
    // the framework defaults is safer and still updates Java callers.
    try {
        var Locale = Java.use("java.util.Locale");
        var spoofLocale = Locale.$new(spoofProfile.localeLanguage, spoofProfile.localeCountry);
        Locale.setDefault.overload("java.util.Locale").call(Locale, spoofLocale);

        try {
            var LocaleList = Java.use("android.os.LocaleList");
            var spoofLocaleList = LocaleList.forLanguageTags(spoofProfile.localeTag);
            LocaleList.setDefault.overload("android.os.LocaleList").call(LocaleList, spoofLocaleList);
        } catch (e) {
            logDebug("LocaleList.setDefault hook skipped: " + e.message);
        }
    } catch (err) {
        logDebug("Locale default update unavailable: " + err.message);
    }

    try {
        var TimeZone = Java.use("java.util.TimeZone");
        var spoofTimeZone = TimeZone.getTimeZone(spoofProfile.timezoneId);
        TimeZone.setDefault.overload("java.util.TimeZone").call(TimeZone, spoofTimeZone);

        logSuccess("Locale/timezone spoofed: " + spoofProfile.localeTag + " / " + spoofProfile.timezoneId);
    } catch (err) {
        logDebug("Timezone default update unavailable: " + err.message);
    }
}

/* ========== SCREEN METRICS SPOOFING ========== */

function spoofScreenMetrics(spoofProfile) {
    logInfo("Spoofing screen metrics...");

    function applyMetrics(metrics) {
        if (metrics === null || metrics === undefined) {
            return metrics;
        }

        try { metrics.widthPixels.value = spoofProfile.screenWidth; } catch (e) { try { metrics.widthPixels = spoofProfile.screenWidth; } catch (ignored) {} }
        try { metrics.heightPixels.value = spoofProfile.screenHeight; } catch (e) { try { metrics.heightPixels = spoofProfile.screenHeight; } catch (ignored) {} }
        try { metrics.density.value = spoofProfile.density; } catch (e) { try { metrics.density = spoofProfile.density; } catch (ignored) {} }
        try { metrics.scaledDensity.value = spoofProfile.density; } catch (e) { try { metrics.scaledDensity = spoofProfile.density; } catch (ignored) {} }
        try { metrics.densityDpi.value = spoofProfile.densityDpi; } catch (e) { try { metrics.densityDpi = spoofProfile.densityDpi; } catch (ignored) {} }
        try { metrics.xdpi.value = spoofProfile.densityDpi; } catch (e) { try { metrics.xdpi = spoofProfile.densityDpi; } catch (ignored) {} }
        try { metrics.ydpi.value = spoofProfile.densityDpi; } catch (e) { try { metrics.ydpi = spoofProfile.densityDpi; } catch (ignored) {} }
        return metrics;
    }

    try {
        var Resources = Java.use("android.content.res.Resources");
        var getDisplayMetrics = Resources.getDisplayMetrics.overload();
        getDisplayMetrics.implementation = function() {
            return applyMetrics(getDisplayMetrics.call(this));
        };
    } catch (err) {
        logDebug("Resources.getDisplayMetrics hook unavailable: " + err.message);
    }

    try {
        var Display = Java.use("android.view.Display");

        try {
            var getMetrics = Display.getMetrics.overload("android.util.DisplayMetrics");
            getMetrics.implementation = function(outMetrics) {
                getMetrics.call(this, outMetrics);
                applyMetrics(outMetrics);
            };
        } catch (e) {
            logDebug("Display.getMetrics hook skipped: " + e.message);
        }

        try {
            var getRealMetrics = Display.getRealMetrics.overload("android.util.DisplayMetrics");
            getRealMetrics.implementation = function(outMetrics) {
                getRealMetrics.call(this, outMetrics);
                applyMetrics(outMetrics);
            };
        } catch (e) {
            logDebug("Display.getRealMetrics hook skipped: " + e.message);
        }
    } catch (err) {
        logDebug("Display metrics hook unavailable: " + err.message);
    }

    logSuccess("Screen metrics spoofed: " + spoofProfile.screenWidth + "x" + spoofProfile.screenHeight + " @ " + spoofProfile.densityDpi + "dpi");
}

/* ========== PLAY SERVICES STATE SPOOFING ========== */

function spoofPlayServicesState(spoofProfile) {
    logInfo("Spoofing Play Services availability state...");

    function hookAvailabilityClass(className) {
        try {
            var Klass = Java.use(className);

            try {
                Klass.isGooglePlayServicesAvailable.overload("android.content.Context").implementation = function(context) {
                    logDebug(className + ".isGooglePlayServicesAvailable(context) -> SUCCESS");
                    return 0;
                };
            } catch (e) {
                logDebug(className + " one-arg availability hook skipped: " + e.message);
            }

            try {
                Klass.isGooglePlayServicesAvailable.overload("android.content.Context", "int").implementation = function(context, minApkVersion) {
                    logDebug(className + ".isGooglePlayServicesAvailable(context, " + minApkVersion + ") -> SUCCESS");
                    return 0;
                };
            } catch (e) {
                logDebug(className + " two-arg availability hook skipped: " + e.message);
            }
        } catch (err) {
            logDebug(className + " unavailable: " + err.message);
        }
    }

    hookAvailabilityClass("com.google.android.gms.common.GoogleApiAvailability");
    hookAvailabilityClass("com.google.android.gms.common.GoogleApiAvailabilityLight");
    hookAvailabilityClass("com.google.android.gms.common.GooglePlayServicesUtil");
    hookAvailabilityClass("com.google.android.gms.common.GooglePlayServicesUtilLight");

    logSuccess("Play Services state spoofed as available");
}

/* ========== TLS / COOKIE HISTORY RESET (CLIENT-SIDE ONLY) ========== */

function resetClientSessionHistory(spoofProfile) {
    logInfo("Resetting client TLS/session/cookie history hooks...");

    try {
        var CookieManager = Java.use("android.webkit.CookieManager");

        try {
            CookieManager.hasCookies.overload().implementation = function() {
                return false;
            };
        } catch (e) {
            logDebug("CookieManager.hasCookies hook skipped: " + e.message);
        }

        try {
            CookieManager.getCookie.overload("java.lang.String").implementation = function(url) {
                logDebug("CookieManager.getCookie(" + url + ") -> null");
                return null;
            };
        } catch (e) {
            logDebug("CookieManager.getCookie hook skipped: " + e.message);
        }
    } catch (err) {
        logDebug("CookieManager hook unavailable: " + err.message);
    }

    try {
        var SSLSession = Java.use("javax.net.ssl.SSLSession");
        SSLSession.getId.overload().implementation = function() {
            var bytes = [];
            for (var i = 0; i < spoofProfile.tlsSessionId.length; i += 2) {
                bytes.push(parseInt(spoofProfile.tlsSessionId.substring(i, i + 2), 16));
            }
            return Java.array("byte", bytes);
        };
    } catch (err) {
        logDebug("SSLSession.getId hook unavailable: " + err.message);
    }

    logWarn("Server-side risk tokens cannot be rewritten from Frida; only client-side observable state was normalized.");
    logSuccess("Client TLS/session/cookie hooks installed");
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

/* ========== ANTI-DEBUGGING BYPASS ========== */
function setupAntiDebuggingBypass() {
    logInfo("Setting up Anti-Debugging Bypass...");

    // Debug.isDebuggerConnected() bypass
    try {
        var Debug = Java.use("android.os.Debug");
        Debug.isDebuggerConnected.implementation = function() {
            logDebug("Debug.isDebuggerConnected() bypassed");
            return false;
        };
        logSuccess("Debug.isDebuggerConnected() hooked");
    } catch (e) {
        logError("Debug.isDebuggerConnected() hook failed: " + e);
    }

    // ApplicationInfo.FLAG_DEBUGGABLE bypass
    try {
        var ApplicationInfo = Java.use("android.content.pm.ApplicationInfo");
        ApplicationInfo.FLAG_DEBUGGABLE.value = 0;
        logSuccess("ApplicationInfo.FLAG_DEBUGGABLE bypassed");
    } catch (e) {
        logError("ApplicationInfo.FLAG_DEBUGGABLE bypass failed: " + e);
    }

    // Bypass native anti-debugging checks
    var nativeFunctions = [
        "ptrace",
        "fork",
        "strstr",
        "strcmp"
    ];

    nativeFunctions.forEach(function(funcName) {
        try {
            var funcPtr = Module.findExportByName(null, funcName) || Module.findExportByName("libc.so", funcName);
            if (funcPtr && !funcPtr.isNull()) {
                if (funcName === "ptrace") {
                    Interceptor.replace(funcPtr, new NativeCallback(function() {
                        logDebug("ptrace() bypassed via replacement");
                        return 0;
                    }, 'int', []));
                } else if (funcName === "fork") {
                    Interceptor.attach(funcPtr, {
                        onLeave: function(retval) {
                            var pid = parseInt(retval.toString(16), 16);
                            logDebug("Child Process PID (fork bypassed): " + pid);
                        }
                    });
                } else {
                    Interceptor.attach(funcPtr, {
                        onEnter: function(args) {
                            if (funcName === "strstr") {
                                var needle = Memory.readUtf8String(args[1]);
                                var debugStrings = ["TracerPid", "gdb", "frida", "xposed"];
                                debugStrings.forEach(function(debugStr) {
                                    if (needle && needle.includes(debugStr)) {
                                        logDebug("strstr() bypassed for: " + needle);
                                        args[1] = Memory.allocUtf8String("non_existent_string");
                                    }
                                });
                            } else if (funcName === "strcmp") {
                                var str1 = Memory.readUtf8String(args[0]);
                                var str2 = Memory.readUtf8String(args[1]);
                                if ((str1 && str1.includes("TracerPid")) || (str2 && str2.includes("TracerPid"))) {
                                    logDebug("strcmp() bypassed for TracerPid");
                                    this.bypass = true;
                                }
                            }
                        },
                        onLeave: function(retval) {
                            if (this.bypass) {
                                retval.replace(1);
                                this.bypass = false;
                            }
                        }
                    });
                }
                logSuccess(funcName + " hooked");
            }
        } catch (e) {
            logError(funcName + " hook failed: " + e);
        }
    });

    // Bypass fgets TracerPid Detection
    try {
        var fgetsPtr = Module.findExportByName("libc.so", "fgets");
        if (fgetsPtr) {
            var fgets = new NativeFunction(fgetsPtr, 'pointer', ['pointer', 'int', 'pointer']);
            Interceptor.replace(fgetsPtr, new NativeCallback(function(buffer, size, fp) {
                var retval = fgets(buffer, size, fp);
                if (!retval.isNull()) {
                    var bufstr = Memory.readUtf8String(buffer);
                    if (bufstr && bufstr.indexOf("TracerPid:") > -1) {
                        Memory.writeUtf8String(buffer, "TracerPid:\t0\n");
                        logDebug("fgets() TracerPID Check bypassed");
                    }
                }
                return retval;
            }, 'pointer', ['pointer', 'int', 'pointer']));
            logSuccess("fgets() hooked for TracerPid");
        }
    } catch (e) {
        logError("fgets() hook failed: " + e);
    }

    // Native Exit & Abort Bypass
    try {
        var abortPtr = Module.findExportByName(null, "abort") || Module.findExportByName('libc.so', 'abort');
        if (abortPtr) {
            Interceptor.replace(abortPtr, new NativeCallback(function(status) {
                logWarn("Native Abort() Replaced/Bypassed");
                return 0;
            }, 'int', ['int']));
        }

        var exitPtr = Module.findExportByName(null, "exit") || Module.findExportByName('libc.so', 'exit');
        if (exitPtr) {
            Interceptor.replace(exitPtr, new NativeCallback(function(status) {
                logWarn("Native Exit() Replaced/Bypassed");
                return 0;
            }, 'int', ['int']));
        }

        var _exitPtr = Module.findExportByName('libc.so', '_exit');
        if (_exitPtr) {
            Interceptor.replace(_exitPtr, new NativeCallback(function(status) {
                logWarn("Native _exit() Replaced/Bypassed");
                return 0;
            }, 'int', ['int']));
        }

        var killPtr = Module.findExportByName('libc.so', 'kill');
        if (killPtr) {
            Interceptor.replace(killPtr, new NativeCallback(function(pid, sig) {
                logWarn("Native Kill() Replaced/Bypassed");
                return 0;
            }, 'int', ['int', 'int']));
        }

        var systemPtr = Module.findExportByName("libc.so", "system");
        if (systemPtr) {
            Interceptor.attach(systemPtr, {
                onEnter: function(args) {
                    var cmd = Memory.readCString(args[0]);
                    if (cmd && cmd.indexOf("kill") !== -1) {
                        logWarn("Bypassing native system kill command: " + cmd);
                        var newCmd = Memory.allocUtf8String("echo bypassed");
                        args[0] = newCmd;
                    }
                }
            });
        }

        logSuccess("Native exit/abort routines bypassed");
    } catch (e) {
        logError("Native anti-exit bypass failed: " + e);
    }

    // Bypass Connect for Frida Ports
    try {
        var connectPtr = Module.findExportByName("libc.so", "connect");
        if (connectPtr) {
            Interceptor.attach(connectPtr, {
                onEnter: function(args) {
                    var family = Memory.readU16(args[1]);
                    if (family === 2) { // AF_INET
                        var port = Memory.readU16(args[1].add(2));
                        port = ((port & 0xff) << 8) | (port >> 8);
                        if (port === 27042 || port === 27043) { // Default frida ports
                            logDebug("Bypassing connect() check for Frida port: " + port);
                            Memory.writeU16(args[1].add(2), 0x0101); // Divert to dummy port
                        }
                    } else if (family === 1) { // AF_UNIX / LOCAL
                        var memory = Memory.readByteArray(args[1], 64);
                        var b = new Uint8Array(memory);
                        // Check for specific unix socket signature that might detect frida
                        if (b[2] == 0x69 && b[3] == 0xa2 && b[4] == 0x7f && b[5] == 0x00 && b[6] == 0x00 && b[7] == 0x01) {
                            this.frida_detection = true;
                        }
                    }
                },
                onLeave: function(retval) {
                    if (this.frida_detection) {
                        logDebug("connect() frida_detection signature bypassed");
                        retval.replace(-1);
                    }
                }
            });
            logSuccess("connect() hooked for Frida ports");
        }
    } catch (e) {
        logError("connect() hook failed: " + e);
    }

    // Bypass timing-based detection
    try {
        var System = Java.use("java.lang.System");
        var originalNanoTime = System.nanoTime;
        var originalCurrentTimeMillis = System.currentTimeMillis;

        System.nanoTime.implementation = function() {
            var result = originalNanoTime.call(this);
            // Modify timing to avoid detection patterns
            return result;
        };

        System.currentTimeMillis.implementation = function() {
            var result = originalCurrentTimeMillis.call(this);
            // Modify timing to avoid detection patterns
            return result;
        };

        logSuccess("Timing functions hooked");
    } catch (e) {
        logError("Timing bypass failed: " + e);
    }

    // Bypass process name checks
    try {
        var ActivityThread = Java.use("android.app.ActivityThread");
        ActivityThread.getProcessName.implementation = function() {
            var processName = this.getProcessName();
            logDebug("Process name requested: " + processName);
            return processName;
        };
        logSuccess("ActivityThread.getProcessName() hooked");
    } catch (e) {
        logError("ActivityThread.getProcessName() hook failed: " + e);
    }

    // Bypass/log exception-based debugging detection safely
    try {
        var Thread = Java.use("java.lang.Thread");
        var getStackTraceOverload = Thread.getStackTrace.overload();

        getStackTraceOverload.implementation = function () {
            // Jangan log tiap stack trace, ini penyebab spam berat
            // Jangan panggil this.getStackTrace(), karena itu manggil hook ini lagi
            return getStackTraceOverload.call(this);
        };

        logSuccess("Thread.getStackTrace() hooked safely");
    } catch (e) {
        logError("Thread.getStackTrace() hook failed: " + e);
    }

    logSuccess("Android Anti-Debugging Bypass setup complete!");
}


/* ========== NETWORK MONITOR ========== */
function setupNetworkMonitor() {
    logInfo("Setting up Network Monitor...");

    // Monitor HttpURLConnection
    try {
        var HttpURLConnection = Java.use("java.net.HttpURLConnection");

        // Hook connect method
        HttpURLConnection.connect.implementation = function() {
            var url = this.getURL().toString();
            var method = this.getRequestMethod();

            logDebug("HttpURLConnection.connect() - URL: " + url + ", Method: " + method);

            // Check for HTTP (insecure)
            if (url.startsWith("http://")) {
                logWarn("INSECURE HTTP CONNECTION DETECTED: " + url);
            }

            return this.connect();
        };

        // Hook getInputStream for response monitoring
        HttpURLConnection.getInputStream.implementation = function() {
            logDebug("HttpURLConnection.getInputStream() - Response code: " + this.getResponseCode() + ", Content type: " + this.getContentType());
            return this.getInputStream();
        };

        logSuccess("HttpURLConnection hooks installed");
    } catch (e) {
        logError("HttpURLConnection hook failed: " + e);
    }

    // Monitor OkHttp3 (popular HTTP client)
    try {
        var OkHttpClient = Java.use("okhttp3.OkHttpClient");
        var Request = Java.use("okhttp3.Request");

        // Hook newCall method
        OkHttpClient.newCall.implementation = function(request) {
            logDebug("OkHttpClient.newCall() - URL: " + request.url().toString() + ", Method: " + request.method());

            // Log headers
            var headers = request.headers();
            var headerNames = headers.names();
            var headerIterator = headerNames.iterator();

            while (headerIterator.hasNext()) {
                var headerName = headerIterator.next();
                var headerValue = headers.get(headerName);
                logDebug("OkHttp Header - " + headerName + ": " + headerValue);

                // Check for sensitive headers
                var headerNameStr = String(headerName);
                if (headerNameStr.toLowerCase().includes("authorization") ||
                    headerNameStr.toLowerCase().includes("token") ||
                    headerNameStr.toLowerCase().includes("key")) {
                    logWarn("SENSITIVE HEADER DETECTED: " + headerNameStr);
                }
            }

            return this.newCall(request);
        };

        logSuccess("OkHttpClient hooks installed");
    } catch (e) {
        logError("OkHttpClient hook failed: " + e);
    }

    // Monitor Volley requests
    try {
        var Request = Java.use("com.android.volley.Request");

        Request.getUrl.implementation = function() {
            var url = this.getUrl();
            logDebug("Volley Request URL: " + url);

            if (url.startsWith("http://")) {
                logWarn("INSECURE VOLLEY REQUEST: " + url);
            }

            return url;
        };

        logSuccess("Volley Request hooks installed");
    } catch (e) {
        logDebug("Volley Request class not found, skipping hook.");
    }

    // Monitor Retrofit (if present)
    try {
        var Retrofit = Java.use("retrofit2.Retrofit");

        Retrofit.baseUrl.implementation = function() {
            var baseUrl = this.baseUrl();
            logDebug("Retrofit base URL: " + baseUrl.toString());
            return baseUrl;
        };

        logSuccess("Retrofit hooks installed");
    } catch (e) {
        logDebug("Retrofit class not found, skipping hook.");
    }

    // Monitor Socket connections
    try {
        var Socket = Java.use("java.net.Socket");

        Socket.connect.overload("java.net.SocketAddress").implementation = function(endpoint) {
            logDebug("Socket.connect() - Endpoint: " + endpoint.toString());
            return this.connect(endpoint);
        };

        Socket.connect.overload("java.net.SocketAddress", "int").implementation = function(endpoint, timeout) {
            logDebug("Socket.connect() with timeout - Endpoint: " + endpoint.toString() + ", Timeout: " + timeout + "ms");
            return this.connect(endpoint, timeout);
        };

        logSuccess("Socket hooks installed");
    } catch (e) {
        logError("Socket hook failed: " + e);
    }

    // Monitor URL class usage
    try {
        var URL = Java.use("java.net.URL");

        URL.$init.overload("java.lang.String").implementation = function(spec) {
            logDebug("URL created: " + spec);

            if (spec.startsWith("http://")) {
                logWarn("INSECURE URL DETECTED: " + spec);
            }

            return this.$init(spec);
        };

        logSuccess("URL hooks installed");
    } catch (e) {
        logError("URL hook failed: " + e);
    }

    // Monitor DNS lookups
    try {
        var InetAddress = Java.use("java.net.InetAddress");

        InetAddress.getByName.implementation = function(host) {
            var result = this.getByName(host);
            logDebug("DNS lookup for: " + host + " -> Resolved to: " + result.getHostAddress());
            return result;
        };

        InetAddress.getAllByName.implementation = function(host) {
            var results = this.getAllByName(host);
            for (var i = 0; i < results.length; i++) {
                logDebug("DNS lookup (all) for: " + host + " -> Resolved to: " + results[i].getHostAddress());
            }
            return results;
        };

        logSuccess("InetAddress hooks installed");
    } catch (e) {
        logError("InetAddress hook failed: " + e);
    }

    // Monitor WebView network activity
    try {
        var WebView = Java.use("android.webkit.WebView");

        WebView.loadUrl.overload("java.lang.String").implementation = function(url) {
            logDebug("WebView.loadUrl(): " + url);

            if (url.startsWith("http://")) {
                logWarn("INSECURE WEBVIEW URL: " + url);
            }

            return this.loadUrl(url);
        };

        WebView.loadUrl.overload("java.lang.String", "java.util.Map").implementation = function(url, additionalHttpHeaders) {
            logDebug("WebView.loadUrl() with headers: " + url);

            if (additionalHttpHeaders) {
                var keySet = additionalHttpHeaders.keySet();
                var iterator = keySet.iterator();

                while (iterator.hasNext()) {
                    var key = iterator.next();
                    var value = additionalHttpHeaders.get(key);
                    logDebug("WebView Additional header - " + key + ": " + value);
                }
            }

            return this.loadUrl(url, additionalHttpHeaders);
        };

        logSuccess("WebView hooks installed");
    } catch (e) {
        logError("WebView hook failed: " + e);
    }

    // Monitor JSON data (often used in API calls)
    try {
        var JSONObject = Java.use("org.json.JSONObject");

        JSONObject.put.overload("java.lang.String", "java.lang.Object").implementation = function(name, value) {
            // Log sensitive-looking JSON keys
            var sensitiveKeys = ["password", "token", "secret", "key", "auth", "api_key", "access_token"];
            var lowerName = name.toLowerCase();

            sensitiveKeys.forEach(function(sensitiveKey) {
                if (lowerName.includes(sensitiveKey)) {
                    logWarn("SENSITIVE JSON KEY DETECTED: " + name + " = " + value);
                }
            });

            return this.put(name, value);
        };

        logSuccess("JSONObject hooks installed");
    } catch (e) {
        logError("JSONObject hook failed: " + e);
    }

    // Monitor HTTP response reading
    try {
        var BufferedReader = Java.use("java.io.BufferedReader");

        var originalReadLine = BufferedReader.readLine.overload();
        BufferedReader.readLine.overload().implementation = function() {
            var line = originalReadLine.call(this);

            if (line != null && line.length > 0) {
                // Look for sensitive data patterns in responses
                var sensitivePatterns = [
                    /token["\s]*[:=]["\s]*([a-zA-Z0-9_-]+)/gi,
                    /key["\s]*[:=]["\s]*([a-zA-Z0-9_-]+)/gi,
                    /password["\s]*[:=]["\s]*([^"]+)/gi,
                    /secret["\s]*[:=]["\s]*([a-zA-Z0-9_-]+)/gi
                ];

                sensitivePatterns.forEach(function(pattern) {
                    var matches = line.match(pattern);
                    if (matches) {
                        logWarn("SENSITIVE DATA IN RESPONSE: " + matches[0]);
                    }
                });
            }

            return line;
        };

        logSuccess("BufferedReader hooks installed");
    } catch (e) {
        logError("BufferedReader hook failed: " + e);
    }

    logSuccess("Android Network Monitor setup complete!");
}

/* ========== ROOT DETECTION BYPASS ========== */
function setupRootDetectionBypass() {
    logInfo("Setting up Root Detection Bypass...");

    // RootBeer library bypass
    try {
        var RootBeer = Java.use("com.scottyab.rootbeer.RootBeer");
        RootBeer.isRooted.implementation = function() {
            logDebug("RootBeer.isRooted() bypassed");
            return false;
        };
        RootBeer.isRootedWithoutBusyBoxCheck.implementation = function() {
            logDebug("RootBeer.isRootedWithoutBusyBoxCheck() bypassed");
            return false;
        };
        logSuccess("RootBeer library hooked");
    } catch (e) {
        logDebug("RootBeer library not found");
    }

    // Generic root detection bypass
    var rootDetectionMethods = [
        "isDeviceRooted",
        "isRooted",
        "checkRoot",
        "detectRoot",
        "isJailbroken",
        "hasRoot",
        "rootCheck",
        "checkSU"
    ];

    // Hook common class names that might contain root detection
    var rootDetectionClasses = [
        "com.example.rootdetection",
        "com.security.rootcheck",
        "com.application.security",
        "com.app.antiroot"
    ];

    // File-based root detection bypass
    try {
        var File = Java.use("java.io.File");
        File.exists.implementation = function() {
            var path = this.getAbsolutePath();
            var suspicious_paths = [
                "/system/app/Superuser.apk",
                "/sbin/su",
                "/system/bin/su",
                "/system/xbin/su",
                "/data/local/xbin/su",
                "/data/local/bin/su",
                "/system/sd/xbin/su",
                "/system/bin/failsafe/su",
                "/data/local/su",
                "/su/bin/su",
                "/system/xbin/busybox",
                "/system/bin/busybox",
                "/data/local/busybox",
                "/data/local/xbin/busybox",
                "/system/app/SuperSU",
                "/system/app/SuperSU.apk",
                "/system/app/Kinguser.apk",
                "/data/data/eu.chainfire.supersu",
                "/data/data/com.noshufou.android.su",
                "/data/data/com.koushikdutta.superuser",
                "/data/data/com.thirdparty.superuser",
                "/data/data/com.yellowes.su",
                "/data/data/com.kingroot.kinguser",
                "/data/data/com.kingo.root",
                "/data/data/com.smedialink.oneclickroot",
                "/data/data/com.zhiqupk.root.global",
                "/data/data/com.alephzain.framaroot",
                "/sbin/magisk",
                "/sbin/magiskinit",
                "/system/bin/magisk",
                "/data/adb/magisk",
                "/data/adb/modules",
                "/data/adb/zygisk",
                "/data/adb/shamiko",
                "/data/adb/tricky_store"
            ];

            for (var i = 0; i < suspicious_paths.length; i++) {
                if (path === suspicious_paths[i]) {
                    logDebug("File.exists() bypassed for: " + path);
                    return false;
                }
            }
            return this.exists();
        };
        logSuccess("File.exists() hooked");
    } catch (e) {
        logError("File.exists() hook failed: " + e);
    }

    // Runtime.exec bypass
    try {
        var Runtime = Java.use("java.lang.Runtime");
        Runtime.exec.overload("java.lang.String").implementation = function(command) {
            var suspicious_commands = [
                "su",
                "which su",
                "busybox",
                "id"
            ];

            for (var i = 0; i < suspicious_commands.length; i++) {
                if (command.includes(suspicious_commands[i])) {
                    logDebug("Runtime.exec() bypassed for: " + command);
                    throw new Error("Command blocked");
                }
            }
            return this.exec(command);
        };
        logSuccess("Runtime.exec() hooked");
    } catch (e) {
        logError("Runtime.exec() hook failed: " + e);
    }

    // ProcessBuilder bypass
    try {
        var ProcessBuilder = Java.use("java.lang.ProcessBuilder");
        ProcessBuilder.start.implementation = function() {
            var commands = this.command();
            var command_str = commands.toString();

            if (command_str.includes("su") || command_str.includes("busybox")) {
                logDebug("ProcessBuilder.start() bypassed for: " + command_str);
                throw new Error("Process blocked");
            }
            return this.start();
        };
        logSuccess("ProcessBuilder.start() hooked");
    } catch (e) {
        logError("ProcessBuilder.start() hook failed: " + e);
    }

    // Package manager bypass
    try {
        var PackageManager = Java.use("android.app.ApplicationPackageManager");

        var suspicious_packages = [
            "com.noshufou.android.su",
            "com.noshufou.android.su.elite",
            "eu.chainfire.supersu",
            "com.koushikdutta.superuser",
            "com.thirdparty.superuser",
            "com.yellowes.su",
            "com.topjohnwu.magisk",
            "com.kingroot.kinguser",
            "com.kingo.root",
            "com.smedialink.oneclickroot",
            "com.zhiqupk.root.global",
            "com.alephzain.framaroot",
            "com.termux",
            "com.oasisfeng.island",
            "io.github.maytinhdibo.pocket",
            "bin.mt.plus.canary:cmd"
        ];

        PackageManager.getInstalledPackages.overload('int').implementation = function(flags) {
            var packages = this.getInstalledPackages(flags);
            var filtered_packages = [];

            for (var i = 0; i < packages.size(); i++) {
                var package_info = packages.get(i);
                if (!package_info) continue;

                var package_name = "";
                try {
                    package_name = String(package_info.packageName.value);
                } catch(e) {
                    try { package_name = String(package_info.packageName); } catch(err) {}
                }

                var is_suspicious = false;
                if (package_name) {
                    for (var j = 0; j < suspicious_packages.length; j++) {
                        if (package_name === suspicious_packages[j]) {
                            logDebug("Hidden suspicious package in getInstalledPackages: " + package_name);
                            is_suspicious = true;
                            break;
                        }
                    }
                }

                if (!is_suspicious) {
                    filtered_packages.push(package_info);
                }
            }

            var ArrayList = Java.use("java.util.ArrayList");
            var filtered_list = ArrayList.$new();
            for (var k = 0; k < filtered_packages.length; k++) {
                filtered_list.add(filtered_packages[k]);
            }

            return filtered_list;
        };

        PackageManager.getInstalledApplications.overload('int').implementation = function(flags) {
            var apps = this.getInstalledApplications(flags);
            var filtered_apps = [];

            for (var i = 0; i < apps.size(); i++) {
                var app_info = apps.get(i);
                if (!app_info) continue;

                var package_name = "";
                try {
                    package_name = String(app_info.packageName.value);
                } catch(e) {
                    try { package_name = String(app_info.packageName); } catch(err) {}
                }

                var is_suspicious = false;
                if (package_name) {
                    for (var j = 0; j < suspicious_packages.length; j++) {
                        if (package_name === suspicious_packages[j]) {
                            logDebug("Hidden suspicious package in getInstalledApplications: " + package_name);
                            is_suspicious = true;
                            break;
                        }
                    }
                }

                if (!is_suspicious) {
                    filtered_apps.push(app_info);
                }
            }

            var ArrayList = Java.use("java.util.ArrayList");
            var filtered_list = ArrayList.$new();
            for (var k = 0; k < filtered_apps.length; k++) {
                filtered_list.add(filtered_apps[k]);
            }

            return filtered_list;
        };

        logSuccess("PackageManager.getInstalledPackages() & getInstalledApplications() hooked");
    } catch (e) {
        logError("PackageManager hooks failed: " + e);
    }

    // DO NOT hook System.loadLibrary / System.load / Runtime.loadLibrary0
    // to completely prevent side-effects on Android Native Library loading that
    // causes UnsatisfiedLinkError during JNI_OnLoad and application crashes.

    logSuccess("Android Root Detection Bypass setup complete!");
}


/* ========== SSL PINNING BYPASS ========== */
function setupSSLPinningBypass() {
    logInfo("Setting up SSL Pinning Bypass...");

    // Bypass X509TrustManager
    try {
        var X509TrustManager = Java.use('javax.net.ssl.X509TrustManager');
        var SSLContext = Java.use('javax.net.ssl.SSLContext');

        // Create a custom TrustManager that trusts everything
        var TrustManager = Java.registerClass({
            name: 'dev.rikka.tools.DummyTrustManager',
            implements: [X509TrustManager],
            methods: {
                checkClientTrusted: function (chain, authType) { },
                checkServerTrusted: function (chain, authType) { },
                getAcceptedIssuers: function () { return []; }
            }
        });

        // Hook SSLContext.init to inject our dummy TrustManager
        var TrustManagers = [TrustManager.$new()];
        var SSLContext_init = SSLContext.init.overload(
            '[Ljavax.net.ssl.KeyManager;', '[Ljavax.net.ssl.TrustManager;', 'java.security.SecureRandom');

        SSLContext_init.implementation = function(keyManager, trustManager, secureRandom) {
            logDebug("Overriding SSLContext.init() to use DummyTrustManager");
            SSLContext_init.call(this, keyManager, TrustManagers, secureRandom);
        };
        logSuccess("X509TrustManager bypassed");
    } catch (e) {
        logError("X509TrustManager bypass failed: " + e);
    }

    // Bypass OkHttp3 CertificatePinner
    try {
        var CertificatePinner = Java.use('okhttp3.CertificatePinner');
        CertificatePinner.check.overload('java.lang.String', 'java.util.List').implementation = function (str) {
            logDebug("OkHttp3 CertificatePinner.check() bypassed for: " + str);
            return;
        };
        logSuccess("OkHttp3 CertificatePinner bypassed");
    } catch (e) {
        logDebug("OkHttp3 CertificatePinner not found or bypass failed");
    }

    // Bypass TrustManagerImpl (Android > 7)
    try {
        var TrustManagerImpl = Java.use('com.android.org.conscrypt.TrustManagerImpl');
        TrustManagerImpl.verifyChain.implementation = function (untrustedChain, trustAnchorChain, host, clientAuth, ocspData, tlsSctData) {
            logDebug("TrustManagerImpl.verifyChain() bypassed for host: " + host);
            return untrustedChain;
        };
        logSuccess("TrustManagerImpl bypassed");
    } catch (e) {
        logDebug("TrustManagerImpl not found or bypass failed");
    }

    // Bypass HttpsURLConnection HostnameVerifier
    try {
        var HttpsURLConnection = Java.use("javax.net.ssl.HttpsURLConnection");
        HttpsURLConnection.setDefaultHostnameVerifier.implementation = function(hostnameVerifier) {
            logDebug("HttpsURLConnection.setDefaultHostnameVerifier() bypassed");
            return;
        };
        HttpsURLConnection.setHostnameVerifier.implementation = function(hostnameVerifier) {
            logDebug("HttpsURLConnection.setHostnameVerifier() bypassed");
            return;
        };
        logSuccess("HttpsURLConnection HostnameVerifier bypassed");
    } catch (e) {
        logError("HttpsURLConnection HostnameVerifier bypass failed: " + e);
    }

    // Bypass Android WebViewClient SslErrorHandler
    try {
        var WebViewClient = Java.use("android.webkit.WebViewClient");
        WebViewClient.onReceivedSslError.overload("android.webkit.WebView", "android.webkit.SslErrorHandler", "android.net.http.SslError").implementation = function(view, handler, error) {
            logDebug("WebViewClient.onReceivedSslError() (SslErrorHandler) bypassed");
            handler.proceed();
        };
        logSuccess("WebViewClient SslErrorHandler bypassed");
    } catch (e) {
        logDebug("WebViewClient SslErrorHandler bypass failed or not found");
    }

    try {
        var WebViewClient2 = Java.use("android.webkit.WebViewClient");
        WebViewClient2.onReceivedError.overload("android.webkit.WebView", "int", "java.lang.String", "java.lang.String").implementation = function(view, errorCode, description, failingUrl) {
            logDebug("WebViewClient.onReceivedError(int) bypassed");
        };

        WebViewClient2.onReceivedError.overload("android.webkit.WebView", "android.webkit.WebResourceRequest", "android.webkit.WebResourceError").implementation = function(view, request, error) {
            logDebug("WebViewClient.onReceivedError(WebResourceRequest) bypassed");
        };
        logSuccess("WebViewClient WebResourceError bypassed");
    } catch (e) {
        logDebug("WebViewClient WebResourceError bypass failed or not found");
    }

    // Bypass Apache Cordova WebViewClient
    try {
        var CordovaWebViewClient = Java.use("org.apache.cordova.CordovaWebViewClient");
        CordovaWebViewClient.onReceivedSslError.overload("android.webkit.WebView", "android.webkit.SslErrorHandler", "android.net.http.SslError").implementation = function(view, handler, error) {
            logDebug("CordovaWebViewClient.onReceivedSslError() bypassed");
            handler.proceed();
        };
        logSuccess("CordovaWebViewClient bypassed");
    } catch (e) {
        logDebug("CordovaWebViewClient not found, skipping");
    }

    // Bypass Boye AbstractVerifier
    try {
        var BoyeAbstractVerifier = Java.use("ch.boye.httpclientandroidlib.conn.ssl.AbstractVerifier");
        BoyeAbstractVerifier.verify.implementation = function(host, ssl) {
            logDebug("Boye AbstractVerifier bypassed for host: " + host);
        };
        logSuccess("Boye AbstractVerifier bypassed");
    } catch (e) {
        logDebug("Boye AbstractVerifier not found, skipping");
    }

    logSuccess("SSL Pinning Bypass setup complete!");
}
/* ========== TRAFFIC VERIFICATION WEBVIEW LOGGER ========== */
function hookTrafficVerifyLogger() {
    try {
        var WebView = Java.use("android.webkit.WebView");

        WebView.loadUrl.overload("java.lang.String").implementation = function (url) {
            if (url.indexOf("/verify/traffic") !== -1 || url.indexOf("captcha") !== -1) {
                logWarn("[TRAFFIC_VERIFY_WEBVIEW] " + url);
            }
            return this.loadUrl(url);
        };

        logSuccess("Traffic verify WebView logger installed");
    } catch (e) {
        logError("Traffic verify WebView logger failed: " + e);
    }
}

/* ========== WEBVIEW ERROR LOGGER ========== */
function hookWebViewVerifyErrors() {
    try {
        var WebViewClient = Java.use("android.webkit.WebViewClient");

        var onReceivedHttpError = WebViewClient.onReceivedHttpError.overload(
            "android.webkit.WebView",
            "android.webkit.WebResourceRequest",
            "android.webkit.WebResourceResponse"
        );

        onReceivedHttpError.implementation = function (view, request, response) {
            try {
                var url = request.getUrl().toString();
                var code = response.getStatusCode();

                if (url.indexOf("/verify/traffic") !== -1 || url.indexOf("captcha") !== -1 || code >= 400) {
                    logWarn("[WEBVIEW_HTTP_ERROR] " + code + " " + url);
                    logWarn("[WEBVIEW_HTTP_REASON] " + response.getReasonPhrase());
                }
            } catch (e) {}

            return onReceivedHttpError.call(this, view, request, response);
        };

        var onReceivedError = WebViewClient.onReceivedError.overload(
            "android.webkit.WebView",
            "android.webkit.WebResourceRequest",
            "android.webkit.WebResourceError"
        );

        onReceivedError.implementation = function (view, request, error) {
            try {
                var url = request.getUrl().toString();

                if (url.indexOf("/verify/traffic") !== -1 || url.indexOf("captcha") !== -1) {
                    logWarn("[WEBVIEW_ERROR] " + url);
                    logWarn("[WEBVIEW_ERROR_CODE] " + error.getErrorCode());
                    logWarn("[WEBVIEW_ERROR_DESC] " + error.getDescription());
                }
            } catch (e) {}

            return onReceivedError.call(this, view, request, error);
        };

        var onReceivedSslError = WebViewClient.onReceivedSslError.overload(
            "android.webkit.WebView",
            "android.webkit.SslErrorHandler",
            "android.net.http.SslError"
        );

        onReceivedSslError.implementation = function (view, handler, sslError) {
            logWarn("[WEBVIEW_SSL_ERROR] " + sslError.toString());

            // Jangan proceed. Biarkan app original handle.
            return onReceivedSslError.call(this, view, handler, sslError);
        };

        logSuccess("WebView verify error logger installed");
    } catch (e) {
        logError("WebView verify error logger failed: " + e);
    }
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
        var spoofProfile = createSpoofProfile(deviceData);

        console.log("\x1b[1m\x1b[33m[DEVICE SELECTED]\x1b[0m " + randomDevice.brand.toUpperCase() + " > " + randomDevice.model + "\n");

        if (CONFIG.ENABLE_DYNAMIC_RECEIVER_FIX) { hookDynamicReceiverFlags(); console.log(""); }
        if (CONFIG.ENABLE_BUILD_SPOOFING) { deepSpoofBuildProperties(deviceData, spoofProfile); console.log(""); }
        if (CONFIG.ENABLE_BUILD_VERSION_SPOOFING) { spoofBuildVersion(deviceData); console.log(""); }
        if (CONFIG.ENABLE_JAVA_SYSTEM_PROPERTIES) { hookExtendedSystemProperties(deviceData, spoofProfile); console.log(""); }
        if (CONFIG.ENABLE_NATIVE_SYSTEM_PROPERTIES) { hookNativeSystemProperties(); console.log(""); }
        if (CONFIG.ENABLE_LOCALE_TIMEZONE_SPOOF) { spoofLocaleTimezone(spoofProfile); console.log(""); }
        if (CONFIG.ENABLE_SCREEN_METRICS_SPOOF) { spoofScreenMetrics(spoofProfile); console.log(""); }
        if (CONFIG.ENABLE_DEVICE_SETTINGS_SPOOF) { hookDeviceSettings(deviceData, spoofProfile); console.log(""); }
        if (CONFIG.ENABLE_SECURE_SETTINGS_SPOOF) { spoofSecureSettings(deviceData, spoofProfile); console.log(""); }
        if (CONFIG.ENABLE_TELEPHONY_SPOOF) { spoofTelephony(spoofProfile); console.log(""); }
        if (CONFIG.ENABLE_MAC_ADDRESS_SPOOF) { spoofMACAddress(spoofProfile); console.log(""); }
        if (CONFIG.ENABLE_BOOT_TIMESTAMPS_SPOOF) { spoofBootTimestamps(spoofProfile); console.log(""); }
        if (CONFIG.ENABLE_ADVERTISING_ID_SPOOF) { spoofAdvertisingId(spoofProfile); console.log(""); }
        if (CONFIG.ENABLE_APPSFLYER_SPOOF) { spoofAppsFlyer(spoofProfile); console.log(""); }
        if (CONFIG.ENABLE_INSTALL_REFERRER_SPOOF) { spoofInstallReferrer(spoofProfile); console.log(""); }
        if (CONFIG.ENABLE_WEBVIEW_UA_SPOOF) { spoofWebViewUserAgent(deviceData, spoofProfile); console.log(""); }
        if (CONFIG.ENABLE_NETWORK_INFO_SPOOF) { spoofNetworkInfo(spoofProfile); console.log(""); }
        if (CONFIG.ENABLE_PLAY_SERVICES_SPOOF) { spoofPlayServicesState(spoofProfile); console.log(""); }
        if (CONFIG.ENABLE_RESET_SESSION) { resetClientSessionHistory(spoofProfile); console.log(""); }
        if (CONFIG.ENABLE_PACKAGE_MANAGER_SPOOF) { spoofPackageManager(spoofProfile); console.log(""); }
        if (CONFIG.ENABLE_NEW_DEVICE_MARKER) { createNewDeviceMarker(); console.log(""); }
        if (CONFIG.ENABLE_HIDE_GSF) { hideGSFID(); console.log(""); }
        if (CONFIG.ENABLE_ANTI_DEBUG) { setupAntiDebuggingBypass(); console.log(""); }
        if (CONFIG.ENABLE_NETWORK_MONITOR) { setupNetworkMonitor(); console.log(""); }
        if (CONFIG.ENABLE_ROOT_BYPASS) { setupRootDetectionBypass(); console.log(""); }
        if (CONFIG.ENABLE_SSL_BYPASS) { setupSSLPinningBypass(); console.log(""); }

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
