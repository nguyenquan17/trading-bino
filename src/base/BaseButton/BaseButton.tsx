import './BaseButton.scss';

const BaseButton = ({ children, ...rest}: any) => {

  return (
    <button
      className="base-button"
      {...rest}
    >
      {children}
    </button>
  )
}

export default BaseButton;
