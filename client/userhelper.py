# -*- coding: utf-8 -*-

import os
import utils
import requests
import json
import time
import base64
import re


def init_config():
    global jobUrl
    global open_id
    global skey
    global userName
    global userPw
    global loginUrl
    global checkInUrl
    global checkOutUrl
    global jobFilePath
    global jobStoreMaxTime

    config = os.getcwd() + "/config.xml"
    jobUrl = utils.getXmlText(config, "server/url")
    open_id = base64.b64decode(utils.getXmlText(config, "user/open_id"))
    userName = base64.b64decode(utils.getXmlText(config, "user/userName"))
    userPw = base64.b64decode(utils.getXmlText(config, "user/passwd"))
    skey = base64.b64decode(utils.getXmlText(config, "user/skey"))
    loginUrl = utils.getXmlText(config, "component/check/loginurl")
    checkInUrl = utils.getXmlText(config, "component/check/checkinurl")
    checkOutUrl = utils.getXmlText(config, "component/check/checkouturl")
    jobFilePath = utils.getXmlText(config, "component/buildserver/jobfilepath")
    jobStoreMaxTime = int(
        utils.getXmlText(config, "component/buildserver/jobStoremaxtime"))

    s = requests.session()
    s.keep_alive = False


def getJobInfo():
    data = {'open_id': open_id, 'skey': skey}
    res = requests.get(jobUrl, params=data)
    resData = json.loads(res.text)
    if (resData):
        if isinstance(resData, dict) and resData.get("code") and resData.get(
                "code") == 0 or resData == int('-0x20f0', 16):
            return {}
        elif (isinstance(resData, dict)):
            return resData
        else:
            print("getJobInfo error:", hex(resData))
            return {}


def updateJobInfo(msg):
    data = {'open_id': open_id, 'skey': skey, 'msg': msg}
    requests.post(jobUrl, data)
    print(msg)


def executeJob(jobdata):
    if not jobdata.get("type"):
        ret = "No Function"
        if jobdata.get("type") == 0:
            if jobdata.get("optype") == 0:
                print("doCheckIn")
                ret = doCheck(checkInUrl)
            elif jobdata.get("optype") == 1:
                print("doCheckOut")
                ret = doCheck(checkOutUrl)
        elif jobdata.get("type") == 1:
            if jobdata.get("optype") == 0:
                print("doBuildServer")
                ret = doBuildServer(jobdata.get("opdata"))
            elif jobdata.get("optype") == 1:
                print("doBuildClient")
        updateJobInfo(ret)


def doCheck(checkUrl):
    loginData = doUserLogin()
    if loginData and loginData.get("tokenId"):
        cookie = {'iPlanetDirectoryPro': loginData.get("tokenId")}
        res = requests.get(checkUrl, cookies=cookie, verify=False)
        return parseCheckResult(res.text)


def doUserLogin():
    data = {'username': userName, 'password': userPw}
    res = requests.post(loginUrl, data, verify=False)
    resData = json.loads(res.text)
    return resData


def parseCheckResult(res):
    msg = res
    temp = re.sub('[{}\']', '', res)
    temp = temp.split(',')
    if len(temp) >= 2:
        ret = temp[0].replace('result:', '')
        if ret == 'true':
            msg = temp[1].replace('actionType:', '')
            if len(temp) > 2:
                for index in range(2, len(temp)):
                    msg = msg + ' ' + temp[index]

    return msg


def doCleanServerJob():
    jobDir = os.listdir(jobFilePath)
    for fileName in jobDir:
        file = os.path.join(jobFilePath, fileName)
        if os.path.isfile(file):
            diff = int(time.time()) - int(fileName)
            if diff > jobStoreMaxTime:
                os.remove(file)


def doBuildServer(args):
    doCleanServerJob()
    jobFile = jobFilePath + str(int(time.time()))
    with open(jobFile, 'w') as f:
        f.write(args)
    return 'Begin Build Server ' + args


def run():
    while True:
        jobdata = getJobInfo()
        if jobdata:
            executeJob(jobdata)

        time.sleep(60)

    print("program exit")


def main():
    init_config()
    run()


if __name__ == "__main__":
    main()
