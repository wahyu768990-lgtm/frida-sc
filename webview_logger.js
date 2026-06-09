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
