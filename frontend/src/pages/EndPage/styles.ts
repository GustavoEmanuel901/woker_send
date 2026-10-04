import styled from 'styled-components';

export const Container = styled.main`
  min-height: 100vh;
  padding: 48px 24px;
  background: #f4f6fb;
`;

export const Content = styled.div`
  display: grid;
  width: min(100%, 760px);
  min-height: calc(100vh - 96px);
  margin: 0 auto;
  place-items: center;

  @media (max-width: 600px) {
    min-height: calc(100vh - 56px);
    padding: 0 16px;
  }
`;

export const Confirmation = styled.section`
  display: flex;
  width: min(100%, 520px);
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 36px;
  border: 1px solid #d8efe3;
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 8px 24px rgba(28, 39, 67, 0.05);
  text-align: center;

  @media (max-width: 600px) {
    padding: 26px 20px;
  }
`;

export const ConfirmationIcon = styled.div`
  display: grid;
  width: 64px;
  height: 64px;
  place-items: center;
  border-radius: 50%;
  background: #eaf7f0;
  color: #21855b;
`;

export const Title = styled.h1`
  margin: 0;
  color: #176b48;
  font-size: clamp(24px, 4vw, 30px);
  letter-spacing: -0.035em;
`;

export const Message = styled.p`
  margin: 0;
  color: #69758b;
  font-size: 14px;
  line-height: 1.6;
`;

export const Email = styled.strong`
  color: #26324b;
  overflow-wrap: anywhere;
`;

export const BackButton = styled.button`
  display: inline-flex;
  min-height: 44px;
  align-items: center;
  justify-content: center;
  margin-top: 4px;
  padding: 0 20px;
  border: 0;
  border-radius: 9px;
  background: #5a49db;
  color: #fff;
  cursor: pointer;
  font: inherit;
  font-size: 14px;
  font-weight: 600;
  transition: background 150ms ease;

  &:hover {
    background: #4938c5;
  }

  &:focus-visible {
    outline: 3px solid rgba(90, 73, 219, 0.35);
    outline-offset: 3px;
  }
`;