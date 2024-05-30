import React, { Fragment } from 'react';
import { AuthorizerResetPassword } from 'kokateam-authorizer-react';

export default function SetupPassword() {
	return (
		<Fragment>
			<h1 style={{ textAlign: 'center' }}>Смена пароля</h1>
			<br />
			<AuthorizerResetPassword />
		</Fragment>
	);
}
