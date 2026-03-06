export interface Photo {

  _id?: string;

  type: 'customer' | 'room' | 'restaurant';

  refId: string;

  idType?: string;

  path: string;

  order?: number;

  createdAt?: Date;

}