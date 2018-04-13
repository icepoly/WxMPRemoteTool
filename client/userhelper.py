#!/usr/bin/python
# -*- coding: utf-8 -*-

import os
import plistlib
import utils
import requests
import json
import time
from urllib import parse

def init_config():
    global jobUrl
    global open_id
    global skey
    global userName
    global userPw
    global loginUrl
    global checkInUrl
    global checkOutUrl

    config = os.getcwd() + "/config.xml"
    jobUrl = utils.getXmlText(config, "server/url")
    open_id = utils.getXmlText(config, "user/open_id")
    userName = utils.getXmlText(config, "user/userName")
    userPw = utils.getXmlText(config, "user/passwd")
    skey = utils.getXmlText(config, "user/skey")
    loginUrl = utils.getXmlText(config, "component/loginUrl")
    checkInUrl = utils.getXmlText(config, "component/checkInUrl")
    checkOutUrl = utils.getXmlText(config, "component/checkOutUrl")

def getJobInfo():
    data = {
    'open_id' : open_id,
    'skey' : skey
    }
    res = requests.post(jobUrl, data)
    resData = json.loads(res.text)
    if(resData.get("data") and resData["data"]):
        return resData["data"]

def executeJob(jobdata):
    if(jobdata.get("type") and jobdata.get("type") == 1):
        if(jobdata.get("optype") == 1):
            print("doCheckIn")
            #doCheck(checkInUrl)
        elif(jobdata.get("optype") == 2):
            print("doCheckOut")
            #doCheck(checkOutUrl)

def doCheckIn():
    loginData = doUserLogin()
    if(loginData and loginData.get("tokenId")):
        cookie = {
        'iPlanetDirectoryPro' : loginData.get("tokenId")
        }
        res = requests.get(checkInUrl, cookies=cookie, verify=False)
        print(res.text)

def doCheck(checkUrl):
    loginData = doUserLogin()
    if(loginData and loginData.get("tokenId")):
        cookie = {
        'iPlanetDirectoryPro' : loginData.get("tokenId")
        }
        res = requests.get(checkUrl, cookies=cookie, verify=False)
        print(res.text)

def doUserLogin():
    data = {
    'username' : userName,
    'password' : userPw
    }
    res = requests.post(loginUrl, data, verify=False)
    resData = json.loads(res.text)
    return resData

def run():
    while True:
        jobdata = getJobInfo()
        if jobdata :
            executeJob(jobdata)

        time.sleep(60)

    print("program exit")

def main():
    init_config()
    run()

if __name__ == "__main__":
    main()
    