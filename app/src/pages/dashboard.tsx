import React from 'react';
import { useAuthorizer } from 'kokateam-authorizer-react';

export default function Dashboard() {
	const [loading, setLoading] = React.useState(false);
	const { user, setToken, authorizerRef } = useAuthorizer();

	const onLogout = async () => {
		setLoading(true);
		await authorizerRef.logout();
		setToken(null);
		setLoading(false);
	};

	return (
		<div>
			<h1>Привет 👋,</h1>
			<p>Спасибо за использование сервиса.</p>
			<p>
				Твой адрес электронной почты:{' '}
				<a href={`mailto:${user?.email}`} style={{ color: '#3B82F6' }}>
					{user?.email}
				</a>
			</p>

			<br />
			{loading ? (
				<h3>Обработка...</h3>
			) : (
				<h3
					style={{
						color: '#3B82F6',
						cursor: 'pointer',
					}}
					onClick={onLogout}
				>
					Выйти
				</h3>
			)}
		</div>
	);
}
