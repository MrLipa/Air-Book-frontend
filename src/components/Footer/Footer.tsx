import { FaFacebookF, FaTwitter, FaYoutube, FaGooglePlus } from "react-icons/fa";
import { useTranslation } from 'react-i18next';
import './Footer.css';

export const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div className="row">
        <div className="col">
          <h5>{t('Air Book')}</h5>
          <p>{t('Footer_Introduce')}</p>

          <h5>{t('Air Book')}</h5>
          <div className="icon-container">
            <FaFacebookF className="fa-facebook-f" />
            <FaTwitter className="fa-twitter" />
            <FaYoutube className="fa-youtube" />
            <FaGooglePlus className="fa-google-plus" />
          </div>

        </div>

        <div className="col">
          <h5>{t('Footer_Contact')}</h5>
          <ul>
            <li><strong>{t('Footer_Name')}</strong> Student Debil</li>
            <li><strong>{t('Footer_Email')}</strong> student.debil@example.com</li>
            <li><strong>{t('Footer_Phone')}</strong> +48 213 742 069</li>
          </ul>
        </div>

        <div className="col">
          <h5>{t('Footer_Newsletter')}</h5>
          <p>{t('Footer_Subscribe')}</p>
        </div>
      </div>
    </footer>
  );
};
