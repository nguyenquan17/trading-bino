import BaseSvgIcon from "../../base/BaseSvgIcon"

export const Spinner = () => {
  return (
    <div className="loader">
      <div className="vertical-centered-box">
        <div className="content">
          <div className="loader-line-mask">
            <div className="loader-line"></div>
          </div>
          <div className="loader-circle">
            <img src="/images/logo.png" alt="logo" />
          </div>
        </div>
      </div>
    </div>
  )
}