import { Resend } from 'resend';

import { env } from './env';

export const sendMail = new Resend(env.RESEND_API_KEY);
