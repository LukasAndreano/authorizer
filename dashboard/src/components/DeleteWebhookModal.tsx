import React from 'react';
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
	useToast,
} from '@chakra-ui/react';
import { useClient } from 'urql';
import { FaRegTrashAlt } from 'react-icons/fa';
import { DeleteWebhook } from '../graphql/mutation';
import { capitalizeFirstLetter } from '../utils';

interface deleteWebhookModalInputPropTypes {
	webhookId: string;
	eventName: string;
	fetchWebookData: Function;
}

const DeleteWebhookModal = ({
	webhookId,
	eventName,
	fetchWebookData,
}: deleteWebhookModalInputPropTypes) => {
	const client = useClient();
	const toast = useToast();
	const { isOpen, onOpen, onClose } = useDisclosure();

	const deleteHandler = async () => {
		const res = await client
			.mutation(DeleteWebhook, { params: { id: webhookId } })
			.toPromise();
		if (res.error) {
			toast({
				title: capitalizeFirstLetter(res.error.message),
				isClosable: true,
				status: 'error',
				position: 'top-right',
			});

			return;
		} else if (res.data?._delete_webhook) {
			toast({
				title: capitalizeFirstLetter(res.data?._delete_webhook.message),
				isClosable: true,
				status: 'success',
				position: 'top-right',
			});
		}
		onClose();
		fetchWebookData();
	};
	return (
		<>
			<MenuItem onClick={onOpen}>Удалить</MenuItem>
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Удалить вебхук</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Text fontSize="md">Вы уверены?</Text>
						<Flex
							padding="5%"
							marginTop="5%"
							marginBottom="2%"
							border="1px solid #ff7875"
							borderRadius="5px"
							flexDirection="column"
						>
							<Text fontSize="sm">
								Вебхук для события <b>{eventName}</b> будет удален безвозвратно!
							</Text>
						</Flex>
					</ModalBody>

					<ModalFooter>
						<Button
							leftIcon={<FaRegTrashAlt />}
							colorScheme="red"
							variant="solid"
							onClick={deleteHandler}
							isDisabled={false}
						>
							<Center h="100%" pt="5%">
								Удалить
							</Center>
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default DeleteWebhookModal;
