---
title: Mac でコマンド終了時に音を鳴らす
date: "2023-03-07T08:28:36.414Z"
description: "Mac でコマンド終了時に音を鳴らす方法についてです"
---

「プロジェクトAのビルド中にプロジェクトBの開発を進めよう！」

このように、コマンドラインで長いタスクを実行しながら、自分は裏で別の作業をすることがまあまああります。
その場合に、そのタスクが終わったタイミングをすぐに知る必要があることが多いです。

例えば上記の例で言うと、ビルドが失敗したらプロジェクトAの修正にすぐに取り掛かりたいですよね。
とはいえ、都度ビルドの状況を確認してたらプロジェクトBの作業が進みません。

そういった時に、ビルドが終わったタイミングで音で通知できると便利そうです。

## 結論

以下のようにすると `long_task.sh` の実行後に「ポン！」って音が鳴ります

```sh
$ ./long_task.sh && afplay /System/Library/Sounds/Submarine.aiff
```

## Memo

別に流す音声ファイルはなんだっていいです。音声ファイルなら基本的に問題なく流せる気がします。

システム用の音声は他にもあるので、好きなやつを探してもいいし、自分で音声ファイルを用意しても良いです。

```
$ /System/Library/Sounds
Basso.aiff     Frog.aiff      Hero.aiff      Pop.aiff       Submarine.aiff
Blow.aiff      Funk.aiff      Morse.aiff     Purr.aiff      Tink.aiff
Bottle.aiff    Glass.aiff     Ping.aiff      Sosumi.aiff
```
