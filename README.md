# ros_smartphone_imu
The smartphone will be the IMU sensor.

## パッケージ説明
お手持ちのスマートフォンをIMU(慣性計測装置)として使用することができるROSパッケージです。
Web経由でデータをやり取りするため、Rosbridgeを使用しています。
これにより、特別なアプリなどを使用せず、Webページにアクセスするだけで簡単に使えます。

## 出力形式
ROSの"sensor_msgs/Imu"に準拠した出力になります。

加速度 -> x,y,z[m/s2]

角加速度 -> x,y,z[rad/s]

## インストール

rosbridgeをインストールします。
```
sudo apt install ros-kinetic-rosbridge-suite
```
ros_smartphone_imuを追加します。
```
cd ~/catkin_ws/src
git clone https://github.com/AtsushiSaito/ros_smartphone_imu.git
cd ~/catkin_ws && catkin_make && source ~/catkin_ws/devel/setup.bash
```

## 使用方法
以下のコマンドを実行し、Webサーバを立ち上げます。
```
roslaunch ros_smartphone_imu sample.launch
```
ROSが起動しているPCのIPアドレスを調べ、スマートフォンのブラウザから以下のようにアクセスします。
```
IPアドレス:8000
# 例 -> 192.168.0.33:8000
```
これで"imu/data_raw"というTopicが配信されるようになります。
