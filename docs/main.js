// 構造体
function ImuData() {
    this.a_x;
    this.a_y;
    this.a_z;
    this.v_a;
    this.v_b;
    this.v_g;

    this.o_x;
    this.o_y;
    this.o_z;
    this.o_w;
}

var imu_data = new ImuData();
quaternionpose = new THREE.Quaternion;
var imu_publisher;

function connect() {
    if (address_form.address.value == "") {
        alert("IPアドレスを入力してください。");
    } else {
        var ros = new ROSLIB.Ros({ url: 'wss://' + address_form.address.value });

        imu_publisher = new ROSLIB.Topic({
            ros: ros,
            name: 'imu/data_raw',
            messageType: "sensor_msgs/Imu"
        });

        ros.on('connection', function () {
            console.log("WebSocket: connected");
            document.getElementById("wss_info").innerHTML = "接続済み";
        });
        ros.on('error', function (error) {
            console.log("WebSocket error: ", error);
            document.getElementById("wss_info").innerHTML = "接続エラー";
        });
        ros.on('close', function () {
            console.log("WebSocket: closed");
            document.getElementById("wss_info").innerHTML = "接続切断済み";
        });
    }
}

function request_permission() {
    if (
        DeviceMotionEvent &&
        DeviceMotionEvent.requestPermission &&
        typeof DeviceMotionEvent.requestPermission === 'function'
    ) {
        DeviceMotionEvent.requestPermission();
    }
    if (
        DeviceOrientationEvent &&
        DeviceOrientationEvent.requestPermission &&
        typeof DeviceOrientationEvent.requestPermission === 'function'
    ) {
        DeviceOrientationEvent.requestPermission();
    }
}

window.addEventListener("deviceorientation", (event) => {
    // http://wiki.ros.org/roslibjs/Tutorials/Publishing%20video%20and%20IMU%20data%20with%20roslibjs
    var beta_radian = ((event.beta + 360) / 360 * 2 * Math.PI) % (2 * Math.PI);  // x軸（左右）まわりの回転の角度（引き起こすとプラス）
    var gamma_radian = ((event.gamma + 360) / 360 * 2 * Math.PI) % (2 * Math.PI);// y軸（上下）まわりの回転の角度（右に傾けるとプラス）
    var alpha_radian = ((event.alpha + 360) / 360 * 2 * Math.PI) % (2 * Math.PI);// z軸（表裏）まわりの回転の角度（反時計回りがプラス）
    var eurlerpose = new THREE.Euler(beta_radian, gamma_radian, alpha_radian);
    quaternionpose.setFromEuler(eurlerpose);
});

var data_send = function () {
    if (imu_publisher != null) {
        var msg = new ROSLIB.Message({
            header: {
                frame_id: "imu_link"
            },
            orientation: {
                x: quaternionpose.x,
                y: quaternionpose.y,
                z: quaternionpose.z,
                w: quaternionpose.w
            },
            orientation_covariance: [0, 0, 0, 0, 0, 0, 0, 0, 0],
            angular_velocity: {
                x: imu_data.v_b,
                y: imu_data.v_g,
                z: imu_data.v_a,
            },
            angular_velocity_covariance: [0, 0, 0, 0, 0, 0, 0, 0, 0],
            linear_acceleration: {
                x: imu_data.a_x,
                y: imu_data.a_y,
                z: imu_data.a_z,
            },
            linear_acceleration_covariance: [0, 0, 0, 0, 0, 0, 0, 0, 0],
        });
        imu_publisher.publish(msg);
    }
}

window.addEventListener("devicemotion", devicemotionHandler);
function devicemotionHandler(event) {

    if (event.accelerationIncludingGravity.x != null) {
        imu_data.a_x = event.accelerationIncludingGravity.x;
        imu_data.a_y = event.accelerationIncludingGravity.y;
        imu_data.a_z = event.accelerationIncludingGravity.z;
        document.getElementById("a_x").innerHTML = imu_data.a_x;
        document.getElementById("a_y").innerHTML = imu_data.a_y;
        document.getElementById("a_z").innerHTML = imu_data.a_z;
    } else {
        document.getElementById("a_x").innerHTML = "NULL";
        document.getElementById("a_y").innerHTML = "NULL";
        document.getElementById("a_z").innerHTML = "NULL";
    }

    if (event.rotationRate.alpha != null) {
        imu_data.v_g = event.rotationRate.gamma;
        imu_data.v_b = event.rotationRate.beta;
        imu_data.v_a = event.rotationRate.alpha;
        document.getElementById("l_b").innerHTML = imu_data.v_b;
        document.getElementById("l_g").innerHTML = imu_data.v_g;
        document.getElementById("l_a").innerHTML = imu_data.v_a;
    } else {
        document.getElementById("l_b").innerHTML = "NULL";
        document.getElementById("l_g").innerHTML = "NULL";
        document.getElementById("l_a").innerHTML = "NULL";
    }
};

setInterval(data_send, 10);