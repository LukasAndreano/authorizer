import React, { useState } from 'react';
import {
	Button,
	Center,
	Flex,
	MenuItem,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Stack,
	useDisclosure,
	Text,
	useToast,
} from '@chakra-ui/react';
import { useClient } from 'urql';
import { FaSave } from 'react-icons/fa';
import InputField from './InputField';
import {
	DateInputType,
	MultiSelectInputType,
	SelectInputType,
	TextInputType,
} from '../constants';
import { getObjectDiff } from '../utils';
import { UpdateUser } from '../graphql/mutation';
import { GetAvailableRolesQuery } from '../graphql/queries';

const GenderTypes = {
	Undisclosed: null,
	Male: 'Мужской',
	Female: 'Женский',
};

interface userDataTypes {
	id: string;
	email: string;
	given_name: string;
	family_name: string;
	middle_name: string;
	nickname: string;
	gender: string;
	birthdate: string;
	phone_number: string;
	picture: string;
	roles: [string] | [];
}

const EditUserModal = ({
	user,
	updateUserList,
}: {
	user: userDataTypes;
	updateUserList: Function;
}) => {
	const client = useClient();
	const toast = useToast();
	const [availableRoles, setAvailableRoles] = useState<string[]>([]);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [userData, setUserData] = useState<userDataTypes>({
		id: '',
		email: '',
		given_name: '',
		family_name: '',
		middle_name: '',
		nickname: '',
		gender: '',
		birthdate: '',
		phone_number: '',
		picture: '',
		roles: [],
	});
	React.useEffect(() => {
		setUserData(user);
		fetchAvailableRoles();
	}, []);
	const fetchAvailableRoles = async () => {
		const res = await client.query(GetAvailableRolesQuery).toPromise();
		if (res.data?._env?.ROLES && res.data?._env?.PROTECTED_ROLES) {
			setAvailableRoles([
				...res.data._env.ROLES,
				...res.data._env.PROTECTED_ROLES,
			]);
		}
	};
	const saveHandler = async () => {
		const diff = getObjectDiff(user, userData);
		const updatedUserData = diff.reduce(
			(acc: any, property: string) => ({
				...acc,
				// @ts-ignore
				[property]: userData[property],
			}),
			{},
		);
		const res = await client
			.mutation(UpdateUser, { params: { ...updatedUserData, id: userData.id } })
			.toPromise();
		if (res.error) {
			toast({
				title: 'Произошла ошибка при обновлении данных пользователя',
				isClosable: true,
				status: 'error',
				position: 'top-right',
			});
		} else if (res.data?._update_user?.id) {
			toast({
				title: 'Данные пользователя обновлены успешно',
				isClosable: true,
				status: 'success',
				position: 'top-right',
			});
		}
		onClose();
		updateUserList();
	};
	return (
		<>
			<MenuItem onClick={onOpen}>Редактировать данные пользователя</MenuItem>
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Редактировать данные пользователя</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Stack>
							<Flex>
								<Flex w="30%" justifyContent="start" alignItems="center">
									<Text fontSize="sm">Имя:</Text>
								</Flex>
								<Center w="70%">
									<InputField
										variables={userData}
										setVariables={setUserData}
										inputType={TextInputType.GIVEN_NAME}
									/>
								</Center>
							</Flex>
							<Flex>
								<Flex w="30%" justifyContent="start" alignItems="center">
									<Text fontSize="sm">Отчество:</Text>
								</Flex>
								<Center w="70%">
									<InputField
										variables={userData}
										setVariables={setUserData}
										inputType={TextInputType.MIDDLE_NAME}
									/>
								</Center>
							</Flex>
							<Flex>
								<Flex w="30%" justifyContent="start" alignItems="center">
									<Text fontSize="sm">Фамилия:</Text>
								</Flex>
								<Center w="70%">
									<InputField
										variables={userData}
										setVariables={setUserData}
										inputType={TextInputType.FAMILY_NAME}
									/>
								</Center>
							</Flex>
							<Flex>
								<Flex w="30%" justifyContent="start" alignItems="center">
									<Text fontSize="sm">Дата рождения:</Text>
								</Flex>
								<Center w="70%">
									<InputField
										variables={userData}
										setVariables={setUserData}
										inputType={DateInputType.BIRTHDATE}
									/>
								</Center>
							</Flex>
							<Flex>
								<Flex w="30%" justifyContent="start" alignItems="center">
									<Text fontSize="sm">Никнейм:</Text>
								</Flex>
								<Center w="70%">
									<InputField
										variables={userData}
										setVariables={setUserData}
										inputType={TextInputType.NICKNAME}
									/>
								</Center>
							</Flex>
							<Flex>
								<Flex w="30%" justifyContent="start" alignItems="center">
									<Text fontSize="sm">Пол:</Text>
								</Flex>
								<Center w="70%">
									<InputField
										variables={userData}
										setVariables={setUserData}
										inputType={SelectInputType.GENDER}
										value={userData.gender}
										options={GenderTypes}
									/>
								</Center>
							</Flex>
							<Flex>
								<Flex w="30%" justifyContent="start" alignItems="center">
									<Text fontSize="sm">Номер телефона:</Text>
								</Flex>
								<Center w="70%">
									<InputField
										variables={userData}
										setVariables={setUserData}
										inputType={TextInputType.PHONE_NUMBER}
									/>
								</Center>
							</Flex>
							<Flex>
								<Flex w="30%" justifyContent="start" alignItems="center">
									<Text fontSize="sm">Изображение:</Text>
								</Flex>
								<Center w="70%">
									<InputField
										variables={userData}
										setVariables={setUserData}
										inputType={TextInputType.PICTURE}
									/>
								</Center>
							</Flex>
							<Flex>
								<Flex w="30%" justifyContent="start" alignItems="center">
									<Text fontSize="sm">Роли:</Text>
								</Flex>
								<Center w="70%">
									<InputField
										variables={userData}
										setVariables={setUserData}
										availableRoles={availableRoles}
										inputType={MultiSelectInputType.USER_ROLES}
									/>
								</Center>
							</Flex>
						</Stack>
					</ModalBody>

					<ModalFooter>
						<Button
							leftIcon={<FaSave />}
							colorScheme="blue"
							variant="solid"
							onClick={saveHandler}
							isDisabled={false}
						>
							<Center h="100%" pt="5%">
								Сохранить
							</Center>
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default EditUserModal;
