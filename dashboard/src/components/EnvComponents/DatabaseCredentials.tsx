import React from 'react';
import { Flex, Stack, Center, Text, useMediaQuery } from '@chakra-ui/react';

import InputField from '../../components/InputField';
import { TextInputType } from '../../constants';

const DatabaseCredentials = ({ variables, setVariables }: any) => {
	const [isNotSmallerScreen] = useMediaQuery('(min-width:600px)');
	return (
		<div>
			{' '}
			<Text fontSize="md" paddingTop="2%" fontWeight="bold">
				Учетные данные базы данных
			</Text>
			<Stack spacing={6} padding="3% 0">
				<Text fontStyle="italic" fontSize="sm" color="blackAlpha.500" mt={3}>
					Примечание: Переменные среды, связанные с базой данных, не могут быть
					обновлены из панели управления. Пожалуйста, используйте файл .env или
					переменные среды ОС для их обновления.
				</Text>
				<Flex direction={isNotSmallerScreen ? 'row' : 'column'}>
					<Flex
						w={isNotSmallerScreen ? '30%' : '40%'}
						justifyContent="start"
						alignItems="center"
					>
						<Text fontSize="sm">Имя базы данных:</Text>
					</Flex>
					<Center
						w={isNotSmallerScreen ? '70%' : '100%'}
						mt={isNotSmallerScreen ? '0' : '3'}
					>
						<InputField
							borderRadius={5}
							variables={variables}
							setVariables={setVariables}
							inputType={TextInputType.DATABASE_NAME}
							isDisabled={true}
						/>
					</Center>
				</Flex>
				<Flex direction={isNotSmallerScreen ? 'row' : 'column'}>
					<Flex
						w={isNotSmallerScreen ? '30%' : '40%'}
						justifyContent="start"
						alignItems="center"
					>
						<Text fontSize="sm">Тип базы данных:</Text>
					</Flex>
					<Center
						w={isNotSmallerScreen ? '70%' : '100%'}
						mt={isNotSmallerScreen ? '0' : '3'}
					>
						<InputField
							borderRadius={5}
							variables={variables}
							setVariables={setVariables}
							inputType={TextInputType.DATABASE_TYPE}
							isDisabled={true}
						/>
					</Center>
				</Flex>
				<Flex direction={isNotSmallerScreen ? 'row' : 'column'}>
					<Flex
						w={isNotSmallerScreen ? '30%' : '40%'}
						justifyContent="start"
						alignItems="center"
					>
						<Text fontSize="sm">URL базы данных:</Text>
					</Flex>
					<Center
						w={isNotSmallerScreen ? '70%' : '100%'}
						mt={isNotSmallerScreen ? '0' : '3'}
					>
						<InputField
							borderRadius={5}
							variables={variables}
							setVariables={setVariables}
							inputType={TextInputType.DATABASE_URL}
							isDisabled={true}
						/>
					</Center>
				</Flex>
			</Stack>
		</div>
	);
};

export default DatabaseCredentials;
