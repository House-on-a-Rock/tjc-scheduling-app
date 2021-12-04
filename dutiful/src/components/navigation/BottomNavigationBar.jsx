import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { Slider } from 'components/slider';
import { Button } from 'components/button';

export const BottomNavigation = ({ activeStep, setActiveStep, data }) => {
  const classes = useStyles();
  const settings = {
    className: '',
    dots: true,
    infinite: true,
    slidesToShow: 5,
    slidesToScroll: 5,
    adaptiveHeight: true,
    swipe: false,
  };
  return (
    <Slider {...settings}>
      {data.map((item, idx) => {
        return (
          <Button
            key={idx}
            className={clsx(classes.button, activeStep === idx && classes.selected)}
            onClick={() => setActiveStep(idx)}
          >
            {item.name}
          </Button>
        );
      })}
    </Slider>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  content: { flexGrow: 1, height: '80vh', overflow: 'scroll' },
  footer: { flexShrink: 0 },
  button: {},
  selected: {
    backgroundColor: theme.palette.primary.light,
    color: 'white',
  },
}));
