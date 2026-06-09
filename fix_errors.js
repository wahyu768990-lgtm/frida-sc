<<<<<<< SEARCH
    // Bypass native anti-debugging checks
    var nativeFunctions = [
        "ptrace",
        "fork",
        "strstr",
        "strcmp"
    ];

    nativeFunctions.forEach(function(funcName) {
        try {
            var funcPtr = Module.findExportByName("libc.so", funcName);
            if (funcPtr && !funcPtr.isNull()) {
                Interceptor.attach(funcPtr, {
=======
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
                Interceptor.attach(funcPtr, {
>>>>>>> REPLACE
<<<<<<< SEARCH
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
        logError("Volley Request hook failed: " + e);
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
        logError("Retrofit hook failed: " + e);
    }
=======
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
>>>>>>> REPLACE
<<<<<<< SEARCH
    // Monitor HTTP response reading
    try {
        var BufferedReader = Java.use("java.io.BufferedReader");

        var originalReadLine = BufferedReader.readLine;
        BufferedReader.readLine.implementation = function() {
            var line = originalReadLine.call(this);
=======
    // Monitor HTTP response reading
    try {
        var BufferedReader = Java.use("java.io.BufferedReader");

        var originalReadLine = BufferedReader.readLine.overload();
        BufferedReader.readLine.overload().implementation = function() {
            var line = originalReadLine.call(this);
>>>>>>> REPLACE
<<<<<<< SEARCH
    // Package manager bypass
    try {
        var PackageManager = Java.use("android.app.ApplicationPackageManager");
        PackageManager.getInstalledPackages.implementation = function(flags) {
            var packages = this.getInstalledPackages(flags);
=======
    // Package manager bypass
    try {
        var PackageManager = Java.use("android.app.ApplicationPackageManager");
        PackageManager.getInstalledPackages.overload('int').implementation = function(flags) {
            var packages = this.getInstalledPackages(flags);
>>>>>>> REPLACE
