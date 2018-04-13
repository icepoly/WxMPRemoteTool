#!/usr/bin/python
# -*- coding: utf-8 -*-

import os
import plistlib
import utils
import requests
import json

def init_config():
    global jobUrl
    global open_id
    global skey
    config = os.getcwd() + "/config.xml"
    jobUrl = utils.getXmlText(config, "server/url")
    open_id = utils.getXmlText(config, "user/open_id")
    skey = utils.getXmlText(config, "user/skey")

def getJobInfo():
    data = {
    'open_id' : open_id,
    'skey' : skey
    }
    res = requests.post(jobUrl, data)
    resData = json.loads(res.text)
    if(resData.get("data") and resData["data"]):
        return resData["data"]

def main():
    init_config()
    getJobInfo()

if __name__ == "__main__":
    main()
    