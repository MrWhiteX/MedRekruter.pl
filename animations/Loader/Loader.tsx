import Lottie from 'lottie-react';
import loaderAnimation from './loader.json';

const Loader = () => {
  return <Lottie style={{ height: '50vh' }} animationData={loaderAnimation} />;
};

export default Loader;
