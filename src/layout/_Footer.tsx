import { Link } from "react-router-dom";
import BaseSvgIcon from "../base/BaseSvgIcon";
import "./_Footer.scss";

export default function Footer() {
  return (
    <div className="footer container">
      <div className="wrap">
        <div className="basic-info">
          <p className="head-title">Contacts</p>
          <p>
            <span>Phone</span>
            <a className="text tel" href="tel:+18499366003">
              <span>: +18499366003</span>
            </a>
          </p>
          <p>
            <span>Email</span>
            <a className="mail" id="mail" target="_blank">
              : support@quarax.com
            </a>
          </p>
          <p className="row" id="addresses">
            Dolphin Corp LLC
            <br /> Euro House, Richmond Hill Road, Kingstown, St. Vincent and
            Grenadines
          </p>
          <p className="row" id="copyright">
            © 2021-2023 quarax.com
          </p>
        </div>
        <div className="desc">
          <div className="item">
            <p className="upper">For traders</p>
            <a id="qa_main_TournamentsLink">Tournaments</a>
            <a id="qa_main_PromotionsLink">Promotions</a>
            <a id="qa_main_StrategiesLink">Strategies</a>
            <a id="qa_main_BlogLink">Quarax Blog</a>
          </div>
          <div className="item">
            <p className="upper">Training</p>
            <a id="qa_main_FaqLink">Help Center</a>
            <a id="qa_main_GlossaryOfTermsLink">Glossary</a>
          </div>
          <div className="item">
            <p className="upper">Information</p>

            <Link to="/about">About</Link>
            <a id="qa_main_RegulationsLink">Regulations</a>
            <Link to="/agreement">Client Agreement</Link>
            <a id="qa_main_BinpartnerLink" target="_blank" rel="noopener">
              Affiliate program
            </a>
            <Link to="/privacy">Policy</Link>
          </div>
        </div>
      </div>

      <div className="social" id="socialsContainer">
        <a className="link" target="_blank" rel="noopener noreferer">
          <BaseSvgIcon iconName="youtube_filled-l2" size={40} />
        </a>
        <a className="link" target="_blank" rel="noopener noreferer">
          <BaseSvgIcon iconName="instagram_filled-l2" size={40} />
        </a>
        <a className="link" target="_blank" rel="noopener noreferer">
          <BaseSvgIcon iconName="twitter_filled-l2" size={40} />
        </a>
        <a className="link" target="_blank" rel="noopener noreferer">
          <BaseSvgIcon iconName="telegram_filled-l2" size={40} />
        </a>
        <a className="link" target="_blank" rel="noopener noreferer">
          <BaseSvgIcon iconName="facebook_filled-l2" size={40} />
        </a>
      </div>
    </div>
  );
}
