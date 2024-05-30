import React from 'react';
import {
	Flex,
	Stack,
	Center,
	Text,
	useMediaQuery,
	Button,
	useToast,
} from '@chakra-ui/react';
import {
	HiddenInputType,
	TextInputType,
	TextAreaInputType,
} from '../../constants';
import GenerateKeysModal from '../GenerateKeysModal';
import InputField from '../InputField';
import { copyTextToClipboard } from '../../utils';

const JSTConfigurations = ({
	variables,
	setVariables,
	fieldVisibility,
	setFieldVisibility,
	SelectInputType,
	getData,
	HMACEncryptionType,
	RSAEncryptionType,
	ECDSAEncryptionType,
}: any) => {
	const [isNotSmallerScreen] = useMediaQuery('(min-width:600px)');
	const toast = useToast();

	const copyJSON = async () => {
		try {
			await copyTextToClipboard(
				JSON.stringify({
					type: variables.JWT_TYPE,
					key: variables.JWT_PUBLIC_KEY || variables.JWT_SECRET,
				}),
			);
			toast({
				title: `Конфигурация JWT успешно скопирована`,
				isClosable: true,
				status: 'success',
				position: 'top-right',
			});
		} catch (err) {
			console.error({
				message: `Не удалось скопировать конфигурацию JWT`,
				error: err,
			});
			toast({
				title: `Не удалось скопировать конфигурацию JWT`,
				isClosable: true,
				status: 'error',
				position: 'top-right',
			});
		}
	};

	return (
		<div>
			<Flex
				borderRadius={5}
				width="100%"
				justifyContent="space-between"
				alignItems="center"
				paddingTop="2%"
			>
				<Text
					fontSize={isNotSmallerScreen ? 'md' : 'sm'}
					fontWeight="bold"
					mb={5}
				>
					Конфигурации JWT (JSON Web Token)
				</Text>
				<Flex mb={7}>
					<Button
						colorScheme="blue"
						h="1.75rem"
						size="sm"
						variant="ghost"
						onClick={copyJSON}
					>
						Скопировать как JSON-конфигурацию
					</Button>
					<GenerateKeysModal jwtType={variables.JWT_TYPE} getData={getData} />
				</Flex>
			</Flex>
			<Stack spacing={6} padding="2% 0%">
				<Flex direction={isNotSmallerScreen ? 'row' : 'column'}>
					<Flex w="30%" justifyContent="start" alignItems="center">
						<Text fontSize="sm">Тип JWT:</Text>
					</Flex>
					<Flex
						w={isNotSmallerScreen ? '70%' : '100%'}
						mt={isNotSmallerScreen ? '0' : '2'}
					>
						<InputField
							borderRadius={5}
							variables={variables}
							setVariables={setVariables}
							inputType={SelectInputType}
							value={SelectInputType}
							options={{
								...HMACEncryptionType,
								...RSAEncryptionType,
								...ECDSAEncryptionType,
							}}
						/>
					</Flex>
				</Flex>
				{Object.values(HMACEncryptionType).includes(variables.JWT_TYPE) ? (
					<Flex direction={isNotSmallerScreen ? 'row' : 'column'}>
						<Flex w="30%" justifyContent="start" alignItems="center">
							<Text fontSize="sm">Секрет JWT</Text>
						</Flex>
						<Center
							w={isNotSmallerScreen ? '70%' : '100%'}
							mt={isNotSmallerScreen ? '0' : '2'}
						>
							<InputField
								borderRadius={5}
								variables={variables}
								setVariables={setVariables}
								fieldVisibility={fieldVisibility}
								setFieldVisibility={setFieldVisibility}
								inputType={HiddenInputType.JWT_SECRET}
							/>
						</Center>
					</Flex>
				) : (
					<>
						<Flex direction={isNotSmallerScreen ? 'row' : 'column'}>
							<Flex w="30%" justifyContent="start" alignItems="center">
								<Text fontSize="sm">Публичный ключ</Text>
							</Flex>
							<Center
								w={isNotSmallerScreen ? '70%' : '100%'}
								mt={isNotSmallerScreen ? '0' : '2'}
							>
								<InputField
									borderRadius={5}
									variables={variables}
									setVariables={setVariables}
									inputType={TextAreaInputType.JWT_PUBLIC_KEY}
									placeholder="Добавьте публичный ключ сюда"
									minH="25vh"
								/>
							</Center>
						</Flex>
						<Flex direction={isNotSmallerScreen ? 'row' : 'column'}>
							<Flex w="30%" justifyContent="start" alignItems="center">
								<Text fontSize="sm">Приватный ключ</Text>
							</Flex>
							<Center
								w={isNotSmallerScreen ? '70%' : '100%'}
								mt={isNotSmallerScreen ? '0' : '2'}
							>
								<InputField
									borderRadius={5}
									variables={variables}
									setVariables={setVariables}
									inputType={TextAreaInputType.JWT_PRIVATE_KEY}
									placeholder="Добавьте приватный ключ сюда"
									minH="25vh"
								/>
							</Center>
						</Flex>
					</>
				)}
				<Flex direction={isNotSmallerScreen ? 'row' : 'column'}>
					<Flex
						w={isNotSmallerScreen ? '30%' : '40%'}
						justifyContent="start"
						alignItems="center"
					>
						<Text fontSize="sm" orientation="vertical">
							JWT Role Claim:
						</Text>
					</Flex>
					<Center
						w={isNotSmallerScreen ? '70%' : '100%'}
						mt={isNotSmallerScreen ? '0' : '2'}
					>
						<InputField
							borderRadius={5}
							variables={variables}
							setVariables={setVariables}
							inputType={TextInputType.JWT_ROLE_CLAIM}
						/>
					</Center>
				</Flex>
			</Stack>
		</div>
	);
};

export default JSTConfigurations;
