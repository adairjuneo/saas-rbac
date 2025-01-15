import { Button, Html, Text } from '@react-email/components';
import * as React from 'react';

interface IRecoveryPasswordProps {
  name: string;
}

const RecoveryPassword = (props: IRecoveryPasswordProps) => {
  const { name } = props;

  return (
    <React.Fragment>
      <Html lang="pt-BR" dir="ltr">
        <Text>{name}</Text>
        <Button href="#">Click</Button>
      </Html>
    </React.Fragment>
  );
};

export default RecoveryPassword;
