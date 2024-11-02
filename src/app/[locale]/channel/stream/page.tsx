import { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.REDIRECT_URI
);

oauth2Client.setCredentials({ access_token: 'КОРИСТУВАЦЬКИЙ_ТОКЕН' });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const youtube = google.youtube('v3');
    const broadcast = await youtube.liveBroadcasts.insert({
        part: ['snippet', 'status', 'contentDetails'],
      requestBody: {
        snippet: {
          title: 'Мій стрім',
          description: 'Опис стріму',
          scheduledStartTime: new Date().toISOString(),
        },
        status: {
          privacyStatus: 'public', 
        },
        contentDetails: {
          monitorStream: {
            enableMonitorStream: true,
          },
        },
      },
    });

    res.status(200).json(broadcast.data);
  } catch (error) {
    console.error('Помилка створення стріму:', error);
    res.status(500).json({ error: 'Не вдалося створити стрім' });
  }
}
