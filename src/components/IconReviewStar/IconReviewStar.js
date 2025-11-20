import React from 'react';
import classNames from 'classnames';

import css from './IconReviewStar.module.css';

/**
 * Review star icon.
 *
 * @component
 * @param {Object} props
 * @param {string?} props.className add more style rules in addition to components own css.root
 * @param {string?} props.rootClassName overwrite components own css.root
 * @param {boolean?} props.isFilled is filled with color
 * @returns {JSX.Element} SVG icon
 */
const IconReviewStar = props => {
  const { className, rootClassName, isFilled } = props;
  const filledOrDefault = isFilled ? css.filled : css.root;
  const classes = classNames(rootClassName || filledOrDefault, className);

  return (

        <svg className={classes} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8.26894 1.45105C9.06651 0.182982 10.9335 0.182982 11.7311 1.45105L13.6599 4.5178C13.9406 4.96396 14.3864 5.28413 14.9023 5.41009L18.4489 6.27584C19.9153 6.63382 20.4922 8.38907 19.5187 9.53076L17.1643 12.2919C16.8218 12.6936 16.6515 13.2116 16.6897 13.7356L16.9527 17.3374C17.0615 18.8268 15.5511 19.9116 14.1518 19.3491L10.7678 17.9888C10.2755 17.7909 9.72448 17.7909 9.23217 17.9888L5.84818 19.3491C4.44893 19.9116 2.93851 18.8268 3.04726 17.3374L3.31026 13.7356C3.34853 13.2116 3.17825 12.6936 2.83572 12.2919L0.481292 9.53076C-0.492242 8.38907 0.0846877 6.63382 1.55115 6.27584L5.09768 5.41009C5.61365 5.28413 6.05944 4.96396 6.34006 4.5178L8.26894 1.45105Z" fill="#FFD700"/>
        </svg>

  );
};

export default IconReviewStar;
