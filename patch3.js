<<<<<<< SEARCH
var CONFIG = {
    ENABLE_DYNAMIC_RECEIVER_FIX: true,
    ENABLE_BUILD_SPOOFING: true,
    ENABLE_BUILD_VERSION_SPOOFING: true,
    ENABLE_JAVA_SYSTEM_PROPERTIES: true,
    ENABLE_NETWORK_MONITOR: true,
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
    ENABLE_SSL_BYPASS: true,
=======
var CONFIG = {
    ENABLE_DYNAMIC_RECEIVER_FIX: true,
    ENABLE_BUILD_SPOOFING: true,
    ENABLE_BUILD_VERSION_SPOOFING: true,
    ENABLE_JAVA_SYSTEM_PROPERTIES: true,
    ENABLE_NETWORK_MONITOR: true,
    ENABLE_PACKAGE_MANAGER_SPOOF: true,
    ENABLE_WEBVIEW_UA_SPOOF: true,
    ENABLE_TELEPHONY_SPOOF: true,
    ENABLE_NETWORK_INFO_SPOOF: true,
    ENABLE_PLAY_SERVICES_SPOOF: true,
    ENABLE_ADVERTISING_ID_SPOOF: true,
    ENABLE_APPSFLYER_SPOOF: true,
    ENABLE_INSTALL_REFERRER_SPOOF: true,

    // TURNED OFF TO DEBUG TRAFFIC VERIFICATION:
    ENABLE_ROOT_BYPASS: false,
    ENABLE_ANTI_DEBUG: false,
    ENABLE_NATIVE_SYSTEM_PROPERTIES: false,
    ENABLE_RESET_SESSION: false,
    ENABLE_HIDE_GSF: false,
    ENABLE_SSL_BYPASS: false,
>>>>>>> REPLACE
<<<<<<< SEARCH
/* ========== MAIN EXECUTION ========== */

Java.perform(function () {
=======
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
>>>>>>> REPLACE
<<<<<<< SEARCH
        if (CONFIG.ENABLE_ROOT_BYPASS) { setupRootDetectionBypass(); console.log(""); }
        if (CONFIG.ENABLE_SSL_BYPASS) { setupSSLPinningBypass(); console.log(""); }
        console.log("\x1b[1m\x1b[32m╔════════════════════════════════════════════════════════════════╗\x1b[0m");
=======
        if (CONFIG.ENABLE_ROOT_BYPASS) { setupRootDetectionBypass(); console.log(""); }
        if (CONFIG.ENABLE_SSL_BYPASS) { setupSSLPinningBypass(); console.log(""); }

        hookTrafficVerifyLogger();
        console.log("");
        hookWebViewVerifyErrors();
        console.log("");

        console.log("\x1b[1m\x1b[32m╔════════════════════════════════════════════════════════════════╗\x1b[0m");
>>>>>>> REPLACE
