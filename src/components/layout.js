import React from "react"
import { Link } from "gatsby"

const Layout = ({ location, title, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`
  const isRootPath = location.pathname === rootPath
  let header

  if (location.pathname === rootPath) {
    header = (
      <h1 className="main-heading">
        <Link to={`/`}> {title}</Link>
      </h1>
    )
  } else {
    header = (
      <h3>
        <Link className="header-link-home" to={`/`} >
          {title}
        </Link>
      </h3>
    )
  }
  return (
    <div className="global-wrapper" data-is-root-path={isRootPath}>
      <header className="global-header">{header}</header>
      <main>{children}</main>
      <footer>
        © takanakahiko {new Date().getFullYear()}, Built with
        {` `}
        <a href="https://www.gatsbyjs.org">Gatsby</a>
        <br />
        This site uses Google Analytics.
      </footer>
    </div>
  )
}

export default Layout
