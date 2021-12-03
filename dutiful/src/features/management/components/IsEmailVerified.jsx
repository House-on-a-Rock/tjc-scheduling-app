import { Button } from 'components/button';
export const IsEmailVerified = ({ value }) => {
  return (
    <>
      {value} {value !== 'Yes' && <Button>Remind?</Button>}
    </>
  );
};
