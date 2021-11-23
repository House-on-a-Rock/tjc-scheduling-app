import ReactSlider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export const Slider = ({ children, ...props }) => {
  return <ReactSlider {...props}>{children}</ReactSlider>;
};
