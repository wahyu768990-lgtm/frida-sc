<<<<<<< SEARCH
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
        WebViewClient2.onReceivedSslError.overload("android.webkit.WebView", "android.webkit.WebResourceRequest", "android.webkit.WebResourceError").implementation = function(view, request, error) {
            logDebug("WebViewClient.onReceivedSslError() (WebResourceError) bypassed");
        };
        logSuccess("WebViewClient WebResourceError bypassed");
    } catch (e) {
        logDebug("WebViewClient WebResourceError bypass failed or not found");
    }
=======
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
>>>>>>> REPLACE
