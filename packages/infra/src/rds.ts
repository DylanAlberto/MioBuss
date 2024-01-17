import { rds } from './awsSDK';
import {
  CreateDBInstanceCommandInput,
  CreateDBInstanceCommand,
  DescribeDBInstancesCommand,
  DeleteDBInstanceCommand,
} from '@aws-sdk/client-rds';

async function createRDSInstance({
  dbName,
  dbMasterUsername,
  dbMasterPassword,
}: {
  dbName: string;
  dbMasterUsername: string;
  dbMasterPassword: string;
}) {
  const describeParams = {
    DBInstanceIdentifier: dbName,
  };

  try {
    await rds.send(new DescribeDBInstancesCommand(describeParams));
    console.log(`* Database ${dbName} already exists.`);
  } catch (error: any) {
    if (error.Error.Code === 'DBInstanceNotFound') {
      console.log(`* Database ${dbName} does not exist. Creating...`);
      const createParams: CreateDBInstanceCommandInput = {
        DBName: dbName,
        DBInstanceIdentifier: dbName,
        AllocatedStorage: 20,
        DBInstanceClass: 'db.t2.micro',
        Engine: 'mysql',
        MasterUsername: dbMasterUsername,
        MasterUserPassword: dbMasterPassword,
        BackupRetentionPeriod: 0,
        MultiAZ: false,
        StorageType: 'gp2',
        PubliclyAccessible: false,
      };

      await rds.send(new CreateDBInstanceCommand(createParams));
      console.log(`* Database ${dbName} created.`);
    } else {
      console.error('* Error', error);
    }
  }
}

async function deleteRDSInstance(dbName: string) {
  const deleteParams = {
    DBInstanceIdentifier: dbName,
    SkipFinalSnapshot: true,
    DeleteAutomatedBackups: true,
  };

  try {
    await rds.send(new DeleteDBInstanceCommand(deleteParams));
    console.log(`* Database ${dbName} deleted.`);
  } catch (error: any) {
    if (error.Error.Code === 'DBInstanceNotFound') {
      console.log(`* Database ${dbName} does not exist.`);
    } else {
      console.error('* Error deleting database', error);
    }
  }
}

export { createRDSInstance, deleteRDSInstance };
