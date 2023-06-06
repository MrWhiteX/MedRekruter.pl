import { OfferType } from 'types/types';
import { Session } from 'next-auth';

const isAuthorized = (offer: OfferType | null, session: Session | null) => {
  if (!session || !offer) return false;
  if (session.user.role === 'admin') return true;
  if (offer.users && offer.users[0] === session.user.id) return true;

  return false;
};

export default isAuthorized;
