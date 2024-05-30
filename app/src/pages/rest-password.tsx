import React, { Fragment } from 'react';
import { AuthorizerResetPassword } from 'kokateam-authorizer-react';

export default function ResetPassword() {
	return (
		<Fragment>
			<h1 style={{ textAlign: 'center' }}>Восстановление пароля</h1>
			<br />
			<AuthorizerResetPassword />
		</Fragment>
	);
}
