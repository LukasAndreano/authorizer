import React from 'react';
import { Divider, Flex, Stack, Text } from '@chakra-ui/react';
import InputField from '../InputField';
import { SwitchInputType } from '../../constants';

const Features = ({ variables, setVariables }: any) => {
	return (
		<div>
			{' '}
			<Text fontSize="md" paddingTop="2%" fontWeight="bold" mb={5}>
				Функции
			</Text>
			<Stack spacing={6}>
				<Flex>
					<Flex w="100%" justifyContent="start" alignItems="center">
						<Text fontSize="sm">Страница входа:</Text>
					</Flex>
					<Flex justifyContent="start">
						<InputField
							variables={variables}
							setVariables={setVariables}
							inputType={SwitchInputType.DISABLE_LOGIN_PAGE}
							hasReversedValue
						/>
					</Flex>
				</Flex>

				<Flex>
					<Flex w="100%" justifyContent="start" alignItems="center">
						<Text fontSize="sm">Подтверждение электронной почты:</Text>
					</Flex>
					<Flex justifyContent="start">
						<InputField
							variables={variables}
							setVariables={setVariables}
							inputType={SwitchInputType.DISABLE_EMAIL_VERIFICATION}
							hasReversedValue
						/>
					</Flex>
				</Flex>
				<Flex>
					<Flex w="100%" justifyContent="start" alignItems="center">
						<Text fontSize="sm">Волшебная ссылка для входа:</Text>
					</Flex>
					<Flex justifyContent="start">
						<InputField
							variables={variables}
							setVariables={setVariables}
							inputType={SwitchInputType.DISABLE_MAGIC_LINK_LOGIN}
							hasReversedValue
						/>
					</Flex>
				</Flex>
				<Flex>
					<Flex w="100%" justifyContent="start" alignItems="center">
						<Text fontSize="sm">
							Базовая аутентификация по электронной почте:
						</Text>
					</Flex>
					<Flex justifyContent="start">
						<InputField
							variables={variables}
							setVariables={setVariables}
							inputType={SwitchInputType.DISABLE_BASIC_AUTHENTICATION}
							hasReversedValue
						/>
					</Flex>
				</Flex>
				<Flex>
					<Flex w="100%" justifyContent="start" alignItems="center">
						<Text fontSize="sm">
							Базовая аутентификация для мобильных устройств:
						</Text>
					</Flex>
					<Flex justifyContent="start">
						<InputField
							variables={variables}
							setVariables={setVariables}
							inputType={SwitchInputType.DISABLE_MOBILE_BASIC_AUTHENTICATION}
							hasReversedValue
						/>
					</Flex>
				</Flex>
				<Flex>
					<Flex w="100%" justifyContent="start" alignItems="center">
						<Text fontSize="sm">Регистрация:</Text>
					</Flex>
					<Flex justifyContent="start" mb={3}>
						<InputField
							variables={variables}
							setVariables={setVariables}
							inputType={SwitchInputType.DISABLE_SIGN_UP}
							hasReversedValue
						/>
					</Flex>
				</Flex>
				<Flex>
					<Flex w="100%" justifyContent="start" alignItems="center">
						<Text fontSize="sm">Надежный пароль:</Text>
					</Flex>
					<Flex justifyContent="start" mb={3}>
						<InputField
							variables={variables}
							setVariables={setVariables}
							inputType={SwitchInputType.DISABLE_STRONG_PASSWORD}
							hasReversedValue
						/>
					</Flex>
				</Flex>
				<Flex alignItems="center">
					<Flex w="100%" alignItems="baseline" flexDir="column">
						<Text fontSize="sm">Многофакторная аутентификация (MFA):</Text>
						<Text fontSize="x-small">
							Примечание: Включение этой опции проигнорирует Принудительное
							применение MFA, показанное ниже, а также игнорирует настройку MFA
							пользователя.
						</Text>
					</Flex>

					<Flex justifyContent="start" mb={3}>
						<InputField
							variables={variables}
							setVariables={setVariables}
							inputType={SwitchInputType.DISABLE_MULTI_FACTOR_AUTHENTICATION}
							hasReversedValue
						/>
					</Flex>
				</Flex>
				{!variables.DISABLE_MULTI_FACTOR_AUTHENTICATION && (
					<Flex alignItems="center">
						<Flex w="100%" alignItems="baseline" flexDir="column">
							<Text fontSize="sm">Временный OTP (TOTP):</Text>
							<Text fontSize="x-small">
								Примечание: чтобы включить TOTP MFA
							</Text>
						</Flex>

						<Flex justifyContent="start" mb={3}>
							<InputField
								variables={variables}
								setVariables={setVariables}
								inputType={SwitchInputType.DISABLE_TOTP_LOGIN}
								hasReversedValue
							/>
						</Flex>
					</Flex>
				)}
				{!variables.DISABLE_MULTI_FACTOR_AUTHENTICATION && (
					<Flex alignItems="center">
						<Flex w="100%" alignItems="baseline" flexDir="column">
							<Text fontSize="sm">EMAIL OTP:</Text>
							<Text fontSize="x-small">
								Примечание: чтобы включить Email OTP MFA
							</Text>
						</Flex>

						<Flex justifyContent="start" mb={3}>
							<InputField
								variables={variables}
								setVariables={setVariables}
								inputType={SwitchInputType.DISABLE_MAIL_OTP_LOGIN}
								hasReversedValue
							/>
						</Flex>
					</Flex>
				)}

				<Flex alignItems="center">
					<Flex w="100%" alignItems="baseline" flexDir="column">
						<Text fontSize="sm">
							Принудительное применение многофакторной аутентификации (MFA):
						</Text>
						<Text fontSize="x-small">
							Примечание: Если вы отключите принудительное применение после его
							включения, MFA все равно останется включенным для старых
							пользователей.
						</Text>
					</Flex>
					<Flex justifyContent="start" mb={3}>
						<InputField
							variables={variables}
							setVariables={setVariables}
							inputType={SwitchInputType.ENFORCE_MULTI_FACTOR_AUTHENTICATION}
						/>
					</Flex>
				</Flex>
				<Flex>
					<Flex w="100%" justifyContent="start" alignItems="center">
						<Text fontSize="sm">Playground:</Text>
					</Flex>
					<Flex justifyContent="start">
						<InputField
							variables={variables}
							setVariables={setVariables}
							inputType={SwitchInputType.DISABLE_PLAYGROUND}
							hasReversedValue
						/>
					</Flex>
				</Flex>
			</Stack>
			<Divider paddingY={5} />
			<Text fontSize="md" paddingTop={5} fontWeight="bold" mb={5}>
				Функции безопасности файлов cookie
			</Text>
			<Stack spacing={6}>
				<Flex>
					<Flex w="100%" alignItems="baseline" flexDir="column">
						<Text fontSize="sm">
							Использовать безопасный файл cookie приложения:
						</Text>
						<Text fontSize="x-small">
							Примечание: Если вы установите значение "небезопасный", для
							свойства <code>sameSite</code> файла cookie будет установлено
							значение <code>lax</code>
						</Text>
					</Flex>
					<Flex justifyContent="start">
						<InputField
							variables={variables}
							setVariables={setVariables}
							inputType={SwitchInputType.APP_COOKIE_SECURE}
						/>
					</Flex>
				</Flex>
				<Flex>
					<Flex w="100%" alignItems="baseline" flexDir="column">
						<Text fontSize="sm">
							Использовать безопасный файл cookie администратора:
						</Text>
					</Flex>
					<Flex justifyContent="start">
						<InputField
							variables={variables}
							setVariables={setVariables}
							inputType={SwitchInputType.ADMIN_COOKIE_SECURE}
						/>
					</Flex>
				</Flex>
			</Stack>
		</div>
	);
};

export default Features;
