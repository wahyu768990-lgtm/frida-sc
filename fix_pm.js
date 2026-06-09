<<<<<<< SEARCH
    // Package manager bypass
    try {
        var PackageManager = Java.use("android.app.ApplicationPackageManager");
        PackageManager.getInstalledPackages.overload('int').implementation = function(flags) {
            var packages = this.getInstalledPackages(flags);
            var filtered_packages = [];

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

            for (var i = 0; i < packages.size(); i++) {
                var package_info = packages.get(i);
                var package_name = package_info.packageName.value;

                var is_suspicious = false;
                for (var j = 0; j < suspicious_packages.length; j++) {
                    if (package_name === suspicious_packages[j]) {
                        logDebug("Hidden suspicious package: " + package_name);
                        is_suspicious = true;
                        break;
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
        logSuccess("PackageManager.getInstalledPackages() hooked");
    } catch (e) {
        logError("PackageManager.getInstalledPackages() hook failed: " + e);
    }
=======
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
                var package_name = package_info.packageName.value;

                var is_suspicious = false;
                for (var j = 0; j < suspicious_packages.length; j++) {
                    if (package_name === suspicious_packages[j]) {
                        logDebug("Hidden suspicious package in getInstalledPackages: " + package_name);
                        is_suspicious = true;
                        break;
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
                var package_name = app_info.packageName.value;

                var is_suspicious = false;
                for (var j = 0; j < suspicious_packages.length; j++) {
                    if (package_name === suspicious_packages[j]) {
                        logDebug("Hidden suspicious package in getInstalledApplications: " + package_name);
                        is_suspicious = true;
                        break;
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
>>>>>>> REPLACE
