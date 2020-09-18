---
title: 【Bash】シェルスクリプトにて exit 前にコマンドを実行する
date: "2020-09-16T16:05:34.726Z"
description: "シェルスクリプトの中断前にtry-catch-finallyのように処理を実行する方法です"
---

シェルスクリプト内で異常終了時のハンドリングでハマったので。
だいぶ基礎的な気もしますがメモしときます。

あと記事のタイトルが微妙な気がしてます。いい案あったら教えてほしいです。

## 結論

`trap` コマンドで終了時の処理を設定する

```bash:title=main.sh
#!/bin/bash -e

# 終了前に実行したい処理を定義する（関数名は何でも良い）
function finally () {
  echo 'nyao'
}

# EXITシグナルをtrapして中断前に実行したい処理を登録する
trap finally EXIT

# 以降に失敗するかもしれない処理を書く
echo "hoge"
false # ←ここでコマンドが失敗する
echo "huga"
```

```bash
$ ./main.sh       
hoge
nyao
```

## メモ

本題に入る前に `set` の話をします。
シェルスクリプトは `set -e` を実行して以降では「失敗時に中断(exit)する」といった挙動にすることができます。
`false` は必ず失敗する処理です。そこで中断するので `echo "huga"` は実行されていません。

```bash:title=main.sh
#!/bin/bash

set -e

echo "hoge"
false # ←ここでコマンドが失敗する
echo "huga"
```

```bash
$ ./main.sh
hoge
```

試しに `set -e` を外すとこうなります。
失敗後も実行が継続していることがわかります。

```bash:title=main.sh
#!/bin/bash

# set -e # ←コメントアウトしてみる

echo "hoge"
false # ←ここでコマンドが失敗する
echo "huga"
```

```bash
$ ./main.sh
hoge
huga
```

ちなみに `set -e` はシェルスクリプト戦闘の Shebang (`#!/bin/bash` の部分)に `-e` を指定することでも設定できます。
以下のスクリプトでも `set -e` したことになります

```bash:title=main.sh
#!/bin/bash -e

# 以降処理を記述
```

この `set -e` ですが、 `set +e` で解除することが出来たり、他のオプションを指定できたりします。
しますが、全部話すとキリがないのでこのぐらいで。
これだけでも記事書けそうだな...。

---

コマンドが失敗したときのハンドリングは以下のような記述で定義できます。
以下は「 `cd` コマンドが失敗したら "hogeディレクトリは無いみたいです" と表示する」という例です。

```bash
$ cd hoge || echo "hogeディレクトリは無いみたいです"
```

これはもちろんシェルスクリプトでもできます。
上記のような記述をすると右側のコマンドが評価されて正常に実行できたことになってしまうので、更に　`|| exit 1` みたいに書いて異常終了させる必要があります。
そうすればシェルスクリプトでも書くことができますが、シェルスクリプト内の全部の「失敗するかもしれない処理」に対してそれを書いていくわけにはいかないです。
以下みたいに書くと面倒ですよね。

```bash:title=main.sh
#!/bin/bash -e

# hoge ディレクトリが無いことを考慮して記述
cd hoge || echo "終了しました" || exit 1

# huga.txt が無いことを考慮して記述
cat huga.txt || echo "終了しました" || exit 1

echo "終了しました
```

で、この記述を楽にできるのが `trap` です。
上記の例だとこう書くことが出来ます。

```bash:title=main.sh
#!/bin/bash -e

function finally(){
  echo "終了しました"
}
trap finally EXIT

cd hoge
cat huga.txt
```

重要なところはこの `trap finally EXIT` というやつです。
これは「 `EXIT` シグナルを `trap` して中断前にfinallyを実行する」という記述になります。
シグナルとは、実行中のプロセスにさまざまなイベントを通知するために送出されるものです。

**追記ここから ----------------**

フォロワーから「EXIT はシグナルじゃなくて SIGKILL (9) を除くどんな場合でもトラップするという特別な値」と教えてもらいました。

POSIXを確認したところ、 `EXIT` は正確にはシグナルと呼べるものではないみたいです。
trap の引数に指定できるのは「 `EXIT` あるいはシグナル」ということらしいです。
https://pubs.opengroup.org/onlinepubs/9699919799/utilities/V3_chap02.html#trap

また、Bashの仕様には明確な挙動が書かれています。

