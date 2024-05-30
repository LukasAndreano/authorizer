import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
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
	useDisclosure,
	Text,
	Spinner,
	Table,
	Th,
	Thead,
	Tr,
	Tbody,
	IconButton,
	NumberDecrementStepper,
	NumberIncrementStepper,
	NumberInput,
	NumberInputField,
	NumberInputStepper,
	Select,
	TableCaption,
	Tooltip,
	Td,
	Tag,
} from '@chakra-ui/react';
import { useClient } from 'urql';
import {
	FaAngleDoubleLeft,
	FaAngleDoubleRight,
	FaAngleLeft,
	FaAngleRight,
	FaExclamationCircle,
	FaRegClone,
} from 'react-icons/fa';
import { copyTextToClipboard } from '../utils';
import { WebhookLogsQuery } from '../graphql/queries';
import { pageLimits } from '../constants';

interface paginationPropTypes {
	limit: number;
	page: number;
	offset: number;
	total: number;
	maxPages: number;
}

interface deleteWebhookModalInputPropTypes {
	webhookId: string;
	eventName: string;
}

interface webhookLogsDataTypes {
	id: string;
	http_status: number;
	request: string;
	response: string;
	created_at: number;
}

const ViewWebhookLogsModal = ({
	webhookId,
	eventName,
}: deleteWebhookModalInputPropTypes) => {
	const client = useClient();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [loading, setLoading] = useState<boolean>(false);
	const [webhookLogs, setWebhookLogs] = useState<webhookLogsDataTypes[]>([]);
	const [paginationProps, setPaginationProps] = useState<paginationPropTypes>({
		limit: 5,
		page: 1,
		offset: 0,
		total: 0,
		maxPages: 1,
	});
	const getMaxPages = (pagination: paginationPropTypes) => {
		const { limit, total } = pagination;
		if (total > 1) {
			return total % limit === 0
				? total / limit
				: parseInt(`${total / limit}`) + 1;
		} else return 1;
	};
	const fetchWebhookLogsData = async () => {
		setLoading(true);
		const res = await client
			.query(WebhookLogsQuery, {
				params: {
					webhook_id: webhookId,
					pagination: {
						limit: paginationProps.limit,
						page: paginationProps.page,
					},
				},
			})
			.toPromise();
		if (res.data?._webhook_logs) {
			const { pagination, webhook_logs } = res.data?._webhook_logs;
			const maxPages = getMaxPages(pagination);
			if (webhook_logs?.length) {
				setWebhookLogs(webhook_logs);
				setPaginationProps({ ...paginationProps, ...pagination, maxPages });
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
	const paginationHandler = (value: Record<string, number>) => {
		setPaginationProps({ ...paginationProps, ...value });
	};
	useEffect(() => {
		isOpen && fetchWebhookLogsData();
	}, [isOpen, paginationProps.page, paginationProps.limit]);
	return (
		<>
			<MenuItem onClick={onOpen}>Просмотреть логи</MenuItem>
			<Modal isOpen={isOpen} onClose={onClose} size="4xl">
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Логи вебхуков - {eventName}</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Flex
							flexDirection="column"
							border="1px"
							borderRadius="md"
							borderColor="gray.200"
							p="5"
						>
							{!loading ? (
								webhookLogs.length ? (
									<Table variant="simple">
										<Thead>
											<Tr>
												<Th>ID</Th>
												<Th>Создано</Th>
												<Th>HTTP-статус</Th>
												<Th>Запрос</Th>
												<Th>Ответ</Th>
											</Tr>
										</Thead>
										<Tbody>
											{webhookLogs.map((logData: webhookLogsDataTypes) => (
												<Tr key={logData.id} style={{ fontSize: 14 }}>
													<Td>
														<Text fontSize="sm">{`${logData.id.substring(
															0,
															5,
														)}***${logData.id.substring(
															logData.id.length - 5,
															logData.id.length,
														)}`}</Text>
													</Td>
													<Td>
														{dayjs(logData.created_at * 1000).format(
															'MMM DD, YYYY',
														)}
													</Td>
													<Td>
														<Tag
															size="sm"
															variant="outline"
															colorScheme={
																logData.http_status >= 400 ? 'red' : 'green'
															}
														>
															{logData.http_status}
														</Tag>
													</Td>
													<Td>
														<Flex alignItems="center">
															<Tooltip
																bg="gray.300"
																color="black"
																label={logData.request || 'null'}
															>
																<Tag
																	size="sm"
																	variant="outline"
																	colorScheme={
																		logData.request ? 'gray' : 'yellow'
																	}
																>
																	{logData.request
																		? 'Полезная нагрузка'
																		: 'Нет данных'}
																</Tag>
															</Tooltip>
															{logData.request && (
																<Button
																	size="xs"
																	variant="outline"
																	marginLeft="5px"
																	h="21px"
																	onClick={() =>
																		copyTextToClipboard(logData.request)
																	}
																>
																	<FaRegClone color="#bfbfbf" />
																</Button>
															)}
														</Flex>
													</Td>
													<Td>
														<Flex alignItems="center">
															<Tooltip
																bg="gray.300"
																color="black"
																label={logData.response || 'null'}
															>
																<Tag
																	size="sm"
																	variant="outline"
																	colorScheme={
																		logData.response ? 'gray' : 'yellow'
																	}
																>
																	{logData.response ? 'Просмотр' : 'Нет данных'}
																</Tag>
															</Tooltip>
															{logData.response && (
																<Button
																	size="xs"
																	variant="outline"
																	marginLeft="5px"
																	h="21px"
																	onClick={() =>
																		copyTextToClipboard(logData.response)
																	}
																>
																	<FaRegClone color="#bfbfbf" />
																</Button>
															)}
														</Flex>
													</Td>
												</Tr>
											))}
										</Tbody>
										{(paginationProps.maxPages > 1 ||
											paginationProps.total >= 5) && (
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
															{pageLimits.map((pageSize) => (
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
																	paginationProps.page >=
																	paginationProps.maxPages
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
																	paginationProps.page >=
																	paginationProps.maxPages
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
								) : (
									<Flex
										flexDirection="column"
										minH="25vh"
										justifyContent="center"
										alignItems="center"
									>
										<Center w="50px" marginRight="1.5%">
											<FaExclamationCircle
												style={{ color: '#f0f0f0', fontSize: 70 }}
											/>
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
						</Flex>
					</ModalBody>
					<ModalFooter>
						<Button
							colorScheme="blue"
							variant="solid"
							onClick={onClose}
							isDisabled={false}
						>
							<Center h="100%" pt="5%">
								Закрыть
							</Center>
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default ViewWebhookLogsModal;
