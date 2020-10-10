---
title: GitHub Actions で set-env が Deprecate になった件に関する対応方法
date: "2020-10-10T06:32:34.248Z"
description: "GitHub Actions で set-env が Deprecate になった件に関して、代替手段を紹介します"
---

GitHub Actions で set-env が Deprecate になってたので対応しました。
ちょっと影響受ける人多そうなので記事にしておきました。

## 結論

以下のようにする

```sh
echo "action_state=yellow" >> $GITHUB_ENV
```

## メモ

GitHub Actions 以下のように環境変数を代入していたら警告が出ていた

```sh
echo ::set-env name=IMAGE::'asia.gcr.io/${{ env.GCP_PROJECT }}/${{ env.SERVICE_NAME }}:${{ github.sha }}'
```

```
Warning: The `set-env` command is deprecated and will be disabled soon.
Please upgrade to using Environment Files.
For more information see: https://github.blog/changelog/2020-10-01-github-actions-deprecating-set-env-and-add-path-commands/
```

URL を開くと Deprecating set-env and add-path commands とのことで、修正する必要がある。

https://github.com/actions/toolkit/security/advisories/GHSA-mfwh-5m23-j46w
の脆弱性への対応らしい。
標準出力で意図せずに `set-env` が呼び出されてしまうと環境変数が書き換えられるから良くないねと。

https://docs.github.com/en/free-pro-team@latest/actions/reference/workflow-commands-for-github-actions#setting-an-environment-variable
に指定されたように書き換えると無事に警告は消えた。

```sh:title=before
echo ::set-env name=IMAGE::'asia.gcr.io/${{ env.GCP_PROJECT }}/${{ env.SERVICE_NAME }}:${{ github.sha }}'
```

```sh:title=after
echo "IMAGE=asia.gcr.io/${{env.GCP_PROJECT}}/${{ matrix.SERVICE_NAME }}:${{ github.sha }}" >> $GITHUB_ENV
```

以下のコマンドを実行すると一発で変換できると思う。
できなかったら、まあ…、頑張ってください。

```sh
find ./.github/workflows -type f -name "*.yml" | xargs sed -i '' -e 's/echo ::set-env name=\(.*\)::['\'']\(.*\)['\'']$/echo "\1=\2" >> $GITHUB_ENV/'
```

過去の記事にある表記も直しておきました。
