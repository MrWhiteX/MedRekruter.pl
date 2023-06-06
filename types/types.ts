import * as t from 'io-ts';
import { User } from 'next-auth';
export const Offer = t.type({
  id: t.number,
  category: t.string,
  company: t.string,
  createdAt: t.string,
  description: t.string,
  location: t.string,
  mobile: t.string,
  price: t.number,
  status: t.string,
  title: t.string,
  updateAt: t.string,
  imageUrl: t.union([t.string, t.undefined]),
  email: t.array(t.string)
});

export type Offer = t.TypeOf<typeof Offer>;
export interface OfferType {
  id: number;
  category: string;
  company: string;
  createdAt: string;
  description: string;
  location: string;
  mobile: string;
  price: number;
  status: string;
  title: string;
  email: string[];
  updateAt: string;
  imageUrl?: string | undefined;
  users?: string[];
  favourite_users?: string[];
}

export interface ExtendedOfferType extends OfferType {
  airtableId: string;
}

export interface OffersProps {
  offers: {
    id: number;
    category: string;
    company: string;
    createdAt: string;
    description: string;
    location: string;
    mobile: string;
    price: number;
    status: string;
    title: string;
    updateAt: string;
    email: string[];
    users: string[];
    imageUrl?: string | undefined;
  }[];
}

export interface OfferPayload {
  category: string;
  company: string;
  description: string;
  location: string;
  mobile: string;
  price: string;
  status: string;
  title: string;
}

export interface CreateUserSchema {
  email: string;
  fullName: string;
  password: string;
}

export interface ISession {
  expires: string;
  user: User;
}
