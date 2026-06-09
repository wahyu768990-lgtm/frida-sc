<<<<<<< SEARCH
    // Bypass exception-based debugging detection
    try {
        var Thread = Java.use("java.lang.Thread");
        Thread.getStackTrace.implementation = function() {
            var stack = this.getStackTrace();
            logDebug("Stack trace requested");
            return stack;
        };
        logSuccess("Thread.getStackTrace() hooked");
    } catch (e) {
        logError("Thread.getStackTrace() hook failed: " + e);
    }
=======
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
>>>>>>> REPLACE
<<<<<<< SEARCH
    // Native library check bypass
    try {
        var System = Java.use("java.lang.System");
        var originalLoadLibrary = System.loadLibrary;
        System.loadLibrary.implementation = function(library) {
            logDebug("System.loadLibrary() called for: " + library);
            try {
                return originalLoadLibrary.call(System, library);
            } catch (e) {
                logDebug("Library load failed, continuing: " + e);
                throw e;
            }
        };
        logSuccess("System.loadLibrary() hooked");
    } catch (e) {
        logError("System.loadLibrary() hook failed: " + e);
    }
=======
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
>>>>>>> REPLACE
