import { Text } from '@chakra-ui/react';
import React from 'react';

export default function Home() {
	return (
		<>
			<Text fontSize="2xl" fontWeight="bold">
				Привет 👋 <br />
			</Text>

			<Text fontSize="xl" color="gray.700">
				Добро пожаловать в админку Authorizer! <br />
				Пожалуйста, используйте эту панель для настройки переменных окружения
				или просмотра ваших пользователей
			</Text>
		</>
	);
}
