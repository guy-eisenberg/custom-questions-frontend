import { useNavigate, useRouteError } from 'react-router-dom';
import { Button } from '../components';

const RouteErrorPage: React.FC = () => {
  const navigate = useNavigate();

  const error = useRouteError();
  console.error(error);

  return (
    <main className="flex h-full flex-col items-center justify-center text-theme-extra-dark-gray">
      <div className="mb-12">
        <img
          alt="broken link icon"
          src="images/icon_broken_link.svg"
          className="mx-auto mb-8 w-56"
        />
        <h1 className="text-title">Houston, we have a problem!</h1>
      </div>
      <p className="mb-24 text-small-title">
        We are unable to locate the resource you are looking for, it may have
        moved or been deleted.
      </p>
      <Button onClick={() => navigate(-1)}>Go Back</Button>
    </main>
  );
};

export default RouteErrorPage;
