var initPush = function() {
    var PushNotification = cordova.require("phonegap-plugin-push.PushNotification");
    var push = PushNotification.init({
        android: {
            senderID: "1079851742012"
        },
        ios: {
            alert: "true",
            badge: "true",
            sound: "true"
        },
        windows: {}
    });

    push.on('registration', function(data) {
        window.pegg.registrationId = data.registrationId;
        console.log('REGISTRATIONID: ' + data.registrationId);
    });

    push.on('notification', function(data) {
        if (window.pegg.onPushNotification) {
            window.pegg.onPushNotification(data);
        } else {
            window.pegg.pushNotification = data; // cold start case
        }
    });

    push.on('error', function(e) {
        console.log('PUSH ERROR: ' + e)
    });
}

var initFullScreen = function () {
    if (StatusBar) StatusBar.hide();
    // if(window.navigationbar) {
    //     var autoHideNavigationBar = true;
    //     window.navigationbar.setUp(autoHideNavigationBar);
    //     // window.navigationbar.hide();
    // }
}

var initKeyboard = function () {
    window.addEventListener('native.keyboardshow', function (e) {
        if (window.pegg.onKeyboardShow) {
            window.pegg.onKeyboardShow(e);
        }
    });
    window.addEventListener('native.keyboardhide', function () {
        if (window.pegg.onKeyboardHide) {
            window.pegg.onKeyboardHide();
        }
    });
}

var initBranch = function () {
    // Branch initialization
    Branch.initSession(function(data) {
        // read deep link data on click
        if (window.pegg.onDeepLink) {
            window.pegg.onDeepLink(data);
        } else {
            window.pegg.deepLink = data; // cold start case
        }
    });
}

var appendScript = function(url) {
    console.log("appending script", url)
    return new Promise(function(resolve, reject) {
        var element
        element = document.createElement('script')
        element.src = url
        element.onload = resolve
        return document.body.appendChild(element)
    })
}

var getJSON = function(url) {
    return new Promise(function(resolve, reject) {
        var xhr
        xhr = new XMLHttpRequest
        xhr.open('get', url, true)
        xhr.responseType = 'json'
        xhr.onload = function() {
            var status
            status = xhr.status
            if (status === 200) {
                return resolve(xhr.response)
            } else {
                return reject(status)
            }
        }
        return xhr.send()
    })
}


var app = {
    initialize: function() {
        if (window.pegg == null) window.pegg = {};
        this.bindEvents();
    },
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener('resume', this.onDeviceResume, false);
    },
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        initPush();
        initKeyboard();
        initFullScreen();
        initBranch();
    },
    onDeviceResume: function() {
        initBranch();
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);
        cdnRootUrl = 'http://live.pegg.us';
        firebaseRootUrl = 'https://pegg-live.firebaseio.com';
        env = 'production';

        if (env == 'dev') {
            // load vendor/app bundles directly
            appendScript(cdnRootUrl + '/vendor.bundle.js')
            .then(function() {
              appendScript(cdnRootUrl + '/app.bundle.js')
            })
        } else {
            // load correct version of app
            getJSON(firebaseRootUrl + '/version.json')
            .then(function(version) {
                window.pegg.version = version
                appendScript(cdnRootUrl + '/src/' + version + '/vendor.bundle.js')
                .then(function() {
                  appendScript(cdnRootUrl + '/src/' + version + '/app.bundle.js')
                    })
                })
        }
    }
};
app.initialize();
