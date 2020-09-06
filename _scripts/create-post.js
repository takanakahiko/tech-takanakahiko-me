const fs = require('fs');

const dateString = new Date().toISOString()
const dirPath = `content/blog/${dateString}`
fs.mkdirSync(dirPath)
fs.writeFileSync(`${dirPath}/index.md`, `---
title: タイトル
date: "${dateString}"
description: "説明"
---

本文
`)
