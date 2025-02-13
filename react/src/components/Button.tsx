import { PropsWithChildren } from 'react';
import { Button as AntdButton } from 'antd';
import { PoweroffOutlined } from '@ant-design/icons';

const Button = ({ children, ...buttonProps }: PropsWithChildren<typeof AntdButton.defaultProps>) => {
  return (
    <AntdButton type="primary" icon={<PoweroffOutlined />} {...buttonProps}>
      {children}
    </AntdButton>
  );
};
Button.displayName = 'Button';

export default Button;
