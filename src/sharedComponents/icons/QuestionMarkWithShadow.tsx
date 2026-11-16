import * as React from 'react';
import QuestionIconCircle from '../../images/QuestionIconCircle.svg';

export const QuestionMarkWithShadow = ({
  style,
  ...props
}: React.ComponentProps<typeof QuestionIconCircle>) => (
  <QuestionIconCircle
    style={[
      {
        shadowColor: '#000',
        backgroundColor: '#fff',
        borderRadius: 100,
        elevation: 20,
      },
      style,
    ]}
    {...props}
  />
);
