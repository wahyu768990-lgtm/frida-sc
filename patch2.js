<<<<<<< SEARCH
        var getStackTraceOverload = Thread.getStackTrace.overload();

        Thread.getStackTrace.implementation = function () {
            // Jangan log tiap stack trace, ini penyebab spam berat
            // Jangan panggil this.getStackTrace(), karena itu manggil hook ini lagi
            return getStackTraceOverload.call(this);
        };
=======
        var getStackTraceOverload = Thread.getStackTrace.overload();

        getStackTraceOverload.implementation = function () {
            // Jangan log tiap stack trace, ini penyebab spam berat
            // Jangan panggil this.getStackTrace(), karena itu manggil hook ini lagi
            return getStackTraceOverload.call(this);
        };
>>>>>>> REPLACE
<<<<<<< SEARCH
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
=======
        System.loadLibrary.overload("java.lang.String").implementation = function (library) {
            logDebug("System.loadLibrary() called for: " + library);

            try {
                // Panggil original overload dengan System
                return systemLoadLibrary.call(System, library);
            } catch (e) {
                logDebug("System.loadLibrary() failed for " + library + ": " + e);
                throw e;
            }
        };

        System.load.overload("java.lang.String").implementation = function (path) {
            logDebug("System.load() called for: " + path);

            try {
                // Panggil original overload dengan System
                return systemLoad.call(System, path);
            } catch (e) {
                logDebug("System.load() failed for " + path + ": " + e);
                throw e;
            }
        };
>>>>>>> REPLACE
