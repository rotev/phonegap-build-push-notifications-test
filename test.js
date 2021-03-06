
document.addEventListener("deviceready", function() {
  window.pushNotification = window.plugins.pushNotification;
  init_push_notifications();
}, false); 


function init_push_notifications() {
  if (device.platform == 'android' || device.platform == 'Android') {
    alert('registering...');
    pushNotification.register(pg_success_handler, pg_error_handler, {
      "senderID": "608777187337",
      "ecb": on_pg_gcm_notification
    });
  } else {
      pushNotification.register(pg_token_handler, pg_error_handler, {
        "badge": "true",
        "sound":"true", 
        "alert":"true",
        "ecb": on_pg_apn_notification
      });
  }
}

function pg_success_handler(result) {
  alert('successs');
  alert(result);
}

function pg_error_handler(error) {
  alert('error');
  alert(error);
}

function pg_token_handler(result) {
    // Your iOS push server needs to know the token before it can push to this device
    // here is where you might want to send it the token for later use.
  alert('device token = '+result);
}

function on_pg_gcm_notification(e) {

      $("#app-status-ul").append('<li>EVENT -> RECEIVED:' + e.event + '</li>');

      switch(e.event) {
          case 'registered':
            if (e.regid.length > 0) {
                $("#app-status-ul").append('<li>REGISTERED -> REGID:' + e.regid + "</li>");
                // Your GCM push server needs to know the regID before it can push to this device
                // here is where you might want to send it the regID for later use.
                console.log("regID = " + e.regID);
            }
            break;

          case 'message':
              // if this flag is set, this notification happened while we were in the foreground.
              // you might want to play a sound to get the user's attention, throw up a dialog, etc.
              if (e.foreground){
                  $("#app-status-ul").append('<li>--INLINE NOTIFICATION--' + '</li>');

                  // if the notification contains a soundname, play it.
                  var my_media = new Media("/android_asset/www/"+e.soundname);
                  my_media.play();
              }
              else {   // otherwise we were launched because the user touched a notification in the notification tray.
                  if (e.coldstart)
                      $("#app-status-ul").append('<li>--COLDSTART NOTIFICATION--' + '</li>');
                  else
                  $("#app-status-ul").append('<li>--BACKGROUND NOTIFICATION--' + '</li>');
              }

              $("#app-status-ul").append('<li>MESSAGE -> MSG: ' + e.payload.message + '</li>');
              $("#app-status-ul").append('<li>MESSAGE -> MSGCNT: ' + e.payload.msgcnt + '</li>');
            break;

          case 'error':
              $("#app-status-ul").append('<li>ERROR -> MSG:' + e.msg + '</li>');
            break;

          default:
              $("#app-status-ul").append('<li>EVENT -> Unknown, an event was received and we do not know what it is</li>');
            break;
      }
}

function on_pg_apn_notification(event) {      
    if (event.alert) {
        navigator.notification.alert(event.alert);
    }

    if (event.sound) {
        var snd = new Media(event.sound);
        snd.play();
    }

    if (event.badge) {
        pushNotification.setApplicationIconBadgeNumber(pg_success_handler, pg_error_handler, event.badge);
    }
}     