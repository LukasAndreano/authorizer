import React from 'react';
import { useClient } from 'urql';
import dayjs from 'dayjs';
import {
	Box,
	Flex,
	IconButton,
	NumberDecrementStepper,
	NumberIncrementStepper,
	NumberInput,
	NumberInputField,
	NumberInputStepper,
	Select,
	Table,
	Tag,
	Tbody,
	Td,
	Text,
	TableCaption,
	Th,
	Thead,
	Tooltip,
	Tr,
	Button,
	Center,
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	useToast,
	Spinner,
	TableContainer,
} from '@chakra-ui/react';
import {
	FaAngleLeft,
	FaAngleRight,
	FaAngleDoubleLeft,
	FaAngleDoubleRight,
	FaExclamationCircle,
	FaAngleDown,
} from 'react-icons/fa';
import { EmailVerificationQuery, UserDetailsQuery } from '../graphql/queries';
import { EnableAccess, RevokeAccess, UpdateUser } from '../graphql/mutation';
import EditUserModal from '../components/EditUserModal';
import DeleteUserModal from '../components/DeleteUserModal';
import InviteMembersModal from '../components/InviteMembersModal';

interface paginationPropTypes {
	limit: number;
	page: number;
	offset: number;
	total: number;
	maxPages: number;
}

interface userDataTypes {
	id: string;
	email: string;
	email_verified: boolean;
	given_name: string;
	family_name: string;
	middle_name: string;
	nickname: string;
	gender: string;
	birthdate: string;
	phone_number: string;
	picture: string;
	signup_methods: string;
	roles: [string];
	created_at: number;
	revoked_timestamp: number;
	is_multi_factor_auth_enabled?: boolean;
}

const enum updateAccessActions {
	REVOKE = 'REVOKE',
	ENABLE = 'ENABLE',
}

const getMaxPages = (pagination: paginationPropTypes) => {
	const { limit, total } = pagination;
	if (total > 1) {
		return total % limit === 0
			? total / limit
			: parseInt(`${total / limit}`) + 1;
	} else return 1;
};

const getLimits = (pagination: paginationPropTypes) => {
	const { total } = pagination;
	const limits = [5];
	if (total > 10) {
		for (let i = 10; i <= total && limits.length <= 10; i += 5) {
			limits.push(i);
		}
	}
	return limits;
};

