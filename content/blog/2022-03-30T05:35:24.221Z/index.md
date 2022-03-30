---
title: Datastore Emulator on Docker on M1 Mac がハングアップすることに対する対応
date: "2022-03-30T05:35:24.221Z"
description: "Datastore Emulator on Docker on M1 Mac がハングアップすることに対する対応"
---

長らく [google/cloud-sdk](https://hub.docker.com/r/google/cloud-sdk/) の Docker Image が `linux/amd64` にしか対応していませんでした。
Apple Silicon 向け Docker Desktop for Mac で Cloud Datastore Emulator を立ち上げると、CPU が100% でハングするという問題がありました。
その件について対応しましたので記事にしておきました。

## 結論

以下のイメージ(少なくとも 379.0.0 以降)を使う

```
gcr.io/google.com/cloudsdktool/google-cloud-cli:379.0.0-emulators
```

## Memo

仕事で手元でテストがまれに落ちるので困っていたところ、この問題に引っかかっていたことが判明しました。
https://journal.lampetty.net/entry/apple-silicon-docker-desktop-problem

上記にある通り [google/cloud-sdk](https://hub.docker.com/r/google/cloud-sdk/) では長らく `linux/amd64` しか配信されていなかったので M1 Mac では色々と問題がありました。
[GoogleCloudPlatform/cloud-sdk-docker#232](https://github.com/GoogleCloudPlatform/cloud-sdk-docker/issues/232) に改善要望があったのだけれどもしばらく放置されていました。
今一度対応をお願いしたく、多少なり強引に PR を作るなりしてみました。
https://github.com/GoogleCloudPlatform/cloud-sdk-docker/pull/265

結果として、`gcr.io` で配信される `debian_component_based` tag でのみ `linux/arm64` アーキテクチャの Image が配信されるようになりました。
https://github.com/GoogleCloudPlatform/cloud-sdk-docker/issues/232#issuecomment-1062486619

しかし、今回の問題の解決には至りませんでした。
`debian_component_based` tag では Cloud Datastore Emulator はサポートされていないのです。 
その旨を [GoogleCloudPlatform/cloud-sdk-docker#268](https://github.com/GoogleCloudPlatform/cloud-sdk-docker/issues/268) で相談しましたころ、  `emulator` tag でも `linux/arm64` アーキテクチャの Image が配信されるようになりました :tada:
https://console.cloud.google.com/gcr/images/google.com:cloudsdktool/global/google-cloud-cli@sha256:2e87f440123dcc6d8dbf41c42fe0e9c64ce792c181aedec11e0ec9dff44d2775/details

注意点ですが、この対応は Docker Hub 側での Image ([google/cloud-sdk](https://hub.docker.com/r/google/cloud-sdk/)) には適用されていません。
M1 Mac から Cloud SDK on Docker を使うには、今後は `gcr.io/google.com/cloudsdktool/google-cloud-cli` を利用するようにした方がよさそうですね。

[willfaris](https://github.com/willfaris) さん、素早い対応をありがとうございました。
