import { CloudWatchClient, GetMetricDataCommand } from '@aws-sdk/client-cloudwatch';
import { RDSClient, StopDBInstanceCommand } from '@aws-sdk/client-rds';

const cloudWatchClient = new CloudWatchClient({ region: process.env.AWS_REGION || '' });
const rdsClient = new RDSClient({ region: process.env.AWS_REGION || '' });
const dbName = process.env.DB_NAME || '';

const handler = async () => {
  const fiveMinutesAgo = new Date();
  fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);

  const params = {
    StartTime: fiveMinutesAgo,
    EndTime: new Date(),
    MetricDataQueries: [
      {
        Id: 'm1',
        MetricStat: {
          Metric: {
            Namespace: 'AWS/RDS',
            MetricName: 'DatabaseConnections',
            Dimensions: [
              {
                Name: 'DBInstanceIdentifier',
                Value: dbName,
              },
            ],
          },
          Period: 300,
          Stat: 'Sum',
        },
      },
    ],
  };

  try {
    const data = await cloudWatchClient.send(new GetMetricDataCommand(params));
    const results = data.MetricDataResults;
    console.log(results);

    if (results && results.length > 0 && results[0].Values && results[0].Values.length > 0) {
      console.log('Hay actividad en la base de datos. Manteniendo activa.');
    } else {
      console.log('No se detectó actividad. Apagando la base de datos.');
      const stopDBInstanceParams = {
        DBInstanceIdentifier: dbName,
      };
      await rdsClient.send(new StopDBInstanceCommand(stopDBInstanceParams));
    }
  } catch (error) {
    console.error('Error al obtener registros de CloudWatch', error);
  }
};

export default handler;