> If a sigspec is 0 or EXIT, arg is executed when the shell exits.

`trap [-lp] [arg] [sigspec …]` で言うところの `sigspac` が `EXIT` なら、 `arg` がシェルの `exit` 前に実行されるということです。
が、シェルによって `EXIT` の挙動が異なるようなので、`bash` 以外で利用するには注意が必要みたいです。

https://www.gnu.org/software/bash/manual/html_node/Bourne-Shell-Builtins.html#trap

と、これを誤解なく記述しつつ文章をまとめる方法が思いつかないので、とりあえず追記というフォーマットで補足しておきます。

**追記ここまで ----------------**

シェルスクリプト内において、trapは本来用意されていない `EXIT` というシグナル(のようなもの)を使うことが出来ます。
シェルスクリプト内のとあるコマンドが失敗する際には「シェルは自分自身のプロセスに `EXIT` というシグナル(のようなもの)を送出したあとに中断が行われる」ということが行われます。
`EXIT` は正常終了時でも送出されるので、 `try-catch-finally` 構文で言うところの `finally` のような挙動を再現するのに適切です。

ちなみに他の、例えば `ERR` シグナルを用いることで `try-catch-finally` で言うところの `catch` も再現することが出来ます。

```bash:title=main.sh
#!/bin/bash -e

function catch(){
  echo "失敗しました"
}
trap catch ERR

function finally(){
  echo "終了しました"
}
trap finally EXIT

cd hoge
echo "hogeに移動しました"
cat huga.txt
echo "huga.txtを表示しました"
```

```bash
# hoge ディレクトリがない状態で実行
$ ./main.sh
./main.sh: line 13: cd: hoge: No such file or directory
失敗しました
終了しました

# hoge ディレクトリを作成
$ mkdir hoge

# hoge ディレクトリはあるが hoge/huga.txt がない状態で実行
$ ./main.sh
hogeに移動しました
cat: huga.txt: No such file or directory
失敗しました
終了しました

# hoge/huga.txt を作成
$ echo "ニャオニャオ" > hoge/huga.txt

# hoge ディレクトリも hoge/huga.txt もある状態で実行
$ ./main.sh                          
hogeに移動しました
ニャオニャオ
huga.txtを表示しました
終了しました
```

---

なんでこんなこと調べたかという話ですが、 `git` の操作をするシェルスクリプトを書いていたからです。
例えば以下のような「指定されたコミットハッシュに存在する `hoge.txt` や `huga.txt` を表示する」みたいなシェルスクリプトを組んでいたとしましょう。

```bash:title=main.sh
#!/bin/bash -e

# ORIGINAL_BRANCH に現在のブランチ名を格納
ORIGINAL_BRANCH=$(git rev-parse --abbrev-ref HEAD)

# シェルスクリプトの引数で指定されたコミットハッシュに移動する
git checkout $1

# hoge.txt を表示する
cat hoge.txt

# huga.txt を表示する
cat huga.txt

# もとのブランチに戻る
git checkout -f "$ORIGINAL_BRANCH"
```

ここで気になるのは「指定されたハッシュにファイルが存在しなくて `cat hoge.txt` や `cat huga.txt` が失敗したら、もとのブランチに戻る処理が実行されない」という点です。
こういうときに困っていたときにたどり着いた情報が `trap` を使うことでした。

`trap` を使うことによって以下のように書けました。良かったですね。

```bash:title=main.sh
#!/bin/bash -e

# ORIGINAL_BRANCH に現在のブランチ名を格納
ORIGINAL_BRANCH=$(git rev-parse --abbrev-ref HEAD)

# EXITシグナルが送出されたらもとのブランチに戻る
function finally(){
  git checkout -f "$ORIGINAL_BRANCH"
}
trap finally EXIT

# シェルスクリプトの引数で指定されたコミットハッシュに移動する
git checkout $1

# hoge.txt を表示する（失敗するかも）
cat hoge.txt

# huga.txt を表示する
cat huga.txt
```

## 参考

- https://www.linuxjournal.com/content/bash-trap-command
- https://www.atmarkit.co.jp/ait/articles/1805/10/news023.html
- https://shellscript.sunone.me/signal_and_trap.html
- https://qiita.com/ryo0301/items/7bf1eaf00b037c38e2ea
- https://qiita.com/ine1127/items/5523b1b674492f14532a
