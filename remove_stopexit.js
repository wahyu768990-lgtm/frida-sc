<<<<<<< SEARCH
    // Prevent app from closing itself
    try {
        var system = Java.use("java.lang.System");
        system.exit.overload("int").implementation = function(var0) {
            logWarn("System.exit(" + var0 + ") Called and Bypassed");
        };

        var Proc = Java.use("android.os.Process");
        Proc.killProcess.overload('int').implementation = function(arg) {
            logWarn("Process.killProcess(" + arg + ") Called and Bypassed");
        };

        var act = Java.use("android.app.Activity");
        act.finish.overload().implementation = function() {
            logWarn("Activity.finish() Called and Bypassed");
        };
        act.finishActivity.overload('int').implementation = function(arg) {
            logWarn("Activity.finishActivity(" + arg + ") Called and Bypassed");
        };
        act.finishAffinity.overload().implementation = function() {
            logWarn("Activity.finishAffinity() Called and Bypassed");
        };
        act.finishAndRemoveTask.overload().implementation = function() {
            logWarn("Activity.finishAndRemoveTask() Called and Bypassed");
        };

        logSuccess("Anti-Exit mechanisms hooked");
    } catch (e) {
        logDebug("Anti-Exit mechanisms failed: " + e.message);
    }

    // Runtime.exec bypass
=======
    // Runtime.exec bypass
>>>>>>> REPLACE
<<<<<<< SEARCH
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
=======
    // Bypass Connect for Frida Ports
>>>>>>> REPLACE
