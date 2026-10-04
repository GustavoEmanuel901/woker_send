import { MdCheckCircle } from 'react-icons/md';

import { useCurrentPage } from '../../context/CurrentPageContext';
import { useFormInitialInfo } from '../../context/FormInitialInfoContext';
import {
  BackButton,
  Confirmation,
  ConfirmationIcon,
  Container,
  Content,
  Email,
  Message,
  Title,
} from './styles';

export default function EndPage() {
  const { setCurrentPage } = useCurrentPage();
  const { formInitialInfo } = useFormInitialInfo();

  return (
    <Container>
      <Content>
        <Confirmation role="status">
          <ConfirmationIcon aria-hidden="true">
            <MdCheckCircle size={32} />
          </ConfirmationIcon>
          <Title>Currículo cadastrado com sucesso!</Title>
          <Message>
            Verifique seu e-mail
            {formInitialInfo?.confirmationEmail ? (
              <>
                {' '}
                <Email>{formInitialInfo.confirmationEmail}</Email>
              </>
            ) : null}{' '}
            para conferir os próximos passos.
          </Message>
          <BackButton type="button" onClick={() => setCurrentPage('home')}>
            Voltar ao início
          </BackButton>
        </Confirmation>
      </Content>
    </Container>
  );
}