export default function Users() {
	const client = useClient();
	const toast = useToast();
	const [paginationProps, setPaginationProps] =
		React.useState<paginationPropTypes>({
			limit: 5,
			page: 1,
			offset: 0,
			total: 0,
			maxPages: 1,
		});
	const [userList, setUserList] = React.useState<userDataTypes[]>([]);
	const [loading, setLoading] = React.useState<boolean>(false);
	const [disableInviteMembers, setDisableInviteMembers] =
		React.useState<boolean>(true);
	const updateUserList = async () => {
		setLoading(true);
		const { data } = await client
			.query(UserDetailsQuery, {
				params: {
					pagination: {
						limit: paginationProps.limit,
						page: paginationProps.page,
					},
				},
			})
			.toPromise();
		if (data?._users) {
			const { pagination, users } = data._users;
			const maxPages = getMaxPages(pagination);
			if (users && users.length > 0) {
				setPaginationProps({ ...paginationProps, ...pagination, maxPages });
				setUserList(users);
			} else {
				if (paginationProps.page !== 1) {
					setPaginationProps({
						...paginationProps,
						...pagination,
						maxPages,
						page: 1,
					});
				}
			}
		}
		setLoading(false);
	};
	const checkEmailVerification = async () => {
		setLoading(true);
		const { data } = await client.query(EmailVerificationQuery).toPromise();
		if (data?._env) {
			const { DISABLE_EMAIL_VERIFICATION } = data._env;
			setDisableInviteMembers(DISABLE_EMAIL_VERIFICATION);
		}
		setLoading(false);
	};
	React.useEffect(() => {
		updateUserList();
		checkEmailVerification();
	}, []);
	React.useEffect(() => {
		updateUserList();
	}, [paginationProps.page, paginationProps.limit]);

	const paginationHandler = (value: Record<string, number>) => {
		setPaginationProps({ ...paginationProps, ...value });
	};

	const userVerificationHandler = async (user: userDataTypes) => {
		const { id, email, phone_number } = user;
		let params = {};
		if (email) {
			params = {
				id,
				email,
				email_verified: true,
			};
		}
		if (phone_number) {
			params = {
				id,
				phone_number,
				phone_number_verified: true,
			};
		}
		const res = await client
			.mutation(UpdateUser, {
				params,
			})
			.toPromise();
		if (res.error) {
			toast({
				title: 'Ошибка подтверждения пользователя',
				isClosable: true,
				status: 'error',
				position: 'top-right',
			});
		} else if (res.data?._update_user?.id) {
			toast({
				title: 'Пользователь успешно подтвержден',
				isClosable: true,
				status: 'success',
				position: 'top-right',
			});
		}
		updateUserList();
	};

	const updateAccessHandler = async (
		id: string,
		action: updateAccessActions,
	) => {
		switch (action) {
			case updateAccessActions.ENABLE:
				const enableAccessRes = await client
					.mutation(EnableAccess, {
						param: {
							user_id: id,
						},
					})
					.toPromise();
				if (enableAccessRes.error) {
					toast({
						title: 'Не удалось предоставить доступ пользователю',
						isClosable: true,
						status: 'error',
						position: 'top-right',
					});
				} else {
					toast({
						title: 'Доступ пользователю успешно предоставлен',
						isClosable: true,
						status: 'success',
						position: 'top-right',
					});
				}
				updateUserList();
				break;
			case updateAccessActions.REVOKE:
				const revokeAccessRes = await client
					.mutation(RevokeAccess, {
						param: {
							user_id: id,
						},
					})
					.toPromise();
				if (revokeAccessRes.error) {
					toast({
						title: 'Не удалось отозвать доступ пользователя',
						isClosable: true,
						status: 'error',
						position: 'top-right',
					});
				} else {
					toast({
						title: 'Доступ пользователя успешно отозван',
						isClosable: true,
						status: 'success',
						position: 'top-right',
					});
				}
				updateUserList();
				break;
			default:
				break;
		}
	};
	const multiFactorAuthUpdateHandler = async (user: userDataTypes) => {
		const res = await client
			.mutation(UpdateUser, {
				params: {
					id: user.id,
					is_multi_factor_auth_enabled: !user.is_multi_factor_auth_enabled,
				},
			})
			.toPromise();
		if (res.data?._update_user?.id) {
			toast({
				title: `Многофакторная аутентификация ${
					user.is_multi_factor_auth_enabled ? 'отключена' : 'включена'
				} для пользователя`,
				isClosable: true,
				status: 'success',
				position: 'top-right',
			});
			updateUserList();
			return;
		}
		toast({
			title:
				'Не удалось обновить многофакторную аутентификацию для пользователя',
			isClosable: true,
			status: 'error',
			position: 'top-right',
		});
	};

	return (
		<Box m="5" py="5" px="10" bg="white" rounded="md">
			<Flex margin="2% 0" justifyContent="space-between" alignItems="center">
				<Text fontSize="md" fontWeight="bold">
					Пользователи
				</Text>
				<InviteMembersModal
					disabled={disableInviteMembers}
					updateUserList={updateUserList}
				/>
			</Flex>
			{!loading ? (
				userList.length > 0 ? (
					<TableContainer>
						<Table variant="simple">
							<Thead>
								<Tr>
									<Th>Email / Телефон</Th>
									<Th>Дата создания</Th>
									<Th>Способы регистрации</Th>
									<Th>Роли</Th>
									<Th>Подтверждено</Th>
									<Th>Доступ</Th>
									<Th>
										<Tooltip label="Многофакторная аутентификация включена / отключена">
											MFA
										</Tooltip>
									</Th>
									<Th>Действия</Th>
								</Tr>
							</Thead>
							<Tbody>
								{userList.map((user: userDataTypes) => {
									const {
										email_verified,
										phone_number_verified,
										created_at,
										...rest
									}: any = user;
									return (
										<Tr key={user.id} style={{ fontSize: 14 }}>
											<Td maxW="300">{user.email || user.phone_number}</Td>
											<Td>
												{dayjs(user.created_at * 1000).format('MMM DD, YYYY')}
											</Td>
											<Td>{user.signup_methods}</Td>
											<Td>{user.roles.join(', ')}</Td>
											<Td>
												<Tag
													size="sm"
													variant="outline"
													colorScheme={
														user.email_verified || user.phone_number_verified
															? 'green'
															: 'yellow'
													}
												>
													{(
														user.email_verified || user.phone_number_verified
													).toString()}
												</Tag>
											</Td>
											<Td>
												<Tag
													size="sm"
													variant="outline"
													colorScheme={user.revoked_timestamp ? 'red' : 'green'}
												>
													{user.revoked_timestamp ? 'Отозван' : 'Предоставлен'}
												</Tag>
											</Td>
											<Td>
												<Tag
													size="sm"
													variant="outline"
													colorScheme={
														user.is_multi_factor_auth_enabled ? 'green' : 'red'
													}
												>
													{user.is_multi_factor_auth_enabled
														? 'Включено'
														: 'Отключено'}
												</Tag>
											</Td>
											<Td>
												<Menu>
													<MenuButton as={Button} variant="unstyled" size="sm">
														<Flex
															justifyContent="space-between"
															alignItems="center"
														>
															<Text fontSize="sm" fontWeight="light">
																Меню
															</Text>
															<FaAngleDown style={{ marginLeft: 10 }} />
														</Flex>
													</MenuButton>
													<MenuList>
														{!user.email_verified &&
															!user.phone_number_verified && (
																<MenuItem
																	onClick={() => userVerificationHandler(user)}
																>
																	Подтвердить пользователя
																</MenuItem>
															)}
														<EditUserModal
															user={rest}
															updateUserList={updateUserList}
														/>
														<DeleteUserModal
															user={rest}
															updateUserList={updateUserList}
														/>
														{user.revoked_timestamp ? (
															<MenuItem
																onClick={() =>
																	updateAccessHandler(
																		user.id,
																		updateAccessActions.ENABLE,
																	)
																}
															>
																Предоставить доступ
															</MenuItem>
														) : (
															<MenuItem
																onClick={() =>
																	updateAccessHandler(
																		user.id,
																		updateAccessActions.REVOKE,
																	)
																}
															>
																Отозвать доступ
															</MenuItem>
														)}
														{user.is_multi_factor_auth_enabled ? (
															<MenuItem
																onClick={() =>
																	multiFactorAuthUpdateHandler(user)
																}
															>
																Отключить многофакторную аутентификацию
															</MenuItem>
														) : (
															<MenuItem
																onClick={() =>
																	multiFactorAuthUpdateHandler(user)
																}
															>
																Включить многофакторную аутентификацию
															</MenuItem>
														)}
													</MenuList>
												</Menu>
											</Td>
										</Tr>
									);
								})}
							</Tbody>
							{(paginationProps.maxPages > 1 || paginationProps.total >= 5) && (
								<TableCaption>
									<Flex
										justifyContent="space-between"
										alignItems="center"
										m="2% 0"
									>
										<Flex flex="1">
											<Tooltip label="Первая страница">
												<IconButton
													aria-label="icon button"
													onClick={() =>
														paginationHandler({
															page: 1,
														})
													}
													isDisabled={paginationProps.page <= 1}
													mr={4}
													icon={<FaAngleDoubleLeft />}
												/>
											</Tooltip>
											<Tooltip label="Предыдущая страница">
												<IconButton
													aria-label="icon button"
													onClick={() =>
														paginationHandler({
															page: paginationProps.page - 1,
														})
													}
													isDisabled={paginationProps.page <= 1}
													icon={<FaAngleLeft />}
												/>
											</Tooltip>
										</Flex>
										<Flex
											flex="8"
											justifyContent="space-evenly"
											alignItems="center"
										>
											<Text mr={8}>
												Страница{' '}
												<Text fontWeight="bold" as="span">
													{paginationProps.page}
												</Text>{' '}
												из{' '}
												<Text fontWeight="bold" as="span">
													{paginationProps.maxPages}
												</Text>
											</Text>
											<Flex alignItems="center">
												<Text flexShrink="0">Перейти на страницу:</Text>{' '}
												<NumberInput
													ml={2}
													mr={8}
													w={28}
													min={1}
													max={paginationProps.maxPages}
													onChange={(value) =>
														paginationHandler({
															page: parseInt(value),
														})
													}
													value={paginationProps.page}
												>
													<NumberInputField />
													<NumberInputStepper>
														<NumberIncrementStepper />
														<NumberDecrementStepper />
													</NumberInputStepper>
												</NumberInput>
											</Flex>
											<Select
												w={32}
												value={paginationProps.limit}
												onChange={(e) =>
													paginationHandler({
														page: 1,
														limit: parseInt(e.target.value),
													})
												}
											>
												{getLimits(paginationProps).map((pageSize) => (
													<option key={pageSize} value={pageSize}>
														Показать {pageSize}
													</option>
												))}
											</Select>
										</Flex>
										<Flex flex="1">
											<Tooltip label="Следующая страница">
												<IconButton
													aria-label="icon button"
													onClick={() =>
														paginationHandler({
															page: paginationProps.page + 1,
														})
													}
													isDisabled={
														paginationProps.page >= paginationProps.maxPages
													}
													icon={<FaAngleRight />}
												/>
											</Tooltip>
											<Tooltip label="Последняя страница">
												<IconButton
													aria-label="icon button"
													onClick={() =>
														paginationHandler({
															page: paginationProps.maxPages,
														})
													}
													isDisabled={
														paginationProps.page >= paginationProps.maxPages
													}
													ml={4}
													icon={<FaAngleDoubleRight />}
												/>
											</Tooltip>
										</Flex>
									</Flex>
								</TableCaption>
							)}
						</Table>
					</TableContainer>
				) : (
					<Flex
						flexDirection="column"
						minH="25vh"
						justifyContent="center"
						alignItems="center"
					>
						<Center w="50px" marginRight="1.5%">
							<FaExclamationCircle style={{ color: '#f0f0f0', fontSize: 70 }} />
						</Center>
						<Text
							fontSize="2xl"
							paddingRight="1%"
							fontWeight="bold"
							color="#d9d9d9"
						>
							Нет данных
						</Text>
					</Flex>
				)
			) : (
				<Center minH="25vh">
					<Spinner />
				</Center>
			)}
		</Box>
	);
}
