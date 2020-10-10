---
title: GitHub Actions から Cloud Run へデプロイする
date: "2020-09-12T15:45:14.186Z"
description: "GitHub Actions から Cloud Run へデプロイする方法です"
---

GitHub Actions から Cloud Run へデプロイする方法です。
いつも調べ直している気がするのでメモしておきます。

## 結論

CloudRun の APIを有効にしておきます。
https://console.cloud.google.com/apis/library/run.googleapis.com

あらかじめサービスアカウントを作って鍵を発行して `GCP_SA_KEY` を リポジトリの Secrets に登録します。
サービスアカウントには以下の Role （か、カスタムロール）を設定します。

- roles/run.admin : Cloud Run 管理者
- roles/serverless.serviceAgent	: Cloud Run Cloud Run サービス エージェント
- roles/storage.admin	: ストレージ管理者

で、以下のファイルをリポジトリに置きます。

```yaml:title=.github/workflow/deploy.yml
name: deloy

# この例は master ブランチへの push 時にデプロイするようにしているので、適宜変更をする
on: 
  push:
    branches:
      - master

# 自分のプロダクトに合わせて設定をする
env:
  GCP_PROJECT: "your-gcp-project-name"
  GCP_REGION: "asia-northeast1"
  SERVICE_NAME: "your-cloudrun-service-name"

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout the repository
        uses: actions/checkout@v2

      - name: GCP Authenticate
        uses: GoogleCloudPlatform/github-actions/setup-gcloud@master
        with:
          version: '306.0.0'
          service_account_key: ${{ secrets.GCP_SA_KEY }}
          export_default_credentials: true

      - name: Configure docker to use the gcloud cli
        run: gcloud auth configure-docker --quiet'

      - name: Set the docker image name
        run: echo "IMAGE=asia.gcr.io/${{ env.GCP_PROJECT }}/${{ env.SERVICE_NAME }}:${{ github.sha }}" >> $GITHUB_ENV

      - name: Build a docker image
        run: docker build -t $IMAGE

      - name: Push the docker image
        run: docker push $IMAGE

      - name: Deploy to Cloud Run
        run: |
            gcloud run deploy $SERVICE_NAME \
              --image $IMAGE \
              --project $GCP_PROJECT \
              --region $GCP_REGION \
              --platform managed \
              --allow-unauthenticated \
              --quiet
```


## メモ

覚えておきたいことをメモしておきます。
基本的には Cloud Run のデプロイに必要なことをそのままの順序で行っているだけです。

`gcloud` コマンドを使えるようにするために `GoogleCloudPlatform/github-actions/setup-gcloud@master` でセットアップします。
README 内にあるサンプルをペタッとして終わりです。楽ですね。

https://github.com/GoogleCloudPlatform/github-actions/tree/master/setup-gcloud#usage

サービスアカウントに必要な権限なんですが、ここを参考にしてカスタムロール作っても良いかなと思いました。
https://cloud.google.com/run/docs/reference/iam/roles#additional-configuration

docker push で GCR に push するためには `gcloud auth configure-docker` で認証をする必要があります。
https://cloud.google.com/container-registry/docs/advanced-authentication#gcloud-helper

プロンプトで確認が入るのを防ぐために、 `--quiet` が必要です。

```
gcloud auth configure-docker --quiet
```

GitHub Actions では、 step から環境変数を設定するために `$GITHUB_ENV` というのを使う必要があり、以下のように環境変数の設定をすることにしました。
これで `IMAGE` に　`'asia.gcr.io/${{ env.GCP_PROJECT }}/${{ env.SERVICE_NAME }}:${{ github.sha }}'` が入ります。

```
echo "IMAGE=asia.gcr.io/${{ env.GCP_PROJECT }}/${{ env.SERVICE_NAME }}:${{ github.sha }}" >> $GITHUB_ENV
```

`gcloud run deploy` も同様に、プロンプトで確認が入るのを防ぐために、 `--quiet` が必要です。
また、オプションは適宜変更する必要があるかなと思います。
ビルド時にメモリが足りずにエラーになるようだったらこんな感じで `--memory 512Mi` を指定するなどをします。


```sh
gcloud run deploy $SERVICE_NAME \
  --image $IMAGE \
  --project $GCP_PROJECT \
  --region $GCP_REGION \
  --platform managed \
  --allow-unauthenticated \
  --quiet \
  --memory 512Mi
```

詳しくはこちら
https://cloud.google.com/sdk/gcloud/reference/run/deploy
