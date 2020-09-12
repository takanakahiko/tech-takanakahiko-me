import React from "react"
import { MdCreate as EditIcon } from "react-icons/md"

export default function EditLink({ slug }) {
  return (
    <div sx={{ display: `flex`, alignItems: `center`, mt: 9 }}>
      <a
        sx={{ variant: `links.muted` }}
        href={slug.replace(/\/posts\/(.+)\//gi, "https://github.com/takanakahiko/tech-takanakahiko-me/blob/master/content/blog/$1/index.md")}
      >
        <EditIcon sx={{ mr: 2 }} /> Edit this page on GitHub
      </a>
    </div>
  )
}
