/*--------ROSとの通信----------*/
var ros = new ROSLIB.Ros({ url : 'ws://' + location.hostname + ':9000' });

ros.on('connection', function(){ console.log("WebSocket: connected");});
ros.on('error', function(error){ console.log("WebSocket error: ", error);});
ros.on('close', function(){ console.log("WebSocket: closed");});

var ros_pub = new ROSLIB.Topic({
    ros : ros,
    name : '/web_time',
    messageType : "sensor_msgs/Imu"
});

window.addEventListener("devicemotion", devicemotionHandler);
function devicemotionHandler(event) {
    accel_x = event.accelerationIncludingGravity.x;
    accel_y = event.accelerationIncludingGravity.y;
    accel_z = event.accelerationIncludingGravity.z;
    alpha = 2*3.141592*(event.rotationRate.alpha/360);
    beta = 2*3.141592*(event.rotationRate.beta/360);
    gamma = 2*3.141592*(event.rotationRate.gamma/360);

    document.getElementById("a_x").innerHTML = accel_x;
    document.getElementById("a_y").innerHTML = accel_y;
    document.getElementById("a_z").innerHTML = accel_z;
    document.getElementById("l_a").innerHTML = alpha;
    document.getElementById("l_b").innerHTML = beta;
    document.getElementById("l_y").innerHTML = gamma;

    var msg = new ROSLIB.Message({
        "angular_velocity":{"x": accel_x, "y": accel_y, "z": accel_z},
        "linear_acceleration":{"x": alpha, "y": beta, "z": gamma}
    });
    ros_pub.publish(msg);
};
