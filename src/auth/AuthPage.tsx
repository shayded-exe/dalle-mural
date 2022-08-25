import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import {
  Button,
  chakra,
  Flex,
  FormControl,
  FormErrorMessage,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useBoolean,
} from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useForm, ValidationRule } from 'react-hook-form';

import { DALLE_AUTH_TOKEN_LENGTH } from '../dalle';
import { useStores } from '../store';

export interface AuthPageProps {}

export const AuthPage = chakra(observer(_AuthPage));

function _AuthPage({ ...passthrough }: AuthPageProps) {
  const {
    dalleStore: { signIn },
  } = useStores();

  interface FormValues {
    authToken: string;
  }

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<FormValues>();

  const [showToken, setShowToken] = useBoolean(false);

  const placeholder = `sess-${'x'.repeat(40)}`;

  return (
    <Flex
      direction='column'
      align='center'
      {...passthrough}
    >
      <Heading>Paste your auth token</Heading>

      <Text
        textStyle='hint'
        marginTop='0.5rem'
      >
        (This is only stored in your browser)
      </Text>

      <chakra.form
        onSubmit={handleSubmit(onSubmit)}
        marginTop='2rem'
      >
        <Flex>
          <FormControl
            isInvalid={!!errors.authToken}
            width='62ch'
          >
            <InputGroup size='lg'>
              <Input
                {...registerTokenField()}
                placeholder={placeholder}
                type={showToken ? 'text' : 'password'}
                fontFamily='mono'
                borderRightRadius='0'
              />
              <InputRightElement>
                <IconButton
                  onClick={setShowToken.toggle}
                  icon={showToken ? <ViewOffIcon /> : <ViewIcon />}
                  variant='ghost'
                  aria-label='toggle visibility'
                />
              </InputRightElement>
            </InputGroup>

            <FormErrorMessage>{errors.authToken?.message}</FormErrorMessage>
          </FormControl>

          <Button
            isLoading={isSubmitting}
            type='submit'
            colorScheme='blue'
            size='lg'
            borderLeftRadius='0'
          >
            sign in
          </Button>
        </Flex>
      </chakra.form>
    </Flex>
  );

  function registerTokenField() {
    const length = DALLE_AUTH_TOKEN_LENGTH;
    const tokenLengthValidation: ValidationRule<number> = {
      value: length,
      message: `Auth token must be ${length} characters long`,
    };

    return register('authToken', {
      required: 'Auth token is required',
      minLength: tokenLengthValidation,
      maxLength: tokenLengthValidation,
      pattern: {
        value: /^sess-[a-zA-Z0-9]{40}$/,
        message: 'Invalid auth token',
      },
    });
  }

  function onSubmit({ authToken }: FormValues) {
    signIn(authToken);
  }
}
