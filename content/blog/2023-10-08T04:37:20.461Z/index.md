---
title: 今更 asdf で nodejs の10系を入れる
date: "2023-10-08T04:37:20.461Z"
description: "asdf で nodejs の 12.16.1 を入れる時に悩んだので記録を残しておく"
---

## 結論

こうするといい

```bash
asdf install python 2.7.18
ASDF_PYTHON_VERSION=2.7.18 asdf install nodejs 12.16.1
```

## 作業記録

### １回目

```bash
$ asdf install nodejs 12.16.1                           
Trying to update node-build... ok
Downloading node-v12.16.1.tar.gz...
-> https://nodejs.org/dist/v12.16.1/node-v12.16.1.tar.gz

WARNING: node-v12.16.1 is in LTS Maintenance mode and nearing its end of life.
It only receives *critical* security updates, *critical* bug fixes and documentation updates.

Installing node-v12.16.1...

BUILD FAILED (OS X 13.5.2 using node-build 4.9.125)

Inspect or clean up the working tree at /var/folders/bg/_b487w692pd_yt93kr3v9_hr0000gq/T/node-build.20231008133346.64241.cfZWyf
Results logged to /var/folders/bg/_b487w692pd_yt93kr3v9_hr0000gq/T/node-build.20231008133346.64241.log

Last 10 log lines:
/var/folders/bg/_b487w692pd_yt93kr3v9_hr0000gq/T/node-build.20231008133346.64241.cfZWyf ~
/var/folders/bg/_b487w692pd_yt93kr3v9_hr0000gq/T/node-build.20231008133346.64241.cfZWyf/node-v12.16.1 /var/folders/bg/_b487w692pd_yt93kr3v9_hr0000gq/T/node-build.20231008133346.64241.cfZWyf ~
Traceback (most recent call last):
  File "/private/var/folders/bg/_b487w692pd_yt93kr3v9_hr0000gq/T/node-build.20231008133346.64241.cfZWyf/node-v12.16.1/./configure", line 15, in <module>
    from distutils.spawn import find_executable as which
ModuleNotFoundError: No module named 'distutils'
Missing or stale config.gypi, please run ./configure
make: *** [config.gypi] Error 1
```

distutil というのが参照できないらしい。

https://docs.python.org/ja/3/library/distutils.html

> distutils は 非推奨で、Python 3.12 での除去が予定されています。 より詳しい情報は What's New 記事を参照してください。

確かに今は 3.12.0 を使っているので、すでに利用できないのも納得

```bash
$ asdf current python
python          3.12.0          /Users/takanakahiko/.tool-versions
```

とのことなので、 python の `3.11.6` を入れてみる

```bash
$ asdf install python 3.11.6
python-build 3.11.6 /Users/takanakahiko/.asdf/installs/python/3.11.6
python-build: use openssl@1.1 from homebrew
python-build: use readline from homebrew
Downloading Python-3.11.6.tar.xz...
-> https://www.python.org/ftp/python/3.11.6/Python-3.11.6.tar.xz
Installing Python-3.11.6...
python-build: use readline from homebrew
python-build: use zlib from xcode sdk
Installed Python-3.11.6 to /Users/takanakahiko/.asdf/installs/python/3.11.6
```

### 2回目

`ASDF_PYTHON_VERSION` で一時的に利用するツールのバージョンを指定することが可能

```bash
$ ASDF_PYTHON_VERSION=3.11.6 asdf install nodejs 12.16.1      
Trying to update node-build... ok
Downloading node-v12.16.1.tar.gz...
-> https://nodejs.org/dist/v12.16.1/node-v12.16.1.tar.gz

WARNING: node-v12.16.1 is in LTS Maintenance mode and nearing its end of life.
It only receives *critical* security updates, *critical* bug fixes and documentation updates.

Installing node-v12.16.1...

BUILD FAILED (OS X 13.5.2 using node-build 4.9.125)

Inspect or clean up the working tree at /var/folders/bg/_b487w692pd_yt93kr3v9_hr0000gq/T/node-build.20231008133435.67015.0G97Ic
Results logged to /var/folders/bg/_b487w692pd_yt93kr3v9_hr0000gq/T/node-build.20231008133435.67015.log

Last 10 log lines:
/var/folders/bg/_b487w692pd_yt93kr3v9_hr0000gq/T/node-build.20231008133435.67015.0G97Ic ~
/var/folders/bg/_b487w692pd_yt93kr3v9_hr0000gq/T/node-build.20231008133435.67015.0G97Ic/node-v12.16.1 /var/folders/bg/_b487w692pd_yt93kr3v9_hr0000gq/T/node-build.20231008133435.67015.0G97Ic ~
Please use Python 2.7
Missing or stale config.gypi, please run ./configure
make: *** [config.gypi] Error 1
```

> Please use Python 2.7

とのことなのでそうする

```bash
$ asdf install python 2.7.18
python-build 2.7.18 /Users/takanakahiko/.asdf/installs/python/2.7.18
python-build: use openssl@1.1 from homebrew
python-build: use readline from homebrew
Downloading Python-2.7.18.tar.xz...
-> https://www.python.org/ftp/python/2.7.18/Python-2.7.18.tar.xz
Installing Python-2.7.18...
patching file configure
patching file configure.ac
patching file setup.py
patching file 'Mac/Tools/pythonw.c'
patching file setup.py
patching file 'Doc/library/ctypes.rst'
patching file 'Lib/test/test_str.py'
patching file 'Lib/test/test_unicode.py'
patching file 'Modules/_ctypes/_ctypes.c'
patching file 'Modules/_ctypes/callproc.c'
patching file 'Modules/_ctypes/ctypes.h'
patching file 'Modules/_ctypes/callproc.c'
patching file setup.py
patching file 'Mac/Modules/qt/setup.py'
patching file setup.py
python-build: use readline from homebrew
python-build: use zlib from xcode sdk
Installing pip from https://bootstrap.pypa.io/pip/2.7/get-pip.py...
Installed Python-2.7.18 to /Users/takanakahiko/.asdf/installs/python/2.7.18
```

### 3回目

```bash
❯ ASDF_PYTHON_VERSION=2.7.18 asdf install nodejs 12.16.1
Trying to update node-build... ok
Downloading node-v12.16.1.tar.gz...
-> https://nodejs.org/dist/v12.16.1/node-v12.16.1.tar.gz

WARNING: node-v12.16.1 is in LTS Maintenance mode and nearing its end of life.
It only receives *critical* security updates, *critical* bug fixes and documentation updates.

Installing node-v12.16.1...
Installed node-v12.16.1 to /Users/takanakahiko/.asdf/installs/nodejs/12.16.1
```

うまくいった

```bash
$ asdf local nodejs 12.16.1
$ node -v
v12.16.1
```
