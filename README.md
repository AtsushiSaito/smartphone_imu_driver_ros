# ros_smartphone_imu
The smartphone will be the IMU sensor.

## パッケージ説明
お手持ちのスマートフォンをIMU(慣性計測装置)として使用することができるROSパッケージです。
Web経由でデータをやり取りするため、Rosbridgeを使用しています。
これにより、特別なアプリなどを使用せず、Webページにアクセスするだけで簡単に使えます。

## 使用可能端末
Android(加速度センサやジャイロセンサが搭載されている端末のみ)

※ iOSでは現状動作しません。(近日対応予定)

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
以下のコマンドで`rosbridge`を立ち上げます。
```
roslaunch ros_smartphone_imu secure_rosbridge.launch
```
同時にrvizを表示する場合
```
roslaunch ros_smartphone_imu secure_rosbridge_rviz.launch
```

## ngrokでrosbridgeをSSL接続

ngrokをインストールし、以下のコマンドを実行します。
`192.168.xxx.xxx:9000`の部分は、`rosbridge`が起動しているPCのIPアドレスとポート番号に置き換えます。
```
./ngrok http 192.168.xxx.xxx:9000
```

コマンドを実行すると、以下のような画面が表示されるので、`http://xxxxxxxxxxx.ngrok.io`の`xxxxxxxxxxx.ngrok.io`をメモしておきます。

[https://atsushisaito.github.io/ros_smartphone_imu/](https://atsushisaito.github.io/ros_smartphone_imu/)にアクセスします。

接続先に先程メモした``xxxxxxxxxxx.ngrok.io`を入力し、`接続`ボタンを押します。

接続が成功すると、"imu/data_raw"というTopicが配信されるようになります。
