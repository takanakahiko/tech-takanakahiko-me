---
title: Gatsby.js で記事の URL のみカスタマイズする
date: "2020-09-08T21:24:43.098Z"
description: "Gatsby.jsで記事のURLをカスタマイズ(例えば /posts 以下に)する方法です。 "
---

Gatsby.js で記事の URL をカスタマイズする方法です。
これを使うと、すべての記事の URL が変更されるので注意が必要です。

もっとスマートな方法があったら教えていただけると嬉しいです。

## 結論

gatsby-node.js のこれを

```js:title=gatsby-node.js
exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}
```

こうします

```js:title=gatsby-node.js
exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    console.log(node)
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value: `/posts${value}`, // ここでカスタマイズします
    })
  }
}
```

## メモ

そもそも私自身 Gatsby.js を始めて日が浅いので、今回の方法がベストプラクティスではない可能性がありますのでご容赦ください。

[gatsby-source-filesystem](https://www.gatsbyjs.com/plugins/gatsby-source-filesystem/) を使用している前提です。
これは [gatsby-starter-blog](https://github.com/gatsbyjs/gatsby-starter-blog) にデフォルトで採用されてるやつです。

記事は登録した Node をもとに生成されています。
その Node を登録するときに `onCreateNode` が呼ばれています。

https://www.gatsbyjs.com/docs/node-apis/#onCreateNode

gatsby-source-filesystem だとその中で `createFilePath` にて生成されるパスをそのまま設定しているのがデフォルトになっています。
`value` というやつですね。
`value` には例えば `/2020-09-08T21:24:43.098Z/` みたいな文字列が入ってます。

https://www.gatsbyjs.com/plugins/gatsby-source-filesystem/#createfilepath

```js:title=gatsby-node.js
exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}
```

こいつを書き換えることで URL を変化させることが出来ます。
今回ですと `value` に `/2020-09-08T21:24:43.098Z/` みたいな文字列が入っていたら、`/posts/2020-09-08T21:24:43.098Z/` にすれば良さそうです。
そのため `value` を `` `/posts${value}` `` に書き換えればいいというわけです。

```js:title=gatsby-node.js
exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    console.log(node)
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value: `/posts${value}`,
    })
  }
}
```

ドキュメントのここらへんにも書き換えてるサンプルがありますね。
https://www.gatsbyjs.com/plugins/gatsby-source-filesystem/#example-usage

...

そもそもなぜ URL をカスタマイズするかという話です。

URL から「記事」「記事ではないページ」を判定できることはとても大きなメリットです。
記事のみ移管するときにリダイレクト等の差し込みが楽になります。

URL を変更する際には「パスを切る」ほうが「パスを切るのをやめる」より難しいです。
つまり、 `/2020-09-08T21:24:43.098Z` を `/posts/2020-09-08T21:24:43.098Z` のように変えるのはとてもコストが掛かるのです。

なぜか、それはその記事がリンクされた場合とかを想定すると容易です。
記事の URL を変更したなら、親切なら変更後の URL にリダイレクトしたいところです。
しかし、例えばタグ一覧ページ( `/tags` )みたいなのがあったとして、そういった「記事ではないページ」はリダイレクトしないようにする必要があります。
「記事ではないページ」も「記事」も同じように `/` 以下直接にしてしまうと、あとから判別が難しくなりそうです。

しかし、逆は簡単です。
`/posts/2020-09-08T21:24:43.098Z` を `/2020-09-08T21:24:43.098Z` にする場合ですね。
その場合は「`/post`以下に来たアクセスを`/`以下にリダイレクトする」という処理で終わります。
別のフレームワークに移行するときなんかも可搬性は高いと思います。

今回はブログを始めて作ったので、早めに URL 移行することにした次第です。
`/posts` 以下にするのが微妙だったらもとに戻そうと思います。
