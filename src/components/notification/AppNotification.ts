import {ReactElement} from 'react';

export type AppNotification = {
  title: string | ReactElement;
  content?: string | ReactElement;
};
