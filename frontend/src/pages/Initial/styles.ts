import styled from 'styled-components';

export const Container = styled.main`
  min-height: 100vh;
  padding: 48px 24px;
  background: #f4f6fb;
`;

export const Content = styled.div`
  width: min(100%, 760px);
  margin: 0 auto;

  @media (max-width: 600px) {
    padding: 28px 16px;
  }
`;

export const PageHeader = styled.header`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin: 0 0 28px;
`;

export const BrandMark = styled.div`
  width: 48px;
  height: 48px;
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  border-radius: 14px;
  background: #5a49db;
  color: #fff;
`;

export const Eyebrow = styled.p`
  margin: 0 0 5px;
  color: #5a49db;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
`;

export const PageTitle = styled.h1`
  margin: 0 0 6px;
  color: #182238;
  font-size: clamp(24px, 4vw, 32px);
  letter-spacing: -0.035em;
`;

export const Description = styled.p`
  margin: 0;
  color: #69758b;
  font-size: 15px;
  line-height: 1.6;
`;

export const ManualButton = styled.button`
  margin-top: 12px;
  padding: 0;
  border: 0;
  background: transparent;
  color: #5a49db;
  cursor: pointer;
  font: inherit;
  font-size: 14px;
  font-weight: 600;
  text-align: left;

  &:hover:not(:disabled) {
    color: #4938c5;
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 2px solid #5a49db;
    outline-offset: 3px;
    border-radius: 2px;
  }

  &:disabled {
    color: #8992a3;
    cursor: not-allowed;
  }
`;

export const Panel = styled.section`
  margin-top: 18px;
  padding: 24px;
  border: 1px solid #e7eaf1;
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 8px 24px rgba(28, 39, 67, 0.04);

  @media (max-width: 600px) {
    padding: 18px;
  }
`;

export const SectionHeading = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
`;

export const SectionTitle = styled.h2`
  margin: 0 0 5px;
  color: #182238;
  font-size: 17px;
`;

export const SectionDescription = styled.p`
  margin: 0;
  color: #7b8496;
  font-size: 13px;
`;

export const HeadingIcon = styled.div`
  color: #5a49db;
`;

export const FormError = styled.p`
  margin: 12px 0 0;
  color: #b83232;
  font-size: 13px;
`;
