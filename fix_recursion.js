<<<<<<< SEARCH
    // Bypass exception-based debugging detection
    try {
        var Thread = Java.use("java.lang.Thread");
        Thread.getStackTrace.implementation = function() {
            return this.getStackTrace();
        };
        logSuccess("Thread.getStackTrace() hooked");
    } catch (e) {
        logError("Thread.getStackTrace() hook failed: " + e);
    }
=======
    // Bypass/log exception-based debugging detection safely
    try {
        var Thread = Java.use("java.lang.Thread");
        var getStackTraceOverload = Thread.getStackTrace.overload();

        Thread.getStackTrace.implementation = function () {
            // Jangan log tiap stack trace, ini penyebab spam berat
            // Jangan panggil this.getStackTrace(), karena itu manggil hook ini lagi
            return getStackTraceOverload.call(this);
        };

        logSuccess("Thread.getStackTrace() hooked safely");
    } catch (e) {
        logError("Thread.getStackTrace() hook failed: " + e);
    }
>>>>>>> REPLACE
<<<<<<< SEARCH
    // Native library check bypass
    try {
        var System = Java.use("java.lang.System");
        var Runtime = Java.use("java.lang.Runtime");

        System.loadLibrary.implementation = function(library) {
            try {
                // Delegate completely to Java.lang.System to prevent UnsatisfiedLinkError crashes
                // resulting from context issues in the Frida hook wrapper
                return this.loadLibrary(library);
            } catch (e) {
                logDebug("Library load failed for " + library + ": " + e);
                throw e;
            }
        };

        // Sometimes apps call Runtime.getRuntime().loadLibrary() directly
        Runtime.loadLibrary0.overload('java.lang.Class', 'java.lang.String').implementation = function(callerClass, library) {
            try {
                return this.loadLibrary0(callerClass, library);
            } catch(e) {
                logDebug("Runtime library load failed for " + library);
                throw e;
            }
        };

        logSuccess("System.loadLibrary() / Runtime.loadLibrary0() hooked securely");
    } catch (e) {
        logDebug("Native Library hooking modified / skipped");
    }
=======
    // Native library load logger - jangan swallow error, jangan fake success
    try {
        var System = Java.use("java.lang.System");
        var Runtime = Java.use("java.lang.Runtime");

        var systemLoadLibrary = System.loadLibrary.overload("java.lang.String");
        var systemLoad = System.load.overload("java.lang.String");

        System.loadLibrary.overload("java.lang.String").implementation = function (library) {
            logDebug("System.loadLibrary() called for: " + library);

            try {
                // Panggil original overload, bukan this.loadLibrary()
                return systemLoadLibrary.call(this, library);
            } catch (e) {
                logDebug("System.loadLibrary() failed for " + library + ": " + e);
                throw e;
            }
        };

        System.load.overload("java.lang.String").implementation = function (path) {
            logDebug("System.load() called for: " + path);

            try {
                return systemLoad.call(this, path);
            } catch (e) {
                logDebug("System.load() failed for " + path + ": " + e);
                throw e;
            }
        };

        try {
            var runtimeLoadLibrary0 = Runtime.loadLibrary0.overload("java.lang.Class", "java.lang.String");

            Runtime.loadLibrary0.overload("java.lang.Class", "java.lang.String").implementation = function (callerClass, library) {
                logDebug("Runtime.loadLibrary0() called for: " + library);

                try {
                    return runtimeLoadLibrary0.call(this, callerClass, library);
                } catch (e) {
                    logDebug("Runtime.loadLibrary0() failed for " + library + ": " + e);
                    throw e;
                }
            };
        } catch (e2) {
            logDebug("Runtime.loadLibrary0 overload not available: " + e2);
        }

        logSuccess("System.load/loadLibrary hooked safely");
    } catch (e) {
        logError("Native library hook failed: " + e);
    }
>>>>>>> REPLACE
