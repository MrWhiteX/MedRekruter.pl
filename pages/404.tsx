import BaseLayout from 'components/BaseLayout';
import Lottie from 'lottie-react';
import pageNotFound from '../animations/404.json';
import { dictData } from 'dicData';

const Custom404 = () => {
  return (
    <BaseLayout>
      <section className="text-gray-600 body-font overflow-hidden container px-5 mx-auto">
        <div className="container mx-auto  ">
          <p className="text-4xl text-center mt-10">{dictData.noPage}</p>
          <Lottie className="h-90vh" animationData={pageNotFound} />
        </div>
      </section>
    </BaseLayout>
  );
};

export default Custom404;
