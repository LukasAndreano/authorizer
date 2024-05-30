import React from 'react';
import { Flex, Stack, Text, useMediaQuery } from '@chakra-ui/react';
import InputField from '../../components/InputField';
import { TextInputType, TextAreaInputType } from '../../constants';

const AccessToken = ({ variables, setVariables }: any) => {
	const [isNotSmallerScreen] = useMediaQuery('(min-width:600px)');
	return (
		<div>
			{' '}
			<Text fontSize="md" paddingTop="2%" fontWeight="bold" mb={5}>
				Токен доступа
			</Text>
			<Stack spacing={6} padding="2% 0%">
				<Flex direction={isNotSmallerScreen ? 'row' : 'column'}>
					<Flex
						w={isNotSmallerScreen ? '30%' : '50%'}
						justifyContent="start"
						alignItems="center"
					>
						<Text fontSize="sm">
							Время истечения срока действия токена доступа:
						</Text>
					</Flex>
					<Flex
						w={isNotSmallerScreen ? '70%' : '100%'}
						mt={isNotSmallerScreen ? '0' : '3'}
					>
						<InputField
							borderRadius={5}
							variables={variables}
							setVariables={setVariables}
							inputType={TextInputType.ACCESS_TOKEN_EXPIRY_TIME}
							placeholder="0h15m0s"
						/>
					</Flex>
				</Flex>
				<Flex direction={isNotSmallerScreen ? 'row' : 'column'}>
					<Flex
						w={isNotSmallerScreen ? '30%' : '60%'}
						justifyContent="start"
						direction="column"
					>
						<Text fontSize="sm">Пользовательские скрипты:</Text>
						<Text fontSize="xs" color="blackAlpha.500">
							(Используется для добавления пользовательских полей в ID-токен)
						</Text>
					</Flex>
					<Flex
						w={isNotSmallerScreen ? '70%' : '100%'}
						mt={isNotSmallerScreen ? '0' : '3'}
					>
						<InputField
							variables={variables}
							setVariables={setVariables}
							inputType={TextAreaInputType.CUSTOM_ACCESS_TOKEN_SCRIPT}
							placeholder="Добавьте скрипт сюда"
							minH="25vh"
						/>
					</Flex>
				</Flex>
			</Stack>
		</div>
	);
};

export default AccessToken;
