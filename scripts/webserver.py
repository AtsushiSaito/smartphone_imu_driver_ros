#!/usr/bin/env python
# -*- coding: utf-8 -*-
import rospy, os
import SimpleHTTPServer

def kill():
    os.system("kill -KILL " + str(os.getpid())) #強制シャットダウン

os.chdir(os.path.dirname(__file__))  #scriptsディレクトリが見えるように
rospy.init_node("webserver")         #rosのノード登録
rospy.on_shutdown(kill)              #kill関数の登録
SimpleHTTPServer.test()              #サーバ立ち上げ
