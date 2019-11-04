function connect() {
    if (address_form.address.value == "") {
        alert("IPアドレスを入力してください。");
    } else {
        // alert("IP:" + address_form.address.value);
        var ros = new ROSLIB.Ros({ url: 'wss://' + address_form.address.value + ':9000' });

        var ros_pub = new ROSLIB.Topic({
            ros: ros,
            name: 'imu/data_raw',
            messageType: "sensor_msgs/Imu"
        });

        ros.on('connection', function () { console.log("WebSocket: connected"); });
        ros.on('error', function (error) { console.log("WebSocket error: ", error); });
        ros.on('close', function () { console.log("WebSocket: closed"); });
    }
}

window.addEventListener("devicemotion", devicemotionHandler);
function devicemotionHandler(event) {
    accel_x = event.accelerationIncludingGravity.x;
    accel_y = event.accelerationIncludingGravity.y;
    accel_z = event.accelerationIncludingGravity.z;
    alpha = 2 * 3.141592 * (event.rotationRate.alpha / 360);
    beta = 2 * 3.141592 * (event.rotationRate.beta / 360);
    gamma = 2 * 3.141592 * (event.rotationRate.gamma / 360);

    document.getElementById("a_x").innerHTML = accel_x;
    document.getElementById("a_y").innerHTML = accel_y;
    document.getElementById("a_z").innerHTML = accel_z;
    document.getElementById("l_b").innerHTML = beta;
    document.getElementById("l_g").innerHTML = gamma;
    document.getElementById("l_a").innerHTML = alpha;

    var msg = new ROSLIB.Message({
        "angular_velocity": { "x": accel_x, "y": accel_y, "z": accel_z },
        "linear_acceleration": { "x": beta, "y": gamma, "z": alpha }
    });
    ros_pub.publish(msg);
};
