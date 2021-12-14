---
title: GCE の update-container で Instance doesn't have gce-container-declaration metadata key
date: "2021-12-14T04:49:16.778Z"
description: "container-optimized GCE VM に Containers をデプロイしようとしたところ問題が発生したので解消方法を紹介します"
---

GCE (Google Compute Engine) の container-optimized GCE VM に Containers をデプロイしようとしたところ問題が発生したので記事にしておきました。

## 問題

```
$ gcloud compute instances update-container "$GCE_INSTANCE" \
    --zone "$GCE_INSTANCE_ZONE" \
    --container-image "gcr.io/$PROJECT_ID/$GCE_INSTANCE-image:$GITHUB_SHA"

ERROR: (gcloud.compute.instances.update-container) Instance doesn't have gce-container-declaration metadata key - it is not a container.
```

## 解決方法

GCE の container-optimized GCE VM の作成時に Containers を指定する。

## 解説

GCE の container-optimized GCE VM は作成時に Boot disk を Container Optimized OS に設定すると良い(と思ってる)。
そのときに Containers を指定する必要があり、そうしないと `gce-container-declaration metadata` というものが登録されないらしく、そもそも container-optimized GCE VM として振る舞ってくれないらしい。

少なくとも、VM 作成時には仮の Container でもいいからデプロイしておく必要がある。
