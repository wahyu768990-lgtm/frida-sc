<<<<<<< SEARCH
    // Native library load bypass / logging
    try {
        var System = Java.use("java.lang.System");
        var systemLoadLibrary = System.loadLibrary.overload("java.lang.String");
        systemLoadLibrary.implementation = function(library) {
            logDebug("System.loadLibrary() called for: " + library);
            return systemLoadLibrary.call(this, library);
        };

        var systemLoad = System.load.overload("java.lang.String");
        systemLoad.implementation = function(path) {
            logDebug("System.load() called for: " + path);
            return systemLoad.call(this, path);
        };

        try {
            var Runtime = Java.use("java.lang.Runtime");
            var runtimeLoadLibrary0 = Runtime.loadLibrary0.overload("java.lang.Class", "java.lang.String");
            runtimeLoadLibrary0.implementation = function(callerClass, library) {
                logDebug("Runtime.loadLibrary0() called for: " + library);
                return runtimeLoadLibrary0.call(this, callerClass, library);
            };
        } catch (err2) {
            // Ignore if Runtime.loadLibrary0 is not accessible
        }

        logSuccess("System.loadLibrary() / System.load() hooked securely");
    } catch (e) {
        logDebug("Native Library hooking modified / skipped");
    }
=======
    // DO NOT hook System.loadLibrary / System.load / Runtime.loadLibrary0
    // to completely prevent side-effects on Android Native Library loading that
    // causes UnsatisfiedLinkError during JNI_OnLoad and application crashes.
>>>>>>> REPLACE
